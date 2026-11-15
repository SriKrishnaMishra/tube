@echo off
title RecTracker AI Desktop App Launcher
color 0b
echo ======================================================================
echo           STARTING RECTRACKER AI DESKTOP APP ON YOUR LAPTOP
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting AI & Real-Time Backend API (Port 8000)...
start "RecTracker Backend" /min python scripts/realtime_server.py

timeout /t 2 /nobreak >nul

echo [2/3] Starting Frontend Web Server (Port 3000)...
start "RecTracker Frontend" /min npm run dev

timeout /t 3 /nobreak >nul

echo [3/3] Opening Dedicated Desktop App Window...
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3000 --window-size=1280,820
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000 --window-size=1280,820
) else (
    start http://localhost:3000
)

echo.
echo ======================================================================
echo  RecTracker AI App is now running! 
echo  Keep this terminal open, or close it when done.
echo ======================================================================
pause

