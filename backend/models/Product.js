const dbConnection = require('../database/connection');

class Product {
  constructor() {
    this.db = dbConnection;
  }

  // Create a new product
  async create(productData) {
    const {
      title,
      description,
      price,
      originalPrice = null,
      condition,
      categoryId,
      sellerId,
      imageUrls = [],
      isEcoFriendly = true,
      tags = []
    } = productData;

    const sql = `
      INSERT INTO products (
        title, description, price, original_price, condition, category_id, seller_id,
        image_urls, is_eco_friendly, tags, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const params = [
      title,
      description,
      price,
      originalPrice,
      condition,
      categoryId,
      sellerId,
      JSON.stringify(imageUrls),
      isEcoFriendly ? 1 : 0,
      JSON.stringify(tags)
    ];

    try {
      const result = await this.db.execute(sql, params);
      return await this.getById(result.lastID);
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  async getById(id) {
    const sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `;

    const product = await this.db.queryOne(sql, [id]);
    if (product) {
      product.image_urls = JSON.parse(product.image_urls || '[]');
      product.tags = JSON.parse(product.tags || '[]');
    }
    return product;
  }

  // Get all products with filtering and search
  async getAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      category = null,
      search = '',
      minPrice = null,
      maxPrice = null,
      condition = null,
      isEcoFriendly = null,
      sellerId = null,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filters;

    const offset = (page - 1) * limit;
    let sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.deleted_at IS NULL
    `;
    const params = [];

    // Apply filters
    if (category) {
      sql += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (minPrice !== null) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice !== null) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    if (condition) {
      sql += ' AND p.condition = ?';
      params.push(condition);
    }

    if (isEcoFriendly !== null) {
      sql += ' AND p.is_eco_friendly = ?';
      params.push(isEcoFriendly ? 1 : 0);
    }

    if (sellerId) {
      sql += ' AND p.seller_id = ?';
      params.push(sellerId);
    }

    // Apply sorting
    const validSortFields = ['created_at', 'price', 'title', 'view_count', 'updated_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY p.${sortField} ${order}`;

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const products = await this.db.query(sql, params);

    // Parse JSON fields
    const parsedProducts = products.map(product => ({
      ...product,
      image_urls: JSON.parse(product.image_urls || '[]'),
      tags: JSON.parse(product.tags || '[]')
    }));

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM products p WHERE p.deleted_at IS NULL';
    const countParams = [];

    if (category) {
      countSql += ' AND p.category_id = ?';
      countParams.push(category);
    }

    if (search) {
      countSql += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (minPrice !== null) {
      countSql += ' AND p.price >= ?';
      countParams.push(minPrice);
    }

    if (maxPrice !== null) {
      countSql += ' AND p.price <= ?';
      countParams.push(maxPrice);
    }

    if (condition) {
      countSql += ' AND p.condition = ?';
      countParams.push(condition);
    }

    if (isEcoFriendly !== null) {
      countSql += ' AND p.is_eco_friendly = ?';
      countParams.push(isEcoFriendly ? 1 : 0);
    }

    if (sellerId) {
      countSql += ' AND p.seller_id = ?';
      countParams.push(sellerId);
    }

    const countResult = await this.db.queryOne(countSql, countParams);

    return {
      products: parsedProducts,
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Get featured products
  async getFeatured(limit = 8) {
    const sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.deleted_at IS NULL AND p.is_sold = 0
      ORDER BY p.view_count DESC, p.created_at DESC
      LIMIT ?
    `;

    const products = await this.db.query(sql, [limit]);
    return products.map(product => ({
      ...product,
      image_urls: JSON.parse(product.image_urls || '[]'),
      tags: JSON.parse(product.tags || '[]')
    }));
  }

  // Get products by seller ID
  async getBySellerId(sellerId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.seller_id = ? AND p.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const products = await this.db.query(sql, [sellerId, limit, offset]);

    // Get total count
    const countSql = 'SELECT COUNT(*) as total FROM products WHERE seller_id = ? AND deleted_at IS NULL';
    const countResult = await this.db.queryOne(countSql, [sellerId]);

    return {
      products: products.map(product => ({
        ...product,
        image_urls: JSON.parse(product.image_urls || '[]'),
        tags: JSON.parse(product.tags || '[]')
      })),
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Update product
  async update(id, updateData) {
    const allowedFields = [
      'title', 'description', 'price', 'original_price', 'condition', 
      'category_id', 'image_urls', 'is_eco_friendly', 'tags'
    ];
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'image_urls' || key === 'tags') {
          updates.push(`${key} = ?`);
          params.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = ?`);
          params.push(value);
        }
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(id);
    const sql = `
      UPDATE products 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.db.execute(sql, params);
    return await this.getById(id);
  }

  // Mark product as sold
  async markAsSold(id) {
    const sql = `
      UPDATE products 
      SET is_sold = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await this.db.execute(sql, [id]);
    return result.changes > 0;
  }

  // Mark product as available
  async markAsAvailable(id) {
    const sql = `
      UPDATE products 
      SET is_sold = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await this.db.execute(sql, [id]);
    return result.changes > 0;
  }

  // Increment view count
  async incrementViewCount(id) {
    const sql = 'UPDATE products SET view_count = view_count + 1 WHERE id = ?';
    await this.db.execute(sql, [id]);
  }

  // Delete product (soft delete)
  async delete(id) {
    const sql = `
      UPDATE products 
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await this.db.execute(sql, [id]);
    return result.changes > 0;
  }

  // Permanently delete product
  async permanentDelete(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    const result = await this.db.execute(sql, [id]);
    return result.changes > 0;
  }

  // Search products
  async search(query, filters = {}) {
    const {
      page = 1,
      limit = 20,
      category = null,
      minPrice = null,
      maxPrice = null,
      condition = null,
      isEcoFriendly = null
    } = filters;

    const offset = (page - 1) * limit;
    let sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.deleted_at IS NULL AND p.is_sold = 0
      AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)
    `;
    const params = [];
    const searchTerm = `%${query}%`;
    params.push(searchTerm, searchTerm, searchTerm);

    // Apply additional filters
    if (category) {
      sql += ' AND p.category_id = ?';
      params.push(category);
    }

    if (minPrice !== null) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice !== null) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    if (condition) {
      sql += ' AND p.condition = ?';
      params.push(condition);
    }

    if (isEcoFriendly !== null) {
      sql += ' AND p.is_eco_friendly = ?';
      params.push(isEcoFriendly ? 1 : 0);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const products = await this.db.query(sql, params);

    // Get total count
    let countSql = `
      SELECT COUNT(*) as total 
      FROM products p 
      WHERE p.deleted_at IS NULL AND p.is_sold = 0
      AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)
    `;
    const countParams = [searchTerm, searchTerm, searchTerm];

    if (category) {
      countSql += ' AND p.category_id = ?';
      countParams.push(category);
    }

    if (minPrice !== null) {
      countSql += ' AND p.price >= ?';
      countParams.push(minPrice);
    }

    if (maxPrice !== null) {
      countSql += ' AND p.price <= ?';
      countParams.push(maxPrice);
    }

    if (condition) {
      countSql += ' AND p.condition = ?';
      countParams.push(condition);
    }

    if (isEcoFriendly !== null) {
      countSql += ' AND p.is_eco_friendly = ?';
      countParams.push(isEcoFriendly ? 1 : 0);
    }

    const countResult = await this.db.queryOne(countSql, countParams);

    return {
      products: products.map(product => ({
        ...product,
        image_urls: JSON.parse(product.image_urls || '[]'),
        tags: JSON.parse(product.tags || '[]')
      })),
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Get product statistics
  async getStats(productId) {
    const stats = {};

    // Get view count
    const viewCount = await this.db.queryOne(
      'SELECT view_count FROM products WHERE id = ?',
      [productId]
    );
    stats.viewCount = viewCount?.view_count || 0;

    // Get review count and average rating
    const reviewStats = await this.db.queryOne(
      'SELECT COUNT(*) as count, COALESCE(AVG(rating), 0) as average FROM reviews WHERE product_id = ?',
      [productId]
    );
    stats.reviewCount = reviewStats.count;
    stats.averageRating = reviewStats.average;

    // Get favorite count
    const favoriteCount = await this.db.queryOne(
      'SELECT COUNT(*) as count FROM favorites WHERE product_id = ?',
      [productId]
    );
    stats.favoriteCount = favoriteCount.count;

    return stats;
  }

  // Get related products
  async getRelated(productId, limit = 4) {
    const sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.deleted_at IS NULL AND p.is_sold = 0 AND p.id != ?
      AND p.category_id = (
        SELECT category_id FROM products WHERE id = ?
      )
      ORDER BY p.created_at DESC
      LIMIT ?
    `;

    const products = await this.db.query(sql, [productId, productId, limit]);
    return products.map(product => ({
      ...product,
      image_urls: JSON.parse(product.image_urls || '[]'),
      tags: JSON.parse(product.tags || '[]')
    }));
  }

  // Get products by category
  async getByCategory(categoryId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.category_id = ? AND p.deleted_at IS NULL AND p.is_sold = 0
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const products = await this.db.query(sql, [categoryId, limit, offset]);

    // Get total count
    const countSql = 'SELECT COUNT(*) as total FROM products WHERE category_id = ? AND deleted_at IS NULL AND is_sold = 0';
    const countResult = await this.db.queryOne(countSql, [categoryId]);

    return {
      products: products.map(product => ({
        ...product,
        image_urls: JSON.parse(product.image_urls || '[]'),
        tags: JSON.parse(product.tags || '[]')
      })),
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }
}

module.exports = Product;