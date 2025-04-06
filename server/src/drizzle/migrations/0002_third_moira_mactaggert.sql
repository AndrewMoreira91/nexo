ALTER TABLE "users" ALTER COLUMN "focus_session_duration" SET DEFAULT 1500;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "short_break_session_duration" SET DEFAULT 300;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "long_break_session_duration" SET DEFAULT 900;