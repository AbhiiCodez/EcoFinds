#!/usr/bin/env node

const path = require('path');
const DatabaseSeeder = require('../database/seed');
const dbConnection = require('../database/connection');

async function main() {
  try {
    console.log('🚀 Starting EcoFinds Database Seeding...\n');
    
    // Connect to database
    await dbConnection.connect();
    
    // Create seeder instance
    const seeder = new DatabaseSeeder();
    
    // Check command line arguments
    const args = process.argv.slice(2);
    const command = args[0] || 'seed';
    
    switch (command) {
      case 'seed':
        await seeder.seed();
        break;
      case 'reset':
        await seeder.reset();
        break;
      case 'clear':
        await seeder.clearData();
        console.log('✅ Database cleared successfully!');
        break;
      default:
        console.log('Usage: node seed-database.js [seed|reset|clear]');
        console.log('  seed  - Seed the database with sample data (default)');
        console.log('  reset - Clear and reseed the database');
        console.log('  clear - Clear all data from the database');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await dbConnection.close();
    console.log('\n👋 Database connection closed.');
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main();
