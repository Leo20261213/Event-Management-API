import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validation.js';
import {
  createVenue,
  getVenueById,
  updateVenue,
  deleteVenue
} from '../controllers/venueController.js';

const router = express.Router();

// POST /api/venues (ADMIN)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  createVenue
);

// GET /api/venues/:id (public)
router.get(
  '/:idVenue',
  validateIdParam('idVenue'),
  getVenueById
);

// PUT /api/venues/:id (ADMIN)
router.put(
  '/:idVenue',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idVenue'),
  updateVenue
);

// DELETE /api/venues/:id (ADMIN)
router.delete(
  '/:idVenue',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idVenue'),
  deleteVenue
);

export default router;