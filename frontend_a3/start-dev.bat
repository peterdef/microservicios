@echo off
echo Starting development environment...
echo.

echo Starting frontend development server...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Development environment started!
echo.
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
