import { verifyToken } from '../utils/jwtUtils.js';
import UserModel from '../models/userModel.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Middleware to check if user's email is verified
export const requireEmailVerification = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    
    if (!user.is_email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address to continue',
      });
    }

    next();
  } catch (error) {
    console.error('Email verification check error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Middleware to check if user's mobile is verified
export const requireMobileVerification = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    
    if (!user.is_mobile_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your mobile number to continue',
      });
    }

    next();
  } catch (error) {
    console.error('Mobile verification check error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};