// server/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: String,
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Pricing
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPrice: Number,
  // Course details
  thumbnail: String,
  trailerVideo: String,
  category: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  language: {
    type: String,
    default: 'Urdu'
  },
  whatYouWillLearn: [String],
  requirements: [String],
  targetAudience: [String],
  // Stats
  totalModules: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  totalDuration: Number, // in minutes
  totalStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Generate slug before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = Date.now();
  next();
});
const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  notes: String,
  quiz: [{
    question: String,
    options: [String],
    correct: Number
  }]
});

const ModuleSchema = new mongoose.Schema({
  title: String,
  lessons: [LessonSchema]
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
  level: String,
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [ModuleSchema],
  finalExam: [{
    question: String,
    options: [String],
    correct: Number
  }],
  status: { type: String, enum: ['pending', 'published', 'rejected'], default: 'pending' },
  thumbnail: String,
  category: String,
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Course', CourseSchema);