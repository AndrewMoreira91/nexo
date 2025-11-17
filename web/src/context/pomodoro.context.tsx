import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DURATIONS,
  type SessionType,
} from "../config/pomodoro-configs";
import { timerService } from "../services/timer-service";
import { useAuth } from "./auth.context";

interface PomodoroContextType {
  // Session State
  currentMode: SessionType;
  setCurrentMode: (mode: SessionType) => void;
  resetSession: (mode: SessionType) => void;

  // Tasks State
  tasksSelected: string[];
  setTasksSelected: (tasks: string[]) => void;
  toggleTaskSelection: (taskId: string) => void;

  // Timer State
  isTimerRunning: boolean;
  timeLeft: number;
  startTimer: (onComplete?: () => void) => void;
  stopTimer: () => void;
  updateTimeLeft: (mode: SessionType) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Session State
  const [currentMode, setCurrentMode] = useState<SessionType>("focus");

  // Tasks State
  const [tasksSelected, setTasksSelected] = useState<string[]>([]);

  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(() =>
    timerService.getIsRunning()
  );
  const [timeLeft, setTimeLeft] = useState(
    user?.focusSessionDuration || DEFAULT_DURATIONS.default.focus
  );

  // Update time left when mode or user changes
  useEffect(() => {
    if (!user) return;

    const durations = {
      focus: user.focusSessionDuration,
      shortBreak: user.shortBreakSessionDuration,
      longBreak: user.longBreakSessionDuration,
    };

    setTimeLeft(durations[currentMode]);
  }, [currentMode, user]);

  // Setup timer callbacks
  useEffect(() => {
    timerService.setCallbacks({
      onTick: (remaining: number) => {
        setTimeLeft(remaining);
      },
      onComplete: () => {
        setIsTimerRunning(false);
      },
    });
  }, []);

  const updateTimeLeft = useCallback(
    (mode: SessionType) => {
      if (!user) return;

      const durations = {
        focus: user.focusSessionDuration,
        shortBreak: user.shortBreakSessionDuration,
        longBreak: user.longBreakSessionDuration,
      };

      setTimeLeft(durations[mode]);
    },
    [user]
  );

  const startTimer = useCallback(
    (onComplete?: () => void) => {
      setIsTimerRunning(true);
      timerService.start(timeLeft, {
        onTick: (remaining: number) => {
          setTimeLeft(remaining);
        },
        onComplete: () => {
          setIsTimerRunning(false);
          onComplete?.();
        },
      });
    },
    [timeLeft]
  );

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
    timerService.stop();
  }, []);

  const resetSession = useCallback(
    (mode: SessionType) => {
      setCurrentMode(mode);
      updateTimeLeft(mode);
    },
    [updateTimeLeft]
  );

  const toggleTaskSelection = useCallback(
    (taskId: string) => {
      if (tasksSelected.includes(taskId)) {
        setTasksSelected(tasksSelected.filter((id) => id !== taskId));
      } else {
        setTasksSelected([...tasksSelected, taskId]);
      }
    },
    [tasksSelected]
  );

  return (
    <PomodoroContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        resetSession,
        tasksSelected,
        setTasksSelected,
        toggleTaskSelection,
        isTimerRunning,
        timeLeft,
        startTimer,
        stopTimer,
        updateTimeLeft,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
}
