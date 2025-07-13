import { useEffect, useRef, useState } from 'react'

type TimerConfig = {
  duration: number
  onTick?: (remaining: number, accumulatedTime: number) => void
  onComplete?: (accumulatedTime: number) => void
}

type UseTimerResponse = {
  startTimer: () => void
  stopTimer: () => void
}

export function useTimer({
  duration,
  onTick,
  onComplete,
}: TimerConfig): UseTimerResponse {
  const [accumulatedTime, setAccumulatedTime] = useState(0)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../works/timer-work.ts', import.meta.url)
      )
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const startTimer = () => {
    setAccumulatedTime(0)
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../works/timer-work.ts', import.meta.url)
      )
    }

    workerRef.current.onmessage = event => {
      const { type, remaining } = event.data

      if (type === 'tick') {
        onTick?.(remaining, accumulatedTime)
        setAccumulatedTime(prev => prev + 1)
      } else if (type === 'complete') {
        onComplete?.(accumulatedTime)
        stopTimer()
      }
    }

    workerRef.current.postMessage({ duration, type: 'start' })
  }

  const stopTimer = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' })
    }
  }

  return { startTimer, stopTimer }
}
