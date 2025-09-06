module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_PATH: './database.sqlite'
}
