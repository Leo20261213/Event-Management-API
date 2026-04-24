import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validation.js';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// POST /api/bookings (USER)
router.post('/', authenticate, createBooking);

// GET /api/bookings (USER → own, ADMIN → all)
router.get('/', authenticate, getBookings);

// GET /api/bookings/:id (owner or ADMIN)
router.get(
  '/:idBooking',
  authenticate,
  validateIdParam('idBooking'),
  getBookingById
);

// PUT /api/bookings/:id (owner only)
router.put(
  '/:idBooking',
  authenticate,
  validateIdParam('idBooking'),
  updateBooking
);

// DELETE /api/bookings/:id (owner only)
router.delete(
  '/:idBooking',
  authenticate,
  validateIdParam('idBooking'),
  deleteBooking
);

export default router;