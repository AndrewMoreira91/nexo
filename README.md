# Nekso
![Captura de tela de 2025-05-22 22-35-11](https://github.com/user-attachments/assets/c7f2c5a5-601f-4658-8c97-ff0a51700a73)
Nekso é uma aplicação web para gestão de estudos e produtividade baseada no método Pomodoro. Com Nekso, você pode definir metas diárias, acompanhar seu progresso, gerenciar tarefas, visualizar estatísticas e manter sua motivação com streaks de dias consecutivos de estudo.

🌐 **[Demonstração ao vivo](https://nekso.vercel.app)**  

## 🚀 Quick Start

### ⚠️ Antes de começar

**Configure as variáveis de ambiente:**

Crie o arquivo `server/.env-local` baseado no exemplo:

```env
PORT=3333
DATABASE_URL=postgres://nekso:nekso@localhost:5432/nekso
JWT_SECRET=seu_secret_super_secreto_aqui
ENVIRONMENT=development
```

### ▶️ Iniciar tudo com um único comando:

```bash
# Windows
start-dev.bat

# Linux/Mac
./start-dev.sh

# Ou via NPM (qualquer SO)
# Obs: Certifique-se de ter instalado as dependências antes com `npm install` ou `npm run install:all`
npm run dev
```

Isso iniciará:
- 🗄️ PostgreSQL (Docker) na porta 5432
- 🔌 API na porta 3333
- 🌐 Frontend na porta 5173

## Funcionalidades

- **Gestão de tarefas**: Crie, edite e acompanhe tarefas diárias.
- **Pomodoro Timer**: Utilize sessões de foco e pausas automáticas.
- **Metas diárias**: Defina e acompanhe metas de tempo de estudo.
- **Streaks**: Mantenha sua motivação com sequências de dias estudados.
- **Autenticação**: Cadastro e login de usuários.

## Tecnologias Utilizadas

- **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [MUI Joy UI](https://mui.com/joy-ui/), [React Router](https://reactrouter.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Fastify](https://fastify.dev/), [TypeScript](https://www.typescriptlang.org/), [Drizzle ORM](https://orm.drizzle.team/)
- **Banco de Dados**: Postgresql
- **Autenticação**: JWT
- **Docker**: Para facilitar o deploy e desenvolvimento

## 📥 Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 18+ 
- Docker Desktop
- Git

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone https://github.com/AndrewMoreira91/nexo.git
cd nexo
```

2. **Instale todas as dependências**
```bash
npm install           # Instala concurrently
install-all.bat       # Windows
# ou
./install-all.sh      # Linux/Mac
# ou
npm run install:all   # Qualquer SO
```

3. **⚠️ Configure as variáveis de ambiente (IMPORTANTE!)**

Crie o arquivo `server/.env-local` com o seguinte conteúdo:

```env
PORT=3333
DATABASE_URL=postgres://nekso:nekso@localhost:5432/nekso
JWT_SECRET=seu_secret_super_secreto_aqui_mude_isso
ENVIRONMENT=development
```

> 💡 **Dica:** Copie o arquivo `.env-example` e renomeie para `.env-local`

4. **Inicie o desenvolvimento**
```bash
npm run dev
# ou
start-dev.bat  # Windows
```

Acesse:
- Frontend: http://localhost:5173
- API: http://localhost:3333
- API Docs: http://localhost:3333/docs

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia DB + API + Frontend |
| `npm run build` | Build de produção |
| `npm start` | Inicia em modo produção |
| `npm run migrate` | Executa migrations do banco |
| `npm run studio` | Abre Drizzle Studio (GUI do DB) |