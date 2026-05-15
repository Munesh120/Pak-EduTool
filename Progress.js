const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completedQuizzes: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    passedAt: Date,
    score: Number
  }],
  unlockedModules: [{
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    unlockedAt: { type: Date, default: Date.now }
  }],
  overallProgress: { type: Number, default: 0 },
  isCourseCompleted: { type: Boolean, default: false },
  certificateIssued: { type: Boolean, default: false }
});

module.exports = mongoose.model('Progress', progressSchema);