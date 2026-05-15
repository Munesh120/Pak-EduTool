const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  certificateId: { type: String, unique: true },
  issuedAt: { type: Date, default: Date.now },
  pdfUrl: String,
  verificationCode: { type: String, unique: true }
});

module.exports = mongoose.model('Certificate', certificateSchema);