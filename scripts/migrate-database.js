#!/usr/bin/env node

require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('../models/User');

console.log('🔄 Running database migrations...\n');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false
});

async function runMigrations() {
  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');

    // Run migrations (sync with alter: true)
    console.log('🔄 Running database migrations...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database migrations completed!\n');

    console.log('🎉 Migration process completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations(); 