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

// CREATE EVENT (ADMIN)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  createEvent
);

// GET ALL EVENTS (PUBLIC)
router.get('/', getAllEvents);

// GET EVENT BY ID (PUBLIC)
router.get(
  '/:id',
  validateIdParam('id'),
  getEventById
);

// UPDATE EVENT (ADMIN)
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('id'),
  updateEvent
);

// DELETE EVENT (ADMIN)
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('id'),
  deleteEvent
);

export default router;