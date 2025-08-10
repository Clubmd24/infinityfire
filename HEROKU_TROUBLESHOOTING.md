# 🚨 Heroku Deployment Troubleshooting Guide

This guide addresses common deployment errors and their solutions for the InfinityFire application.

## 🔍 Common Error: Build Failures

### Error: "Build failed" or "Build timeout"

**Symptoms:**
- Build process fails during `npm install` or `npm run build`
- Timeout errors during build

**Solutions:**
1. **Check Node.js version compatibility:**
   ```bash
   # Ensure you have Node.js 18.x specified in package.json
   heroku config:set NODE_JS_VERSION=18.x
   ```

2. **Clear build cache:**
   ```bash
   heroku plugins:install heroku-builds
   heroku builds:cache:purge -a your-app-name
   ```

3. **Check package.json scripts:**
   - Ensure `heroku-postbuild` script exists
   - Verify all dependencies are in `dependencies` (not `devDependencies`)

### Error: "Module not found" or "Cannot resolve module"

**Solutions:**
1. **Move dev dependencies to regular dependencies if needed for build:**
   ```json
   {
     "dependencies": {
       "tailwindcss": "^3.3.0",
       "autoprefixer": "^10.4.16",
       "postcss": "^8.4.31"
     }
   }
   ```

2. **Check for missing peer dependencies**

## 🗄️ Common Error: Database Connection Issues

### Error: "Connection refused" or "Database connection failed"

**Symptoms:**
- App crashes on startup
- Database connection errors in logs

**Solutions:**
1. **Verify PostgreSQL addon:**
   ```bash
   heroku addons --app your-app-name
   heroku config | grep DATABASE_URL
   ```

2. **Check database status:**
   ```bash
   heroku pg:info --app your-app-name
   heroku pg:psql --app your-app-name
   ```

3. **Reset database if needed:**
   ```bash
   heroku pg:reset --app your-app-name
   heroku run npm run db:setup --app your-app-name
   ```

### Error: "Dialect not supported" or "Unknown dialect"

**Solutions:**
1. **Ensure database.js properly detects PostgreSQL:**
   - Check that `DATABASE_URL` contains `postgres://` or `postgresql://`
   - Verify SSL configuration for production

2. **Force database sync if needed:**
   ```bash
   heroku config:set SYNC_DATABASE=true --app your-app-name
   heroku restart --app your-app-name
   ```

## 🌐 Common Error: CORS Issues

### Error: "CORS policy" or "Origin not allowed"

**Solutions:**
1. **Update CORS configuration:**
   ```bash
   heroku config:set APP_URL=https://your-app-name.herokuapp.com
   ```

2. **Check allowed origins in server.js:**
   - Ensure your Heroku app URL is in the CORS origins array
   - Restart app after config changes

## 🔑 Common Error: Environment Variable Issues

### Error: "JWT_SECRET is not defined" or missing env vars

**Solutions:**
1. **Set all required environment variables:**
   ```bash
   heroku config:set JWT_SECRET=$(openssl rand -base64 32)
   heroku config:set JWT_REFRESH_SECRET=$(openssl rand -base64 32)
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   ```

2. **Verify AWS credentials:**
   ```bash
   heroku config:set AWS_ACCESS_KEY_ID=your_key
   heroku config:set AWS_SECRET_ACCESS_KEY=your_secret
   heroku config:set AWS_REGION=your_region
   heroku config:set AWS_S3_BUCKET=your_bucket
   ```

## 🚀 Common Error: App Crashes on Startup

### Error: "Application error" or "H10 - App crashed"

**Solutions:**
1. **Check application logs:**
   ```bash
   heroku logs --tail --app your-app-name
   ```

2. **Common crash causes:**
   - Missing environment variables
   - Database connection failures
   - Port binding issues
   - Missing dependencies

3. **Restart the application:**
   ```bash
   heroku restart --app your-app-name
   ```

## 📱 Common Error: Buildpack Issues

### Error: "Buildpack failed" or "No buildpack specified"

**Solutions:**
1. **Set Node.js buildpack:**
   ```bash
   heroku buildpacks:set heroku/nodejs --app your-app-name
   ```

2. **Clear and reset buildpacks:**
   ```bash
   heroku buildpacks:clear --app your-app-name
   heroku buildpacks:set heroku/nodejs --app your-app-name
   ```

## 🔧 Quick Fix Commands

### Reset Everything and Start Fresh
```bash
# Remove and recreate the app
heroku apps:destroy your-app-name --confirm your-app-name

# Create new app
heroku create your-new-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini --app your-new-app-name

# Set environment variables
heroku config:set NODE_ENV=production --app your-new-app-name
heroku config:set PORT=5000 --app your-new-app-name

# Deploy
git push heroku main

# Setup database
heroku run npm run db:setup --app your-new-app-name
```

### Debug Deployment Issues
```bash
# View real-time logs
heroku logs --tail --app your-app-name

# Check app status
heroku ps --app your-app-name

# View all configuration
heroku config --app your-app-name

# Test database connection
heroku run node -e "console.log(process.env.DATABASE_URL)" --app your-app-name
```

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are in `dependencies` (not `devDependencies`)
- [ ] `heroku-postbuild` script exists in root package.json
- [ ] Node.js version is specified in both package.json files
- [ ] Database configuration supports both MySQL and PostgreSQL
- [ ] CORS configuration includes your Heroku app URL
- [ ] All environment variables are set
- [ ] AWS S3 credentials are configured
- [ ] PostgreSQL addon is provisioned

## 🆘 Still Having Issues?

1. **Check Heroku status page:** https://status.heroku.com/
2. **Review Heroku documentation:** https://devcenter.heroku.com/
3. **Check application logs:** `heroku logs --tail --app your-app-name`
4. **Verify build logs:** Check the "Activity" tab in Heroku dashboard
5. **Test locally:** Ensure the app runs locally with `npm start`

## 🔄 Rollback Strategy

If deployment fails, you can rollback:

```bash
# List recent releases
heroku releases --app your-app-name

# Rollback to previous version
heroku rollback vXX --app your-app-name

# Or rollback to specific version
heroku rollback v42 --app your-app-name
```

---

**💡 Pro Tip:** Always test your deployment in a staging environment first before deploying to production! 