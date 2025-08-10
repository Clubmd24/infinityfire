# File View Feature

## Overview
The File View feature allows users to view file contents directly in the browser without downloading them. This feature is integrated with the admin activity logging system to track all file view activities.

## Features

### 🔍 File Content Viewing
- **Text Files**: View contents of text-based files (code, documents, logs, etc.)
- **Binary Files**: Get information about binary files with option to download
- **Size Limits**: Files larger than 5MB cannot be viewed (download only)
- **File Type Support**: Supports common text file extensions

### 📊 Activity Logging
- All file view activities are automatically logged
- Logs include user ID, file path, file size, content type, and timestamp
- Activity type: `file_view`
- Accessible through the admin panel

### 🎯 Supported File Types
The following file extensions are supported for viewing:
- **Code Files**: `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.cpp`, `.c`, `.h`, `.php`, `.rb`, `.go`, `.rs`, `.swift`
- **Web Files**: `.html`, `.css`, `.scss`, `.xml`, `.json`
- **Documentation**: `.txt`, `.md`, `.yml`, `.yaml`
- **Data Files**: `.csv`, `.sql`, `.log`
- **Configuration**: `.ini`, `.conf`, `.cfg`
- **Scripts**: `.sh`, `.bash`, `.zsh`, `.fish`, `.bat`, `.cmd`, `.ps1`

## Usage

### For Users
1. Navigate to the File Explorer
2. Locate a viewable file (indicated by an enabled "View" button)
3. Click the "View" button to open the file viewer modal
4. View file contents in the modal
5. Use the "Download" button if you need to save the file

### For Administrators
1. Access the Admin Panel
2. Navigate to Activity Logs
3. Filter by activity type `file_view` to see all file view activities
4. Monitor user file access patterns

## Technical Implementation

### Backend Changes
- **New Endpoint**: `GET /api/files/view?path=<file_path>`
- **S3 Service**: Enhanced with `readFileContents()` method
- **Content Type Detection**: Automatic MIME type detection
- **Encoding Support**: UTF-8 with fallback to Latin-1 and Base64
- **Binary File Handling**: Base64 encoding for non-text files

### Frontend Changes
- **View Button**: Added to file listings for viewable files
- **Modal Interface**: Full-screen modal for file content display
- **File Info Display**: Shows file metadata (size, type, last modified)
- **Responsive Design**: Works on all screen sizes

### Database Changes
- **ActivityLog Model**: Added `file_view` to activity type enum
- **Migration Script**: `scripts/update-activity-log-enum.js`

## Security Features

### Access Control
- Requires user authentication
- Respects existing file permissions
- No unauthorized file access

### Content Validation
- File size limits (5MB max for viewing)
- Content type validation
- Safe encoding handling

### Activity Monitoring
- Complete audit trail of file views
- IP address and user agent logging
- Timestamp and metadata tracking

## Configuration

### File Size Limits
```javascript
const maxViewableSize = 5 * 1024 * 1024; // 5MB
```

### Supported Extensions
```javascript
const viewableExtensions = [
  '.txt', '.md', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json',
  '.xml', '.csv', '.log', '.ini', '.conf', '.cfg', '.yml', '.yaml', '.sql',
  '.py', '.java', '.cpp', '.c', '.h', '.php', '.rb', '.go', '.rs', '.swift',
  '.sh', '.bash', '.zsh', '.fish', '.bat', '.cmd', '.ps1'
];
```

## Testing

### Manual Testing
1. Upload a text file to your S3 bucket
2. Navigate to File Explorer
3. Click the "View" button on the file
4. Verify content displays correctly
5. Check admin panel for activity log entry

### Automated Testing
```bash
# Run the test script
node scripts/test-file-view.js

# Run database migration
node scripts/update-activity-log-enum.js
```

## Troubleshooting

### Common Issues

#### File Not Viewable
- Check file extension is in supported list
- Verify file size is under 5MB
- Ensure file exists in S3 bucket

#### Content Not Displaying
- Check file encoding (UTF-8 recommended)
- Verify file is not corrupted
- Check browser console for errors

#### Activity Not Logged
- Verify database migration completed
- Check ActivityLog model configuration
- Ensure user authentication is working

### Error Messages
- `"File not found"`: File path is incorrect or file doesn't exist
- `"Failed to read file contents"`: S3 access issue or file corruption
- `"File too large to view"`: File exceeds 5MB limit

## Future Enhancements

### Planned Features
- **Syntax Highlighting**: Code file syntax highlighting
- **File Editing**: In-place file editing capabilities
- **Version History**: File version comparison
- **Collaborative Viewing**: Real-time shared file viewing
- **Advanced Search**: Full-text content search

### Performance Improvements
- **Content Caching**: Redis-based content caching
- **Lazy Loading**: Progressive content loading for large files
- **Compression**: Gzip compression for text content

## API Reference

### View File Endpoint
```http
GET /api/files/view?path=<file_path>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "filename.txt",
    "path": "path/to/file.txt",
    "content": "file contents...",
    "contentType": "text/plain",
    "size": 1024,
    "lastModified": "2024-01-01T00:00:00.000Z",
    "isBinary": false
  }
}
```

### Activity Log Entry
```json
{
  "id": 123,
  "userId": 456,
  "activityType": "file_view",
  "description": "User viewed file: path/to/file.txt",
  "metadata": {
    "filePath": "path/to/file.txt",
    "fileSize": 1024,
    "contentType": "text/plain",
    "action": "view",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "endpoint": "/api/files/view?path=path/to/file.txt",
    "method": "GET"
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Support

For technical support or feature requests related to the File View functionality, please:
1. Check this documentation
2. Review the activity logs for error patterns
3. Contact the development team with specific error details 