@echo off
echo ========================================
echo  Push to GitHub
echo ========================================
echo.
echo IMPORTANT: Before running this script:
echo 1. Create a new repository on GitHub.com
echo 2. Name it: river-raid-leaderboard
echo 3. Make it PUBLIC (required for free Render deployment)
echo 4. DO NOT initialize with README
echo.
echo ========================================
echo.

set /p username="Enter your GitHub username: "

echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%username%/river-raid-leaderboard.git

echo.
echo Renaming branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo  SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Next step: Deploy on Render.com
echo See RENDER_DEPLOYMENT_STEPS.txt
echo.
pause
