import { api } from '../libs/api'
import type { TaskEditType, TaskType } from '../types'

export const fetchTasks = async (): Promise<TaskType[]> => {
  const { data } = await api.get<TaskType[]>('/task?isCompleted=false')
  return data.sort((a, b) => Number(b.isCompleted) - Number(a.isCompleted))
}

export const fetchCompletedTasks = async () => {
  const { api } = await import('../libs/api')
  const response = await api.get<TaskType[]>('/task?isCompleted=true&isDeleted=false')
  return response.data
    .sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
    )
}

export const postTask = async (title: string): Promise<TaskType> => {
  const response = await api.post('/task', { title })
  return response.data
}

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/task/${taskId}`)
}

export const updateTask = async ({
  taskId,
  newTitle,
  isCompleted = false,
}: TaskEditType): Promise<TaskType> => {
  const response = await api.put(`/task/${taskId}`, {
    title: newTitle,
    isCompleted,
  })
  return response.data
}
