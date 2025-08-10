# 🚀 InfinityFire Deployment Guide

This guide covers deploying your InfinityFire file access application to various platforms.

## 📋 Prerequisites

- Node.js 16+ installed
- PostgreSQL database (local or cloud)
- AWS S3 bucket configured
- Git repository set up

## 🏠 Local Development Deployment

### 1. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/infinityfire
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_db_password

# AWS S3
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Setup database
npm run db:setup

# (Optional) Seed with sample data
npm run db:seed
```

### 3. Start Application

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd client && npm start
```

**Access URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## ☁️ Cloud Deployment

### Option 1: Heroku

#### 1. Heroku Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini
```

#### 2. Environment Variables
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set JWT_REFRESH_SECRET=your_production_refresh_secret
heroku config:set AWS_ACCESS_KEY=your_aws_access_key
heroku config:set AWS_SECRET_KEY=your_aws_secret_key
heroku config:set AWS_REGION=your_aws_region
heroku config:set S3_BUCKET_NAME=your_s3_bucket_name
```

#### 3. Deploy
```bash
# Deploy to Heroku
git push heroku main

# Run database migrations
heroku run npm run db:migrate

# Open app
heroku open
```

### Option 2: Railway

#### 1. Railway Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to existing project
railway link
```

#### 2. Environment Variables
Set in Railway dashboard:
- `NODE_ENV=production`
- `JWT_SECRET=your_production_jwt_secret`
- `JWT_REFRESH_SECRET=your_production_refresh_secret`
- `AWS_ACCESS_KEY=your_aws_access_key`
- `AWS_SECRET_KEY=your_aws_secret_key`
- `AWS_REGION=your_aws_region`
- `S3_BUCKET_NAME=your_s3_bucket_name`

#### 3. Deploy
```bash
# Deploy
railway up

# Run migrations
railway run npm run db:migrate
```

### Option 3: DigitalOcean App Platform

#### 1. App Platform Setup
1. Go to DigitalOcean App Platform
2. Create new app from GitHub repository
3. Select Node.js as runtime
4. Configure build settings

#### 2. Environment Variables
Set in App Platform dashboard:
- All required environment variables from `.env`

#### 3. Deploy
- App Platform automatically deploys on git push
- Run migrations manually via console

### Option 4: AWS EC2

#### 1. EC2 Instance Setup
```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2
sudo npm install -g pm2
```

#### 2. Application Setup
```bash
# Clone repository
git clone your-repo-url
cd infinityfire

# Install dependencies
npm install
cd client && npm install && npm run build
cd ..

# Create .env file
nano .env
```

#### 3. Database Setup
```bash
# Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE infinityfire;
CREATE USER infinityfire_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE infinityfire TO infinityfire_user;
\q

# Run database setup
npm run db:setup
```

#### 4. Deploy with PM2
```bash
# Start application
pm2 start server.js --name "infinityfire"

# Save PM2 configuration
pm2 save
pm2 startup

# Setup Nginx reverse proxy (optional)
sudo apt install nginx -y
```

## 🔒 Production Security Checklist

### Environment Variables
- [ ] All sensitive data moved to environment variables
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] AWS credentials have minimal required permissions

### Database Security
- [ ] Database is not publicly accessible
- [ ] Strong passwords used
- [ ] Regular backups configured
- [ ] Connection encryption enabled

### Application Security
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Helmet.js security headers enabled

### S3 Security
- [ ] Bucket is not publicly accessible
- [ ] IAM user has minimal required permissions
- [ ] CORS configured for your domain only
- [ ] Bucket policy restricts access

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application status
curl https://your-domain.com/api/health

# Check database connection
npm run db:migrate
```

### Logs
```bash
# Heroku logs
heroku logs --tail

# Railway logs
railway logs

# PM2 logs
pm2 logs infinityfire
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install
cd client && npm install && npm run build
cd ..

# Restart application
# Heroku: git push heroku main
# Railway: railway up
# PM2: pm2 restart infinityfire
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed
- Check database credentials in `.env`
- Verify database is running and accessible
- Check firewall settings

#### S3 Access Denied
- Verify AWS credentials
- Check IAM user permissions
- Verify S3 bucket name and region

#### Build Failures
- Check Node.js version (16+ required)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

#### Port Already in Use
- Change PORT in `.env`
- Kill process using the port: `lsof -ti:5000 | xargs kill -9`

### Getting Help
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Check S3 bucket permissions
5. Review error messages in browser console

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Railway Documentation](https://docs.railway.app/)

---

**Happy Deploying! 🚀** 