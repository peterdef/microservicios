@echo off
echo Starting development environment...
echo.

echo Starting mock server...
start "Mock Server" cmd /k "node mock-server.js"

echo Waiting for mock server to start...
timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Development environment started!
echo.
echo Mock Server: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Test credentials:
echo - autor / password
echo - revisor / password
echo - editor / password
echo - admin / password
echo - lector / password
echo.
pause
