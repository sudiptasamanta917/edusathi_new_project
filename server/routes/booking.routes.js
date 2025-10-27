import express from 'express';
const router = express.Router();
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
} from '../controllers/booking.controller.js';

// Public routes
router.post('/book', createBooking);

// Admin routes (you can add authentication middleware here)
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingById);
router.patch('/bookings/:id/status', updateBookingStatus);

export default router;
