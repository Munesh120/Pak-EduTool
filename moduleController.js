const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const getCourses = (req, res) => {
  try {
    const courses = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: err.message });
  }
};

const getCourseById = (req, res) => {
  try {
    const { id } = req.params;
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const modules = db.prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index').all(id);
    res.json({ success: true, course, modules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const enrollCourse = (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) return res.status(400).json({ success: false, message: 'userId and courseId required' });

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const existing = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (existing) return res.json({ success: true, enrollment: existing, message: 'Already enrolled' });

    const paymentStatus = course.is_premium === 0 ? 'confirmed' : 'pending';
    const enrollment = db.prepare(`
      INSERT INTO enrollments (id, user_id, course_id, progress, payment_status)
      VALUES (?, ?, ?, 0, ?)
    `).run(uuidv4(), userId, courseId, paymentStatus);

    const newEnrollment = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    res.json({ success: true, enrollment: newEnrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getEnrollments = (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = db.prepare(`
      SELECT e.*, c.title, c.instructor, c.category, c.level, c.modules_count, c.thumbnail, c.price
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `).all(userId);
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCourses, getCourseById, enrollCourse, getEnrollments };
