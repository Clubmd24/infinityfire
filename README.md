# 🔥 InfinityFire - Secure File Access Platform

A modern, secure file access and management website that allows users to browse, search, and download files from an S3 bucket. Built with a sleek dark theme and comprehensive user management.

## ✨ Features

- 🔐 **Secure Authentication** - User registration, login, and JWT-based sessions
- 📁 **File Management** - Browse S3 bucket structure, navigate folders, search files
- ⬇️ **File Downloads** - Secure file downloads with presigned URLs
- 👥 **User Management** - Role-based access control and user profiles
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔍 **Advanced Search** - Search files by name, type, and content
- 📊 **Admin Panel** - User management and system monitoring
- 🚀 **Performance** - Optimized for speed with lazy loading

## 🏗️ Architecture

- **Backend**: Node.js + Express + PostgreSQL + Sequelize
- **Frontend**: React + Tailwind CSS + Context API
- **Storage**: AWS S3 for file storage
- **Authentication**: JWT tokens with refresh mechanism
- **Database**: PostgreSQL with user management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database
- AWS S3 bucket with appropriate permissions

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd infinityfire
```

### 2. Environment Configuration
```bash
cp env.example .env
# Edit .env with your actual credentials
```

### 3. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 4. Database Setup
```bash
# Create database and run migrations
npm run db:setup
```

### 5. Start Development
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
infinityfire/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── App.js         # Main app component
│   └── package.json
├── config/                 # Configuration files
├── middleware/             # Express middleware
├── models/                 # Database models
├── routes/                 # API routes
├── services/               # Business logic services
├── server.js              # Express server
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

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
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Setup

1. Create a PostgreSQL database
2. Update the `.env` file with your database credentials
3. Run database setup:
   ```bash
   npm run db:setup
   ```

### S3 Bucket Configuration

1. Create an S3 bucket
2. Configure CORS for your domain
3. Set up IAM user with appropriate S3 permissions
4. Update the `.env` file with your AWS credentials

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the theme by editing:
- `client/tailwind.config.js` - Tailwind configuration
- `client/src/index.css` - Global styles

### Components
All React components are modular and can be easily customized:
- `client/src/components/layout/` - Layout components
- `client/src/components/files/` - File management components
- `client/src/components/auth/` - Authentication components

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure file download URLs
- Role-based access control
- CORS protection

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Files
- `GET /api/files/list` - List files and folders
- `GET /api/files/download/:key` - Get download URL
- `GET /api/files/search` - Search files

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List users (admin only)

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

### Environment Variables
Ensure all production environment variables are set:
- Database connection string
- AWS credentials
- JWT secrets
- Rate limiting configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the setup guide in `SETUP.md`
2. Review the logs for error messages
3. Ensure all environment variables are correctly set
4. Verify database and S3 bucket connectivity

## 🎯 Roadmap

- [ ] File upload functionality
- [ ] File sharing and collaboration
- [ ] Advanced file preview
- [ ] Mobile app
- [ ] API rate limiting dashboard
- [ ] Multi-tenant support

---

**Built with ❤️ using modern web technologies**