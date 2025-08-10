const { sequelize } = require('../config/database');

async function updateActivityLogEnumMySQL() {
  try {
    console.log('Starting ActivityLog enum update for MariaDB/MySQL...');
    
    // For MariaDB/MySQL, we need to recreate the table with the new enum values
    // First, let's check the current table structure
    const [results] = await sequelize.query(`
      SHOW CREATE TABLE ActivityLogs;
    `);
    
    console.log('Current table structure retrieved');
    
    // Get the current enum values
    const [enumValues] = await sequelize.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'ActivityLogs' 
      AND COLUMN_NAME = 'activityType';
    `);
    
    if (enumValues.length > 0) {
      const currentEnum = enumValues[0].COLUMN_TYPE;
      console.log('Current enum values:', currentEnum);
      
      // Check if 'file_view' already exists
      if (currentEnum.includes("'file_view'")) {
        console.log('✅ "file_view" value already exists in enum, skipping...');
        return;
      }
    }
    
    // For MariaDB/MySQL, we need to modify the column to add the new enum value
    // This is safer than recreating the table
    await sequelize.query(`
      ALTER TABLE ActivityLogs 
      MODIFY COLUMN activityType ENUM('login', 'logout', 'file_download', 'file_upload', 'file_delete', 'file_view') NOT NULL;
    `);
    
    console.log('✅ Successfully added "file_view" to ActivityLog activityType enum');
    
  } catch (error) {
    console.error('❌ Error updating ActivityLog enum:', error.message);
    
    // If the above fails, try a different approach
    try {
      console.log('Trying alternative approach...');
      
      // Try to add the enum value using a different method
      await sequelize.query(`
        ALTER TABLE ActivityLogs 
        CHANGE COLUMN activityType activityType ENUM('login', 'logout', 'file_download', 'file_upload', 'file_delete', 'file_view') NOT NULL;
      `);
      
      console.log('✅ Successfully added "file_view" using alternative method');
      
    } catch (alternativeError) {
      console.error('❌ Alternative method also failed:', alternativeError.message);
      throw alternativeError;
    }
  }
}

async function main() {
  try {
    await updateActivityLogEnumMySQL();
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

module.exports = { updateActivityLogEnumMySQL }; 