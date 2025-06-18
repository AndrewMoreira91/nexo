import { z } from "zod";

export const TaskSchema = z.object({
	updated_at: z.date().nullable(),
	created_at: z.date(),
	deleted_at: z.date().nullable(),
	id: z.string(),
	userId: z.string(),
	dailyProgressId: z.string(),
	title: z.string(),
	isCompleted: z.boolean(),
});

export const SessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	dailyProgressId: z.string(),
	duration: z.number(),
	type: z.enum(["focus", "shortBreak", "longBreak"]),
	startTime: z.date(),
	endTime: z.date().nullable(),
	sessionEndDate: z.string().nullable(),
	updated_at: z.date().nullable(),
	created_at: z.date(),
	deleted_at: z.date().nullable(),
});

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	dailySessionTarget: z.number(),
	focusSessionDuration: z.number(),
	shortBreakSessionDuration: z.number(),
	longBreakSessionDuration: z.number(),
	streak: z.number(),
	longestStreak: z.number(),
	selectedDaysOfWeek: z.array(z.number()).optional(),
	completedOnboarding: z.boolean(),
	updated_at: z.date().nullable(),
	created_at: z.date(),
	deleted_at: z.date().nullable(),
});
