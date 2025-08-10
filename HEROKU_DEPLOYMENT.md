# 🚀 Heroku Deployment Guide for InfinityFire

This guide will walk you through deploying your InfinityFire application to Heroku step by step.

## 📋 Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) 16+ installed
- AWS S3 bucket configured
- PostgreSQL database (will be provisioned by Heroku)

## 🔧 Step 1: Install Heroku CLI

### macOS (using Homebrew)
```bash
brew tap heroku/brew && brew install heroku
```

### Windows
Download and install from: https://devcenter.heroku.com/articles/heroku-cli

### Linux
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

## 🔐 Step 2: Login to Heroku

```bash
heroku login
```

This will open your browser to authenticate with Heroku.

## 🆕 Step 3: Create Heroku App

```bash
# Create a new Heroku app
heroku create your-app-name

# Or let Heroku generate a name
heroku create
```

**Note**: Replace `your-app-name` with your desired app name. App names must be unique across all of Heroku.

## 🗄️ Step 4: Add PostgreSQL Database

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Verify the database was created
heroku config | grep DATABASE_URL
```

## 🔑 Step 5: Configure Environment Variables

```bash
# Set JWT secrets (Heroku will generate these automatically)
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Set AWS S3 credentials
heroku config:set AWS_ACCESS_KEY_ID=your_aws_access_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_aws_secret_key
heroku config:set AWS_REGION=your_aws_region
heroku config:set AWS_S3_BUCKET=your_s3_bucket_name

# Set other environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
```

**Important**: Replace the AWS credentials with your actual values.

## 🚀 Step 6: Deploy to Heroku

### Option A: Deploy from GitHub (Recommended)

1. **Connect to GitHub**:
   ```bash
   heroku git:remote -a your-app-name
   ```

2. **Enable GitHub integration**:
   - Go to your Heroku dashboard
   - Select your app
   - Go to "Deploy" tab
   - Connect to your GitHub repository
   - Enable automatic deploys from main branch

### Option B: Deploy from local repository

```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Push to Heroku
git push heroku main
```

## 🗃️ Step 7: Setup Database

```bash
# Run database setup
heroku run npm run db:setup
```

This will create the necessary tables and admin user.

## 🌐 Step 8: Open Your App

```bash
# Open the app in your browser
heroku open
```

## 📊 Step 9: Monitor Your App

```bash
# View logs
heroku logs --tail

# Check app status
heroku ps

# View configuration
heroku config
```

## 🔧 Step 10: Custom Domain (Optional)

```bash
# Add custom domain
heroku domains:add yourdomain.com

# Configure DNS records as instructed by Heroku
```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures
```bash
# Check build logs
heroku logs --tail

# Common causes:
# - Missing dependencies in package.json
# - Build script errors
# - Node.js version incompatibility
```

#### 2. Database Connection Issues
```bash
# Verify database URL
heroku config | grep DATABASE_URL

# Test database connection
heroku run node -e "console.log(process.env.DATABASE_URL)"
```

#### 3. Environment Variable Issues
```bash
# List all config vars
heroku config

# Set missing variables
heroku config:set VARIABLE_NAME=value
```

#### 4. App Crashes
```bash
# Check app status
heroku ps

# View recent logs
heroku logs --tail

# Restart the app
heroku restart
```

## 📱 Heroku CLI Commands Reference

```bash
# App management
heroku apps                    # List your apps
heroku create                  # Create new app
heroku destroy app-name        # Delete app
heroku rename old-name new-name # Rename app

# Configuration
heroku config                  # View all config vars
heroku config:set KEY=value   # Set config var
heroku config:unset KEY       # Remove config var

# Logs and monitoring
heroku logs --tail            # Stream logs
heroku logs --num 200         # View last 200 lines
heroku ps                     # Check app status

# Database
heroku pg:info                # Database info
heroku pg:psql                # Connect to database
heroku pg:reset               # Reset database

# Addons
heroku addons                  # List addons
heroku addons:create plan     # Create addon
heroku addons:destroy addon   # Remove addon

# Maintenance
heroku maintenance:on         # Enable maintenance mode
heroku maintenance:off        # Disable maintenance mode
heroku restart                # Restart app
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Database Access**: Use Heroku's managed PostgreSQL service
3. **SSL**: Heroku provides SSL certificates automatically
4. **Rate Limiting**: Your app includes rate limiting for security
5. **Input Validation**: All user inputs are validated and sanitized

## 💰 Cost Optimization

- **PostgreSQL Mini**: $5/month (suitable for development)
- **PostgreSQL Basic**: $9/month (suitable for production)
- **Dyno Types**: 
  - Eco: $5/month (sleeps after 30 min of inactivity)
  - Basic: $7/month (always running)
  - Standard: $25/month (better performance)

## 📈 Scaling

```bash
# Scale horizontally
heroku ps:scale web=2

# Scale vertically
heroku ps:type standard-1x

# Enable auto-scaling
heroku ps:autoscale:enable
```

## 🔄 Continuous Deployment

1. **Enable GitHub integration** in Heroku dashboard
2. **Set up automatic deploys** from main branch
3. **Configure review apps** for pull requests
4. **Set up staging environment** for testing

## 📞 Support

- **Heroku Documentation**: https://devcenter.heroku.com/
- **Heroku Support**: https://help.heroku.com/
- **Community**: https://stackoverflow.com/questions/tagged/heroku

## 🎯 Next Steps After Deployment

1. **Test all functionality** on the live app
2. **Monitor performance** using Heroku metrics
3. **Set up alerts** for errors and performance issues
4. **Configure backup strategies** for your database
5. **Set up monitoring** with tools like New Relic or DataDog

---

**🎉 Congratulations! Your InfinityFire app is now live on Heroku!**

Your app will be available at: `https://your-app-name.herokuapp.com` 