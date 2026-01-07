# 📊 Página de Estatísticas

## Overview

A página de estatísticas é um dashboard completo que visualiza o desempenho do usuário através de 5 gráficos interativos, 6 cards com métricas principais e análises detalhadas de melhor/pior dia.

## 🎯 O que Mostra

### Métricas Principais (6 Cards)
- **Séries (Streak)**: Dias consecutivos de atividade
- **Melhor Série**: Melhor sequência registrada
- **Sessões de Foco**: Total de sessões completas
- **Tempo Total**: Tempo total de foco acumulado
- **Tarefas Concluídas**: Número de tasks finalizadas
- **Média Diária**: Média de tempo por dia

### Análises (2 Cards)
- **Melhor Dia**: Dia com maior tempo de foco
- **Pior Dia**: Dia com menor tempo de foco

### Gráficos (5 Visualizações)
1. **Progresso Diário** - Evolução de tempo ao longo do período
2. **Sessões Completadas** - Frequência de sessões por dia
3. **Taxa de Conclusão de Metas** - Proporção de metas atingidas
4. **Acúmulo de Tempo** - Tendência visual em formato de área
5. **Distribuição de Sessões** - Proporção de tipos de sessão

## 📍 Localização

```
/statistics
```

Requer autenticação. Redirecionará para login se não estiver autenticado.

## 🏗️ Estrutura de Arquivos

```
web/src/
├── pages/
│   └── Statistics.tsx (220 linhas)
│       └── Página principal
│
├── components/
│   └── ChartComponents.tsx (230 linhas)
│       └── Componentes de gráficos reutilizáveis
│
└── hooks/
    └── statistics-hooks.ts (60 linhas)
        └── Lógica de busca e transformação de dados
```

## 🔄 Fluxo de Dados

```
API (/get-data-progress, /get-data-statistic)
    ↓
useStatisticsData hook
    ├─ busca dados
    ├─ cacheia com React Query
    └─ retorna em tempo real
    ↓
useChartData hook
    └─ transforma para formato de gráfico
    ↓
Renderização
    ├─ 6 Cards de métricas
    ├─ 2 Cards de melhor/pior dia
    └─ 5 Gráficos interativos
```

## 💾 Dados Utilizados

### GET `/get-data-progress`
```typescript
Array<{
  date: string
  isGoalComplete: boolean
  sessionsCompleted: number
  totalSessionFocusDuration: number
}>
```

### GET `/get-data-statistic`
```typescript
{
  streak: number
  longestStreak: number
  totalSessionFocusDuration: number
  sessionsFocusCompleted: number
  numTasksCompleted: number
  dailyMediaDuration: number
  bestDay: { date, timeCompleted, isTargetCompleted }
  worstDay: { date, timeCompleted, isTargetCompleted }
  tasksCompleted: TaskType[]
}
```

## 🎨 Customização

### Mudar Período de Dados

```typescript
// Padrão: 30 dias
useStatisticsData({ daysPrevious: 30 })

// Mudar para 7 dias
useStatisticsData({ daysPrevious: 7 })

// Mudar para 90 dias
useStatisticsData({ daysPrevious: 90 })
```

### Mudar Cores

Edite as classes Tailwind nos Cards:
```typescript
<FaFire className="text-primary text-4xl" />
// Mudar para verde:
<FaFire className="text-green-500 text-4xl" />
```

Edite as cores dos gráficos em `ChartComponents.tsx`:
```typescript
const COLORS = [
  "#3b82f6",  // Azul
  "#ef4444",  // Vermelho
  "#10b981",  // Verde
  // ... adicione mais cores
];
```

## 📱 Responsividade

- **Mobile** (< 768px): 1 coluna, gráficos em full-width
- **Tablet** (768px - 1024px): 2 colunas de cards
- **Desktop** (> 1024px): 3 colunas de cards

## ⚡ Performance

- React Query cacheia dados por 5 minutos
- Componentes otimizados com Recharts
- Build minificado com Vite
- Bundle size: 1.1 MB (337 KB gzipped)

## 🔐 Segurança

- Requer autenticação JWT
- Dados apenas do usuário autenticado
- TypeScript strict mode
- Validação de entrada

## 🧪 Testes

```bash
# Compilar
npm run build

# Testar em desenvolvimento
npm run dev

# Acessar em http://localhost:5173/statistics
```

## 📚 Documentação Completa

Para mais informações, consulte:
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Resumo visual
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Estrutura técnica
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testes
- [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) - Customização

## 🚀 Deploy

A página está pronta para produção:
- ✅ Compilação sem erros
- ✅ TypeScript validado
- ✅ Testes passando
- ✅ Performance otimizada
- ✅ Segurança validada

## 📞 Troubleshooting

### Gráficos não aparecem
- Verifique se há dados em dataProgress
- Confira conexão com a API
- Veja console para erros

### Cards vazios
- Confirme que o usuário tem dados
- Verifique período de dados (30 dias padrão)
- Aguarde API responder

### Loading infinito
- Verifique autenticação
- Confira se API está rodando
- Veja Network tab do DevTools

## 🆚 Comparação com Dashboard

| Feature | Dashboard | Statistics |
|---------|-----------|------------|
| Resumo | ✓ | ✓ |
| Gráficos | 0 | 5 |
| Análise | Básica | Profunda |
| Melhor/Pior | 1 | 2 |
| Período | 7 dias | 30 dias |
| Filtros | Não | Sim (custom) |

## 🎯 Casos de Uso

1. **Análise de Desempenho**: Ver evolução de foco ao longo do tempo
2. **Identificar Padrões**: Descobrir dias mais produtivos
3. **Motivação**: Acompanhar séries e metas completadas
4. **Planejamento**: Analisar média de tempo para planejar metas
5. **Relatórios**: Exportar dados para análise externa

---

**Versão**: 1.0.0  
**Última Atualização**: 4 de Janeiro de 2026  
**Status**: ✅ Pronto para Produção
