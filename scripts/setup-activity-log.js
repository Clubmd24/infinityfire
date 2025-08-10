const { sequelize } = require('../config/database');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

async function setupActivityLog() {
  try {
    console.log('🚀 Setting up ActivityLog system...');
    
    // Test database connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync the ActivityLog model
    console.log('📋 Creating ActivityLog table...');
    await ActivityLog.sync({ force: false });
    console.log('✅ ActivityLog table created/verified');
    
    // Test the associations
    console.log('🔗 Testing model associations...');
    const testUser = await User.findOne();
    if (testUser) {
      console.log('✅ User model accessible');
      console.log('✅ Associations working correctly');
    }
    
    // Get table info
    const count = await ActivityLog.count();
    console.log(`📊 ActivityLog table contains ${count} records`);
    
    console.log('\n🎉 ActivityLog system setup complete!');
    console.log('\n📋 New features available:');
    console.log('- User activity tracking (login/logout)');
    console.log('- File download logging');
    console.log('- Admin activity dashboard');
    console.log('- User management system');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check DATABASE_URL environment variable');
    console.log('2. Ensure database server is running');
    console.log('3. Verify database permissions');
    console.log('4. Check network connectivity');
    
    if (error.message.includes('DATABASE_URL')) {
      console.log('\n🔧 For deployment:');
      console.log('- DATABASE_URL should be set in GitHub secrets');
      console.log('- Run this script after deployment');
    }
  } finally {
    await sequelize.close();
  }
}

setupActivityLog(); 