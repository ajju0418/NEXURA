@echo off
echo ========================================
echo NEXURA - Starting Development Servers
echo ========================================
echo.

cd /d %~dp0

echo [1/3] Ensuring Prisma Client is ready...
cd backend
call npx prisma generate > nul 2>&1
echo Prisma Client ready!

echo.
echo [2/3] Starting Backend Server...
cd ..
start "NEXURA Backend" cmd /k "cd backend && npm run start:dev"

echo.
echo [3/3] Starting Frontend Server...
timeout /t 3 /nobreak > nul
start "NEXURA Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo Backend:  http://localhost:3000/api
echo API Docs: http://localhost:3000/api/docs
echo Frontend: http://localhost:3001
echo.
echo Demo Login:
echo   Email: admin@nexura.com
echo   Password: Nexura@123
echo ========================================
echo.
echo Press any key to close this window...
pause > nul

