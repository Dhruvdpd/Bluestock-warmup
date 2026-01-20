import axiosInstance from './axiosInstance';

export const companyApi = {
  // Get company profile
  getCompany: async () => {
    const response = await axiosInstance.get('/company');
    return response.data;
  },

  // Create company profile
  createCompany: async (companyData) => {
    const response = await axiosInstance.post('/company', companyData);
    return response.data;
  },

  // Update company profile
  updateCompany: async (companyData) => {
    const response = await axiosInstance.put('/company', companyData);
    return response.data;
  },

  // Delete company profile
  deleteCompany: async () => {
    const response = await axiosInstance.delete('/company');
    return response.data;
  },

  // Upload logo
  uploadLogo: async (imageBase64) => {
    const response = await axiosInstance.post('/company/upload/logo', {
      image: imageBase64,
    });
    return response.data;
  },

  // Upload banner
  uploadBanner: async (imageBase64) => {
    const response = await axiosInstance.post('/company/upload/banner', {
      image: imageBase64,
    });
    return response.data;
  },
};