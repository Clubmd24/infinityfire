const { sequelize } = require('../config/database');
const ActivityLog = require('../models/ActivityLog');

async function createActivityLogTable() {
  try {
    console.log('Creating ActivityLog table...');
    
    // Sync the ActivityLog model
    await ActivityLog.sync({ force: false });
    
    console.log('ActivityLog table created successfully!');
    
    // Test the table
    const count = await ActivityLog.count();
    console.log(`ActivityLog table contains ${count} records`);
    
  } catch (error) {
    console.error('Error creating ActivityLog table:', error);
  } finally {
    await sequelize.close();
  }
}

createActivityLogTable(); 