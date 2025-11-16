export const DURATION_LIMITS = {
	focus: { min: 300, max: 10800 },
	shortBreak: { min: 60, max: 3600 },
	longBreak: { min: 120, max: 5400 },
};

export const DEFAULT_DURATIONS = {
	default: { focus: 1500, shortBreak: 300, longBreak: 900 },
	long: { focus: 3000, shortBreak: 600, longBreak: 1500 },
};

export const DURATION_STEP = 300; // 5 minutes in seconds

export type FocusOption = {
	id: string;
	title: string;
	description: string;
	tag: string;
};

export const FOCUS_OPTIONS: FocusOption[] = [
	{
		id: "default",
		title: "Padrão",
		description: "25 min de foco / 5 min de descanso / 15 min de descanso longo",
		tag: "Recomendado",
	},
	{
		id: "long",
		title: "Longo",
		description: "50 min de foco / 10 min de descanso / 25 min de descanso longo",
		tag: "Você pode ficar cansado",
	},
	{
		id: "personalized",
		title: "Personalizado",
		description: "Defina seus próprios tempos",
		tag: "Você no controle dos seus tempos",
	},
];