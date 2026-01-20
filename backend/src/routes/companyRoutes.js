import express from 'express';
import CompanyController from '../controllers/companyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { handleValidationErrors, sanitizeInput } from '../middleware/validationMiddleware.js';
import { companyValidation } from '../utils/validators.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Get company profile
router.get('/', CompanyController.getCompany);

// Create company profile
router.post(
  '/',
  sanitizeInput,
  companyValidation,
  handleValidationErrors,
  CompanyController.createCompany
);

// Update company profile
router.put(
  '/',
  sanitizeInput,
  companyValidation,
  handleValidationErrors,
  CompanyController.updateCompany
);

// Delete company profile
router.delete('/', CompanyController.deleteCompany);

// Upload logo
router.post('/upload/logo', sanitizeInput, CompanyController.uploadLogo);

// Upload banner
router.post('/upload/banner', sanitizeInput, CompanyController.uploadBanner);

export default router;