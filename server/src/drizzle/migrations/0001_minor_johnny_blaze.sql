ALTER TABLE "users" RENAME COLUMN "sessions_duration" TO "focus_session_duration";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "short_break_session_duration" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "long_break_session_duration" integer DEFAULT 0 NOT NULL;