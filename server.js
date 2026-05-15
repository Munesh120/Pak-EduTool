const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// MongoDB Connection
const dbURI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1); 
  });

// --- MOVED THE LISTEN BLOCK TO THE BOTTOM ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// ======================= MODELS =======================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  isApprovedInstructor: { type: Boolean, default: false },
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    enrolledAt: Date
  }],
  points: { type: Number, default: 0 },
  quizResults: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    lessonTitle: String,
    score: Number,
    maxScore: Number,
    earnedPoints: Number,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};
const User = mongoose.model('User', userSchema);

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  notes: String,
  quiz: [{
    question: String,
    options: [String],
    correct: Number
  }]
}, { strict: false });

const moduleSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [moduleSchema],
  finalExam: [{
    question: String,
    options: [String],
    correct: Number
  }],
  status: { type: String, enum: ['pending', 'published', 'rejected'], default: 'pending' }
}, { timestamps: true });
const Course = mongoose.model('Course', courseSchema);

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  enrolledAt: { type: Date, default: Date.now }
});
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

const transactionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  adminCut: Number,
  instructorCut: Number,
  paymentMethod: { type: String, enum: ['easypaisa', 'jazzcash'] },
  transactionId: { type: String, unique: true },
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// ======================= UTILS =======================
const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '7d' });

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// ======================= AUTH ROUTES =======================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role: role || 'student' });
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name, email, role: user.role, isApprovedInstructor: user.isApprovedInstructor }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email, role: user.role, isApprovedInstructor: user.isApprovedInstructor }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/me', protect, (req, res) => res.json({ success: true, user: req.user }));

// ======================= PUBLIC COURSE ROUTES =======================
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' }).populate('instructorId', 'name');
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/courses/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructorId', 'name');
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

    let fullAccess = false;
    const enrollment = await Enrollment.findOne({ studentId: req.user._id, courseId: course._id });
    if (enrollment) fullAccess = true;
    if (req.user.role === 'admin') fullAccess = true;
    if (req.user.role === 'instructor' && course.instructorId._id.toString() === req.user._id.toString()) fullAccess = true;

    const courseObj = course.toObject();
    if (!fullAccess) {
      courseObj.modules = courseObj.modules.map(m => ({
        ...m,
        lessons: m.lessons.map(l => ({ title: l.title }))
      }));
    }
    res.json({ success: true, data: courseObj, hasAccess: fullAccess });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ======================= MOCK PAYMENT & FREE COURSE =======================
app.post('/api/payments/create-order', protect, async (req, res) => {
  try {
    const { courseId, paymentMethod } = req.body;
    const course = await Course.findById(courseId);
    if (!course || course.status !== 'published') {
      return res.status(400).json({ success: false, error: 'Course not available' });
    }
    const existing = await Enrollment.findOne({ studentId: req.user._id, courseId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Already enrolled' });
    }

    if (course.price === 0) {
      await Enrollment.create({ studentId: req.user._id, courseId });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { enrolledCourses: { courseId, paymentStatus: 'completed', enrolledAt: new Date() } }
      });
      return res.json({ success: true, free: true, message: 'Enrolled in free course' });
    }

    const transactionId = crypto.randomBytes(16).toString('hex');
    const mockPaymentUrl = `/mock-payment?txn=${transactionId}&course=${courseId}&method=${paymentMethod}&userId=${req.user._id}`;
    res.json({ success: true, transactionId, paymentUrl: mockPaymentUrl, amount: course.price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/mock-payment', async (req, res) => {
  const { txn, course, method, userId } = req.query;
  try {
    const courseDoc = await Course.findById(course);
    const student = await User.findById(userId);
    if (!courseDoc || !student) return res.status(404).send('Invalid request');

    const existing = await Enrollment.findOne({ studentId: userId, courseId: course });
    if (!existing) {
      await Enrollment.create({ studentId: userId, courseId: course });
      student.enrolledCourses.push({ courseId: course, paymentStatus: 'completed', enrolledAt: new Date() });
      await student.save();

      const adminCut = courseDoc.price * 0.2;
      const instructorCut = courseDoc.price * 0.8;
      await Transaction.create({
        courseId: course,
        studentId: userId,
        instructorId: courseDoc.instructorId,
        amount: courseDoc.price,
        adminCut, instructorCut,
        paymentMethod: method,
        transactionId: txn
      });
    }
    res.send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:50px">
        <h2>✅ Payment Successful!</h2>
        <p>You are now enrolled in <strong>${courseDoc.title}</strong>.</p>
        <a href="/student-dashboard.html">Go to Dashboard</a>
        <script>setTimeout(()=>location.href='/student-dashboard.html',2000)</script>
      </body></html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Payment error');
  }
});

// ======================= ADMIN ROUTES =======================
app.get('/api/admin/users', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const users = await User.find().select('-password');
  res.json(users);
});

app.get('/api/admin/pending-instructors', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const instructors = await User.find({ role: 'instructor', isApprovedInstructor: false }).select('-password');
  res.json(instructors);
});

app.put('/api/admin/approve-instructor/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  await User.findByIdAndUpdate(req.params.id, { isApprovedInstructor: true });
  res.json({ message: 'Instructor approved' });
});

app.get('/api/admin/pending-courses', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const courses = await Course.find({ status: 'pending' }).populate('instructorId');
  res.json(courses);
});

app.put('/api/admin/approve-course/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  await Course.findByIdAndUpdate(req.params.id, { status: 'published' });
  res.json({ message: 'Course published' });
});

app.put('/api/admin/reject-course/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  await Course.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.json({ message: 'Course rejected' });
});

app.get('/api/admin/transactions', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const transactions = await Transaction.find().populate('courseId studentId instructorId');
  res.json(transactions);
});

app.put('/api/courses/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { title, description, price, status } = req.body;
  const course = await Course.findByIdAndUpdate(req.params.id, 
    { title, description, price, status },
    { new: true, runValidators: true }
  );
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ success: true, data: course });
});

app.delete('/api/admin/courses/:courseId', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const course = await Course.findByIdAndDelete(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  await Enrollment.deleteMany({ courseId: req.params.courseId });
  await Transaction.deleteMany({ courseId: req.params.courseId });
  res.json({ message: 'Course deleted successfully' });
});

app.delete('/api/admin/courses/:courseId/modules/:moduleIndex', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const idx = parseInt(req.params.moduleIndex);
  if (idx < 0 || idx >= course.modules.length) return res.status(404).json({ error: 'Module not found' });
  course.modules.splice(idx, 1);
  await course.save();
  res.json({ message: 'Module deleted' });
});

app.delete('/api/admin/courses/:courseId/modules/:moduleIndex/lessons/:lessonIndex', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const mIdx = parseInt(req.params.moduleIndex);
  const lIdx = parseInt(req.params.lessonIndex);
  if (!course.modules[mIdx]) return res.status(404).json({ error: 'Module not found' });
  if (lIdx < 0 || lIdx >= course.modules[mIdx].lessons.length) return res.status(404).json({ error: 'Lesson not found' });
  course.modules[mIdx].lessons.splice(lIdx, 1);
  await course.save();
  res.json({ message: 'Lesson deleted' });
});

// ======================= INSTRUCTOR ROUTES =======================
app.use('/api/instructor', protect);
app.use('/api/instructor', (req, res, next) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ success: false, error: 'Instructor only' });
  next();
});

app.get('/api/instructor/courses', async (req, res) => {
  const courses = await Course.find({ instructorId: req.user._id });
  res.json(courses);
});

app.post('/api/instructor/courses', async (req, res) => {
  let description = req.body.description;
  if (!description || description.trim() === '') {
    description = 'No description provided.';
  }
  const course = new Course({ 
    title: req.body.title,
    description: description,
    price: req.body.price,
    level: req.body.level,
    instructorId: req.user._id,
    status: 'pending',
    modules: []
  });
  await course.save();
  res.json(course);
});

app.get('/api/instructor/earnings', async (req, res) => {
  const transactions = await Transaction.find({ instructorId: req.user._id });
  const total = transactions.reduce((sum, t) => sum + t.instructorCut, 0);
  res.json({ total });
});

app.post('/api/instructor/courses/:courseId/modules', async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  course.modules.push({ title: req.body.title, lessons: [] });
  await course.save();
  res.json(course);
});

app.put('/api/instructor/courses/:courseId/modules/:moduleIndex', async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const idx = parseInt(req.params.moduleIndex);
  if (!course.modules[idx]) return res.status(404).json({ error: 'Module not found' });
  course.modules[idx].title = req.body.title;
  await course.save();
  res.json(course);
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadVideo = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

app.post('/api/instructor/courses/:courseId/modules/:moduleIndex/lessons', protect, uploadVideo.single('video'), async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const idx = parseInt(req.params.moduleIndex);
    if (isNaN(idx) || !course.modules[idx]) return res.status(404).json({ error: 'Module not found' });

    let videoUrl = req.body.videoUrl || '';
    let title = req.body.title;
    let notes = req.body.notes || '';
    let quiz = [];

    if (req.file) {
      videoUrl = `/uploads/${req.file.filename}`;
    }

    // ✅ Critical fix: parse quiz field properly
    if (req.body.quiz) {
      try {
        quiz = typeof req.body.quiz === 'string' ? JSON.parse(req.body.quiz) : req.body.quiz;
      } catch(e) {
        console.error('Quiz parse error:', e);
        quiz = [];
      }
    }

    if (!title) return res.status(400).json({ error: 'Lesson title required' });

    const lesson = { title, videoUrl, notes, quiz };
    course.modules[idx].lessons.push(lesson);
    await course.save();

    res.status(201).json({ success: true, lesson });
  } catch (err) {
    console.error('Error adding lesson:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/instructor/courses/:courseId/final-exam', async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  course.finalExam = req.body.questions;
  await course.save();
  res.json(course);
});

// ======================= CREATE ADMIN USER =======================
async function ensureAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`✅ Admin already exists: ${existingAdmin.email}`);
      const testMatch = await existingAdmin.comparePassword('Admin@123');
      if (!testMatch) {
        console.log('⚠️ Admin password mismatch, resetting to Admin@123');
        existingAdmin.password = 'Admin@123';
        await existingAdmin.save();
        console.log('✅ Admin password reset');
      }
    } else {
      await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: 'admin',
        isApprovedInstructor: true
      });
      console.log('✅ Admin created: admin@example.com / Admin@123');
    }
  } catch (err) {
    console.error('Error ensuring admin:', err);
  }
}


// ======================= STUDENT STATS & LEADERBOARD =======================
app.get('/api/student/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('points quizResults enrolledCourses name');
    const enrolledCount = user.enrolledCourses?.length || 0;
    const recent = user.quizResults?.slice(-1)[0] || null;
    res.json({
      success: true,
      points: user.points || 0,
      enrolledCount,
      recentQuiz: recent ? {
        lessonTitle: recent.lessonTitle,
        score: recent.score,
        maxScore: recent.maxScore,
        earnedPoints: recent.earnedPoints,
        date: recent.date
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/student/quiz-result', protect, async (req, res) => {
  try {
    const { courseId, lessonTitle, score, maxScore } = req.body;
    const earnedPoints = Math.round((score / maxScore) * 10) || 0;
    await User.findByIdAndUpdate(req.user._id, {
      $push: { quizResults: { courseId, lessonTitle, score, maxScore, earnedPoints } },
      $inc: { points: earnedPoints }
    });
    res.json({ success: true, earnedPoints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/leaderboard', protect, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name points enrolledCourses quizResults')
      .sort({ points: -1 })
      .limit(10);
    const board = students.map((s, i) => ({
      rank: i + 1,
      name: s.name,
      points: s.points || 0,
      coursesCount: s.enrolledCourses?.length || 0,
      quizzesCount: s.quizResults?.length || 0
    }));
    res.json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/instructor/analytics', protect, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Instructor only' });
    const courses = await Course.find({ instructorId: req.user._id });
    const analytics = await Promise.all(courses.map(async (c) => {
      const enrollmentCount = await Enrollment.countDocuments({ courseId: c._id });
      const totalLessons = c.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
      return {
        courseId: c._id,
        title: c.title,
        status: c.status,
        price: c.price,
        enrollmentCount,
        totalLessons,
        totalModules: c.modules.length
      };
    }));
    const totalEnrollments = analytics.reduce((s, a) => s + a.enrollmentCount, 0);
    res.json({ success: true, data: analytics, totalEnrollments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete lesson from module (Instructor)
app.delete('/api/instructor/courses/:courseId/modules/:moduleIndex/lessons/:lessonIndex', protect, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Instructor only' });
    const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const mIdx = parseInt(req.params.moduleIndex);
    const lIdx = parseInt(req.params.lessonIndex);
    if (!course.modules[mIdx]) return res.status(404).json({ error: 'Module not found' });
    course.modules[mIdx].lessons.splice(lIdx, 1);
    await course.save();
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete module (Instructor)
app.delete('/api/instructor/courses/:courseId/modules/:moduleIndex', protect, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Instructor only' });
    const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const idx = parseInt(req.params.moduleIndex);
    if (idx < 0 || idx >= course.modules.length) return res.status(404).json({ error: 'Module not found' });
    course.modules.splice(idx, 1);
    await course.save();
    res.json({ success: true, message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Update lesson quiz (Instructor)
app.put('/api/instructor/courses/:courseId/modules/:moduleIndex/lessons/:lessonIndex/quiz', protect, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Instructor only' });
    const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const mIdx = parseInt(req.params.moduleIndex);
    const lIdx = parseInt(req.params.lessonIndex);
    if (!course.modules[mIdx]) return res.status(404).json({ error: 'Module not found' });
    if (!course.modules[mIdx].lessons[lIdx]) return res.status(404).json({ error: 'Lesson not found' });
    course.modules[mIdx].lessons[lIdx].quiz = req.body.quiz || [];
    await course.save();
    res.json({ success: true, message: 'Quiz updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ======================= STATIC FILES =======================
const clientPath = path.join(__dirname, '..');
app.use(express.static(clientPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API not found' });
  const indexFile = path.join(clientPath, 'index.html');
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  res.status(404).send('Not found');
});
