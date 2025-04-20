type TimerConfig = {
  duration: number
  onTick: (remaining: number) => void
  onComplete: (accumulatedTime: number) => void
}

let timer: NodeJS.Timeout | null = null
export function timerFunction({ duration, onTick, onComplete }: TimerConfig) {
  let startTime: number | null = null
  let elapsedTime = 0
  let accumulatedTime = 0

  const countDown = () => {
    timer = setInterval(() => {
      if (startTime === null) return

      new Date()

      elapsedTime = Math.floor((Date.now() - startTime) / 1000)
      const remainingTime = duration - elapsedTime

      if (remainingTime < 0) {
        accumulatedTime = Math.abs(remainingTime)
      } else {
        accumulatedTime = 0
      }

      if (remainingTime <= 0) {
        stopTimer()
        onComplete(accumulatedTime)
      } else {
        onTick(remainingTime)
      }
    }, 1000)
  }

  const handleVisibilityChange = () => {
    if (startTime) {
      if (document.hidden && startTime !== null) {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000)
        if (timer) {
          clearInterval(timer)
          timer = null
        }
        return
      }

      countDown()
    }
  }

  const startTimer = () => {
    if (timer) return

    startTime = Date.now() - elapsedTime * 1000
    countDown()

    // document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  console.log(timer)

  const stopTimer = () => {
    console.log("stopTimer")
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return { startTimer, stopTimer, }
}