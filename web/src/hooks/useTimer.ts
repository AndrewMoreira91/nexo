import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_DURATIONS, SessionType } from '../config/pomodoro-configs'
import { useAuth } from '../context/auth.context'
import { timerService } from '../services/timer-service'

type TimerConfig = {
  onTick?: (remaining: number) => void
  onComplete?: () => void
}

type UseTimerResponse = {
  startTimer: () => void
  stopTimer: () => void
  isTimerRunning: boolean
  timeLeft: number
  updateTimeLeft: (mode: SessionType) => void
}

export function useTimer({
  onTick,
  onComplete,
}: TimerConfig): UseTimerResponse {
  const [isTimerRunning, setIsTimerRunning] = useState(() =>
    timerService.getIsRunning()
  )

  const { user } = useAuth()

  const [timeLeft, setTimeLeft] = useState(user?.focusSessionDuration || DEFAULT_DURATIONS.default.focus)

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

  // Update callbacks whenever they change
  useEffect(() => {
    timerService.setCallbacks({
      onTick: (remaining: number) => {
        setTimeLeft(remaining)
        onTick?.(remaining)
      },
      onComplete: () => {
        setIsTimerRunning(false)
        onComplete?.()
      },
    })
  }, [onTick, onComplete])

  // Sync local state with timer service on mount
  useEffect(() => {
    setIsTimerRunning(timerService.getIsRunning())
  }, [])

  const startTimer = () => {
    setIsTimerRunning(true)
    timerService.start(timeLeft, {
      onTick,
      onComplete: () => {
        setIsTimerRunning(false)
        onComplete?.()
      },
    })
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    timerService.stop()
  }

  return { startTimer, stopTimer, isTimerRunning, timeLeft, updateTimeLeft }
}
