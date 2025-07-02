import { DURATION_LIMITS, DURATION_STEP } from "../config/pomodoro-configs";

export const roundToStep = (value: number) =>
  Math.round(value / DURATION_STEP) * DURATION_STEP;

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const clampFocusDuration = (value: number) =>
  clamp(roundToStep(value), DURATION_LIMITS.focus.min, DURATION_LIMITS.focus.max);

export const clampShortBreakDuration = (value: number) =>
  clamp(roundToStep(value), DURATION_LIMITS.shortBreak.min, DURATION_LIMITS.shortBreak.max);

export const clampLongBreakDuration = (value: number) =>
  clamp(roundToStep(value), DURATION_LIMITS.longBreak.min, DURATION_LIMITS.longBreak.max);