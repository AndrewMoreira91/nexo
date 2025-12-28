import { UserType } from "../types";

export type LoginData = {
	email: string;
	password: string;
};

export type RegisterData = {
	name: string;
	email: string;
	password: string;
};

export type ValidationError = {
	validation?: string;
	code: string;
	message: string;
	path: string[];
	minimum?: number;
	type?: string;
	inclusive?: boolean;
	exact?: boolean;
};

export interface ErrorResponse {
	statusCode: number;
	error: string;
	message: string;
	errors: ValidationError[];
};

export type AuthContextType = {
	login: (
		data: LoginData
	) => Promise<{ error: ErrorResponse | null; isError: boolean }>;
	register: (
		data: RegisterData
	) => Promise<{ error: ErrorResponse | null; isError: boolean }>;
	logout: () => void;
	updateUser: (data?: Partial<UserType>) => Promise<void>;
	user: UserType | null;
	isAuthenticated: boolean;
	isLoading: boolean;
};

export type UserResponse = {
	user: UserType;
	accessToken: string;
};