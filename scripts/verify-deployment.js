#!/usr/bin/env node

/**
 * Deployment Verification Script for InfinityFire
 * This script checks your deployment configuration and identifies potential issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 InfinityFire Deployment Verification');
console.log('=====================================\n');

let hasErrors = false;
const errors = [];
const warnings = [];

// Check package.json files
console.log('📦 Checking package.json files...');

// Root package.json
try {
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!rootPackage.engines?.node) {
    errors.push('Root package.json missing Node.js version specification');
  }
  
  if (!rootPackage.scripts['heroku-postbuild']) {
    errors.push('Root package.json missing heroku-postbuild script');
  }
  
  if (!rootPackage.scripts['db:setup']) {
    errors.push('Root package.json missing db:setup script');
  }
  
  console.log('✅ Root package.json: OK');
} catch (error) {
  errors.push(`Cannot read root package.json: ${error.message}`);
}

// Client package.json
try {
  const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  
  if (!clientPackage.engines?.node) {
    warnings.push('Client package.json missing Node.js version specification');
  }
  
  if (clientPackage.proxy && clientPackage.proxy.includes('localhost')) {
    warnings.push('Client package.json has localhost proxy (this is fine for development)');
  }
  
  console.log('✅ Client package.json: OK');
} catch (error) {
  errors.push(`Cannot read client package.json: ${error.message}`);
}

// Check critical files
console.log('\n📁 Checking critical files...');

const criticalFiles = [
  'server.js',
  'Procfile',
  'app.json',
  'config/database.js',
  'client/build/index.html'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}: Found`);
  } else {
    if (file === 'client/build/index.html') {
      warnings.push(`${file}: Not found (will be built during deployment)`);
    } else {
      errors.push(`${file}: Missing`);
    }
  }
});

// Check environment variables
console.log('\n🔑 Checking environment variables...');

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET'
];

const envFile = '.env';
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar}: Found in .env`);
    } else {
      warnings.push(`${envVar}: Not found in .env (will need to be set in Heroku)`);
    }
  });
} else {
  warnings.push('.env file not found (environment variables will need to be set in Heroku)');
}

// Check database configuration
console.log('\n🗄️ Checking database configuration...');

try {
  const dbConfig = fs.readFileSync('config/database.js', 'utf8');
  
  if (dbConfig.includes('postgres') && dbConfig.includes('mysql')) {
    console.log('✅ Database config: Supports both PostgreSQL and MySQL');
  } else if (dbConfig.includes('postgres')) {
    console.log('✅ Database config: PostgreSQL support detected');
  } else if (dbConfig.includes('mysql')) {
    warnings.push('Database config: Only MySQL support detected (Heroku uses PostgreSQL)');
  } else {
    errors.push('Database config: No database dialect detected');
  }
} catch (error) {
  errors.push(`Cannot read database config: ${error.message}`);
}

// Check CORS configuration
console.log('\n🌐 Checking CORS configuration...');

try {
  const serverFile = fs.readFileSync('server.js', 'utf8');
  
  if (serverFile.includes('cors') && serverFile.includes('origin')) {
    console.log('✅ CORS configuration: Found');
  } else {
    warnings.push('CORS configuration: Not found or incomplete');
  }
  
  if (serverFile.includes('herokuapp.com')) {
    console.log('✅ Heroku CORS origins: Configured');
  } else {
    warnings.push('Heroku CORS origins: May need configuration');
  }
} catch (error) {
  errors.push(`Cannot read server.js: ${error.message}`);
}

// Summary
console.log('\n📊 Verification Summary');
console.log('======================');

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 All checks passed! Your deployment should work correctly.');
} else {
  if (errors.length > 0) {
    console.log(`❌ ${errors.length} Error(s) found:`);
    errors.forEach(error => console.log(`   • ${error}`));
    hasErrors = true;
  }
  
  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} Warning(s):`);
    warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (hasErrors) {
    console.log('\n🚨 Please fix the errors above before deploying.');
    console.log('📚 See HEROKU_TROUBLESHOOTING.md for solutions.');
  } else {
    console.log('\n✅ No critical errors found. You can proceed with deployment.');
  }
}

console.log('\n📋 Next Steps:');
console.log('1. Run: npm run build (to test client build)');
console.log('2. Run: npm start (to test server locally)');
console.log('3. Deploy to Heroku using deploy-heroku.sh');
console.log('4. Check logs: heroku logs --tail --app your-app-name');

if (hasErrors) {
  process.exit(1);
} 