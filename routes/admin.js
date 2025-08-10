const express = require('express');
const { adminAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { Op, sequelize } = require('sequelize');

const router = express.Router();

// Get activity log (admin only)
router.get('/activity-log', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, activityType, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (activityType) {
      whereClause.activityType = activityType;
    }
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows } = await ActivityLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
});

// Get activity statistics (admin only)
router.get('/activity-stats', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    // Get activity counts by type
    const activityCounts = await ActivityLog.findAll({
      where: whereClause,
      attributes: [
        'activityType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['activityType']
    });

    // Get recent activities (last 24 hours)
    const recentActivities = await ActivityLog.count({
      where: {
        ...whereClause,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get unique users with activity
    const uniqueUsers = await ActivityLog.count({
      where: whereClause,
      distinct: true,
      col: 'userId'
    });

    res.json({
      success: true,
      data: {
        activityCounts,
        recentActivities,
        uniqueUsers,
        totalActivities: activityCounts.reduce((sum, item) => sum + parseInt(item.dataValues.count), 0)
      }
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ error: 'Failed to fetch activity statistics' });
  }
});

// Get user activity summary (admin only)
router.get('/user-activity/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const whereClause = { userId };
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const activities = await ActivityLog.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'lastLogin', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        user,
        activities,
        totalActivities: activities.length
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

module.exports = router; 