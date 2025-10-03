@echo off

echo 🚀 Setting up Tamper-Proof Certificate Verification System...

node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version

npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version

echo 📁 Current directory: %CD%

echo 📦 Installing root dependencies...
call npm install

echo 🖥️  Setting up React frontend...
cd client

if exist "package.json" (
    echo 📦 Installing frontend dependencies...
    call npm install
    
    if not exist ".env" (
        echo 📋 Creating .env file...
        copy .env.example .env
        echo ✅ Created .env file. Please update it with your configuration.
    )
    
    echo ✅ Frontend setup complete!
) else (
    echo ❌ Frontend package.json not found!
)

cd ..

echo 🔧 Backend setup will be added in next phase...

echo ⛓️  Blockchain setup will be added in next phase...

echo.
echo 🎉 Setup complete!
echo.
echo 📝 Next steps:
echo    1. Update client\.env with your configuration
echo    2. Install MetaMask browser extension
echo    3. Start the frontend: cd client ^&^& npm start
echo.
echo 🌐 The application will be available at: http://localhost:3000
echo.
echo 📚 For more information, see README.md files in each directory

pause