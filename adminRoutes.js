// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const { sendApprovalEmail } = require('../utils/emailService');

// @route   PUT /api/admin/approve-instructor/:userId
// @desc    Admin approves an instructor to publish courses
// @access  Private (Admin only)
router.put('/approve-instructor/:userId', 
  authMiddleware, 
  roleCheck(['admin']), 
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find the instructor
      const instructor = await User.findById(userId);
      
      if (!instructor) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }
      
      // Verify user is an instructor
      if (instructor.role !== 'instructor') {
        return res.status(400).json({ 
          success: false, 
          error: 'This user is not registered as an instructor' 
        });
      }
      
      // Check if already approved
      if (instructor.isApprovedInstructor) {
        return res.status(400).json({ 
          success: false, 
          error: 'Instructor is already approved' 
        });
      }
      
      // Update approval status
      instructor.isApprovedInstructor = true;
      instructor.instructorRequestStatus = 'approved';
      instructor.approvedAt = new Date();
      instructor.approvedBy = req.userId; // Admin who approved
      
      await instructor.save();
      
      // Send approval email to instructor
      await sendApprovalEmail({
        to: instructor.email,
        name: instructor.name,
        courseCreationLink: 'https://pak-edutoll.com/instructor/dashboard'
      });
      
      // Log approval action (optional: create audit log)
      console.log(`✅ Admin ${req.userId} approved instructor ${userId} at ${new Date()}`);
      
      res.status(200).json({
        success: true,
        message: 'Instructor approved successfully. Course creation is now enabled.',
        data: {
          instructorId: instructor._id,
          name: instructor.name,
          email: instructor.email,
          approvedAt: instructor.approvedAt
        }
      });
      
    } catch (error) {
      console.error('Approval error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Server error while approving instructor' 
      });
    }
  }
);

// @route   GET /api/admin/pending-instructors
// @desc    Get all pending instructor requests
// @access  Private (Admin only)
router.get('/pending-instructors', 
  authMiddleware, 
  roleCheck(['admin']), 
  async (req, res) => {
    try {
      const pendingInstructors = await User.find({
        role: 'instructor',
        isApprovedInstructor: false,
        instructorRequestStatus: 'pending'
      }).select('-password');
      
      res.status(200).json({
        success: true,
        count: pendingInstructors.length,
        data: pendingInstructors
      });
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Server error' 
      });
    }
  }
);

// @route   DELETE /api/admin/reject-instructor/:userId
// @desc    Reject instructor request (optional)
router.delete('/reject-instructor/:userId',
  authMiddleware,
  roleCheck(['admin']),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const instructor = await User.findById(userId);
      
      if (!instructor || instructor.role !== 'instructor') {
        return res.status(404).json({ error: 'Invalid instructor' });
      }
      
      instructor.instructorRequestStatus = 'rejected';
      instructor.rejectedAt = new Date();
      await instructor.save();
      
      // Optionally send rejection email
      await sendRejectionEmail(instructor.email, instructor.name);
      
      res.json({ 
        success: true, 
        message: 'Instructor request rejected' 
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;