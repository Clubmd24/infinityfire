const express = require('express');
const { query, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const s3Service = require('../services/s3Service');

const router = express.Router();

// List files and folders in a directory
router.get('/list', auth, [
  query('path')
    .optional()
    .isString()
    .withMessage('Path must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { path = '' } = req.query;
    
    const result = await s3Service.listObjects(path);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ 
      error: 'Failed to list files',
      message: error.message 
    });
  }
});

// Get file details
router.get('/details', auth, [
  query('path')
    .notEmpty()
    .withMessage('File path is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { path } = req.query;
    
    const fileDetails = await s3Service.getFileDetails(path);
    
    res.json({
      success: true,
      data: fileDetails
    });
  } catch (error) {
    console.error('Get file details error:', error);
    res.status(500).json({ 
      error: 'Failed to get file details',
      message: error.message 
    });
  }
});

// Generate download URL
router.get('/download', auth, [
  query('path')
    .notEmpty()
    .withMessage('File path is required'),
  query('expires')
    .optional()
    .isInt({ min: 300, max: 86400 })
    .withMessage('Expires must be between 300 and 86400 seconds')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { path, expires = 3600 } = req.query;
    
    // Check if file exists
    const exists = await s3Service.objectExists(path);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Generate download URL
    const downloadUrl = await s3Service.generateDownloadUrl(path, parseInt(expires));
    
    res.json({
      success: true,
      data: {
        downloadUrl,
        expiresIn: parseInt(expires),
        expiresAt: new Date(Date.now() + parseInt(expires) * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Generate download URL error:', error);
    res.status(500).json({ 
      error: 'Failed to generate download URL',
      message: error.message 
    });
  }
});

// Search files
router.get('/search', auth, [
  query('q')
    .notEmpty()
    .withMessage('Search query is required'),
  query('path')
    .optional()
    .isString()
    .withMessage('Path must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q: searchTerm, path = '' } = req.query;
    
    const searchResults = await s3Service.searchFiles(searchTerm, path);
    
    res.json({
      success: true,
      data: {
        results: searchResults,
        query: searchTerm,
        path: path,
        count: searchResults.length
      }
    });
  } catch (error) {
    console.error('Search files error:', error);
    res.status(500).json({ 
      error: 'Failed to search files',
      message: error.message 
    });
  }
});

// Get bucket information
router.get('/bucket-info', auth, async (req, res) => {
  try {
    const bucketInfo = await s3Service.getBucketInfo();
    
    res.json({
      success: true,
      data: bucketInfo
    });
  } catch (error) {
    console.error('Get bucket info error:', error);
    res.status(500).json({ 
      error: 'Failed to get bucket information',
      message: error.message 
    });
  }
});

// Navigate to parent directory
router.get('/navigate', auth, [
  query('path')
    .optional()
    .isString()
    .withMessage('Path must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { path = '' } = req.query;
    
    // If no path, return root
    if (!path) {
      const result = await s3Service.listObjects('');
      return res.json({
        success: true,
        data: result
      });
    }
    
    // Get parent path
    const pathParts = path.split('/').filter(part => part);
    if (pathParts.length === 0) {
      const result = await s3Service.listObjects('');
      return res.json({
        success: true,
        data: result
      });
    }
    
    // Remove last part to go to parent
    pathParts.pop();
    const parentPath = pathParts.join('/') + (pathParts.length > 0 ? '/' : '');
    
    const result = await s3Service.listObjects(parentPath);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Navigate error:', error);
    res.status(500).json({ 
      error: 'Failed to navigate',
      message: error.message 
    });
  }
});

module.exports = router; 