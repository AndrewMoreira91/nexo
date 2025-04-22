import { api } from "../libs/api";
import type { TaskEditType, TaskType } from "../types";

export const fetchTasks = async (): Promise<TaskType[]> => {
	const { data } = await api.get<TaskType[]>("/task");
	return data.sort((a, b) => Number(b.isCompleted) - Number(a.isCompleted));
};

export const postTask = async (title: string): Promise<TaskType> => {
	const response = await api.post("/task", { title });
	return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
	await api.delete(`/task/${taskId}`);
};

export const updateTask = async ({
	taskId,
	newTitle,
	isCompleted = false,
}: TaskEditType): Promise<TaskType> => {
	const response = await api.put(`/task/${taskId}`, {
		title: newTitle,
		isCompleted,
	});
	return response.data;
};
