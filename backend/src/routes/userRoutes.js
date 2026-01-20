import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { handleValidationErrors, sanitizeInput } from '../middleware/validationMiddleware.js';
import { updateUserValidation } from '../utils/validators.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Get user profile
router.get('/profile', UserController.getProfile);

// Update user profile
router.put(
  '/profile',
  sanitizeInput,
  updateUserValidation,
  handleValidationErrors,
  UserController.updateProfile
);

// Delete user account
router.delete('/account', UserController.deleteAccount);

export default router;