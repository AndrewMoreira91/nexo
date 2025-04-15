import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { api } from "../libs/api";
import type { UserType } from "../types";

type LoginData = {
	email: string;
	password: string;
};

type RegisterData = {
	name: string;
	email: string;
	password: string;
};

type AuthContextType = {
	login: (data: LoginData) => void;
	register: (data: RegisterData) => void;
	lougout: () => void;
	user: UserType | null;
	isAuthenticated: boolean;
	isLoading: boolean;
};

const authContext = createContext({} as AuthContextType);

type LoginResponse = {
	user: {
		id: string;
		name: string;
		email: string;
		dailySessionTarget: number;
		focusSessionDuration: number;
		shortBreakSessionDuration: number;
		longBreakSessionDuration: number;
		streak: number;
		longestStreak: number;
	};
	accessToken: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const userLocalStorage = localStorage.getItem("user");
		const accessTokenLocalStorage = localStorage.getItem("accessToken");
		if (userLocalStorage && accessTokenLocalStorage) {
			const userParsed = JSON.parse(userLocalStorage);
			setUser(userParsed);
			const accessTokenParsed = accessTokenLocalStorage;
			api.defaults.headers.common.Authorization = `Bearer ${accessTokenParsed}`;
		}
		setIsLoading(false);
	}, []);

	const login = async ({ email, password }: LoginData) => {
		setIsLoading(true);
		try {
			const response = await api.post<LoginResponse>("login", {
				email,
				password,
			});
			console.log("Login response:", response.data);
			setUser(response.data.user);
			api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

			localStorage.setItem("accessToken", response.data.accessToken);
			localStorage.setItem("user", JSON.stringify(response.data.user));

			setIsLoading(false);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Login error:", error.message);
			} else {
				console.error("Login error:", error);
			}
			setIsLoading(false);
		}
	};

	const register = ({ name, email, password }: RegisterData) => {
		console.log("Register", { name, email, password });
		setUser(user);
		localStorage.setItem("user", JSON.stringify(user));
	};

	const lougout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<authContext.Provider
			value={{
				login,
				user,
				isAuthenticated: !!user,
				register,
				lougout,
				isLoading,
			}}
		>
			{children}
		</authContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(authContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
