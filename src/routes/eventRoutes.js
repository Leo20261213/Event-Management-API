import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validation.js';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

// POST /api/events (ADMIN)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  createEvent
);

// GET /api/events (public)
router.get('/', getAllEvents);

// GET /api/events/:id (public)
router.get(
  '/:idEvent',
  validateIdParam('idEvent'),
  getEventById
);

// PUT /api/events/:id (ADMIN)
router.put(
  '/:idEvent',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idEvent'),
  updateEvent
);

// DELETE /api/events/:id (ADMIN)
router.delete(
  '/:idEvent',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idEvent'),
  deleteEvent
);

export default router;