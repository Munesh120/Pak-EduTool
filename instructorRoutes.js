const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', (req, res) => {
  try {
    const totalStudents = db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt;
    const totalCourses = db.prepare('SELECT COUNT(*) as cnt FROM courses').get().cnt;
    const totalCertificates = db.prepare('SELECT COUNT(*) as cnt FROM certificates').get().cnt;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status = 'confirmed'").get().total;
    res.json({ success: true, stats: { totalStudents, totalCourses, totalCertificates, totalRevenue } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/courses', (req, res) => {
  try {
    const courses = db.prepare(`
      SELECT c.*, COUNT(e.id) as enrolled_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id
    `).all();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
