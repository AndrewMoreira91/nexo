# Sistema de Streak - Documentação

## Visão Geral

O sistema de streak rastreia quantos dias consecutivos um usuário completou sua meta diária de sessões de foco. A lógica foi completamente refatorada para ser mais clara, consistente e centralizada no servidor.

## Regras de Negócio

### Como o Streak Funciona

1. **Dias Selecionados**: O usuário pode selecionar quais dias da semana deseja trabalhar (campo `selectedDaysOfWeek` em `users`)
   - 0 = Domingo
   - 1 = Segunda-feira
   - 2 = Terça-feira
   - 3 = Quarta-feira
   - 4 = Quinta-feira
   - 5 = Sexta-feira
   - 6 = Sábado

2. **Meta Diária**: Definida por `dailySessionTarget` em `users`
   - Exemplo: Se `dailySessionTarget = 4`, o usuário precisa completar 4 sessões de foco

3. **Dia Completo**: Um dia conta para o streak quando:
   - É um dia selecionado pelo usuário (está em `selectedDaysOfWeek`)
   - O usuário completou a meta (`isGoalComplete = true` em `dailyProgress`)

4. **Quebra de Streak**: O streak é quebrado quando:
   - Em um dia selecionado, o usuário NÃO completou a meta
   - Dias não selecionados são **ignorados** e não quebram o streak

## Arquitetura

### Armazenamento

- **`users.streak`**: Streak atual do usuário
- **`users.longestStreak`**: Maior streak já alcançado
- **`users.selectedDaysOfWeek`**: Array de dias da semana selecionados
- **`users.dailySessionTarget`**: Meta diária de sessões

- **`dailyProgress.isGoalComplete`**: Se a meta foi atingida naquele dia
- **`dailyProgress.sessionsCompleted`**: Número de sessões completadas
- **`dailyProgress.date`**: Data do progresso (formato: "YYYY-MM-DD")

### Função Principal: `calculateStreak()`

**Localização**: `server/src/functions/user/calculate-streak.ts`

**Responsabilidade**: Calcular o streak atual e o longest streak baseado no histórico

**Algoritmo**:
1. Busca os últimos 90 dias de progresso do usuário
2. Itera de hoje para trás
3. Para cada dia:
   - Se NÃO está em `selectedDaysOfWeek`: pula
   - Se ESTÁ em `selectedDaysOfWeek` e `isGoalComplete = true`: incrementa streak
   - Se ESTÁ em `selectedDaysOfWeek` e `isGoalComplete = false`: quebra o streak atual
4. Retorna `currentStreak` e `longestStreak`

**Exemplo**:
```typescript
// Usuário trabalha Segunda a Sexta (1-5)
selectedDaysOfWeek: [1, 2, 3, 4, 5]

// Histórico:
// Segunda (1): ✅ completo
// Terça (2): ✅ completo  
// Quarta (3): ❌ não completo -> QUEBRA
// Quinta (4): ✅ completo
// Sexta (5): ✅ completo
// Sábado (6): [ignorado - não selecionado]
// Domingo (0): [ignorado - não selecionado]
// Segunda (1): ✅ completo <- HOJE

// Resultado: currentStreak = 3 (quinta, sexta, segunda)
```

### Atualização do Streak

O streak é atualizado automaticamente em 3 momentos:

1. **Ao finalizar uma sessão** (`end-session.ts`)
   - Atualiza o `dailyProgress` com sessões completadas
   - Calcula e atualiza o streak do usuário

2. **Ao acessar dados do usuário** (`verifyStreak` middleware)
   - Garante que o streak está atualizado antes de retornar dados

3. **Atualização diária** (`daily-data-update.ts`)
   - Job que deve rodar 1x por dia (via cron)
   - Recalcula o streak de todos os usuários

## Migração

### Alterações no Banco de Dados

**Removido**: Campo `streak` da tabela `daily_progress`
- Motivo: Duplicação e inconsistência
- A coluna estava criando confusão ao ter o mesmo conceito em dois lugares

**Migration**: `0001_remove_streak_from_daily_progress.sql`
```sql
ALTER TABLE "daily_progress" DROP COLUMN IF EXISTS "streak";
```

### Como Executar a Migration

```bash
# Se usando Drizzle ORM
cd server
npm run db:migrate

# Ou execute manualmente no banco
psql -U usuario -d database < src/drizzle/migrations/0001_remove_streak_from_daily_progress.sql
```

## API Changes

### Endpoints Afetados

#### 1. `GET /get-data-progress`
**Antes**:
```json
{
  "date": "2025-12-31",
  "isGoalComplete": true,
  "sessionsCompleted": 4,
  "totalSessionFocusDuration": 6000,
  "streak": 5  // ❌ REMOVIDO
}
```

**Depois**:
```json
{
  "date": "2025-12-31",
  "isGoalComplete": true,
  "sessionsCompleted": 4,
  "totalSessionFocusDuration": 6000
}
```

**Nota**: Para obter o streak, use `GET /get-user`

#### 2. `POST /end-session`
Continua retornando o `streak` atualizado:
```json
{
  "session": {...},
  "isGoalComplete": true,
  "sessionsCompleted": 4,
  "streak": 6  // ✅ streak atual do usuário
}
```

#### 3. `GET /get-user`
Retorna o streak do usuário:
```json
{
  "id": "...",
  "name": "João",
  "streak": 6,
  "longestStreak": 12,
  "selectedDaysOfWeek": [1, 2, 3, 4, 5],
  ...
}
```

## Testes

### Cenários de Teste

1. **Streak Básico**
   - Usuário completa meta 3 dias seguidos em dias selecionados
   - Streak deve ser 3

2. **Dias Não Selecionados**
   - Usuário trabalha Seg-Sex
   - Não completa meta no Sábado
   - Streak NÃO deve quebrar

3. **Quebra de Streak**
   - Usuário trabalha Seg-Sex
   - Não completa meta na Quarta
   - Streak deve resetar

4. **Longest Streak**
   - Streak atual = 5
   - Longest streak = 10
   - Longest streak deve permanecer 10

## Vantagens da Nova Arquitetura

1. **✅ Fonte Única de Verdade**: Streak só existe em `users`, não duplicado
2. **✅ Lógica Centralizada**: Toda lógica em uma função (`calculateStreak`)
3. **✅ Respeita Preferências**: Considera `selectedDaysOfWeek`
4. **✅ Recuperável**: Pode recalcular streak a qualquer momento baseado no histórico
5. **✅ Auditável**: Todo cálculo é baseado em dados permanentes
6. **✅ Testável**: Função pura, fácil de testar

## Manutenção

### Como Adicionar Novas Regras

Se precisar modificar a lógica de streak:
1. Edite apenas `calculate-streak.ts`
2. Rode os testes
3. Execute `dailyDataUpdate()` para recalcular todos os usuários

### Debug

Para debugar problemas de streak:
```typescript
// Habilite logs em desenvolvimento
isDevelopment() && console.log("Streak calculado:", {
  userId: user.id,
  currentStreak,
  longestStreak,
  selectedDays: user.selectedDaysOfWeek,
});
```

### Performance

- A função busca apenas 90 dias de histórico (suficiente para qualquer streak realista)
- Usa Map para acesso O(1) aos dados de progresso
- Pode ser otimizada com cache se necessário
