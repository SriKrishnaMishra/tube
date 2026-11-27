@echo off
title DevTube - Local + Cloudflare Tunnel Launcher
color 0b
echo ======================================================================
echo           STARTING DEVTUBE PLATFORM + CLOUDFLARE TUNNEL
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/4] Starting AI ^& Real-Time Backend API (Port 8000)...
start "DevTube Backend" /min python scripts/realtime_server.py

timeout /t 2 /nobreak >nul

echo [2/4] Starting Frontend Web Server (Port 3000)...
start "DevTube Frontend" /min npm run dev

timeout /t 3 /nobreak >nul

echo [3/4] Starting Cloudflare Tunnel for Phone ^& Remote Access...
if exist "cloudflared.exe" (
    start "DevTube Cloudflare Tunnel" cmd /k "echo Waiting for your public HTTPS link... & cloudflared.exe tunnel --url http://127.0.0.1:3000 --http-host-header localhost:3000"
) else (
    echo [!] cloudflared.exe not found in workspace. Skipping remote tunnel.
)

timeout /t 3 /nobreak >nul

echo [4/4] Opening Dedicated Desktop App Window...
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3000 --window-size=1280,820
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000 --window-size=1280,820
) else (
    start http://localhost:3000
)

echo.
echo ======================================================================
echo  DevTube is now running!
echo  - Local PC App:   http://localhost:3000
echo  - Same Wi-Fi:     http://10.92.107.204:3000 (check ipconfig if changed)
echo  - Phone / Remote: Check the "DevTube Cloudflare Tunnel" window for
echo                    your live https://*.trycloudflare.com URL!
echo ======================================================================
pause
