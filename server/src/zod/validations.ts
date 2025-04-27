import { z } from "zod";

export const emailValidation = z.string().email("O e-mail não é válido");

export const passwordValidation = z
	.string()
	.min(6, "A senha deve ter pelo menos 6 caracteres");

export const nameValidation = z
	.string()
	.min(3, "O nome deve ter pelo menos 3 caracteres")
	.max(50, "O nome deve ter no máximo 50 caracteres");

export const taskTitleValidation = z
	.string()
	.min(3, "O título deve ter pelo menos 3 caracteres")
	.max(50, "O título deve ter no máximo 50 caracteres");
