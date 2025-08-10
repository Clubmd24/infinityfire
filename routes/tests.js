const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Test = require('../models/Test');
const User = require('../models/User');

// Get all tests for the authenticated user
router.get('/my-tests', auth, async (req, res) => {
  try {
    const tests = await Test.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      success: true,
      data: tests
    });
  } catch (error) {
    console.error('Error fetching user tests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests'
    });
  }
});

// Get test history by type
router.get('/history/:testType', auth, async (req, res) => {
  try {
    const { testType } = req.params;
    
    if (!['test1', 'test2', 'fire_drill'].includes(testType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test type'
      });
    }

    const tests = await Test.findAll({
      where: { 
        userId: req.user.id,
        testType: testType
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      success: true,
      data: tests
    });
  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test history'
    });
  }
});

// Create a new test
router.post('/create', auth, async (req, res) => {
  try {
    const { testType, testData, notes } = req.body;

    if (!testType || !['test1', 'test2', 'fire_drill'].includes(testType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test type. Must be test1, test2, or fire_drill'
      });
    }

    if (!testData) {
      return res.status(400).json({
        success: false,
        message: 'Test data is required'
      });
    }

    const test = await Test.create({
      userId: req.user.id,
      testType,
      testData,
      notes: notes || null,
      status: 'pending'
    });

    // Fetch the created test with user info
    const createdTest = await Test.findByPk(test.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: createdTest
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test'
    });
  }
});

// Update test status and result
router.put('/:testId/update', auth, async (req, res) => {
  try {
    const { testId } = req.params;
    const { status, result, notes } = req.body;

    const test = await Test.findOne({
      where: { 
        id: testId,
        userId: req.user.id
      }
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Update allowed fields
    if (status && ['pending', 'completed', 'failed'].includes(status)) {
      test.status = status;
    }
    
    if (result !== undefined) {
      test.result = result;
    }
    
    if (notes !== undefined) {
      test.notes = notes;
    }

    await test.save();

    res.json({
      success: true,
      message: 'Test updated successfully',
      data: test
    });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update test'
    });
  }
});

// Get test statistics for the user
router.get('/stats', auth, async (req, res) => {
  try {
    const test1Count = await Test.count({
      where: { 
        userId: req.user.id,
        testType: 'test1'
      }
    });

    const test2Count = await Test.count({
      where: { 
        userId: req.user.id,
        testType: 'test2'
      }
    });

    const fireDrillCount = await Test.count({
      where: { 
        userId: req.user.id,
        testType: 'fire_drill'
      }
    });

    const completedTests = await Test.count({
      where: { 
        userId: req.user.id,
        status: 'completed'
      }
    });

    const pendingTests = await Test.count({
      where: { 
        userId: req.user.id,
        status: 'pending'
      }
    });

    res.json({
      success: true,
      data: {
        test1Count,
        test2Count,
        fireDrillCount,
        completedTests,
        pendingTests,
        totalTests: test1Count + test2Count + fireDrillCount
      }
    });
  } catch (error) {
    console.error('Error fetching test stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test statistics'
    });
  }
});

module.exports = router; 