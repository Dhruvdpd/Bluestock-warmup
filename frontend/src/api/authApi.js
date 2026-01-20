import axiosInstance from './axiosInstance';

export const authApi = {
  // Register user
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Verify Firebase token
  verifyFirebaseToken: async (idToken) => {
    const response = await axiosInstance.post('/auth/verify-firebase-token', {
      idToken,
    });
    return response.data;
  },

  // Verify mobile OTP
  verifyMobile: async () => {
    const response = await axiosInstance.post('/auth/verify-mobile');
    return response.data;
  },

  // Verify email
  verifyEmail: async () => {
    const response = await axiosInstance.post('/auth/verify-email');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};