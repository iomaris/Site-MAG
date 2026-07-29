@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
    start "Servidor MAG" /min cmd /c "py -m http.server 5500"
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:5500"
    exit /b
)

where python >nul 2>nul
if %errorlevel%==0 (
    start "Servidor MAG" /min cmd /c "python -m http.server 5500"
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:5500"
    exit /b
)

start "" "index.html"
