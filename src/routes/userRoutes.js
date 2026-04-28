import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// /api/users/me → returns the currently authenticated user
router.get('/me', authenticate, getCurrentUser);

export default router;