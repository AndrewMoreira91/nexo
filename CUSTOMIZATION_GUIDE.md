# 🎨 Guia de Customização - Página de Estatísticas

## Mudando o Período de Dados

### Padrão (30 dias)
```typescript
// src/pages/Statistics.tsx
const { dataProgress, dataStatistics, isLoading: isLoadingData } =
  useStatisticsData({ daysPrevious: 30 });
```

### Para 7 dias (1 semana)
```typescript
useStatisticsData({ daysPrevious: 7 })
```

### Para 90 dias (trimestre)
```typescript
useStatisticsData({ daysPrevious: 90 })
```

### Para 365 dias (um ano)
```typescript
useStatisticsData({ daysPrevious: 365 })
```

## Adicionando Filtro de Período

```typescript
import { useState } from "react";

const StatisticsPage = () => {
  const [period, setPeriod] = useState(30);
  
  const { dataProgress, dataStatistics, isLoading: isLoadingData } =
    useStatisticsData({ daysPrevious: period });

  return (
    <>
      <main>
        <div className="mb-4 flex gap-2">
          <button onClick={() => setPeriod(7)} className={period === 7 ? "active" : ""}>
            7 dias
          </button>
          <button onClick={() => setPeriod(30)} className={period === 30 ? "active" : ""}>
            30 dias
          </button>
          <button onClick={() => setPeriod(90)} className={period === 90 ? "active" : ""}>
            90 dias
          </button>
        </div>
        {/* ... resto do código ... */}
      </main>
    </>
  );
};
```

## Customizando Cores

### Cores dos Ícones

Edite em `src/pages/Statistics.tsx`:

```typescript
// Mudar de azul para verde
<FaFire className="text-green-500 text-4xl" />

// Mudar de vermelho para roxo
<FaCalendarCheck className="text-purple-500 text-2xl" />
```

### Cores dos Gráficos

Em `src/components/ChartComponents.tsx`:

```typescript
// Mudar cor da linha
<Line
  type="monotone"
  dataKey={dataKey}
  stroke="#ef4444"  // Mudar para vermelho
  name={name}
  strokeWidth={2}
/>
```

### Paleta de Cores Completa

```typescript
const COLORS = [
  "#3b82f6",  // Azul (padrão)
  "#ef4444",  // Vermelho
  "#10b981",  // Verde
  "#f59e0b",  // Âmbar
  "#8b5cf6",  // Roxo
  "#ec4899",  // Rosa
];

// Adicionar mais cores:
const COLORS_EXTENDED = [
  "#0ea5e9",  // Cyan
  "#06b6d4",  // Sky
  "#14b8a6",  // Teal
  "#84cc16",  // Lime
  "#eab308",  // Yellow
  "#f97316",  // Orange
];
```

## Mudando Nomes e Labels

### Labels dos Cards

```typescript
// De
<MenuData
  title="Séries (Streak)"
  textMain={`${dataStatistics?.streak ?? 0}`}
  description="Dias consecutivos"
>

// Para
<MenuData
  title="Fogo 🔥"
  textMain={`${dataStatistics?.streak ?? 0}`}
  description="Sequência de fogo"
>
```

### Títulos dos Gráficos

```typescript
// De
<SimpleLineChart
  data={chartData}
  dataKey="time"
  name="Progresso Diário"
  ...
/>

// Para
<SimpleLineChart
  data={chartData}
  dataKey="time"
  name="Meu Desempenho Diário"
  ...
/>
```

## Adicionando Novo Gráfico

### 1. Transformar Dados

```typescript
// Adicionar em StatisticsPage
const weeklyData = [
  { day: "Seg", sessions: 3, time: 180 },
  { day: "Ter", sessions: 4, time: 240 },
  { day: "Qua", sessions: 2, time: 120 },
  { day: "Qui", sessions: 5, time: 300 },
  { day: "Sex", sessions: 4, time: 240 },
  { day: "Sab", sessions: 1, time: 60 },
  { day: "Dom", sessions: 0, time: 0 },
];
```

### 2. Renderizar Gráfico

```typescript
<SimpleBarChart
  data={weeklyData}
  dataKey="time"
  name="Foco por Dia da Semana"
  isLoading={isLoadingData}
  isEmpty={weeklyData.length === 0}
  color="#6366f1"
/>
```

## Criando Novo Componente de Card

```typescript
// src/components/StatCard.tsx
import React from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor = "bg-blue-100",
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-4 flex items-center gap-3`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};
```

Usar em Statistics.tsx:
```typescript
<StatCard
  label="Sessões Hoje"
  value={dataProgress?.[0]?.sessionsCompleted ?? 0}
  icon="🎯"
  bgColor="bg-green-100"
/>
```

## Formatação Customizada

### Tempos

```typescript
// De
formattedTime(dataStatistics?.totalSessionFocusDuration ?? 0)
// "4h 30m"

// Usar função customizada
const formatCustomTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};
```

### Datas

```typescript
// De
getDayOfWeek(dataStatistics.bestDay.date)
// "Segunda-feira"

// Customizar em getDayOfWeek
export const getDayOfWeek = (date: string | Date, format = "long") => {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", { weekday: format });
  // format: "long" = "Segunda-feira"
  // format: "short" = "Seg"
  // format: "narrow" = "S"
};
```

## Adicionando Animações

### Fade-in em Cards

```tsx
<MenuData
  title="Séries (Streak)"
  textMain={`${dataStatistics?.streak ?? 0}`}
  description="Dias consecutivos"
  isLoading={isLoadingData}
  className="animate-fade-in"
>
  <FaFire className="text-primary text-4xl" />
</MenuData>
```

Adicione ao `styles.css`:
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

## Temas (Dark Mode)

### Implementar Suporte a Dark Mode

```typescript
import { useEffect, useState } from "react";

const StatisticsPage = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark";
    setIsDark(dark);
  }, []);

  return (
    <main className={isDark ? "dark bg-gray-900" : ""}>
      {/* ... conteúdo ... */}
    </main>
  );
};
```

## Exportar Dados

### Adicionar Botão de Download

```typescript
const downloadAsJSON = () => {
  const data = {
    dataProgress,
    dataStatistics,
    exportedAt: new Date().toISOString(),
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `statistics-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// No JSX:
<button
  onClick={downloadAsJSON}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  📥 Exportar JSON
</button>
```

## Integrações

### Com Locales (Internacionalização)

```typescript
import { useLocale } from "../hooks/useLocale"; // criar hook

const StatisticsPage = () => {
  const t = useLocale();

  return (
    <>
      <h1>{t("statistics.title")}</h1>
      <MenuData
        title={t("statistics.streak.label")}
        description={t("statistics.streak.description")}
      />
    </>
  );
};
```

### Com Analytics

```typescript
import { trackEvent } from "../services/analytics";

const StatisticsPage = () => {
  useEffect(() => {
    trackEvent("statistics_page_viewed", {
      period: 30,
      hasData: dataProgress.length > 0,
    });
  }, [dataProgress]);

  // ...
};
```

## Performance Otimizations

### Memoização

```typescript
import { useMemo } from "react";

const StatisticsPage = () => {
  const chartData = useMemo(
    () => useChartData(dataProgress),
    [dataProgress]
  );

  const goalData = useMemo(
    () => [
      {
        name: "Metas Completadas",
        value: (dataProgress || []).filter((d) => d.isGoalComplete).length,
      },
      // ...
    ],
    [dataProgress]
  );

  // ...
};
```

### Lazy Loading de Gráficos

```typescript
import { lazy, Suspense } from "react";

const SimpleLineChart = lazy(() =>
  import("../components/ChartComponents").then(m => ({ 
    default: m.SimpleLineChart 
  }))
);

// No JSX:
<Suspense fallback={<Skeleton />}>
  <SimpleLineChart {...props} />
</Suspense>
```

## Debug e Logging

### Adicionar Logs Úteis

```typescript
const StatisticsPage = () => {
  const { dataProgress, dataStatistics, isLoading } =
    useStatisticsData({ daysPrevious: 30 });

  useEffect(() => {
    console.log("Statistics loaded:", {
      dataProgress: dataProgress?.length,
      dataStatistics,
      isLoading,
    });
  }, [dataProgress, dataStatistics, isLoading]);

  // ...
};
```

---

**Última atualização**: 4 de Janeiro de 2026
**Versão**: 1.0.0
