# Admin Features Documentation

## Overview
This document describes the new admin features added to the InfinityFire application, including user management and activity logging.

## Features

### 1. User Management
- **Add New Users**: Admins can create new user accounts with the following fields:
  - Username (required, unique)
  - Email (required, unique)
  - Password (required, minimum 6 characters)
  - First Name (optional)
  - Last Name (optional)
  - Role (user or admin)
  - Account Status (active/inactive)

- **User Operations**:
  - View all users
  - Activate/deactivate users
  - Delete users (cannot delete own account)
  - View user details and last login

### 2. Activity Logging
- **Tracked Activities**:
  - User login/logout
  - File downloads
  - File uploads (when implemented)
  - File deletions (when implemented)

- **Log Information**:
  - User ID and details
  - Activity type and description
  - IP address
  - User agent (browser/device info)
  - Timestamp
  - Additional metadata

### 3. Admin Dashboard
- **Overview Tab**: System statistics and quick actions
- **User Management Tab**: Add, edit, and manage users
- **System Status Tab**: System information and S3 bucket status
- **Activity Log Tab**: View and analyze user activities

## API Endpoints

### User Management
- `POST /api/users` - Create new user (admin only)
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Activity Log
- `GET /api/admin/activity-log` - Get activity log (admin only)
- `GET /api/admin/activity-stats` - Get activity statistics (admin only)
- `GET /api/admin/user-activity/:userId` - Get user activity summary (admin only)

### Authentication
- `POST /api/auth/login` - User login (logs activity)
- `POST /api/auth/logout` - User logout (logs activity)

## Database Schema

### ActivityLog Table
```sql
CREATE TABLE ActivityLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  activityType ENUM('login', 'logout', 'file_download', 'file_upload', 'file_delete') NOT NULL,
  description VARCHAR(500),
  ipAddress VARCHAR(45),
  userAgent TEXT,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_activityType (activityType),
  INDEX idx_createdAt (createdAt)
);
```

## Security Features
- All admin endpoints require admin authentication
- User passwords are hashed using bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection

## Usage Examples

### Creating a New User
```javascript
const newUser = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  isActive: true
};

const response = await axios.post('/api/users', newUser);
```

### Viewing Activity Log
```javascript
const activityLog = await axios.get('/api/admin/activity-log', {
  params: {
    page: 1,
    limit: 50,
    activityType: 'login',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
});
```

## Setup Instructions

1. **Database Migration**:
   ```bash
   node scripts/create-activity-log-table.js
   ```

2. **Restart Server**: The server needs to be restarted to load the new routes and models.

3. **Verify Admin Access**: Ensure you have an admin user account to access these features.

## Notes
- Activity logging is automatic and requires no user intervention
- All activities are logged with IP address and user agent for security purposes
- The activity log can be filtered by user, activity type, and date range
- File download activities include file path and size information
- The system automatically prevents admins from deleting their own accounts 