import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteTask,
  fetchTasks,
  postTask,
  updateTask,
} from '../services/task-service'
import type { TaskType } from '../types'

export const useFetchTasks = () => {
  return useQuery<TaskType[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export const usePostTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postTask,
    onSuccess: newTask => {
      queryClient.setQueryData<TaskType[]>(['tasks'], oldTasks => {
        return oldTasks ? [...oldTasks, newTask] : [newTask]
      })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      queryClient.setQueryData<TaskType[]>(['tasks'], oldTasks => {
        return oldTasks ? oldTasks.filter(task => task.id !== taskId) : []
      })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    onSuccess: updatedTask => {
      queryClient.setQueryData<TaskType[]>(['tasks'], oldTasks => {
        return oldTasks
          ? oldTasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
          : []
      })
    },
  })
}

export const useFetchCompletedTasks = () => {
  return useQuery<TaskType[]>({
    queryKey: ['completedTasks'],
    queryFn: async () => {
      const { api } = await import('../libs/api')
      const response = await api.get<TaskType[]>('/task?isCompleted=true&isDeleted=false')
      return response.data.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
