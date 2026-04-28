import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validation.js';
import {
  createVenue,
  getVenueById,
  updateVenue,
  deleteVenue,
  getAllVenues
} from '../controllers/venueController.js';

const router = express.Router();

// GET /api/venues (public)
router.get('/', getAllVenues);

// POST /api/venues (ADMIN)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  createVenue
);

// GET /api/venues/:idVenue (public)
router.get(
  '/:idVenue',
  validateIdParam('idVenue'),
  getVenueById
);

// PUT /api/venues/:idVenue (ADMIN)
router.put(
  '/:idVenue',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idVenue'),
  updateVenue
);

// DELETE /api/venues/:idVenue (ADMIN)
router.delete(
  '/:idVenue',
  authenticate,
  requireRole('ADMIN'),
  validateIdParam('idVenue'),
  deleteVenue
);

export default router;