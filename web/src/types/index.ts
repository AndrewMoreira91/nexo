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
	completedOnboarding: boolean;
	selectedDaysOfWeek: number[];
};

export type TaskType = {
	id: string;
	userId: string;
	dailyProgressId: string;
	title: string;
	isCompleted: boolean;
	updated_at: Date | null;
	created_at: Date;
	deleted_at: Date | null;
};

export type TaskEditType = {
	taskId: string;
	newTitle?: string;
	isCompleted?: boolean;
};

export type DataProgressType = {
	date: string;
	isGoalComplete: boolean;
	sessionsCompleted: number;
	totalSessionFocusDuration: number;
	streak: number;
};

export type DataStatisticsType = {
	streak: number;
	longestStreak: number;
	totalSessionFocusDuration: number;
	sessionsFocusCompleted: number;
	numTasksCompleted: number;
	tasksCompleted: TaskType[];
	dailyMediaDuration: number;
	weeklyTrend?: number;
	bestDay: {
		date: string;
		timeCompleted: number;
		isTargetCompleted: boolean;
	};
	worstDay: {
		date: string;
		timeCompleted: number;
		isTargetCompleted: boolean;
	};
};
