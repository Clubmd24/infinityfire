const { Sequelize } = require('sequelize');

// Determine database type from DATABASE_URL
const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Check if it's a PostgreSQL URL (Heroku default)
  if (databaseUrl.includes('postgres://') || databaseUrl.includes('postgresql://')) {
    return {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    };
  }
  
  // Default to MySQL for local development
  return {
    dialect: 'mysql'
  };
};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  ...getDatabaseConfig(),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = { sequelize }; 