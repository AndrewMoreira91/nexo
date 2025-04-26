export type UserType = {
  id: string
  email: string
  name: string
  dailySessionTarget: number
  focusSessionDuration: number
  shortBreakSessionDuration: number
  longBreakSessionDuration: number
  streak: number
  longestStreak: number
}

export type TaskType = {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  inProgress?: boolean
}

export type TaskEditType = {
  taskId: string
  newTitle?: string
  isCompleted?: boolean
}

export type DataProgressType = {
  date: string
  isGoalComplete: boolean
  sessionsCompleted: number
  totalSessionFocusDuration: number
  streak: number
}

export type DataStatisticsType = {
  streak: number
  longestStreak: number
  totalSessionFocusDuration: number
  sessionsFocusCompleted: number
  numTasksCompleted: number
  tasksCompleted: TaskType[]
  dailyMediaDuration: number
  weeklyTrend?: number
  bestDay: {
    date: string
    timeCompleted: number
    isTargetCompleted: boolean
  }
  worstDay: {
    date: string
    timeCompleted: number
    isTargetCompleted: boolean
  }
}
