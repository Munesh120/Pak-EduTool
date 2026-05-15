const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, roleCheck('instructor', 'admin'), createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;