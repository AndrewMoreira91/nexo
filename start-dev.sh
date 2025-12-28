#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================="
echo "   NEKSO - Development Environment"
echo -e "====================================${NC}"
echo ""

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}[ERROR] Docker não está rodando!${NC}"
    echo "Por favor, inicie o Docker e tente novamente."
    exit 1
fi

echo -e "${GREEN}[1/4] Verificando dependências...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências da raiz..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "Instalando dependências do servidor..."
    cd server && npm install && cd ..
fi

if [ ! -d "web/node_modules" ]; then
    echo "Instalando dependências do frontend..."
    cd web && npm install && cd ..
fi

# Verificar se .env-local existe
if [ ! -f "server/.env-local" ]; then
    echo ""
    echo -e "${RED}[WARNING] Arquivo server/.env-local não encontrado!${NC}"
    echo ""
    echo "Por favor, crie o arquivo server/.env-local com as configurações:"
    echo ""
    echo "PORT=3333"
    echo "DATABASE_URL=postgres://nekso:nekso@localhost:5432/nekso"
    echo "JWT_SECRET=seu_secret_super_secreto_aqui"
    echo "ENVIRONMENT=development"
    echo ""
    echo "Você pode copiar de server/.env-example"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}[2/4] Iniciando banco de dados PostgreSQL...${NC}"
cd server
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Falha ao iniciar o banco de dados!${NC}"
    cd ..
    exit 1
fi
cd ..

echo ""
echo -e "${GREEN}[3/4] Aguardando banco de dados inicializar...${NC}"
sleep 5

echo ""
echo -e "${GREEN}[4/4] Iniciando servidor e frontend...${NC}"
echo ""
echo -e "${BLUE}===================================="
echo "  Serviços iniciados com sucesso!"
echo "===================================="
echo ""
echo -e "  ${YELLOW}Database:${NC} http://localhost:5432"
echo -e "  ${YELLOW}API:${NC}      http://localhost:3333"
echo -e "  ${YELLOW}Frontend:${NC} http://localhost:5173"
echo ""
echo -e "${BLUE}====================================${NC}"
echo ""

# Iniciar API e Web com concurrently
npm run dev
