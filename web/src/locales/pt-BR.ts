/**
 * Traduções em Português (Brasil)
 * Mantenha as chaves organizadas por contexto/página
 */

export const ptBR = {
	// Geral
	app: {
		name: 'Nekso' as string,
		tagline: 'Gestão de estudos e produtividade' as string,
	},

	// Autenticação
	auth: {
		login: {
			title: 'Entre no Nekso',
			email: 'E-mail',
			password: 'Senha',
			button: 'Entrar',
			forgotPassword: 'Esqueceu a senha?',
			noAccount: 'Não tem uma conta?',
			register: 'Cadastre-se',
		},
		register: {
			title: 'Crie sua conta no Nekso',
			name: 'Nome',
			email: 'E-mail',
			password: 'Senha',
			confirmPassword: 'Confirme a senha',
			button: 'Criar conta',
			hasAccount: 'Já tem uma conta?',
			login: 'Entre',
		},
	},

	// Header
	header: {
		dashboard: 'Dashboard',
		pomodoro: 'Pomodoro',
		settings: 'Configurações',
		logout: 'Sair',
	},

	// Footer
	footer: {
		rights: `© ${new Date().getFullYear()} Nekso. Todos os direitos reservados.` as string,
	},

	// Dashboard
	dashboard: {
		welcome: 'Bem-vindo',
		todayGoal: 'Meta de hoje',
		streak: 'Dias consecutivos',
		totalSessions: 'Sessões totais',
		totalTime: 'Tempo total',
	},

	// Pomodoro
	pomodoro: {
		focus: 'Foco',
		shortBreak: 'Pausa curta',
		longBreak: 'Pausa longa',
		start: 'Iniciar',
		pause: 'Pausar',
		resume: 'Continuar',
		stop: 'Parar',
		skip: 'Pular',
	},

	// Tarefas
	tasks: {
		title: 'Tarefas',
		add: 'Adicionar tarefa',
		edit: 'Editar tarefa',
		delete: 'Excluir tarefa',
		complete: 'Concluir',
		incomplete: 'Incompleto',
		empty: 'Nenhuma tarefa cadastrada',
	},

	// Configurações
	settings: {
		title: 'Configurações',
		profile: 'Perfil',
		pomodoro: 'Pomodoro',
		notifications: 'Notificações',
		theme: 'Tema',
		language: 'Idioma',
		save: 'Salvar',
		cancel: 'Cancelar',
	},

	// Notificações
	notifications: {
		sessionComplete: 'Sessão concluída!',
		breakComplete: 'Pausa concluída!',
		taskComplete: 'Tarefa concluída!',
		goalReached: 'Meta alcançada!',
	},

	// Erros
	errors: {
		generic: 'Algo deu errado. Tente novamente.',
		network: 'Erro de conexão. Verifique sua internet.',
		auth: 'Erro de autenticação. Faça login novamente.',
		notFound: 'Página não encontrada.',
	},

	// Botões gerais
	buttons: {
		save: 'Salvar',
		cancel: 'Cancelar',
		delete: 'Excluir',
		edit: 'Editar',
		close: 'Fechar',
		confirm: 'Confirmar',
		back: 'Voltar',
	},
};

export type Translations = typeof ptBR;
