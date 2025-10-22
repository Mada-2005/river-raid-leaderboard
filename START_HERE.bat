@echo off
echo ========================================
echo  River Raid Online Leaderboard Server
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This might take a minute...
    echo.
    call npm install
    echo.
    echo Dependencies installed!
    echo.
)

echo Starting server...
echo.
echo ========================================
echo  Server will run on:
echo  http://localhost:3000
echo.
echo  View leaderboard at:
echo  http://localhost:3000/leaderboard.html
echo.
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

node server.js
