const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

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

module.exports = { User, ActivityLog }; 