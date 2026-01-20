import createError from 'http-errors';
import * as companyModel from '../models/companyModel.js';
import cloudinary from '../config/cloudinary.js';

export const registerCompany = async (owner_id, companyData) => {
  const existingCompany = await companyModel.findCompanyByOwnerId(owner_id);
  if (existingCompany) {
    throw createError(409, 'Company already registered for this user');
  }

  const company = await companyModel.createCompany({
    owner_id,
    ...companyData,
  });

  return company;
};

export const getCompanyProfile = async (owner_id) => {
  const company = await companyModel.findCompanyByOwnerId(owner_id);
  if (!company) {
    throw createError(404, 'Company profile not found');
  }

  return company;
};

export const updateCompanyProfile = async (owner_id, updates) => {
  const existingCompany = await companyModel.findCompanyByOwnerId(owner_id);
  if (!existingCompany) {
    throw createError(404, 'Company profile not found');
  }

  const updatedCompany = await companyModel.updateCompany(owner_id, updates);
  return updatedCompany;
};

export const uploadCompanyLogo = async (owner_id, file) => {
  const existingCompany = await companyModel.findCompanyByOwnerId(owner_id);
  if (!existingCompany) {
    throw createError(404, 'Company profile not found. Register company first.');
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'company_logos',
          public_id: `logo_${owner_id}_${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const updatedCompany = await companyModel.updateCompanyLogo(owner_id, result.secure_url);
    return updatedCompany;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw createError(500, 'Failed to upload logo');
  }
};

export const uploadCompanyBanner = async (owner_id, file) => {
  const existingCompany = await companyModel.findCompanyByOwnerId(owner_id);
  if (!existingCompany) {
    throw createError(404, 'Company profile not found. Register company first.');
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'company_banners',
          public_id: `banner_${owner_id}_${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const updatedCompany = await companyModel.updateCompanyBanner(owner_id, result.secure_url);
    return updatedCompany;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw createError(500, 'Failed to upload banner');
  }
};