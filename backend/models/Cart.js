const dbConnection = require('../database/connection');

class Cart {
  constructor() {
    this.db = dbConnection;
  }

  // Add item to cart
  async addItem(userId, productId, quantity = 1) {
    // Check if product exists and is available
    const product = await this.db.queryOne(
      'SELECT id, price, seller_id, is_sold FROM products WHERE id = ? AND deleted_at IS NULL',
      [productId]
    );

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.is_sold) {
      throw new Error('Product is already sold');
    }

    if (product.seller_id === userId) {
      throw new Error('Cannot add your own product to cart');
    }

    // Check if item already exists in cart
    const existingItem = await this.db.queryOne(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const sql = 'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      await this.db.execute(sql, [newQuantity, existingItem.id]);
    } else {
      // Add new item
      const sql = `
        INSERT INTO cart (user_id, product_id, quantity, created_at, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      await this.db.execute(sql, [userId, productId, quantity]);
    }

    return await this.getCartItems(userId);
  }

  // Get cart items for user
  async getCartItems(userId) {
    const sql = `
      SELECT c.*, p.title, p.price, p.image_urls, p.condition, p.is_sold,
             cat.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM cart c
      JOIN products p ON c.product_id = p.id
      JOIN categories cat ON p.category_id = cat.id
      JOIN users u ON p.seller_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `;

    const items = await this.db.query(sql, [userId]);
    return items.map(item => ({
      ...item,
      image_urls: JSON.parse(item.image_urls || '[]'),
      total_price: item.price * item.quantity
    }));
  }

  // Update cart item quantity
  async updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeItem(userId, productId);
    }

    const sql = `
      UPDATE cart 
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND product_id = ?
    `;

    const result = await this.db.execute(sql, [quantity, userId, productId]);
    return result.changes > 0;
  }

  // Remove item from cart
  async removeItem(userId, productId) {
    const sql = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';
    const result = await this.db.execute(sql, [userId, productId]);
    return result.changes > 0;
  }

  // Clear entire cart
  async clearCart(userId) {
    const sql = 'DELETE FROM cart WHERE user_id = ?';
    const result = await this.db.execute(sql, [userId]);
    return result.changes;
  }

  // Get cart item count
  async getItemCount(userId) {
    const sql = 'SELECT COUNT(*) as count FROM cart WHERE user_id = ?';
    const result = await this.db.queryOne(sql, [userId]);
    return result.count;
  }

  // Get cart total amount
  async getTotalAmount(userId) {
    const sql = `
      SELECT COALESCE(SUM(c.quantity * p.price), 0) as total
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.is_sold = 0
    `;

    const result = await this.db.queryOne(sql, [userId]);
    return result.total;
  }

  // Get cart summary
  async getCartSummary(userId) {
    const items = await this.getCartItems(userId);
    const totalAmount = await this.getTotalAmount(userId);
    const itemCount = await this.getItemCount(userId);

    return {
      items,
      itemCount,
      totalAmount,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  // Check if product is in cart
  async isInCart(userId, productId) {
    const sql = 'SELECT id FROM cart WHERE user_id = ? AND product_id = ?';
    const result = await this.db.queryOne(sql, [userId, productId]);
    return !!result;
  }

  // Get cart item by product ID
  async getCartItem(userId, productId) {
    const sql = `
      SELECT c.*, p.title, p.price, p.image_urls, p.condition, p.is_sold
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND c.product_id = ?
    `;

    const item = await this.db.queryOne(sql, [userId, productId]);
    if (item) {
      item.image_urls = JSON.parse(item.image_urls || '[]');
      item.total_price = item.price * item.quantity;
    }
    return item;
  }

  // Validate cart items (check if products are still available)
  async validateCartItems(userId) {
    const sql = `
      SELECT c.*, p.title, p.is_sold, p.deleted_at
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;

    const items = await this.db.query(sql, [userId]);
    const invalidItems = [];

    for (const item of items) {
      if (item.is_sold || item.deleted_at) {
        invalidItems.push({
          productId: item.product_id,
          title: item.title,
          reason: item.is_sold ? 'Product is sold' : 'Product is no longer available'
        });
      }
    }

    return {
      valid: invalidItems.length === 0,
      invalidItems
    };
  }

  // Remove invalid items from cart
  async removeInvalidItems(userId) {
    const sql = `
      DELETE FROM cart 
      WHERE user_id = ? AND product_id IN (
        SELECT id FROM products 
        WHERE is_sold = 1 OR deleted_at IS NOT NULL
      )
    `;

    const result = await this.db.execute(sql, [userId]);
    return result.changes;
  }

  // Get cart statistics
  async getCartStats(userId) {
    const stats = {};

    // Get total items
    const itemCount = await this.getItemCount(userId);
    stats.itemCount = itemCount;

    // Get total amount
    const totalAmount = await this.getTotalAmount(userId);
    stats.totalAmount = totalAmount;

    // Get total quantity
    const sql = 'SELECT COALESCE(SUM(quantity), 0) as totalQuantity FROM cart WHERE user_id = ?';
    const result = await this.db.queryOne(sql, [userId]);
    stats.totalQuantity = result.totalQuantity;

    // Get unique sellers count
    const sellersSql = `
      SELECT COUNT(DISTINCT p.seller_id) as sellerCount
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
    const sellersResult = await this.db.queryOne(sellersSql, [userId]);
    stats.sellerCount = sellersResult.sellerCount;

    return stats;
  }

  // Get cart items by seller
  async getCartItemsBySeller(userId) {
    const sql = `
      SELECT 
        p.seller_id,
        u.username as seller_name,
        u.avatar_url as seller_avatar,
        GROUP_CONCAT(c.id) as cart_item_ids,
        COUNT(*) as item_count,
        SUM(c.quantity) as total_quantity,
        SUM(c.quantity * p.price) as total_amount
      FROM cart c
      JOIN products p ON c.product_id = p.id
      JOIN users u ON p.seller_id = u.id
      WHERE c.user_id = ?
      GROUP BY p.seller_id, u.username, u.avatar_url
      ORDER BY u.username
    `;

    const sellers = await this.db.query(sql, [userId]);
    
    // Get detailed items for each seller
    for (const seller of sellers) {
      const itemIds = seller.cart_item_ids.split(',');
      const placeholders = itemIds.map(() => '?').join(',');
      
      const itemsSql = `
        SELECT c.*, p.title, p.price, p.image_urls, p.condition
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.id IN (${placeholders})
        ORDER BY c.created_at DESC
      `;
      
      const items = await this.db.query(itemsSql, itemIds);
      seller.items = items.map(item => ({
        ...item,
        image_urls: JSON.parse(item.image_urls || '[]'),
        total_price: item.price * item.quantity
      }));
    }

    return sellers;
  }

  // Transfer cart to another user (for guest to registered user)
  async transferCart(fromUserId, toUserId) {
    // Check if destination user has items in cart
    const existingItems = await this.getItemCount(toUserId);
    
    if (existingItems > 0) {
      throw new Error('Destination user already has items in cart');
    }

    // Update cart items to new user
    const sql = 'UPDATE cart SET user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?';
    const result = await this.db.execute(sql, [toUserId, fromUserId]);
    return result.changes;
  }
}

module.exports = Cart;