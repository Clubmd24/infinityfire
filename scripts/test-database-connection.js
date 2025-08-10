const { sequelize } = require('../config/database');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Environment:', process.env.NODE_ENV || 'Not set');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test if we can query
    const result = await sequelize.query('SELECT 1 as test');
    console.log('✅ Database query successful:', result[0][0]);
    
    // Check if ActivityLog table exists
    try {
      const ActivityLog = require('../models/ActivityLog');
      await ActivityLog.sync({ force: false });
      console.log('✅ ActivityLog table is ready');
      
      const count = await ActivityLog.count();
      console.log(`📊 ActivityLog table contains ${count} records`);
    } catch (error) {
      console.log('⚠️  ActivityLog table setup:', error.message);
    }
    
    console.log('\n🎉 Database is ready for the new admin features!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. DATABASE_URL is set in your environment');
    console.log('2. Database server is running');
    console.log('3. Database credentials are correct');
  } finally {
    await sequelize.close();
  }
}

testDatabaseConnection(); 