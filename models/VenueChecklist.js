const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VenueChecklist = sequelize.define('VenueChecklist', {
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
  checklistType: {
    type: DataTypes.ENUM('opening', 'closing'),
    allowNull: false
  },
  checkDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  conductedBy: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Opening checklist items
  fireDoorsNorthChainCollected: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireDoorsSouthChainCollected: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireDoorsUnlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  runwayLightingOperating: { type: DataTypes.BOOLEAN, defaultValue: false },
  functionalSafetyLightingOn: { type: DataTypes.BOOLEAN, defaultValue: false },
  cctvOperating: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireAlarmOperational: { type: DataTypes.BOOLEAN, defaultValue: false },
  radioChecksIncTango: { type: DataTypes.BOOLEAN, defaultValue: false },
  gatesShuttersSecuredOpen: { type: DataTypes.BOOLEAN, defaultValue: false },
  idScannerOperation: { type: DataTypes.BOOLEAN, defaultValue: false },
  tillSystemReset: { type: DataTypes.BOOLEAN, defaultValue: false },
  gasTurnedOn: { type: DataTypes.BOOLEAN, defaultValue: false },
  runwayClean: { type: DataTypes.BOOLEAN, defaultValue: false },
  soundSystemWorking: { type: DataTypes.BOOLEAN, defaultValue: false },
  lasersOn: { type: DataTypes.BOOLEAN, defaultValue: false },
  smokeMachinesFull: { type: DataTypes.BOOLEAN, defaultValue: false },
  ledScreenProjectorsOnWorking: { type: DataTypes.BOOLEAN, defaultValue: false },
  postMixFull: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireAlarmIsolated: { type: DataTypes.BOOLEAN, defaultValue: false },
  
  // Closing checklist items
  fireDoor1LockedSecured: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireDoor2LockedSecured: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireDoor3LockedSecured: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireDoor4LockedSecured: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireDoor5LockedSecured: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireDoor6LockedSecured: { type: DataTypes.BOOLEAN, defaultValue: false },
  gentsWcCleared: { type: DataTypes.BOOLEAN, defaultValue: false },
  ladiesWcCleared: { type: DataTypes.BOOLEAN, defaultValue: false },
  phrootClear: { type: DataTypes.BOOLEAN, defaultValue: false },
  lv3Clear: { type: DataTypes.BOOLEAN, defaultValue: false },
  lv2Clear: { type: DataTypes.BOOLEAN, defaultValue: false },
  lv1Clear: { type: DataTypes.BOOLEAN, defaultValue: false },
  frontDoorsLocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  runwayClean: { type: DataTypes.BOOLEAN, defaultValue: false },
  barsClean: { type: DataTypes.BOOLEAN, defaultValue: false },
  dishwashersOff: { type: DataTypes.BOOLEAN, defaultValue: false },
  gasesOff: { type: DataTypes.BOOLEAN, defaultValue: false },
  djGearOff: { type: DataTypes.BOOLEAN, defaultValue: false },
  fireAlarmTakenOutOfIsolation: { type: DataTypes.BOOLEAN, defaultValue: false },
  radiosReturnedOnCharge: { type: DataTypes.BOOLEAN, defaultValue: false },
  tangoLinkSignedOff: { type: DataTypes.BOOLEAN, defaultValue: false },
  
  // Additional fields
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  overallConfirmation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  signature: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'verified'),
    defaultValue: 'in_progress'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['checklistType']
    },
    {
      fields: ['checkDate']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = VenueChecklist;
