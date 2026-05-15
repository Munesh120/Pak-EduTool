// models/QuizResult.js
const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  },
  attemptNumber: {
    type: Number,
    required: true
  },
  score: {
    type: Number, // Points earned
    default: 0
  },
  percentage: {
    type: Number, // Percentage score
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: Number,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

// Compound index to prevent duplicate attempts tracking
quizResultSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 }, { unique: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);