import { query } from '../config/database.js';

class CompanyModel {
  // Create a new company profile
  static async create(companyData) {
    const {
      owner_id,
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      logo_url,
      banner_url,
      industry,
      founded_date,
      description,
      social_links,
    } = companyData;

    const text = `
      INSERT INTO company_profile 
      (owner_id, company_name, address, city, state, country, postal_code, 
       website, logo_url, banner_url, industry, founded_date, description, social_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const values = [
      owner_id,
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website || null,
      logo_url || null,
      banner_url || null,
      industry,
      founded_date || null,
      description || null,
      social_links ? JSON.stringify(social_links) : null,
    ];

    const result = await query(text, values);
    return result.rows[0];
  }

  // Find company by owner ID
  static async findByOwnerId(owner_id) {
    const text = 'SELECT * FROM company_profile WHERE owner_id = $1';
    const result = await query(text, [owner_id]);
    return result.rows[0];
  }

  // Find company by ID
  static async findById(id) {
    const text = 'SELECT * FROM company_profile WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0];
  }

  // Update company profile
  static async update(id, companyData) {
    const {
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      logo_url,
      banner_url,
      industry,
      founded_date,
      description,
      social_links,
    } = companyData;

    const text = `
      UPDATE company_profile 
      SET company_name = COALESCE($1, company_name),
          address = COALESCE($2, address),
          city = COALESCE($3, city),
          state = COALESCE($4, state),
          country = COALESCE($5, country),
          postal_code = COALESCE($6, postal_code),
          website = COALESCE($7, website),
          logo_url = COALESCE($8, logo_url),
          banner_url = COALESCE($9, banner_url),
          industry = COALESCE($10, industry),
          founded_date = COALESCE($11, founded_date),
          description = COALESCE($12, description),
          social_links = COALESCE($13, social_links),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;
    const values = [
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      logo_url,
      banner_url,
      industry,
      founded_date,
      description,
      social_links ? JSON.stringify(social_links) : null,
      id,
    ];

    const result = await query(text, values);
    return result.rows[0];
  }

  // Delete company profile
  static async delete(id) {
    const text = 'DELETE FROM company_profile WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  }

  // Get company with owner details
  static async findWithOwner(id) {
    const text = `
      SELECT cp.*, u.email, u.full_name, u.mobile_no
      FROM company_profile cp
      JOIN users u ON cp.owner_id = u.id
      WHERE cp.id = $1
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  }

  // Check if owner already has a company
  static async checkOwnerExists(owner_id) {
    const text = 'SELECT id FROM company_profile WHERE owner_id = $1';
    const result = await query(text, [owner_id]);
    return result.rows.length > 0;
  }
}

export default CompanyModel;