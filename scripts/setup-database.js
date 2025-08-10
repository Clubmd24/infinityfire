#!/usr/bin/env node

require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('../models/User');
const Test = require('../models/Test');

console.log('🚀 Setting up InfinityFire database...\n');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false
});

async function setupDatabase() {
  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');

    // Sync all models (create tables)
    console.log('🔨 Creating database tables...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables created/updated!\n');

    // Check if admin user exists
    console.log('👤 Checking for admin user...');
    const adminUser = await User.findOne({ where: { email: 'admin@infinityfire.com' } });
    
    if (!adminUser) {
      console.log('👑 Creating admin user...');
      await User.create({
        username: 'admin',
        email: 'admin@infinityfire.com',
        password: 'admin123', // Change this in production!
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created!');
      console.log('   Email: admin@infinityfire.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  Change this password immediately!\n');
    } else {
      console.log('✅ Admin user already exists\n');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure MySQL is running and accessible');
      console.error('💡 Check your .env file for correct database credentials');
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase(); 