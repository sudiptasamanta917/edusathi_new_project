import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createStudentOrder, verifyStudentPayment, getMyEnrollments, createStudentCourseOrder, verifyStudentCoursePayment } from '../controllers/student.controller.js';

const router = express.Router();

router.post('/create-order', requireAuth, requireRole(['student']), createStudentOrder);
router.post('/verify', requireAuth, requireRole(['student']), verifyStudentPayment);
router.post('/course/create-order', requireAuth, requireRole(['student']), createStudentCourseOrder);
router.post('/course/verify', requireAuth, requireRole(['student']), verifyStudentCoursePayment);
router.get('/my-courses', requireAuth, requireRole(['student']), getMyEnrollments);

export default router;
