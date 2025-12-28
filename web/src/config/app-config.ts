/**
 * Configurações gerais da aplicação
 * Centralize aqui informações que podem mudar facilmente
 */

export const APP_CONFIG = {
	name: 'Nekso',
	description: 'Aplicação web para gestão de estudos e produtividade baseada no método Pomodoro',
	url: {
		web: 'https://nekso.vercel.app',
		api: 'https://nekso-api.vercel.app'
	},
	author: {
		name: 'Andrew Moreira',
		email: 'andrewsantos9113@gmail.com'
	},
	social: {
		github: 'https://github.com/AndrewMoreira91/nexo'
	},
	assets: {
		logo: '/logo-icon-nekso.svg',
		favicon: '/logo-icon-nekso.svg'
	}
} as const;
