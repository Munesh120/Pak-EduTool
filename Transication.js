const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  adminCut: Number,
  instructorCut: Number,
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);