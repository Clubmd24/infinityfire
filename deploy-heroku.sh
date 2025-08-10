#!/bin/bash

echo "🚀 InfinityFire Heroku Deployment Script"
echo "========================================="

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed."
    echo "Please install it first:"
    echo "  macOS: brew tap heroku/brew && brew install heroku"
    echo "  Windows: Download from https://devcenter.heroku.com/articles/heroku-cli"
    echo "  Linux: curl https://cli-assets.heroku.com/install.sh | sh"
    exit 1
fi

echo "✅ Heroku CLI detected: $(heroku --version)"

# Check if user is logged in
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please log in to Heroku..."
    heroku login
fi

echo "✅ Logged in as: $(heroku auth:whoami)"

# Get app name
read -p "Enter your Heroku app name (or press Enter to let Heroku generate one): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "🆕 Creating Heroku app with auto-generated name..."
    APP_NAME=$(heroku create --json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "✅ App created: $APP_NAME"
else
    echo "🆕 Creating Heroku app: $APP_NAME"
    heroku create "$APP_NAME"
fi

echo ""
echo "🗄️ Adding PostgreSQL database..."
heroku addons:create heroku-postgresql:mini --app "$APP_NAME"

echo ""
echo "🔑 Setting up environment variables..."

# Generate JWT secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

heroku config:set JWT_SECRET="$JWT_SECRET" --app "$APP_NAME"
heroku config:set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" --app "$APP_NAME"
heroku config:set NODE_ENV=production --app "$APP_NAME"
heroku config:set PORT=5000 --app "$APP_NAME"
heroku config:set APP_URL="https://$APP_NAME.herokuapp.com" --app "$APP_NAME"

echo ""
echo "⚠️  IMPORTANT: You need to set your AWS S3 credentials manually:"
echo "   heroku config:set AWS_ACCESS_KEY_ID=your_key --app $APP_NAME"
echo "   heroku config:set AWS_SECRET_ACCESS_KEY=your_secret --app $APP_NAME"
echo "   heroku config:set AWS_REGION=your_region --app $APP_NAME"
echo "   heroku config:set AWS_S3_BUCKET=your_bucket --app $APP_NAME"

echo ""
read -p "Have you set your AWS credentials? (y/n): " AWS_SET

if [ "$AWS_SET" != "y" ] && [ "$AWS_SET" != "Y" ]; then
    echo "❌ Please set your AWS credentials first, then run this script again."
    exit 1
fi

echo ""
echo "🚀 Deploying to Heroku..."

# Add Heroku remote if not already added
if ! git remote | grep -q heroku; then
    heroku git:remote -a "$APP_NAME"
fi

# Push to Heroku
git push heroku main

echo ""
echo "🗃️ Setting up database..."
heroku run npm run db:setup --app "$APP_NAME"

echo ""
echo "🌐 Opening your app..."
heroku open --app "$APP_NAME"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Useful commands:"
echo "   View logs: heroku logs --tail --app $APP_NAME"
echo "   Check status: heroku ps --app $APP_NAME"
echo "   View config: heroku config --app $APP_NAME"
echo "   Restart app: heroku restart --app $APP_NAME"
echo ""
echo "🔗 Your app is available at: https://$APP_NAME.herokuapp.com"
echo ""
echo "📚 For more information, see HEROKU_DEPLOYMENT.md" 