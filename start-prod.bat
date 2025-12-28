@echo off
echo ====================================
echo    NEKSO - Production Build & Start
echo ====================================
echo.

echo [1/3] Building API...
cd server
call npm run build
if errorlevel 1 (
    echo [ERROR] Falha ao fazer build da API!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [2/3] Building Frontend...
cd web
call npm run build
if errorlevel 1 (
    echo [ERROR] Falha ao fazer build do frontend!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Starting production servers...
echo.
echo ====================================
echo   Builds concluidos com sucesso!
echo ====================================
echo.

call npm start

pause
