@echo off
echo 🚀 InfinityFire Quick Start Script
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    copy env.example .env
    echo 📝 Please edit .env file with your actual credentials before continuing.
    echo    Required: Database, AWS S3, and JWT configuration.
    pause
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ All dependencies installed successfully!
echo.
echo 🚀 To start the application:
echo.
echo Terminal 1 (Backend):
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd client ^&^& npm start
echo.
echo 🌐 The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo 📚 See SETUP.md for detailed configuration instructions.
echo.
echo 🎉 Happy coding!
pause 