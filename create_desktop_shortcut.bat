@echo off
title Create Desktop Icon for RecTracker AI
cd /d "%~dp0"
echo Creating Desktop Shortcut for RecTracker AI...

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.Environment]::GetFolderPath('Desktop') + '\RecTracker AI.lnk'); $s.TargetPath = '%~dp0Launch_App.bat'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'RecTracker AI - 57 Categories Recommendation & Backlink Hub'; $s.Save()"

echo.
echo ======================================================================
echo  SUCCESS! A shortcut named "RecTracker AI" has been added to your Desktop!
echo  You can now simply double-click the icon on your Desktop to open the app.
echo ======================================================================
pause

