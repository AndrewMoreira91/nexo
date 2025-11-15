export function calculateProgress(completionTime: number, target: number) {
  const progress = (completionTime / target) * 100

  if (progress > 100) {
    return 100
  }
  const clampedProgress = Math.min(progress, 100)

  return Number(clampedProgress.toFixed(1))
}
