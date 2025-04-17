import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	deleteTask,
	fetchTasks,
	postTask,
	updateTask,
} from "../services/taskService";
import type { TaskType } from "../types";

export const useFetchTasks = () => {
	return useQuery<TaskType[]>({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const usePostTask = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postTask,
		onSuccess: (newTask) => {
			queryClient.setQueryData<TaskType[]>(["tasks"], (oldTasks) => {
				return oldTasks ? [...oldTasks, newTask] : [newTask];
			});
		},
	});
};

export const useDeleteTask = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteTask,
		onSuccess: (_, taskId) => {
			queryClient.setQueryData<TaskType[]>(["tasks"], (oldTasks) => {
				return oldTasks ? oldTasks.filter((task) => task.id !== taskId) : [];
			});
		},
	});
};

export const useUpdateTask = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateTask,
		onSuccess: (updatedTask) => {
			queryClient.setQueryData<TaskType[]>(["tasks"], (oldTasks) => {
				return oldTasks
					? oldTasks.map((task) =>
							task.id === updatedTask.id ? updatedTask : task,
						)
					: [];
			});
		},
	});
};
