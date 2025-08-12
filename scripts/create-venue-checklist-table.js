const { sequelize } = require('../config/database');
const VenueChecklist = require('../models/VenueChecklist');

async function createVenueChecklistTable() {
  try {
    console.log('Starting VenueChecklist table creation...');
    
    // Sync the VenueChecklist model
    await VenueChecklist.sync({ force: false });
    
    console.log('✅ VenueChecklist table created/verified successfully');
    
  } catch (error) {
    console.error('❌ Error creating VenueChecklist table:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await createVenueChecklistTable();
    console.log('🎉 VenueChecklist table setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 VenueChecklist table setup failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = { createVenueChecklistTable };
