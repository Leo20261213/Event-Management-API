import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateIdParam } from '../middleware/validation.js';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// CREATE BOOKING (USER)
router.post(
  '/', 
  authenticate, 
  createBooking
);

// GET BOOKINGS (USER → own, ADMIN → all)
router.get(
  '/', 
  authenticate, 
  getBookings
);

// GET BOOKING BY ID (OWNER or ADMIN)
router.get(
  '/:idBooking', 
  authenticate, 
  validateIdParam('idBooking'), 
  getBookingById
);

// UPDATE BOOKING (OWNER ONLY)
router.put(
  '/:idBooking', 
  authenticate, 
  validateIdParam('idBooking'), 
  updateBooking
);

// DELETE BOOKING (OWNER ONLY)
router.delete(
  '/:idBooking', 
  authenticate, 
  validateIdParam('idBooking'), 
  deleteBooking
);

export default router;