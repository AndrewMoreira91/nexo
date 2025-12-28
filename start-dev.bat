@echo off
echo ====================================
echo    NEKSO - Development Environment
echo ====================================
echo.

REM Verificar se o Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker nao esta rodando!
    echo Por favor, inicie o Docker Desktop e tente novamente.
    pause
    exit /b 1
)

echo [1/4] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias da raiz...
    call npm install
)

if not exist "server\node_modules" (
    echo Instalando dependencias do servidor...
    cd server
    call npm install
    cd ..
)

if not exist "web\node_modules" (
    echo Instalando dependencias do frontend...
    cd web
    call npm install
    cd ..
)

REM Verificar se .env-local existe
if not exist "server\.env-local" (
    echo.
    echo [WARNING] Arquivo server\.env-local nao encontrado!
    echo.
    echo Por favor, crie o arquivo server\.env-local com as configuracoes:
    echo.
    echo PORT=3333
    echo DATABASE_URL=postgres://nekso:nekso@localhost:5432/nekso
    echo JWT_SECRET=seu_secret_super_secreto_aqui
    echo ENVIRONMENT=development
    echo.
    echo Voce pode copiar de server\.env-example
    echo.
    pause
    exit /b 1
)

echo.
echo [2/4] Iniciando banco de dados PostgreSQL...
cd server
call docker-compose up db -d
if errorlevel 1 (
    echo [ERROR] Falha ao iniciar o banco de dados!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Aguardando banco de dados inicializar...
echo Aguarde 5 segundos...
timeout /t 5 /nobreak

echo.
echo [4/4] Iniciando servidor e frontend...
echo.
echo ====================================
echo   Servicos iniciados com sucesso!
echo ====================================
echo.
echo  Database: http://localhost:5432
echo  API:      http://localhost:3333
echo  Frontend: http://localhost:5173
echo.
echo ====================================
echo.

REM Iniciar API e Web com concurrently
call npm run dev

pause
