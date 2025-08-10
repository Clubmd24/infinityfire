const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

async function updateActivityLogEnum() {
  try {
    console.log('Starting ActivityLog enum update...');
    
    // Update the ENUM type to include 'file_view'
    await sequelize.query(`
      ALTER TYPE "enum_ActivityLogs_activityType" ADD VALUE 'file_view';
    `);
    
    console.log('✅ Successfully added "file_view" to ActivityLog activityType enum');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  "file_view" value already exists in enum, skipping...');
    } else {
      console.error('❌ Error updating ActivityLog enum:', error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    await updateActivityLogEnum();
    console.log('🎉 ActivityLog enum update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 ActivityLog enum update failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = { updateActivityLogEnum }; 