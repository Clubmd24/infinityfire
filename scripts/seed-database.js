#!/usr/bin/env node

require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('../models/User');

console.log('🌱 Seeding database with sample data...\n');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'infinityfire',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

async function seedDatabase() {
  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');

    // Sample users data
    const sampleUsers = [
      {
        username: 'demo_user',
        email: 'demo@infinityfire.com',
        password: 'demo123',
        role: 'user',
        isActive: true
      },
      {
        username: 'test_user',
        email: 'test@infinityfire.com',
        password: 'test123',
        role: 'user',
        isActive: true
      }
    ];

    console.log('👥 Creating sample users...');
    
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.username} (${userData.email})`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.username} (${userData.email})`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Sample users created for testing');

  } catch (error) {
    console.error('❌ Database seeding failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedDatabase(); 