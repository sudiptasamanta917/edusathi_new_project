import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { 
  createStudentOrder, 
  verifyStudentPayment, 
  getMyEnrollments, 
  createStudentCourseOrder, 
  verifyStudentCoursePayment,
  getVideoForStudent,
  enrollInFreeCourse,
  updateVideoProgress,
  getEnrolledCourses,
  enrollInPaidCourse,
  getCourseEnrollmentStatus,
  getMyEnrolledCoursesDetailed,
  getStudentAnalytics,
  debugEnrollment
} from '../controllers/student.controller.js';

const router = express.Router();

// Payment routes
router.post('/create-order', requireAuth, requireRole(['student']), createStudentOrder);
router.post('/verify', requireAuth, requireRole(['student']), verifyStudentPayment);
router.post('/course/create-order', requireAuth, requireRole(['student']), createStudentCourseOrder);
router.post('/course/verify', requireAuth, requireRole(['student']), verifyStudentCoursePayment);

// Course enrollment and management
router.get('/my-courses', requireAuth, requireRole(['student']), getMyEnrollments);
router.get('/enrolled-courses', requireAuth, requireRole(['student']), getEnrolledCourses);
router.get('/enrolled-courses-detailed', requireAuth, requireRole(['student']), getMyEnrolledCoursesDetailed);
router.post('/courses/:courseId/enroll', requireAuth, requireRole(['student']), enrollInFreeCourse);
router.post('/courses/:courseId/enroll-paid', requireAuth, requireRole(['student']), enrollInPaidCourse);
router.get('/courses/:courseId/enrollment-status', requireAuth, requireRole(['student']), getCourseEnrollmentStatus);

// Video watching and progress
router.get('/courses/:courseId/videos/:videoId', requireAuth, requireRole(['student']), getVideoForStudent);
router.post('/courses/:courseId/videos/:videoId/progress', requireAuth, requireRole(['student']), updateVideoProgress);

// Analytics
router.get('/analytics', requireAuth, requireRole(['student']), getStudentAnalytics);

// Debug route for enrollment testing
router.get('/debug/courses/:courseId', requireAuth, requireRole(['student']), debugEnrollment);

export default router;
