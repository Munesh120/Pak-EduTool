const express = require('express');
const Course = require('../models/Course');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.use((req, res, next) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Instructor only' });
  next();
});

router.post('/courses', async (req, res) => {
  const course = new Course({ ...req.body, instructorId: req.user.id, status: 'pending' });
  await course.save();
  res.json(course);
});

router.get('/courses', async (req, res) => {
  const courses = await Course.find({ instructorId: req.user.id });
  res.json(courses);
});

router.get('/earnings', async (req, res) => {
  const transactions = await Transaction.find({ instructorId: req.user.id });
  const total = transactions.reduce((sum, t) => sum + t.instructorCut, 0);
  res.json({ total });
});

router.put('/courses/:courseId', async (req, res) => {
  await Course.findOneAndUpdate({ _id: req.params.courseId, instructorId: req.user.id }, req.body);
  res.json({ message: 'Updated' });
});

router.post('/courses/:courseId/modules', async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user.id });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  course.modules.push(req.body);
  await course.save();
  res.json(course);
});

router.post('/courses/:courseId/modules/:moduleIndex/lessons', async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user.id });
  if (!course) return res.status(404);
  const idx = parseInt(req.params.moduleIndex);
  if (!course.modules[idx]) return res.status(404).json({ error: 'Module not found' });
  course.modules[idx].lessons.push(req.body);
  await course.save();
  res.json(course);
});

router.post('/courses/:courseId/final-exam', async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user.id });
  if (!course) return res.status(404);
  course.finalExam = req.body.questions;
  await course.save();
  res.json(course);
});

module.exports = router;