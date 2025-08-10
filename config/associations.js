const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const Test = require('../models/Test');

// Define associations
User.hasMany(ActivityLog, {
  foreignKey: 'userId',
  as: 'activityLogs',
  onDelete: 'CASCADE'
});

ActivityLog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Test associations
User.hasMany(Test, {
  foreignKey: 'userId',
  as: 'tests',
  onDelete: 'CASCADE'
});

Test.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = { User, ActivityLog, Test }; 