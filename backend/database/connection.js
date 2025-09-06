const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config');

class DatabaseConnection {
  constructor() {
    this.db = null;
    this.isConnected = false;
  }

  // Initialize database connection
  async connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.resolve(config.DATABASE_PATH);
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          this.isConnected = true;
          
          // Enable foreign keys
          this.db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
              console.warn('Warning: Could not enable foreign keys:', err.message);
            }
          });
          
          resolve();
        }
      });
    });
  }

  // Execute a query with parameters (for SELECT operations)
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Database not connected'));
        return;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Query error:', err.message);
          console.error('SQL:', sql);
          console.error('Params:', params);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Execute a single row query
  async queryOne(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Database not connected'));
        return;
      }

      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('QueryOne error:', err.message);
          console.error('SQL:', sql);
          console.error('Params:', params);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Execute a query that doesn't return data (INSERT, UPDATE, DELETE)
  async execute(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Database not connected'));
        return;
      }

      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Execute error:', err.message);
          console.error('SQL:', sql);
          console.error('Params:', params);
          reject(err);
        } else {
          resolve({
            lastID: this.lastID,
            changes: this.changes
          });
        }
      });
    });
  }

  // Execute multiple queries in a transaction
  async transaction(queries) {
    return new Promise(async (resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Database not connected'));
        return;
      }

      try {
        await this.execute('BEGIN TRANSACTION');
        
        const results = [];
        for (const { sql, params = [] } of queries) {
          const result = await this.execute(sql, params);
          results.push(result);
        }
        
        await this.execute('COMMIT');
        resolve(results);
      } catch (error) {
        await this.execute('ROLLBACK');
        reject(error);
      }
    });
  }

  // Check if a table exists
  async tableExists(tableName) {
    const sql = `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name=?
    `;
    const result = await this.queryOne(sql, [tableName]);
    return !!result;
  }

  // Get table schema
  async getTableSchema(tableName) {
    const sql = `PRAGMA table_info(${tableName})`;
    return await this.query(sql);
  }

  // Close database connection
  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('✅ Database connection closed');
            this.isConnected = false;
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Get database statistics
  async getStats() {
    const tables = ['users', 'products', 'categories', 'cart', 'purchases', 'reviews', 'favorites'];
    const stats = {};
    
    for (const table of tables) {
      try {
        const result = await this.queryOne(`SELECT COUNT(*) as count FROM ${table}`);
        stats[table] = result.count;
      } catch (error) {
        stats[table] = 0;
      }
    }
    
    return stats;
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

module.exports = dbConnection;
