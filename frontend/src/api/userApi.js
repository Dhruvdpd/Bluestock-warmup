import axiosInstance from './axiosInstance';

export const userApi = {
  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/user/profile', userData);
    return response.data;
  },

  // Delete user account
  deleteAccount: async () => {
    const response = await axiosInstance.delete('/user/account');
    return response.data;
  },
};