import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type LoginData = {
	email: string;
	password: string;
};

type RegisterData = {
	name: string;
	email: string;
	password: string;
};

type UserType = {
	name: string;
	email: string;
	dailySessionTarget: number;
	sessionDuration: number;
	streak: number;
	longestStreak: number;
};

type AuthContextType = {
	login: (data: LoginData) => void;
	register: (data: RegisterData) => void;
	lougout: () => void;
	user: UserType | null;
	isAuthenticated: boolean;
};

const userFake = {
	name: "John Doe",
	email: "johndoe@example.com",
	dailySessionTarget: 60,
	sessionDuration: 45,
	streak: 5,
	longestStreak: 10,
};

const authContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserType | null>(null);

	// Check if user is already logged in
	useEffect(() => {
		const userLocalStorage = localStorage.getItem("user");
		if (userLocalStorage) {
			const userParsed = JSON.parse(userLocalStorage);
			setUser(userParsed);
		}
	}, []);

	const login = ({ email, password }: LoginData) => {
		console.log("Login", { email, password });
		setUser(userFake);
		localStorage.setItem("user", JSON.stringify(userFake));
	};

	const register = ({ name, email, password }: RegisterData) => {
		console.log("Register", { name, email, password });
		setUser(userFake);
		localStorage.setItem("user", JSON.stringify(userFake));
	};

	const lougout = () => {
		console.log("Logout");
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
