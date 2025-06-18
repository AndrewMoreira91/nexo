import { users } from "../../drizzle/schemas/user-schema";

export const userDataResponse = {
	id: users.id,
	name: users.name,
	email: users.email,
	dailySessionTarget: users.dailySessionTarget,
	focusSessionDuration: users.focusSessionDuration,
	shortBreakSessionDuration: users.shortBreakSessionDuration,
	longBreakSessionDuration: users.longBreakSessionDuration,
	streak: users.streak,
	longestStreak: users.longestStreak,
	completedOnboarding: users.completedOnboarding,
	selectedDaysOfWeek: users.selectedDaysOfWeek,
	updated_at: users.updated_at,
	created_at: users.created_at,
	deleted_at: users.deleted_at,
};
