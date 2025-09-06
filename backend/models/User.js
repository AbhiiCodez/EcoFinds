const bcrypt = require('bcryptjs');
const dbConnection = require('../database/connection');

class User {
  constructor() {
    this.db = dbConnection;
  }

  // Create a new user with password hashing
  async create(userData) {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      bio = '',
      location = '',
      avatarUrl = ''
    } = userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, bio, location, avatar_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const params = [username, email, hashedPassword, firstName, lastName, bio, location, avatarUrl];
    
    try {
      const result = await this.db.execute(sql, params);
      return await this.getById(result.lastID);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        if (error.message.includes('username')) {
          throw new Error('Username already exists');
        } else if (error.message.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }

  // Get user by ID
  async getById(id) {
    const sql = `
      SELECT id, username, email, first_name, last_name, bio, location, avatar_url, 
             created_at, updated_at, last_login_at
      FROM users 
      WHERE id = ?
    `;
    
    const user = await this.db.queryOne(sql, [id]);
    return user;
  }

  // Get user by email
  async getByEmail(email) {
    const sql = `
      SELECT id, username, email, first_name, last_name, bio, location, avatar_url, 
             created_at, updated_at, last_login_at
      FROM users 
      WHERE email = ?
    `;
    
    const user = await this.db.queryOne(sql, [email]);
    return user;
  }

  // Get user by username
  async getByUsername(username) {
    const sql = `
      SELECT id, username, email, first_name, last_name, bio, location, avatar_url, 
             created_at, updated_at, last_login_at
      FROM users 
      WHERE username = ?
    `;
    
    const user = await this.db.queryOne(sql, [username]);
    return user;
  }

  // Get user with password hash (for authentication)
  async getByEmailWithPassword(email) {
    const sql = `
      SELECT id, username, email, password_hash, first_name, last_name, bio, location, avatar_url, 
             created_at, updated_at, last_login_at
      FROM users 
      WHERE email = ?
    `;
    
    const user = await this.db.queryOne(sql, [email]);
    return user;
  }

  // Update user profile
  async update(id, updateData) {
    const allowedFields = ['first_name', 'last_name', 'bio', 'location', 'avatar_url'];
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(id);
    const sql = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.db.execute(sql, params);
    return await this.getById(id);
  }

  // Update password
  async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const sql = `
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.db.execute(sql, [hashedPassword, id]);
    return true;
  }

  // Update last login time
  async updateLastLogin(id) {
    const sql = `
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.db.execute(sql, [id]);
    return true;
  }

  // Verify password
  async verifyPassword(email, password) {
    const user = await this.getByEmailWithPassword(email);
    if (!user) {
      return false;
    }

    return await bcrypt.compare(password, user.password_hash);
  }

  // Delete user (soft delete by setting deleted_at)
  async delete(id) {
    const sql = `
      UPDATE users 
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await this.db.execute(sql, [id]);
    return result.changes > 0;
  }

  // Permanently delete user
  async permanentDelete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await this.db.execute(sql, [id]);
    return result.changes > 0;
  }

  // Get all users with pagination
  async getAll(page = 1, limit = 20, search = '') {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT id, username, email, first_name, last_name, bio, location, avatar_url, 
             created_at, updated_at, last_login_at
      FROM users 
      WHERE deleted_at IS NULL
    `;
    const params = [];

    if (search) {
      sql += ` AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const users = await this.db.query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL';
    const countParams = [];

    if (search) {
      countSql += ` AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const countResult = await this.db.queryOne(countSql, countParams);

    return {
      users,
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Get user statistics
  async getStats(userId) {
    const stats = {};

    // Get product count
    const productCount = await this.db.queryOne(
      'SELECT COUNT(*) as count FROM products WHERE seller_id = ? AND deleted_at IS NULL',
      [userId]
    );
    stats.products = productCount.count;

    // Get sold products count
    const soldCount = await this.db.queryOne(
      'SELECT COUNT(*) as count FROM products WHERE seller_id = ? AND is_sold = 1 AND deleted_at IS NULL',
      [userId]
    );
    stats.soldProducts = soldCount.count;

    // Get purchase count
    const purchaseCount = await this.db.queryOne(
      'SELECT COUNT(*) as count FROM purchases WHERE buyer_id = ?',
      [userId]
    );
    stats.purchases = purchaseCount.count;

    // Get total sales amount
    const salesAmount = await this.db.queryOne(
      'SELECT COALESCE(SUM(total_amount), 0) as total FROM purchases WHERE seller_id = ?',
      [userId]
    );
    stats.totalSales = salesAmount.total;

    // Get total spent amount
    const spentAmount = await this.db.queryOne(
      'SELECT COALESCE(SUM(total_amount), 0) as total FROM purchases WHERE buyer_id = ?',
      [userId]
    );
    stats.totalSpent = spentAmount.total;

    // Get average rating
    const avgRating = await this.db.queryOne(
      `SELECT COALESCE(AVG(rating), 0) as average 
       FROM reviews r 
       JOIN products p ON r.product_id = p.id 
       WHERE p.seller_id = ?`,
      [userId]
    );
    stats.averageRating = avgRating.average;

    return stats;
  }

  // Search users
  async search(query, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const searchTerm = `%${query}%`;
    
    const sql = `
      SELECT id, username, email, first_name, last_name, bio, location, avatar_url, 
             created_at, updated_at, last_login_at
      FROM users 
      WHERE deleted_at IS NULL 
      AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR bio LIKE ?)
      ORDER BY 
        CASE 
          WHEN username LIKE ? THEN 1
          WHEN first_name LIKE ? OR last_name LIKE ? THEN 2
          WHEN email LIKE ? THEN 3
          ELSE 4
        END,
        created_at DESC
      LIMIT ? OFFSET ?
    `;

    const params = [
      searchTerm, searchTerm, searchTerm, searchTerm, searchTerm,
      searchTerm, searchTerm, searchTerm, searchTerm,
      limit, offset
    ];

    const users = await this.db.query(sql, params);

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total 
      FROM users 
      WHERE deleted_at IS NULL 
      AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR bio LIKE ?)
    `;
    const countParams = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    const countResult = await this.db.queryOne(countSql, countParams);

    return {
      users,
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Check if email exists
  async emailExists(email, excludeId = null) {
    let sql = 'SELECT id FROM users WHERE email = ?';
    const params = [email];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    const user = await this.db.queryOne(sql, params);
    return !!user;
  }

  // Check if username exists
  async usernameExists(username, excludeId = null) {
    let sql = 'SELECT id FROM users WHERE username = ?';
    const params = [username];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    const user = await this.db.queryOne(sql, params);
    return !!user;
  }
}

module.exports = User;