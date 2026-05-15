// server/models/Quiz.js
const mongoose = require('mongoose');

// Define ObjectId properly
const { ObjectId } = mongoose.Schema.Types;

const quizSchema = new mongoose.Schema({
  moduleId: { 
    type: ObjectId, 
    ref: 'Module' 
  },
  courseId: { 
    type: ObjectId, 
    ref: 'Course' 
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['module_quiz', 'final_exam'],
    default: 'module_quiz'
  },
  passingScore: {
    type: Number,
    default: 80
  },
  questions: [{
    questionText: String,
    options: [String],
    correctOption: Number,
    points: {
      type: Number,
      default: 10
    }
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate total points
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['module_quiz', 'final_exam'], default: 'module_quiz' },
  passingScore: { type: Number, default: 80 },
  timeLimit: Number,
  maxAttempts: { type: Number, default: 3 },
  questions: [{
    questionText: String,
    options: [String],
    correctOption: Number,
    points: { type: Number, default: 10 }
  }],
  totalPoints: { type: Number, default: 0 }
});

quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);