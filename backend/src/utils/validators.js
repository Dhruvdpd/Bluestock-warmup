import { body, param } from 'express-validator';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

// User registration validation
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters'),
  body('gender')
    .isIn(['m', 'f', 'o'])
    .withMessage('Gender must be m (male), f (female), or o (other)'),
  body('mobile_no')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .custom((value) => {
      if (!isValidPhoneNumber(value)) {
        throw new Error('Please provide a valid mobile number with country code');
      }
      return true;
    }),
];

// Login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Company profile validation
export const companyValidation = [
  body('company_name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 255 })
    .withMessage('Company name must not exceed 255 characters'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 50 })
    .withMessage('City must not exceed 50 characters'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 50 })
    .withMessage('State must not exceed 50 characters'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 50 })
    .withMessage('Country must not exceed 50 characters'),
  body('postal_code')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .isLength({ max: 20 })
    .withMessage('Postal code must not exceed 20 characters'),
  body('website')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('industry')
    .trim()
    .notEmpty()
    .withMessage('Industry is required'),
  body('founded_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('description')
    .optional({ checkFalsy: true })
    .trim(),
  body('social_links')
    .optional()
    .isObject()
    .withMessage('Social links must be an object'),
];

// Update user validation
export const updateUserValidation = [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters'),
  body('gender')
    .optional()
    .isIn(['m', 'f', 'o'])
    .withMessage('Gender must be m, f, or o'),
  body('mobile_no')
    .optional()
    .custom((value) => {
      if (value && !isValidPhoneNumber(value)) {
        throw new Error('Please provide a valid mobile number with country code');
      }
      return true;
    }),
];

// ID parameter validation
export const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid ID parameter'),
];