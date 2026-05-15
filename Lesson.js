// server/models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  videoUrl: {
    type: String,
    required: true
  },
  videoType: {
    type: String,
    enum: ['youtube', 'vimeo', 'local'],
    default: 'youtube'
  },
  videoId: String, // YouTube video ID
  duration: Number, // in seconds
  notes: {
    type: String,
    default: ''
  },
  summary: String,
  resources: [{
    title: String,
    url: String,
    type: String // pdf, link, file
  }],
  order: {
    type: Number,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);