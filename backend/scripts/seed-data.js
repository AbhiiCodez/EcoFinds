const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const db = new sqlite3.Database(config.DATABASE_PATH);

// Sample users
const users = [
  {
    username: 'sarah_m',
    email: 'sarah@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    first_name: 'Sarah',
    last_name: 'Miller',
    bio: 'Eco-conscious seller passionate about sustainable fashion',
    location: 'San Francisco, CA',
    is_verified: 1
  },
  {
    username: 'mike_r',
    email: 'mike@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    first_name: 'Mike',
    last_name: 'Rodriguez',
    bio: 'Furniture enthusiast and sustainability advocate',
    location: 'Portland, OR',
    is_verified: 1
  },
  {
    username: 'emma_l',
    email: 'emma@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    first_name: 'Emma',
    last_name: 'Lee',
    bio: 'Minimalist lifestyle blogger and second-hand enthusiast',
    location: 'Seattle, WA',
    is_verified: 1
  }
];

// Sample products
const products = [
  {
    title: 'Vintage Leather Jacket',
    description: 'Beautiful vintage leather jacket in excellent condition. Perfect for adding a timeless piece to your wardrobe while supporting sustainable fashion.',
    price: 89.00,
    original_price: 150.00,
    condition: 'excellent',
    category_id: 1,
    seller_id: 1,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1551028719-001c4b5e2074?w=400&h=400&fit=crop']),
    is_eco_friendly: 1,
    is_featured: 1
  },
  {
    title: 'Wooden Dining Table',
    description: 'Solid oak dining table with beautiful grain patterns. Perfect for family meals and gatherings. Some minor wear adds character.',
    price: 250.00,
    original_price: 400.00,
    condition: 'good',
    category_id: 2,
    seller_id: 2,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop']),
    is_eco_friendly: 1,
    is_featured: 1
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Soft, comfortable organic cotton t-shirt. Barely worn, like new condition. Perfect for everyday wear.',
    price: 15.00,
    original_price: 25.00,
    condition: 'excellent',
    category_id: 1,
    seller_id: 3,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop']),
    is_eco_friendly: 1,
    is_featured: 1
  },
  {
    title: 'Ceramic Plant Pot Set',
    description: 'Beautiful handcrafted ceramic plant pots. Perfect for indoor plants and succulents. Each pot is unique.',
    price: 35.00,
    original_price: 60.00,
    condition: 'excellent',
    category_id: 3,
    seller_id: 1,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop']),
    is_eco_friendly: 1,
    is_featured: 1
  },
  {
    title: 'Vintage Camera',
    description: 'Classic 35mm film camera in working condition. Great for photography enthusiasts and collectors.',
    price: 120.00,
    original_price: 200.00,
    condition: 'good',
    category_id: 4,
    seller_id: 2,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop']),
    is_eco_friendly: 0,
    is_featured: 1
  },
  {
    title: 'Bamboo Kitchen Utensils',
    description: 'Set of 6 bamboo kitchen utensils. Eco-friendly and sustainable alternative to plastic utensils.',
    price: 25.00,
    original_price: 35.00,
    condition: 'excellent',
    category_id: 3,
    seller_id: 3,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop']),
    is_eco_friendly: 1,
    is_featured: 1
  },
  {
    title: 'Vintage Books Collection',
    description: 'Collection of classic literature books in good condition. Perfect for book lovers and collectors.',
    price: 45.00,
    original_price: 80.00,
    condition: 'good',
    category_id: 5,
    seller_id: 1,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop']),
    is_eco_friendly: 1,
    is_featured: 1
  },
  {
    title: 'Wooden Board Games',
    description: 'Set of classic wooden board games. Perfect for family game nights and sustainable entertainment.',
    price: 60.00,
    original_price: 100.00,
    condition: 'excellent',
    category_id: 6,
    seller_id: 2,
    image_urls: JSON.stringify(['https://images.unsplash.com/photo-1558060370-539c4b0b0b8c?w=400&h=400&fit=crop']),
    is_eco_friendly: 1,
    is_featured: 1
  }
];

// Insert users
console.log('Inserting users...');
const insertUser = db.prepare(`
  INSERT INTO users (username, email, password_hash, first_name, last_name, bio, location, is_verified)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

users.forEach(user => {
  insertUser.run(
    user.username,
    user.email,
    user.password,
    user.first_name,
    user.last_name,
    user.bio,
    user.location,
    user.is_verified
  );
});

insertUser.finalize();

// Insert products
console.log('Inserting products...');
const insertProduct = db.prepare(`
  INSERT INTO products (title, description, price, original_price, condition, category_id, seller_id, image_urls, is_eco_friendly, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

products.forEach(product => {
  insertProduct.run(
    product.title,
    product.description,
    product.price,
    product.original_price,
    product.condition,
    product.category_id,
    product.seller_id,
    product.image_urls,
    product.is_eco_friendly,
    product.is_featured
  );
});

insertProduct.finalize();

console.log('Database seeded successfully!');
db.close();
