import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { 
  createStudentOrder, 
  verifyStudentPayment, 
  getMyEnrollments, 
  createStudentCourseOrder, 
  verifyStudentCoursePayment,
  getMyEnrolledCourses,
  checkCourseAccess,
  updateCourseProgress,
  enrollFreeCourse
} from '../controllers/student.controller.js';

const router = express.Router();

// Content purchases (old system)
router.post('/create-order', requireAuth, requireRole(['student']), createStudentOrder);
router.post('/verify', requireAuth, requireRole(['student']), verifyStudentPayment);
router.get('/my-courses', requireAuth, requireRole(['student']), getMyEnrollments);

// Course purchases (new proper system)
router.post('/course/create-order', requireAuth, requireRole(['student']), createStudentCourseOrder);
router.post('/course/verify', requireAuth, requireRole(['student']), verifyStudentCoursePayment);
router.post('/course/enroll-free', requireAuth, requireRole(['student']), enrollFreeCourse);
router.get('/enrolled-courses', requireAuth, requireRole(['student']), getMyEnrolledCourses);
router.get('/course/:courseId/access', requireAuth, requireRole(['student']), checkCourseAccess);
router.post('/course/progress', requireAuth, requireRole(['student']), updateCourseProgress);

export default router;
