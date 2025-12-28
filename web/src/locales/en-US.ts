/**
 * English (US) translations
 * Keep keys organized by context/page
 */

import type { Translations } from './pt-BR';

export const enUS: Translations = {
	// General
	app: {
		name: 'Nekso',
		tagline: 'Study and productivity management',
	},

	// Authentication
	auth: {
		login: {
			title: 'Sign in to Nekso',
			email: 'Email',
			password: 'Password',
			button: 'Sign in',
			forgotPassword: 'Forgot password?',
			noAccount: "Don't have an account?",
			register: 'Sign up',
		},
		register: {
			title: 'Create your Nekso account',
			name: 'Name',
			email: 'Email',
			password: 'Password',
			confirmPassword: 'Confirm password',
			button: 'Create account',
			hasAccount: 'Already have an account?',
			login: 'Sign in',
		},
	},

	// Header
	header: {
		dashboard: 'Dashboard',
		pomodoro: 'Pomodoro',
		settings: 'Settings',
		logout: 'Logout',
	},

	// Footer
	footer: {
		rights: `© ${new Date().getFullYear()} Nekso. All rights reserved.`,
	},

	// Dashboard
	dashboard: {
		welcome: 'Welcome',
		todayGoal: "Today's goal",
		streak: 'Days streak',
		totalSessions: 'Total sessions',
		totalTime: 'Total time',
	},

	// Pomodoro
	pomodoro: {
		focus: 'Focus',
		shortBreak: 'Short break',
		longBreak: 'Long break',
		start: 'Start',
		pause: 'Pause',
		resume: 'Resume',
		stop: 'Stop',
		skip: 'Skip',
	},

	// Tasks
	tasks: {
		title: 'Tasks',
		add: 'Add task',
		edit: 'Edit task',
		delete: 'Delete task',
		complete: 'Complete',
		incomplete: 'Incomplete',
		empty: 'No tasks registered',
	},

	// Settings
	settings: {
		title: 'Settings',
		profile: 'Profile',
		pomodoro: 'Pomodoro',
		notifications: 'Notifications',
		theme: 'Theme',
		language: 'Language',
		save: 'Save',
		cancel: 'Cancel',
	},

	// Notifications
	notifications: {
		sessionComplete: 'Session completed!',
		breakComplete: 'Break completed!',
		taskComplete: 'Task completed!',
		goalReached: 'Goal reached!',
	},

	// Errors
	errors: {
		generic: 'Something went wrong. Try again.',
		network: 'Connection error. Check your internet.',
		auth: 'Authentication error. Please login again.',
		notFound: 'Page not found.',
	},

	// General buttons
	buttons: {
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		edit: 'Edit',
		close: 'Close',
		confirm: 'Confirm',
		back: 'Back',
	},
};
