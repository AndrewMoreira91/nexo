import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react'
import type { UserType } from '../types'

type LoginData = {
	email: string
	password: string
}

type RegisterData = {
	name: string
	email: string
	password: string
}

type AuthContextType = {
	login: (data: LoginData) => void
	register: (data: RegisterData) => void
	lougout: () => void
	user: UserType | null
	isAuthenticated: boolean
	isLoading: boolean
}

const userFake = {
	id: '123456789',
	name: 'John Doe',
	email: 'johndoe@example.com',
	dailySessionTarget: 60,
	streak: 5,
	longestStreak: 10,
	focusSessionDuration: 1500,
	shortBreakSessionDuration: 300,
	longBreakSessionDuration: 900,
} as UserType

const authContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserType | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const userLocalStorage = localStorage.getItem('user')
		if (userLocalStorage) {
			const userParsed = JSON.parse(userLocalStorage)
			setUser(userParsed)
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [])

	const login = ({ email, password }: LoginData) => {
		console.log('Login', { email, password })
		setUser(userFake)
		localStorage.setItem('user', JSON.stringify(userFake))
	}

	const register = ({ name, email, password }: RegisterData) => {
		console.log('Register', { name, email, password })
		setUser(userFake)
		localStorage.setItem('user', JSON.stringify(userFake))
	}

	const lougout = () => {
		console.log('Logout')
		setUser(null)
		localStorage.removeItem('user')
	}

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
	)
}

export const useAuth = () => {
	const context = useContext(authContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
