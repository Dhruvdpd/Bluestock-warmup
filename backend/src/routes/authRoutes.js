import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { handleValidationErrors, sanitizeInput } from '../middleware/validationMiddleware.js';
import { registerValidation, loginValidation } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.post(
  '/register',
  sanitizeInput,
  registerValidation,
  handleValidationErrors,
  AuthController.register
);

router.post(
  '/login',
  sanitizeInput,
  loginValidation,
  handleValidationErrors,
  AuthController.login
);

router.post(
  '/verify-firebase-token',
  sanitizeInput,
  AuthController.verifyFirebaseToken
);

// Protected routes
router.post(
  '/verify-mobile',
  authenticateToken,
  AuthController.verifyMobile
);

router.post(
  '/verify-email',
  authenticateToken,
  AuthController.verifyEmail
);

router.get(
  '/me',
  authenticateToken,
  AuthController.getCurrentUser
);

export default router;