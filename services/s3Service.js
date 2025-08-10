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

  // Read file contents
  async readFileContents(key) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key
      };

      const data = await s3.getObject(params).promise();
      
      // Determine content type and encoding
      let content = '';
      const contentType = data.ContentType || this.getContentTypeFromKey(key);
      
      if (this.isTextFile(contentType, key)) {
        // For text files, try to detect encoding and convert to string
        try {
          content = data.Body.toString('utf-8');
        } catch (encodingError) {
          // Fallback to other encodings if UTF-8 fails
          try {
            content = data.Body.toString('latin1');
          } catch (fallbackError) {
            content = data.Body.toString('base64');
          }
        }
      } else {
        // For binary files, return base64 encoded content
        content = data.Body.toString('base64');
      }
      
      return {
        content,
        contentType,
        size: data.ContentLength,
        lastModified: data.LastModified,
        isBinary: !this.isTextFile(contentType, key)
      };
    } catch (error) {
      console.error('S3 read file contents error:', error);
      throw new Error('Failed to read file contents');
    }
  }

  // Helper method to determine if file is text-based
  isTextFile(contentType, key) {
    const textExtensions = [
      '.txt', '.md', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json',
      '.xml', '.csv', '.log', '.ini', '.conf', '.cfg', '.yml', '.yaml', '.sql',
      '.py', '.java', '.cpp', '.c', '.h', '.php', '.rb', '.go', '.rs', '.swift',
      '.sh', '.bash', '.zsh', '.fish', '.bat', '.cmd', '.ps1'
    ];
    
    const textMimeTypes = [
      'text/', 'application/json', 'application/xml', 'application/javascript',
      'application/x-python', 'application/x-java-source', 'application/x-csrc'
    ];
    
    // Special handling for PDFs and documents - they're not text but can be viewed
    const viewableExtensions = [
      '.pdf', '.doc', '.docx', '.rtf'
    ];
    
    const extension = key.toLowerCase().substring(key.lastIndexOf('.'));
    if (viewableExtensions.includes(extension)) {
      return false; // These are not text files but are viewable
    }
    
    // Check MIME type first
    if (contentType) {
      for (const mimeType of textMimeTypes) {
        if (contentType.startsWith(mimeType)) {
          return true;
        }
      }
    }
    
    // Fallback to file extension
    return textExtensions.includes(extension);
  }

  // Helper method to get content type from file extension
  getContentTypeFromKey(key) {
    const extension = key.toLowerCase().substring(key.lastIndexOf('.'));
    const mimeTypes = {
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.js': 'application/javascript',
      '.jsx': 'application/javascript',
      '.ts': 'application/typescript',
      '.tsx': 'application/typescript',
      '.html': 'text/html',
      '.css': 'text/css',
      '.scss': 'text/x-scss',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.csv': 'text/csv',
      '.log': 'text/plain',
      '.ini': 'text/plain',
      '.conf': 'text/plain',
      '.cfg': 'text/plain',
      '.yml': 'text/yaml',
      '.yaml': 'text/yaml',
      '.sql': 'application/sql',
      '.py': 'text/x-python',
      '.java': 'text/x-java-source',
      '.cpp': 'text/x-c++src',
      '.c': 'text/x-csrc',
      '.h': 'text/x-chdr',
      '.php': 'application/x-php',
      '.rb': 'text/x-ruby',
      '.go': 'text/x-go',
      '.rs': 'text/x-rust',
      '.swift': 'text/x-swift',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.rtf': 'application/rtf'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
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