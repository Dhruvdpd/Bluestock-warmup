import { validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};

// Middleware to sanitize request body
export const sanitizeInput = (req, res, next) => {
  const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: {},
  };

  // Recursively sanitize all string fields in req.body
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key], sanitizeOptions).trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitizeObject(req.body);
  }

  next();
};