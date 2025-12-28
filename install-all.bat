@echo off
echo ====================================
echo    NEKSO - Install Dependencies
echo ====================================
echo.

echo [1/3] Instalando dependencias da raiz...
call npm install

echo.
echo [2/3] Instalando dependencias do servidor...
cd server
call npm install
cd ..

echo.
echo [3/3] Instalando dependencias do frontend...
cd web
call npm install
cd ..

echo.
echo ====================================
echo   Instalacao concluida!
echo ====================================
echo.

pause
