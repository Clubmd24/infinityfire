const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const VenueChecklist = require('../models/VenueChecklist');
const ActivityLog = require('../models/ActivityLog');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Helper function to log venue checklist activity
const logVenueChecklistActivity = async (userId, activityType, description, req, metadata = {}) => {
  try {
    await ActivityLog.create({
      userId,
      activityType,
      description,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        method: req.method
      }
    });
  } catch (error) {
    console.error('Failed to log venue checklist activity:', error);
  }
};

const router = express.Router();

// Get all venue checklists for the current user
router.get('/', auth, async (req, res) => {
  try {
    const checklists = await VenueChecklist.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: checklists
    });
  } catch (error) {
    console.error('Get venue checklists error:', error);
    res.status(500).json({ 
      error: 'Failed to get venue checklists',
      message: error.message 
    });
  }
});

// Get a specific venue checklist by ID
router.get('/:id', auth, [
  query('id').isInt().withMessage('Invalid checklist ID')
], validate, async (req, res) => {
  try {
    const checklist = await VenueChecklist.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    
    res.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Get venue checklist error:', error);
    res.status(500).json({ 
      error: 'Failed to get venue checklist',
      message: error.message 
    });
  }
});

// Create a new venue checklist
router.post('/', auth, [
  body('checklistType').isIn(['opening', 'closing']).withMessage('Invalid checklist type'),
  body('conductedBy').notEmpty().withMessage('Conducted by is required'),
  body('checkDate').optional().isISO8601().withMessage('Invalid date format')
], validate, async (req, res) => {
  try {
    const { checklistType, conductedBy, checkDate, notes } = req.body;
    
    const checklist = await VenueChecklist.create({
      userId: req.user.id,
      checklistType,
      conductedBy,
      checkDate: checkDate || new Date(),
      notes
    });
    
    // Log the activity
    await logVenueChecklistActivity(req.user.id, 'venue_checklist_created', 
      `Created ${checklistType} checklist`, req, {
        checklistId: checklist.id,
        checklistType,
        conductedBy
      });
    
    res.status(201).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Create venue checklist error:', error);
    res.status(500).json({ 
      error: 'Failed to create venue checklist',
      message: error.message 
    });
  }
});

// Update a venue checklist
router.put('/:id', auth, [
  body('conductedBy').optional().notEmpty().withMessage('Conducted by cannot be empty'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('status').optional().isIn(['in_progress', 'completed', 'verified']).withMessage('Invalid status')
], validate, async (req, res) => {
  try {
    const checklist = await VenueChecklist.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    
    // Update the checklist
    await checklist.update(req.body);
    
    // Log the activity
    await logVenueChecklistActivity(req.user.id, 'venue_checklist_updated', 
      `Updated ${checklist.checklistType} checklist`, req, {
        checklistId: checklist.id,
        checklistType: checklist.checklistType,
        changes: req.body
      });
    
    res.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Update venue checklist error:', error);
    res.status(500).json({ 
      error: 'Failed to update venue checklist',
      message: error.message 
    });
  }
});

// Update checklist items (tick boxes)
router.patch('/:id/items', auth, [
  body('items').isObject().withMessage('Items must be an object')
], validate, async (req, res) => {
  try {
    const checklist = await VenueChecklist.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    
    const { items } = req.body;
    
    // Update only the provided items
    await checklist.update(items);
    
    // Log the activity
    await logVenueChecklistActivity(req.user.id, 'venue_checklist_items_updated', 
      `Updated items in ${checklist.checklistType} checklist`, req, {
        checklistId: checklist.id,
        checklistType: checklist.checklistType,
        updatedItems: items
      });
    
    res.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Update checklist items error:', error);
    res.status(500).json({ 
      error: 'Failed to update checklist items',
      message: error.message 
    });
  }
});

// Complete a checklist
router.patch('/:id/complete', auth, [
  body('overallConfirmation').notEmpty().withMessage('Overall confirmation is required'),
  body('signature').optional().isString().withMessage('Signature must be a string')
], validate, async (req, res) => {
  try {
    const checklist = await VenueChecklist.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    
    // Update the checklist to completed status
    await checklist.update({
      status: 'completed',
      overallConfirmation: req.body.overallConfirmation,
      signature: req.body.signature
    });
    
    // Log the activity
    await logVenueChecklistActivity(req.user.id, 'venue_checklist_completed', 
      `Completed ${checklist.checklistType} checklist`, req, {
        checklistId: checklist.id,
        checklistType: checklist.checklistType,
        overallConfirmation: req.body.overallConfirmation
      });
    
    res.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Complete checklist error:', error);
    res.status(500).json({ 
      error: 'Failed to complete checklist',
      message: error.message 
    });
  }
});

// Delete a venue checklist
router.delete('/:id', auth, async (req, res) => {
  try {
    const checklist = await VenueChecklist.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    
    // Log the activity before deletion
    await logVenueChecklistActivity(req.user.id, 'venue_checklist_deleted', 
      `Deleted ${checklist.checklistType} checklist`, req, {
        checklistId: checklist.id,
        checklistType: checklist.checklistType
      });
    
    await checklist.destroy();
    
    res.json({
      success: true,
      message: 'Checklist deleted successfully'
    });
  } catch (error) {
    console.error('Delete venue checklist error:', error);
    res.status(500).json({ 
      error: 'Failed to delete venue checklist',
      message: error.message 
    });
  }
});

module.exports = router;
