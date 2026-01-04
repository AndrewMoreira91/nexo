import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteTask,
  fetchCompletedTasks,
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
    queryFn: fetchCompletedTasks,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
