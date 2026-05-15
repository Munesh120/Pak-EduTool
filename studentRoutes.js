const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, enrollCourse, getEnrollments } = require('../controllers/moduleController');
const { completeModule, getProgress } = require('../controllers/progressController');
const { getCertificate, getUserCertificates } = require('../controllers/certificateController');

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/enroll', enrollCourse);
router.get('/enrollments/:userId', getEnrollments);
router.post('/progress/complete-module', completeModule);
router.get('/progress/:userId/:courseId', getProgress);
router.get('/certificate/:userId/:courseId', getCertificate);
router.get('/certificates/:userId', getUserCertificates);

module.exports = router;
