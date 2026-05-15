const User = require('../models/User');
const Course = require('../models/Course');

const getPendingInstructors = async (req, res) => {
  try {
    const instructors = await User.find({
      role: 'instructor',
      isApprovedInstructor: false,
      instructorRequestStatus: 'pending'
    }).select('-password');
    
    res.json({ success: true, count: instructors.length, data: instructors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const approveInstructor = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id);
    
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }
    
    instructor.isApprovedInstructor = true;
    instructor.instructorRequestStatus = 'approved';
    instructor.approvedAt = new Date();
    await instructor.save();
    
    res.json({ success: true, message: 'Instructor approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const requestInstructorRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.role !== 'instructor') {
      return res.status(400).json({ success: false, error: 'You must be an instructor to request approval' });
    }
    
    user.instructorRequestStatus = 'pending';
    user.instructorRequestedAt = new Date();
    await user.save();
    
    res.json({ success: true, message: 'Request sent to admin' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructorId', 'name');
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const approveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    course.isApproved = true;
    course.status = 'published';
    course.publishedAt = new Date();
    await course.save();
    
    res.json({ success: true, message: 'Course approved and published' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPendingInstructors,
  approveInstructor,
  requestInstructorRole,
  getAllCourses,
  approveCourse
};