import UserModel from '../models/userModel.js';

class UserController {
  // Get user profile
  static async getProfile(req, res, next) {
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

  // Update user profile
  static async updateProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const { full_name, gender, mobile_no } = req.body;

      // Check if mobile number is already taken by another user
      if (mobile_no) {
        const existingUser = await UserModel.findByMobile(mobile_no);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({
            success: false,
            message: 'Mobile number already in use',
          });
        }
      }

      // Update user
      const user = await UserModel.update(userId, {
        full_name,
        gender,
        mobile_no,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user account
  static async deleteAccount(req, res, next) {
    try {
      const { userId } = req.user;

      const deleted = await UserModel.delete(userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;