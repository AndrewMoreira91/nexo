# Gerenciamento de Estado Global no React - Nexo

## ✅ Implementação Atual

O projeto usa **Context API** com integração completa do timer. Toda a lógica de estado do Pomodoro (sessão, timer e tarefas) está centralizada em um único contexto.

### 🎯 PomodoroContext - API Completa

```tsx
import { usePomodoro } from "../context/pomodoro.context";

function SeuComponente() {
  const { 
    // ===== Session State =====
    currentMode,           // 'focus' | 'shortBreak' | 'longBreak'
    setCurrentMode,        // (mode: SessionType) => void
    resetSession,          // (mode: SessionType) => void - reseta modo e atualiza tempo
    
    // ===== Tasks State =====
    tasksSelected,         // string[] - IDs das tarefas selecionadas
    setTasksSelected,      // (tasks: string[]) => void
    toggleTaskSelection,   // (taskId: string) => void - adiciona/remove tarefa
    
    // ===== Timer State =====
    isTimerRunning,        // boolean
    timeLeft,              // number - tempo restante em segundos
    startTimer,            // (onComplete?: () => void) => void
    stopTimer,             // () => void
    updateTimeLeft,        // (mode: SessionType) => void
  } = usePomodoro();
  
  return (
    <div>
      <p>Modo: {currentMode}</p>
      <p>Tempo: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
      <button onClick={() => startTimer()}>
        {isTimerRunning ? 'Pausar' : 'Iniciar'}
      </button>
    </div>
  );
}
```

### 🚀 Vantagens da Implementação

✅ **Centralizado**: Todo estado relacionado ao Pomodoro em um lugar  
✅ **Performance**: Usa Web Worker para timer sem bloquear a UI  
✅ **Type-safe**: Totalmente tipado com TypeScript  
✅ **Fácil de usar**: Um único hook para acessar tudo  
✅ **Reutilizável**: Disponível em qualquer componente da aplicação  
✅ **Sincronizado**: Timer e modo sempre em sincronia  
✅ **Callbacks flexíveis**: `startTimer` aceita callback opcional para `onComplete`

### 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│         PomodoroProvider (Context)      │
│  - Gerencia estado de sessão            │
│  - Gerencia estado de tarefas           │
│  - Integra com timerService             │
│  - Sincroniza com useAuth (user prefs)  │
└───────────────┬─────────────────────────┘
                │
                ├──> timerService
                │    └──> Web Worker (timer-work.ts)
                │         └──> Executa timer em thread separada
                │
                └──> Qualquer componente da aplicação
                     └──> usePomodoro() hook
```

---

## 📚 Comparação com Outras Soluções

### 2. **Zustand** (Alternativa Recomendada)

Uma biblioteca minimalista, seria útil se o app crescer muito.

**Instalação:**
```bash
npm install zustand
```

**Exemplo:**
```tsx
// stores/pomodoro-store.ts
import { create } from 'zustand';

export const usePomodoroStore = create<PomodoroState>((set) => ({
  currentMode: 'focus',
  tasksSelected: [],
  isTimerRunning: false,
  timeLeft: 1500,
  
  startTimer: () => set({ isTimerRunning: true }),
  stopTimer: () => set({ isTimerRunning: false }),
  setCurrentMode: (mode) => set({ currentMode: mode }),
}));
```

**Vantagens:**
- ✅ Menos boilerplate
- ✅ Excelente performance
- ✅ DevTools disponíveis

**Desvantagens:**
- ⚠️ Dependência externa
- ⚠️ Precisa migrar código existente

---

### 3. **Redux Toolkit** (Para apps muito grandes)

**Instalação:**
```bash
npm install @reduxjs/toolkit react-redux
```

**Exemplo:**
```tsx
import { createSlice } from '@reduxjs/toolkit';

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState: {
    currentMode: 'focus',
    isTimerRunning: false,
    timeLeft: 1500,
  },
  reducers: {
    startTimer: (state) => { state.isTimerRunning = true; },
    stopTimer: (state) => { state.isTimerRunning = false; },
  },
});
```

**Vantagens:**
- ✅ Padrão da indústria
- ✅ DevTools poderosas
- ✅ Ideal para apps muito grandes

**Desvantagens:**
- ⚠️ Muito boilerplate
- ⚠️ Curva de aprendizado
- ⚠️ Overkill para o Nexo

---

### 4. **Jotai** (Atomic State)

**Instalação:**
```bash
npm install jotai
```

**Exemplo:**
```tsx
import { atom, useAtom } from 'jotai';

const currentModeAtom = atom<SessionType>('focus');
const isTimerRunningAtom = atom(false);

function Component() {
  const [currentMode, setCurrentMode] = useAtom(currentModeAtom);
  const [isTimerRunning] = useAtom(isTimerRunningAtom);
}
```

**Vantagens:**
- ✅ Muito leve
- ✅ Simples de usar
- ✅ Bom para estados pequenos

**Desvantagens:**
- ⚠️ Menos estruturado para lógica complexa

---

## 🎯 Recomendação

**Mantenha o Context API atual porque:**

1. ✅ Solução nativa do React (zero dependências)
2. ✅ Perfeito para o tamanho do Nexo
3. ✅ Já está bem estruturado e funcionando
4. ✅ Fácil manutenção
5. ✅ Integração limpa com Web Worker

**Considere migrar para Zustand apenas se:**
- O app crescer significativamente (10+ contextos)
- Tiver problemas de performance (muitos re-renders)
- Precisar de DevTools mais avançadas

---

## 🔧 Melhorias Futuras (Opcionais)

### 1. Persistência do Estado
```tsx
// Salvar no localStorage
useEffect(() => {
  localStorage.setItem('pomodoroState', JSON.stringify({
    currentMode,
    tasksSelected,
  }));
}, [currentMode, tasksSelected]);
```

### 2. Undo/Redo
```tsx
// Usar immer para histórico de estados
import { useImmer } from 'use-immer';
```

### 3. Estado do Timer persistente
```tsx
// Salvar progresso do timer no localStorage para sobreviver refresh
```

---

## 📖 Recursos

- [Context API Docs](https://react.dev/reference/react/createContext)
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Zustand](https://github.com/pmndrs/zustand)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Jotai](https://jotai.org/)
