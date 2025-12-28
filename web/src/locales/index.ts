/**
 * Sistema de internacionalização (i18n)
 * Para adicionar novos idiomas:
 * 1. Crie um novo arquivo (ex: es-ES.ts)
 * 2. Importe e adicione ao objeto translations
 * 3. Adicione o idioma ao tipo SupportedLocale
 */

import { enUS } from './en-US';
import { ptBR } from './pt-BR';

export type SupportedLocale = 'pt-BR' | 'en-US';

export const translations = {
	'pt-BR': ptBR,
	'en-US': enUS,
} as const;

export const defaultLocale: SupportedLocale = 'pt-BR';

/**
 * Hook para usar traduções
 * Exemplo de uso:
 * 
 * import { useTranslations } from '@/locales';
 * 
 * const t = useTranslations();
 * <h1>{t.auth.login.title}</h1>
 */
export function useTranslations(locale: SupportedLocale = defaultLocale) {
	return translations[locale];
}

/**
 * Função para obter traduções diretamente
 */
export function getTranslations(locale: SupportedLocale = defaultLocale) {
	return translations[locale];
}
