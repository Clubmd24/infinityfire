const { sequelize } = require('../config/database');

async function updateActivityLogEnumVenue() {
  try {
    console.log('Starting ActivityLog enum update for venue checklists...');
    
    // Update the ENUM type to include venue checklist activity types
    await sequelize.query(`
      ALTER TYPE "enum_ActivityLogs_activityType" ADD VALUE 'venue_checklist_created';
    `);
    
    console.log('✅ Successfully added "venue_checklist_created" to ActivityLog activityType enum');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  "venue_checklist_created" value already exists in enum, skipping...');
    } else {
      console.error('❌ Error updating ActivityLog enum:', error.message);
      throw error;
    }
  }

  try {
    await sequelize.query(`
      ALTER TYPE "enum_ActivityLogs_activityType" ADD VALUE 'venue_checklist_updated';
    `);
    
    console.log('✅ Successfully added "venue_checklist_updated" to ActivityLog activityType enum');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  "venue_checklist_updated" value already exists in enum, skipping...');
    } else {
      console.error('❌ Error updating ActivityLog enum:', error.message);
      throw error;
    }
  }

  try {
    await sequelize.query(`
      ALTER TYPE "enum_ActivityLogs_activityType" ADD VALUE 'venue_checklist_items_updated';
    `);
    
    console.log('✅ Successfully added "venue_checklist_items_updated" to ActivityLog activityType enum');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  "venue_checklist_items_updated" value already exists in enum, skipping...');
    } else {
      console.error('❌ Error updating ActivityLog enum:', error.message);
      throw error;
    }
  }

  try {
    await sequelize.query(`
      ALTER TYPE "enum_ActivityLogs_activityType" ADD VALUE 'venue_checklist_completed';
    `);
    
    console.log('✅ Successfully added "venue_checklist_completed" to ActivityLog activityType enum');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  "venue_checklist_completed" value already exists in enum, skipping...');
    } else {
      console.error('❌ Error updating ActivityLog enum:', error.message);
      throw error;
    }
  }

  try {
    await sequelize.query(`
      ALTER TYPE "enum_ActivityLogs_activityType" ADD VALUE 'venue_checklist_deleted';
    `);
    
    console.log('✅ Successfully added "venue_checklist_deleted" to ActivityLog activityType enum');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  "venue_checklist_deleted" value already exists in enum, skipping...');
    } else {
      console.error('❌ Error updating ActivityLog enum:', error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    await updateActivityLogEnumVenue();
    console.log('🎉 ActivityLog enum update for venue checklists completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 ActivityLog enum update for venue checklists failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = { updateActivityLogEnumVenue };
