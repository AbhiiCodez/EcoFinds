const dbConnection = require('../database/connection');

class Purchase {
  constructor() {
    this.db = dbConnection;
  }

  // Create a new purchase with transaction handling
  async create(purchaseData) {
    const {
      buyerId,
      items, // Array of { productId, quantity }
      shippingAddress,
      paymentMethod,
      notes = ''
    } = purchaseData;

    try {
      // Start transaction
      await this.db.execute('BEGIN TRANSACTION');

      const purchases = [];

      for (const item of items) {
        // Get product details
        const product = await this.db.queryOne(
          'SELECT * FROM products WHERE id = ? AND deleted_at IS NULL',
          [item.productId]
        );

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.seller_id === buyerId) {
          throw new Error('Cannot purchase your own product');
        }

        if (product.is_sold) {
          throw new Error(`Product ${product.title} is already sold`);
        }

        // Calculate total amount
        const totalAmount = product.price * item.quantity;

        // Create purchase record
        const purchaseSql = `
          INSERT INTO purchases (
            buyer_id, seller_id, product_id, quantity, total_amount,
            shipping_address, payment_method, notes, status, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        const purchaseResult = await this.db.execute(purchaseSql, [
          buyerId,
          product.seller_id,
          item.productId,
          item.quantity,
          totalAmount,
          shippingAddress,
          paymentMethod,
          notes
        ]);

        // Mark product as sold
        await this.db.execute(
          'UPDATE products SET is_sold = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [item.productId]
        );

        purchases.push({
          purchaseId: purchaseResult.lastID,
          productId: item.productId,
          sellerId: product.seller_id,
          quantity: item.quantity,
          totalAmount
        });
      }

      // Clear buyer's cart
      await this.db.execute('DELETE FROM cart WHERE user_id = ?', [buyerId]);

      // Commit transaction
      await this.db.execute('COMMIT');

      return purchases;
    } catch (error) {
      // Rollback transaction on error
      await this.db.execute('ROLLBACK');
      throw error;
    }
  }

  // Get purchase by ID
  async getById(purchaseId) {
    const sql = `
      SELECT p.*, pr.title as product_title, pr.image_urls, pr.price,
             buyer.username as buyer_name, buyer.avatar_url as buyer_avatar,
             seller.username as seller_name, seller.avatar_url as seller_avatar
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      JOIN users buyer ON p.buyer_id = buyer.id
      JOIN users seller ON p.seller_id = seller.id
      WHERE p.id = ?
    `;

    const purchase = await this.db.queryOne(sql, [purchaseId]);
    if (purchase) {
      purchase.image_urls = JSON.parse(purchase.image_urls || '[]');
    }
    return purchase;
  }

  // Get user's purchase history
  async getByBuyerId(buyerId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT p.*, pr.title as product_title, pr.image_urls, pr.price,
             seller.username as seller_name, seller.avatar_url as seller_avatar
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      JOIN users seller ON p.seller_id = seller.id
      WHERE p.buyer_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const purchases = await this.db.query(sql, [buyerId, limit, offset]);

    // Get total count
    const countSql = 'SELECT COUNT(*) as total FROM purchases WHERE buyer_id = ?';
    const countResult = await this.db.queryOne(countSql, [buyerId]);

    return {
      purchases: purchases.map(purchase => ({
        ...purchase,
        image_urls: JSON.parse(purchase.image_urls || '[]')
      })),
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Get user's sales history
  async getBySellerId(sellerId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT p.*, pr.title as product_title, pr.image_urls, pr.price,
             buyer.username as buyer_name, buyer.avatar_url as buyer_avatar
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      JOIN users buyer ON p.buyer_id = buyer.id
      WHERE p.seller_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const sales = await this.db.query(sql, [sellerId, limit, offset]);

    // Get total count
    const countSql = 'SELECT COUNT(*) as total FROM purchases WHERE seller_id = ?';
    const countResult = await this.db.queryOne(countSql, [sellerId]);

    return {
      sales: sales.map(sale => ({
        ...sale,
        image_urls: JSON.parse(sale.image_urls || '[]')
      })),
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Update purchase status
  async updateStatus(purchaseId, status, userId, userRole = 'seller') {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    // Check if user has permission to update status
    const purchase = await this.db.queryOne(
      'SELECT buyer_id, seller_id FROM purchases WHERE id = ?',
      [purchaseId]
    );

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    if (userRole === 'seller' && purchase.seller_id !== userId) {
      throw new Error('Not authorized to update this purchase');
    }

    if (userRole === 'buyer' && purchase.buyer_id !== userId) {
      throw new Error('Not authorized to update this purchase');
    }

    const sql = `
      UPDATE purchases 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await this.db.execute(sql, [status, purchaseId]);
    return result.changes > 0;
  }

  // Cancel purchase
  async cancel(purchaseId, userId, reason = '') {
    const purchase = await this.db.queryOne(
      'SELECT * FROM purchases WHERE id = ? AND buyer_id = ?',
      [purchaseId, userId]
    );

    if (!purchase) {
      throw new Error('Purchase not found or not authorized');
    }

    if (purchase.status === 'cancelled') {
      throw new Error('Purchase is already cancelled');
    }

    if (purchase.status === 'delivered') {
      throw new Error('Cannot cancel delivered purchase');
    }

    try {
      await this.db.execute('BEGIN TRANSACTION');

      // Update purchase status
      await this.db.execute(
        'UPDATE purchases SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['cancelled', reason, purchaseId]
      );

      // Mark product as available again
      await this.db.execute(
        'UPDATE products SET is_sold = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [purchase.product_id]
      );

      await this.db.execute('COMMIT');
      return true;
    } catch (error) {
      await this.db.execute('ROLLBACK');
      throw error;
    }
  }

  // Get purchase statistics
  async getStats(userId, userRole = 'buyer') {
    const stats = {};

    const idField = userRole === 'buyer' ? 'buyer_id' : 'seller_id';

    // Get total purchases/sales
    const totalSql = `SELECT COUNT(*) as total FROM purchases WHERE ${idField} = ?`;
    const totalResult = await this.db.queryOne(totalSql, [userId]);
    stats.total = totalResult.total;

    // Get total amount
    const amountSql = `SELECT COALESCE(SUM(total_amount), 0) as total FROM purchases WHERE ${idField} = ?`;
    const amountResult = await this.db.queryOne(amountSql, [userId]);
    stats.totalAmount = amountResult.total;

    // Get status breakdown
    const statusSql = `
      SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount
      FROM purchases 
      WHERE ${idField} = ?
      GROUP BY status
    `;
    const statusResults = await this.db.query(statusSql, [userId]);
    stats.statusBreakdown = statusResults;

    // Get monthly stats
    const monthlySql = `
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as amount
      FROM purchases 
      WHERE ${idField} = ?
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 12
    `;
    const monthlyResults = await this.db.query(monthlySql, [userId]);
    stats.monthlyStats = monthlyResults;

    return stats;
  }

  // Get recent purchases
  async getRecent(userId, userRole = 'buyer', limit = 5) {
    const idField = userRole === 'buyer' ? 'buyer_id' : 'seller_id';
    const sql = `
      SELECT p.*, pr.title as product_title, pr.image_urls, pr.price,
             ${userRole === 'buyer' ? 'seller.username as other_name, seller.avatar_url as other_avatar' : 'buyer.username as other_name, buyer.avatar_url as other_avatar'}
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      JOIN users ${userRole === 'buyer' ? 'seller' : 'buyer'} ON p.${userRole === 'buyer' ? 'seller_id' : 'buyer_id'} = ${userRole === 'buyer' ? 'seller' : 'buyer'}.id
      WHERE p.${idField} = ?
      ORDER BY p.created_at DESC
      LIMIT ?
    `;

    const purchases = await this.db.query(sql, [userId, limit]);
    return purchases.map(purchase => ({
      ...purchase,
      image_urls: JSON.parse(purchase.image_urls || '[]')
    }));
  }

  // Search purchases
  async search(userId, query, userRole = 'buyer', page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const idField = userRole === 'buyer' ? 'buyer_id' : 'seller_id';
    const searchTerm = `%${query}%`;

    const sql = `
      SELECT p.*, pr.title as product_title, pr.image_urls, pr.price,
             ${userRole === 'buyer' ? 'seller.username as other_name, seller.avatar_url as other_avatar' : 'buyer.username as other_name, buyer.avatar_url as other_avatar'}
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      JOIN users ${userRole === 'buyer' ? 'seller' : 'buyer'} ON p.${userRole === 'buyer' ? 'seller_id' : 'buyer_id'} = ${userRole === 'buyer' ? 'seller' : 'buyer'}.id
      WHERE p.${idField} = ?
      AND (pr.title LIKE ? OR p.status LIKE ? OR p.payment_method LIKE ?)
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const purchases = await this.db.query(sql, [userId, searchTerm, searchTerm, searchTerm, limit, offset]);

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      WHERE p.${idField} = ?
      AND (pr.title LIKE ? OR p.status LIKE ? OR p.payment_method LIKE ?)
    `;
    const countResult = await this.db.queryOne(countSql, [userId, searchTerm, searchTerm, searchTerm]);

    return {
      purchases: purchases.map(purchase => ({
        ...purchase,
        image_urls: JSON.parse(purchase.image_urls || '[]')
      })),
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  // Get purchase analytics
  async getAnalytics(userId, userRole = 'buyer', period = '30d') {
    const idField = userRole === 'buyer' ? 'buyer_id' : 'seller_id';
    let dateFilter = '';

    switch (period) {
      case '7d':
        dateFilter = "AND created_at >= datetime('now', '-7 days')";
        break;
      case '30d':
        dateFilter = "AND created_at >= datetime('now', '-30 days')";
        break;
      case '90d':
        dateFilter = "AND created_at >= datetime('now', '-90 days')";
        break;
      case '1y':
        dateFilter = "AND created_at >= datetime('now', '-1 year')";
        break;
    }

    const analytics = {};

    // Total count and amount
    const totalSql = `
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount
      FROM purchases 
      WHERE ${idField} = ? ${dateFilter}
    `;
    const totalResult = await this.db.queryOne(totalSql, [userId]);
    analytics.total = totalResult;

    // Status breakdown
    const statusSql = `
      SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount
      FROM purchases 
      WHERE ${idField} = ? ${dateFilter}
      GROUP BY status
    `;
    const statusResults = await this.db.query(statusSql, [userId]);
    analytics.statusBreakdown = statusResults;

    // Daily stats
    const dailySql = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as amount
      FROM purchases 
      WHERE ${idField} = ? ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    const dailyResults = await this.db.query(dailySql, [userId]);
    analytics.dailyStats = dailyResults;

    return analytics;
  }
}

module.exports = Purchase;
