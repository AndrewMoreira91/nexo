export type UserType = {
	id: string;
	email: string;
	name: string;
	dailySessionTarget: number;
	focusSessionDuration: number;
	shortBreakSessionDuration: number;
	longBreakSessionDuration: number;
	streak: number;
	longestStreak: number;
};

export type TaskType = {
	id: string;
	title: string;
	description?: string;
	isCompleted: boolean;
	inProgress?: boolean;
};

export type TaskEditType = {
	taskId: string;
	newTitle?: string;
	isCompleted?: boolean;
};
