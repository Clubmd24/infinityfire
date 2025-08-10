const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

class S3Service {
  // List all objects in the bucket with folder structure
  async listObjects(prefix = '') {
    try {
      const params = {
        Bucket: bucketName,
        Prefix: prefix,
        Delimiter: '/'
      };

      const data = await s3.listObjectsV2(params).promise();
      
      const folders = [];
      const files = [];

      // Process folders (CommonPrefixes)
      if (data.CommonPrefixes) {
        data.CommonPrefixes.forEach(prefix => {
          const folderName = prefix.Prefix.replace(prefix.Prefix.split('/').slice(0, -2).join('/') + '/', '');
          folders.push({
            name: folderName,
            path: prefix.Prefix,
            type: 'folder',
            size: null,
            lastModified: null
          });
        });
      }

      // Process files
      if (data.Contents) {
        data.Contents.forEach(object => {
          // Skip the prefix itself if it's not a file
          if (object.Key === prefix) return;
          
          const fileName = object.Key.split('/').pop();
          
          // Skip macOS system files and other hidden files
          if (fileName === '.DS_Store' || fileName.startsWith('.') || fileName === 'Thumbs.db') {
            return;
          }
          
          files.push({
            name: fileName,
            path: object.Key,
            type: 'file',
            size: object.Size,
            lastModified: object.LastModified,
            etag: object.ETag
          });
        });
      }

      return {
        folders: folders.sort((a, b) => a.name.localeCompare(b.name)),
        files: files.sort((a, b) => a.name.localeCompare(b.name)),
        currentPath: prefix,
        parentPath: prefix.split('/').slice(0, -1).join('/') || ''
      };
    } catch (error) {
      console.error('S3 list objects error:', error);
      throw new Error('Failed to list S3 objects');
    }
  }

  // Get file details
  async getFileDetails(key) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key
      };

      const data = await s3.headObject(params).promise();
      
      return {
        name: key.split('/').pop(),
        path: key,
        type: 'file',
        size: data.ContentLength,
        lastModified: data.LastModified,
        contentType: data.ContentType,
        etag: data.ETag
      };
    } catch (error) {
      console.error('S3 get file details error:', error);
      throw new Error('Failed to get file details');
    }
  }

  // Generate presigned URL for download
  async generateDownloadUrl(key, expiresIn = 3600) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
        Expires: expiresIn
      };

      const url = await s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      console.error('S3 generate download URL error:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  // Check if object exists
  async objectExists(key) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key
      };

      await s3.headObject(params).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  // Get bucket information
  async getBucketInfo() {
    try {
      const params = {
        Bucket: bucketName
      };

      const data = await s3.headBucket(params).promise();
      return {
        name: bucketName,
        region: process.env.AWS_REGION,
        accessible: true
      };
    } catch (error) {
      console.error('S3 bucket info error:', error);
      return {
        name: bucketName,
        region: process.env.AWS_REGION,
        accessible: false,
        error: error.message
      };
    }
  }

  // Search files by name pattern
  async searchFiles(searchTerm, prefix = '') {
    try {
      const params = {
        Bucket: bucketName,
        Prefix: prefix
      };

      const data = await s3.listObjectsV2(params).promise();
      
      if (!data.Contents) return [];

      const searchResults = data.Contents
        .filter(object => {
          const fileName = object.Key.split('/').pop();
          
          // Skip macOS system files and other hidden files
          if (fileName === '.DS_Store' || fileName.startsWith('.') || fileName === 'Thumbs.db') {
            return false;
          }
          
          return fileName.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .map(object => ({
          name: object.Key.split('/').pop(),
          path: object.Key,
          type: 'file',
          size: object.Size,
          lastModified: object.LastModified,
          etag: object.ETag
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return searchResults;
    } catch (error) {
      console.error('S3 search files error:', error);
      throw new Error('Failed to search files');
    }
  }
}

module.exports = new S3Service(); 