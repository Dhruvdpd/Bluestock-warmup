import CompanyModel from '../models/companyModel.js';
import cloudinary from '../config/cloudinary.js';

class CompanyController {
  // Create company profile
  static async createCompany(req, res, next) {
    try {
      const { userId } = req.user;
      const companyData = req.body;

      // Check if user already has a company
      const existingCompany = await CompanyModel.findByOwnerId(userId);
      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message: 'You already have a company profile',
        });
      }

      // Create company
      const company = await CompanyModel.create({
        ...companyData,
        owner_id: userId,
      });

      res.status(201).json({
        success: true,
        message: 'Company profile created successfully',
        data: {
          company,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get company profile
  static async getCompany(req, res, next) {
    try {
      const { userId } = req.user;

      const company = await CompanyModel.findByOwnerId(userId);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          company,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update company profile
  static async updateCompany(req, res, next) {
    try {
      const { userId } = req.user;
      const companyData = req.body;

      // Find company by owner
      const existingCompany = await CompanyModel.findByOwnerId(userId);
      if (!existingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
        });
      }

      // Update company
      const company = await CompanyModel.update(existingCompany.id, companyData);

      res.status(200).json({
        success: true,
        message: 'Company profile updated successfully',
        data: {
          company,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete company profile
  static async deleteCompany(req, res, next) {
    try {
      const { userId } = req.user;

      // Find company by owner
      const existingCompany = await CompanyModel.findByOwnerId(userId);
      if (!existingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
        });
      }

      // Delete images from Cloudinary if they exist
      if (existingCompany.logo_url) {
        try {
          const publicId = existingCompany.logo_url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting logo from Cloudinary:', err);
        }
      }

      if (existingCompany.banner_url) {
        try {
          const publicId = existingCompany.banner_url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting banner from Cloudinary:', err);
        }
      }

      // Delete company
      await CompanyModel.delete(existingCompany.id);

      res.status(200).json({
        success: true,
        message: 'Company profile deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Upload company logo
  static async uploadLogo(req, res, next) {
    try {
      const { userId } = req.user;
      const { image } = req.body; // Base64 image string

      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'Image data is required',
        });
      }

      // Find company
      const company = await CompanyModel.findByOwnerId(userId);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
        });
      }

      // Delete old logo if exists
      if (company.logo_url) {
        try {
          const publicId = company.logo_url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting old logo:', err);
        }
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: 'company_logos',
        resource_type: 'image',
      });

      // Update company with new logo URL
      const updatedCompany = await CompanyModel.update(company.id, {
        logo_url: result.secure_url,
      });

      res.status(200).json({
        success: true,
        message: 'Logo uploaded successfully',
        data: {
          logo_url: result.secure_url,
          company: updatedCompany,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Upload company banner
  static async uploadBanner(req, res, next) {
    try {
      const { userId } = req.user;
      const { image } = req.body; // Base64 image string

      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'Image data is required',
        });
      }

      // Find company
      const company = await CompanyModel.findByOwnerId(userId);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
        });
      }

      // Delete old banner if exists
      if (company.banner_url) {
        try {
          const publicId = company.banner_url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting old banner:', err);
        }
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: 'company_banners',
        resource_type: 'image',
      });

      // Update company with new banner URL
      const updatedCompany = await CompanyModel.update(company.id, {
        banner_url: result.secure_url,
      });

      res.status(200).json({
        success: true,
        message: 'Banner uploaded successfully',
        data: {
          banner_url: result.secure_url,
          company: updatedCompany,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CompanyController;