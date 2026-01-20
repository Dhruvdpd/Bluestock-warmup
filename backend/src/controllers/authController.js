import UserModel from '../models/userModel.js';
import { generateToken } from '../utils/jwtUtils.js';
import { auth } from '../config/firebase.js';

class AuthController {
  // Register a new user
  static async register(req, res, next) {
    try {
      const { email, password, full_name, gender, mobile_no, firebase_uid } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email address already registered',
        });
      }

      // Check if mobile number already exists
      const existingMobile = await UserModel.findByMobile(mobile_no);
      if (existingMobile) {
        return res.status(409).json({
          success: false,
          message: 'Mobile number already registered',
        });
      }

      // Create user in database
      const user = await UserModel.create({
        email,
        password,
        full_name,
        gender,
        mobile_no,
        signup_type: 'e',
      });

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            gender: user.gender,
            mobile_no: user.mobile_no,
            is_mobile_verified: user.is_mobile_verified,
            is_email_verified: user.is_email_verified,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Verify password
      const isPasswordValid = await UserModel.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            gender: user.gender,
            mobile_no: user.mobile_no,
            is_mobile_verified: user.is_mobile_verified,
            is_email_verified: user.is_email_verified,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify mobile OTP
  static async verifyMobile(req, res, next) {
    try {
      const { userId } = req.user;

      // Update mobile verification status
      const user = await UserModel.updateMobileVerification(userId, true);

      res.status(200).json({
        success: true,
        message: 'Mobile number verified successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            is_mobile_verified: user.is_mobile_verified,
            is_email_verified: user.is_email_verified,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify email
  static async verifyEmail(req, res, next) {
    try {
      const { userId } = req.user;

      // Update email verification status
      const user = await UserModel.updateEmailVerification(userId, true);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            is_mobile_verified: user.is_mobile_verified,
            is_email_verified: user.is_email_verified,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify Firebase ID token
  static async verifyFirebaseToken(req, res, next) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Firebase ID token is required',
        });
      }

      // Verify the Firebase ID token
      const decodedToken = await auth.verifyIdToken(idToken);
      
      res.status(200).json({
        success: true,
        message: 'Firebase token verified successfully',
        data: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          email_verified: decodedToken.email_verified,
        },
      });
    } catch (error) {
      console.error('Firebase token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid Firebase token',
      });
    }
  }

  // Get current user
  static async getCurrentUser(req, res, next) {
    try {
      const { userId } = req.user;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;