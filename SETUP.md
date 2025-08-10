# InfinityFire Setup Guide

## Overview
InfinityFire is a secure file access and management website that allows users to browse, search, and download files from an S3 bucket. The application features user authentication, role-based access control, and a modern dark-themed UI.

## Prerequisites
- Node.js 16+ and npm
- PostgreSQL database
- AWS S3 bucket with appropriate permissions
- AWS credentials with S3 access

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/infinityfire
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_db_password

# AWS S3 Configuration
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Installation Steps

### 1. Install Backend Dependencies
```bash
npm install
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb infinityfire

# The database will be automatically synced when you start the server
# (in development mode)
```

### 4. Start the Application

#### Development Mode (Recommended for setup)
```bash
# Terminal 1 - Start backend
npm run dev

# Terminal 2 - Start frontend
cd client
npm start
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Features

### ✅ Authentication System
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (user/admin)

### ✅ File Management
- Browse S3 bucket folder structure
- Navigate through directories
- Search files by name
- Download files with presigned URLs
- Maintain original file names and structure

### ✅ User Management
- User profiles with editable information
- Password change functionality
- Admin user management panel
- User activation/deactivation

### ✅ Security Features
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers
- JWT token expiration

### ✅ Modern UI/UX
- Dark theme with smooth animations
- Responsive design for all devices
- Intuitive file navigation
- Loading states and error handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Files
- `GET /api/files/list` - List files and folders
- `GET /api/files/details` - Get file details
- `GET /api/files/download` - Generate download URL
- `GET /api/files/search` - Search files
- `GET /api/files/bucket-info` - Get bucket information

### Users (Admin Only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - User statistics

## Database Schema

### Users Table
- `id` - UUID primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `firstName` - First name (optional)
- `lastName` - Last name (optional)
- `isActive` - Account status
- `lastLogin` - Last login timestamp
- `role` - User role (user/admin)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

## S3 Integration

The application integrates with AWS S3 to:
- List bucket contents with folder structure
- Navigate through directories
- Generate secure download URLs
- Maintain original file organization
- Support large file downloads

## Security Considerations

- All API endpoints (except auth) require valid JWT tokens
- Passwords are hashed using bcrypt with salt rounds of 12
- Rate limiting prevents abuse
- Input validation on all endpoints
- CORS configured for security
- Helmet.js provides additional security headers

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **S3 Access Denied**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Ensure bucket name is correct

3. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on the port

### Logs
- Backend logs are displayed in the terminal
- Check browser console for frontend errors
- Database queries are logged in development mode

## Deployment

### Heroku
```bash
# The package.json includes Heroku build scripts
# Just push to Heroku and it will build automatically
git push heroku main
```

### Docker
```bash
# Build and run with Docker
docker build -t infinityfire .
docker run -p 5000:5000 infinityfire
```

### Environment Variables
Remember to set all environment variables in your production environment.

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure all prerequisites are met
4. Check the API endpoints with a tool like Postman

## License

MIT License - see LICENSE file for details. 