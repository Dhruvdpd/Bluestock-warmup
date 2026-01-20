import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

class UserModel {
  // Create a new user
  static async create(userData) {
    const {
      email,
      password,
      full_name,
      gender,
      mobile_no,
      signup_type = 'e',
    } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const text = `
      INSERT INTO users (email, password, full_name, gender, mobile_no, signup_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, full_name, gender, mobile_no, signup_type, 
                is_mobile_verified, is_email_verified, created_at, updated_at
    `;
    const values = [email, hashedPassword, full_name, gender, mobile_no, signup_type];

    const result = await query(text, values);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const result = await query(text, [email]);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const text = `
      SELECT id, email, full_name, gender, mobile_no, signup_type,
             is_mobile_verified, is_email_verified, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  }

  // Find user by mobile number
  static async findByMobile(mobile_no) {
    const text = 'SELECT * FROM users WHERE mobile_no = $1';
    const result = await query(text, [mobile_no]);
    return result.rows[0];
  }

  // Update mobile verification status
  static async updateMobileVerification(id, status = true) {
    const text = `
      UPDATE users 
      SET is_mobile_verified = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, full_name, is_mobile_verified, is_email_verified
    `;
    const result = await query(text, [status, id]);
    return result.rows[0];
  }

  // Update email verification status
  static async updateEmailVerification(id, status = true) {
    const text = `
      UPDATE users 
      SET is_email_verified = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, full_name, is_mobile_verified, is_email_verified
    `;
    const result = await query(text, [status, id]);
    return result.rows[0];
  }

  // Update user profile
  static async update(id, userData) {
    const { full_name, gender, mobile_no } = userData;
    
    const text = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          gender = COALESCE($2, gender),
          mobile_no = COALESCE($3, mobile_no),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, email, full_name, gender, mobile_no, signup_type,
                is_mobile_verified, is_email_verified, created_at, updated_at
    `;
    const values = [full_name, gender, mobile_no, id];
    
    const result = await query(text, values);
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const text = `
      UPDATE users 
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id
    `;
    const result = await query(text, [hashedPassword, id]);
    return result.rows[0];
  }

  // Delete user
  static async delete(id) {
    const text = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  }
}

export default UserModel;