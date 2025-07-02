export type UpdateUserProps = {
	email?: string;
	password?: string;
	streak?: number;
	dailySessionTarget?: number;
	focusSessionDuration?: number;
	shortBreakSessionDuration?: number;
	longBreakSessionDuration?: number;
	completedOnboarding?: boolean;
	selectedDaysOfWeek?: number[];
}