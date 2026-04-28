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
  '/:idEvent',
  validateIdParam('idEvent'),
  getEventById
);

// UPDATE EVENT (ADMIN)
router.put(
  '/:idEvent',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idEvent'),
  updateEvent
);

// DELETE EVENT (ADMIN)
router.delete(
  '/:idEvent',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idEvent'),
  deleteEvent
);

export default router;