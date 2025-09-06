const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const config = require('../config');

// Ensure database directory exists
const dbDir = path.dirname(config.DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(config.DATABASE_PATH);

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Error creating database schema:', err);
  } else {
    console.log('Database schema created successfully!');
  }
});

// Close database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database connection closed.');
  }
});

module.exports = { db };
