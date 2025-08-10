const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Test = sequelize.define('Test', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  testType: {
    type: DataTypes.ENUM('test1', 'test2', 'fire_drill'),
    allowNull: false
  },
  testData: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  result: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['testType']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Define associations
Test.associate = (models) => {
  Test.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Test; 