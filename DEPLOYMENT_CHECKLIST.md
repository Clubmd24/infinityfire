# ✅ Heroku Deployment Checklist

Use this checklist to ensure a successful deployment of InfinityFire to Heroku.

## 🔧 Pre-Deployment Setup

### 1. Prerequisites
- [ ] Heroku CLI installed and logged in
- [ ] Git repository initialized and committed
- [ ] Node.js 18.x installed locally
- [ ] AWS S3 bucket configured

### 2. Local Testing
- [ ] Run `npm run verify-deployment` (checks configuration)
- [ ] Run `npm run build` (tests client build)
- [ ] Run `npm start` (tests server locally)
- [ ] Test all major functionality locally

### 3. Environment Variables
- [ ] JWT_SECRET (will be auto-generated)
- [ ] JWT_REFRESH_SECRET (will be auto-generated)
- [ ] AWS_ACCESS_KEY_ID
- [ ] AWS_SECRET_ACCESS_KEY
- [ ] AWS_REGION
- [ ] AWS_S3_BUCKET

## 🚀 Deployment Steps

### 1. Create Heroku App
```bash
# Run the deployment script
./deploy-heroku.sh

# Or manually:
heroku create your-app-name
```

### 2. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:mini
```

### 3. Set Environment Variables
```bash
# JWT secrets (auto-generated)
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# App configuration
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set APP_URL=https://your-app-name.herokuapp.com

# AWS S3 credentials (set these manually)
heroku config:set AWS_ACCESS_KEY_ID=your_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_secret
heroku config:set AWS_REGION=your_region
heroku config:set AWS_S3_BUCKET=your_bucket
```

### 4. Deploy Application
```bash
git push heroku main
```

### 5. Setup Database
```bash
heroku run npm run db:setup
```

### 6. Verify Deployment
```bash
heroku open
heroku logs --tail
```

## 🔍 Post-Deployment Verification

### 1. Check Application Status
- [ ] App loads without errors
- [ ] Database connection successful
- [ ] S3 integration working
- [ ] Authentication system functional

### 2. Test Core Features
- [ ] User registration/login
- [ ] File upload/download
- [ ] Admin panel access
- [ ] User management

### 3. Monitor Performance
- [ ] Check response times
- [ ] Monitor error rates
- [ ] Verify database performance
- [ ] Check S3 operations

## 🚨 Common Issues & Solutions

### Build Failures
- **Issue**: Build timeout or dependency errors
- **Solution**: Check Node.js version, clear build cache

### Database Connection
- **Issue**: Connection refused or dialect errors
- **Solution**: Verify PostgreSQL addon, check DATABASE_URL

### CORS Errors
- **Issue**: Origin not allowed
- **Solution**: Update APP_URL environment variable

### App Crashes
- **Issue**: H10 error or application error
- **Solution**: Check logs, verify environment variables

## 📊 Monitoring Commands

```bash
# View real-time logs
heroku logs --tail

# Check app status
heroku ps

# View configuration
heroku config

# Check database status
heroku pg:info

# Monitor addons
heroku addons
```

## 🔄 Rollback Plan

If deployment fails:
1. Check logs: `heroku logs --tail`
2. Rollback to previous version: `heroku rollback vXX`
3. Restart app: `heroku restart`
4. Verify functionality

## 📞 Support Resources

- **Heroku Documentation**: https://devcenter.heroku.com/
- **Troubleshooting Guide**: HEROKU_TROUBLESHOOTING.md
- **Verification Script**: `npm run verify-deployment`
- **Heroku Status**: https://status.heroku.com/

---

**🎯 Success Criteria**: App loads successfully, all features work, database connected, S3 integration functional.

**⏱️ Estimated Time**: 15-30 minutes for initial deployment, 5-10 minutes for subsequent updates. 