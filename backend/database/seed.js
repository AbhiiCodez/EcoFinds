const dbConnection = require('./connection');
const bcrypt = require('bcryptjs');

class DatabaseSeeder {
  constructor() {
    this.db = dbConnection;
  }

  // Clear all data from tables
  async clearData() {
    console.log('🗑️  Clearing existing data...');
    
    const tables = ['favorites', 'reviews', 'purchases', 'cart', 'products', 'categories', 'users'];
    
    for (const table of tables) {
      await this.db.execute(`DELETE FROM ${table}`);
    }
    
    // Reset auto-increment counters
    await this.db.execute('DELETE FROM sqlite_sequence');
    
    console.log('✅ Data cleared successfully');
  }

  // Seed users
  async seedUsers() {
    console.log('👥 Seeding users...');
    
    const users = [
      {
        username: 'eco_enthusiast',
        email: 'sarah@example.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        bio: 'Passionate about sustainable living and eco-friendly products.',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'green_warrior',
        email: 'mike@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Chen',
        bio: 'Environmental activist and second-hand goods enthusiast.',
        location: 'Portland, OR',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'sustainable_living',
        email: 'emma@example.com',
        password: 'password123',
        firstName: 'Emma',
        lastName: 'Williams',
        bio: 'Minimalist lifestyle advocate. Love finding unique vintage items.',
        location: 'Austin, TX',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'vintage_collector',
        email: 'alex@example.com',
        password: 'password123',
        firstName: 'Alex',
        lastName: 'Rodriguez',
        bio: 'Collector of vintage electronics and sustainable tech.',
        location: 'Seattle, WA',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'eco_mom',
        email: 'lisa@example.com',
        password: 'password123',
        firstName: 'Lisa',
        lastName: 'Brown',
        bio: 'Mother of two, passionate about eco-friendly parenting and sustainable living.',
        location: 'Denver, CO',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      }
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      
      await this.db.execute(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, bio, location, avatar_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        user.username,
        user.email,
        hashedPassword,
        user.firstName,
        user.lastName,
        user.bio,
        user.location,
        user.avatarUrl
      ]);
    }

    console.log(`✅ Seeded ${users.length} users`);
  }

  // Seed categories
  async seedCategories() {
    console.log('📂 Seeding categories...');
    
    const categories = [
      { name: 'Clothing & Accessories', description: 'Sustainable fashion and eco-friendly clothing' },
      { name: 'Electronics', description: 'Refurbished and sustainable tech products' },
      { name: 'Home & Garden', description: 'Eco-friendly home goods and garden supplies' },
      { name: 'Books & Media', description: 'Used books, magazines, and educational materials' },
      { name: 'Sports & Outdoors', description: 'Outdoor gear and sports equipment' },
      { name: 'Toys & Games', description: 'Eco-friendly toys and educational games' },
      { name: 'Furniture', description: 'Vintage and sustainable furniture pieces' },
      { name: 'Beauty & Personal Care', description: 'Natural and organic beauty products' }
    ];

    for (const category of categories) {
      await this.db.execute(`
        INSERT INTO categories (name, description, created_at, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [category.name, category.description]);
    }

    console.log(`✅ Seeded ${categories.length} categories`);
  }

  // Seed products
  async seedProducts() {
    console.log('🛍️  Seeding products...');
    
    const products = [
      {
        title: 'Vintage Leather Jacket',
        description: 'Beautiful vintage leather jacket in excellent condition. Perfect for adding a timeless piece to your wardrobe while supporting sustainable fashion.',
        price: 89.99,
        originalPrice: 150.00,
        condition: 'excellent',
        categoryId: 1,
        sellerId: 1,
        imageUrls: [
          'https://images.unsplash.com/photo-1551028719-001c67cdf689?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['vintage', 'leather', 'jacket', 'sustainable fashion']
      },
      {
        title: 'Refurbished MacBook Pro 2019',
        description: 'Fully refurbished MacBook Pro with 16GB RAM and 512GB SSD. Professionally cleaned and tested. Great for students or professionals.',
        price: 899.99,
        originalPrice: 1799.00,
        condition: 'good',
        categoryId: 2,
        sellerId: 2,
        imageUrls: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['laptop', 'refurbished', 'macbook', 'electronics']
      },
      {
        title: 'Organic Cotton Bedding Set',
        description: '100% organic cotton bedding set including sheets, pillowcases, and duvet cover. Hypoallergenic and sustainably sourced.',
        price: 129.99,
        originalPrice: 199.99,
        condition: 'excellent',
        categoryId: 3,
        sellerId: 3,
        imageUrls: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['organic', 'cotton', 'bedding', 'sustainable']
      },
      {
        title: 'Vintage Wooden Bookshelf',
        description: 'Beautiful vintage wooden bookshelf with 5 shelves. Perfect for organizing books, plants, or decorative items. Some minor wear adds character.',
        price: 75.00,
        originalPrice: 120.00,
        condition: 'good',
        categoryId: 7,
        sellerId: 4,
        imageUrls: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['vintage', 'wooden', 'bookshelf', 'furniture']
      },
      {
        title: 'Eco-Friendly Yoga Mat',
        description: 'Natural rubber yoga mat made from sustainable materials. Non-toxic and biodegradable. Perfect for your wellness journey.',
        price: 45.99,
        originalPrice: 69.99,
        condition: 'excellent',
        categoryId: 5,
        sellerId: 5,
        imageUrls: [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1506629905607-0b0b4a0a0a0a?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['yoga', 'mat', 'eco-friendly', 'fitness']
      },
      {
        title: 'Vintage Camera Collection',
        description: 'Collection of 3 vintage film cameras in working condition. Includes Canon AE-1, Nikon F3, and Pentax K1000. Great for photography enthusiasts.',
        price: 299.99,
        originalPrice: 450.00,
        condition: 'good',
        categoryId: 2,
        sellerId: 1,
        imageUrls: [
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['vintage', 'camera', 'film', 'photography']
      },
      {
        title: 'Organic Skincare Set',
        description: 'Complete organic skincare set with cleanser, toner, and moisturizer. All products are cruelty-free and made with natural ingredients.',
        price: 79.99,
        originalPrice: 120.00,
        condition: 'excellent',
        categoryId: 8,
        sellerId: 3,
        imageUrls: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['skincare', 'organic', 'natural', 'beauty']
      },
      {
        title: 'Bamboo Kitchen Utensils Set',
        description: 'Complete set of bamboo kitchen utensils including spoons, spatulas, and tongs. Sustainable alternative to plastic utensils.',
        price: 24.99,
        originalPrice: 39.99,
        condition: 'excellent',
        categoryId: 3,
        sellerId: 2,
        imageUrls: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['bamboo', 'kitchen', 'utensils', 'sustainable']
      },
      {
        title: 'Vintage Vinyl Records',
        description: 'Collection of 20 vintage vinyl records from the 70s and 80s. Includes classic rock, jazz, and folk albums. Great condition.',
        price: 89.99,
        originalPrice: 150.00,
        condition: 'good',
        categoryId: 4,
        sellerId: 4,
        imageUrls: [
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['vinyl', 'records', 'vintage', 'music']
      },
      {
        title: 'Eco-Friendly Water Bottle',
        description: 'Stainless steel water bottle with bamboo cap. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and sustainable.',
        price: 19.99,
        originalPrice: 29.99,
        condition: 'excellent',
        categoryId: 5,
        sellerId: 5,
        imageUrls: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop'
        ],
        isEcoFriendly: true,
        tags: ['water bottle', 'stainless steel', 'eco-friendly', 'sustainable']
      }
    ];

    for (const product of products) {
      await this.db.execute(`
        INSERT INTO products (
          title, description, price, original_price, condition, category_id, seller_id,
          image_urls, is_eco_friendly, tags, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        product.title,
        product.description,
        product.price,
        product.originalPrice,
        product.condition,
        product.categoryId,
        product.sellerId,
        JSON.stringify(product.imageUrls),
        product.isEcoFriendly ? 1 : 0,
        JSON.stringify(product.tags)
      ]);
    }

    console.log(`✅ Seeded ${products.length} products`);
  }

  // Seed cart items
  async seedCartItems() {
    console.log('🛒 Seeding cart items...');
    
    const cartItems = [
      { userId: 1, productId: 2, quantity: 1 },
      { userId: 1, productId: 5, quantity: 2 },
      { userId: 2, productId: 1, quantity: 1 },
      { userId: 2, productId: 3, quantity: 1 },
      { userId: 3, productId: 4, quantity: 1 },
      { userId: 3, productId: 7, quantity: 1 },
      { userId: 4, productId: 6, quantity: 1 },
      { userId: 5, productId: 8, quantity: 3 }
    ];

    for (const item of cartItems) {
      await this.db.execute(`
        INSERT INTO cart (user_id, product_id, quantity, created_at, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [item.userId, item.productId, item.quantity]);
    }

    console.log(`✅ Seeded ${cartItems.length} cart items`);
  }

  // Seed purchases
  async seedPurchases() {
    console.log('💳 Seeding purchases...');
    
    const purchases = [
      {
        buyerId: 1,
        sellerId: 2,
        productId: 2,
        quantity: 1,
        totalAmount: 899.99,
        shippingAddress: '123 Main St, San Francisco, CA 94102',
        paymentMethod: 'credit_card',
        status: 'delivered',
        notes: 'Fast shipping, great condition!'
      },
      {
        buyerId: 2,
        sellerId: 1,
        productId: 1,
        quantity: 1,
        totalAmount: 89.99,
        shippingAddress: '456 Oak Ave, Portland, OR 97201',
        paymentMethod: 'paypal',
        status: 'shipped',
        notes: 'Perfect vintage find!'
      },
      {
        buyerId: 3,
        sellerId: 4,
        productId: 4,
        quantity: 1,
        totalAmount: 75.00,
        shippingAddress: '789 Pine St, Austin, TX 78701',
        paymentMethod: 'credit_card',
        status: 'confirmed',
        notes: 'Love the vintage look!'
      }
    ];

    for (const purchase of purchases) {
      await this.db.execute(`
        INSERT INTO purchases (
          buyer_id, seller_id, product_id, quantity, total_amount,
          shipping_address, payment_method, status, notes, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        purchase.buyerId,
        purchase.sellerId,
        purchase.productId,
        purchase.quantity,
        purchase.totalAmount,
        purchase.shippingAddress,
        purchase.paymentMethod,
        purchase.status,
        purchase.notes
      ]);
    }

    console.log(`✅ Seeded ${purchases.length} purchases`);
  }

  // Seed reviews
  async seedReviews() {
    console.log('⭐ Seeding reviews...');
    
    const reviews = [
      {
        userId: 1,
        productId: 2,
        rating: 5,
        comment: 'Excellent laptop! Works perfectly and looks brand new. Great value for money.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        userId: 2,
        productId: 1,
        rating: 4,
        comment: 'Beautiful jacket, fits perfectly. Some minor wear but adds character.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: 3,
        productId: 4,
        rating: 5,
        comment: 'Love this bookshelf! Perfect size and the vintage look is amazing.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    for (const review of reviews) {
      await this.db.execute(`
        INSERT INTO reviews (user_id, product_id, rating, comment, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [review.userId, review.productId, review.rating, review.comment, review.createdAt]);
    }

    console.log(`✅ Seeded ${reviews.length} reviews`);
  }

  // Seed favorites
  async seedFavorites() {
    console.log('❤️  Seeding favorites...');
    
    const favorites = [
      { userId: 1, productId: 3 },
      { userId: 1, productId: 5 },
      { userId: 2, productId: 6 },
      { userId: 2, productId: 8 },
      { userId: 3, productId: 1 },
      { userId: 3, productId: 7 },
      { userId: 4, productId: 2 },
      { userId: 4, productId: 9 },
      { userId: 5, productId: 4 },
      { userId: 5, productId: 10 }
    ];

    for (const favorite of favorites) {
      await this.db.execute(`
        INSERT INTO favorites (user_id, product_id, created_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `, [favorite.userId, favorite.productId]);
    }

    console.log(`✅ Seeded ${favorites.length} favorites`);
  }

  // Run all seeding operations
  async seed() {
    try {
      console.log('🌱 Starting database seeding...');
      
      await this.clearData();
      await this.seedUsers();
      await this.seedCategories();
      await this.seedProducts();
      await this.seedCartItems();
      await this.seedPurchases();
      await this.seedReviews();
      await this.seedFavorites();
      
      console.log('🎉 Database seeding completed successfully!');
      
      // Display statistics
      const stats = await this.db.getStats();
      console.log('\n📊 Database Statistics:');
      Object.entries(stats).forEach(([table, count]) => {
        console.log(`   ${table}: ${count} records`);
      });
      
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }

  // Reset database (clear and reseed)
  async reset() {
    console.log('🔄 Resetting database...');
    await this.seed();
  }
}

module.exports = DatabaseSeeder;
