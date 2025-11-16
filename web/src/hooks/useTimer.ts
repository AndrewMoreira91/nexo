import { useEffect, useState } from 'react'
import { timerService } from '../services/timer-service'

type TimerConfig = {
  duration: number
  onTick?: (remaining: number) => void
  onComplete?: () => void
}

type UseTimerResponse = {
  startTimer: () => void
  stopTimer: () => void
  isTimerRunning: boolean
  timeLeft: number
}

export function useTimer({
  duration,
  onTick,
  onComplete,
}: TimerConfig): UseTimerResponse {
  const [isTimerRunning, setIsTimerRunning] = useState(() =>
    timerService.getIsRunning()
  )
  const [timeLeft, setTimeLeft] = useState(duration)

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
    timerService.start(duration, {
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

  return { startTimer, stopTimer, isTimerRunning, timeLeft }
}
