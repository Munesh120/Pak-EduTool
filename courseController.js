const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

// Create course (instructor only)
const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructorId: req.user._id
    });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all courses (public)
const getCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = { status: 'published', isApproved: true };
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const courses = await Course.find(query).populate('instructorId', 'name');
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single course
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name bio headline');
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    const modules = await Module.find({ courseId: course._id })
      .sort({ order: 1 })
      .populate('lessons');
    
    res.json({ success: true, data: { course, modules } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Enroll in course
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: course._id
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ success: false, error: 'Already enrolled' });
    }
    
    await Enrollment.create({
      userId: req.user._id,
      courseId: course._id,
      isPaid: !course.isPaid
    });
    
    // Create progress tracking
    await Progress.create({
      userId: req.user._id,
      courseId: course._id,
      unlockedModules: []
    });
    
    // Unlock first module
    const firstModule = await Module.findOne({ courseId: course._id }).sort({ order: 1 });
    if (firstModule) {
      await Progress.findOneAndUpdate(
        { userId: req.user._id, courseId: course._id },
        { $push: { unlockedModules: { moduleId: firstModule._id } } }
      );
    }
    
    course.totalStudents += 1;
    await course.save();
    
    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse
};