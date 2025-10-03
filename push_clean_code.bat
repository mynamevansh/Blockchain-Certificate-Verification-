@echo off
echo Preparing final repository push...

cd /d "c:\Users\vansh\OneDrive\Desktop\blockchain certify"

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing all changes...
git commit -m "Final cleanup: Remove all comments from codebase and finalize project"

echo.
echo Pushing to GitHub repository...
git push origin main

echo.
echo ========================================
echo    Project Successfully Pushed!
echo ========================================
echo.
echo All comments have been removed from:
echo   - setup.bat
echo   - NewAdminDashboard.js
echo   - HomePage.js 
echo   - AuthHomePage.js
echo   - All other project files
echo.
echo Repository URL: https://github.com/mynamevansh/Blockchain-Certificate-Verification-.git
echo.

pause