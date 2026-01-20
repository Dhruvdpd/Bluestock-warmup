import createError from 'http-errors';
import { auth } from '../config/firebase.js';
import * as userModel from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (userData) => {
  const { email, password, full_name, gender, mobile_no } = userData;

  const existingUserByEmail = await userModel.findUserByEmail(email);
  if (existingUserByEmail) {
    throw createError(409, 'User with this email already exists');
  }

  const existingUserByMobile = await userModel.findUserByMobile(mobile_no);
  if (existingUserByMobile) {
    throw createError(409, 'User with this mobile number already exists');
  }

  let firebaseUser;
  try {
    firebaseUser = await auth.createUser({
      email,
      password,
      displayName: full_name,
      phoneNumber: mobile_no,
    });
  } catch (error) {
    console.error('Firebase user creation error:', error);
    throw createError(500, 'Failed to create authentication user');
  }

  try {
    const user = await userModel.createUser({
      email,
      password,
      full_name,
      gender,
      mobile_no,
      signup_type: 'e',
    });

    await auth.generateEmailVerificationLink(email);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_no: user.mobile_no,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
      },
      firebase_uid: firebaseUser.uid,
    };
  } catch (error) {
    await auth.deleteUser(firebaseUser.uid);
    throw error;
  }
};

export const loginUser = async (email, password, firebaseIdToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(firebaseIdToken);
    
    if (decodedToken.email !== email) {
      throw createError(401, 'Token email does not match provided email');
    }
  } catch (error) {
    throw createError(401, 'Invalid Firebase token');
  }

  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }

  const isPasswordValid = await userModel.verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, 'Invalid credentials');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      gender: user.gender,
      mobile_no: user.mobile_no,
      is_email_verified: user.is_email_verified,
      is_mobile_verified: user.is_mobile_verified,
    },
  };
};

export const verifyEmail = async (userId) => {
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw createError(404, 'User not found');
  }

  if (user.is_email_verified) {
    throw createError(400, 'Email already verified');
  }

  const updatedUser = await userModel.updateEmailVerification(userId, true);
  return updatedUser;
};

export const verifyMobile = async (userId, firebaseIdToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(firebaseIdToken);
    
    const user = await userModel.findUserById(userId);
    if (!user) {
      throw createError(404, 'User not found');
    }

    if (user.is_mobile_verified) {
      throw createError(400, 'Mobile number already verified');
    }

    const updatedUser = await userModel.updateMobileVerification(userId, true);
    return updatedUser;
  } catch (error) {
    if (error.status) throw error;
    throw createError(401, 'Invalid verification token');
  }
};