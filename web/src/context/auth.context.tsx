import { AxiosError } from "axios";
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

type ValidationError = {
  validation?: string;
  code: string;
  message: string;
  path: string[];
  minimum?: number;
  type?: string;
  inclusive?: boolean;
  exact?: boolean;
};

type ErrorResponse = {
  statusCode: number;
  error: string;
  message: string;
  errors: ValidationError[];
};

type AuthContextType = {
  login: (
    data: LoginData
  ) => Promise<{ loginError: ErrorResponse; isError: boolean }>;
  register: (
    data: RegisterData
  ) => Promise<{ registerError: ErrorResponse; isError: boolean }>;
  logout: () => void;
  updateUser: (data: Partial<UserType>) => Promise<void>;
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const authContext = createContext({} as AuthContextType);

type UserResponse = {
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
    completedOnboarding: boolean;
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
      const response = await api.post<UserResponse>("login", {
        email,
        password,
      });

      setUser(response.data.user);
      api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsLoading(false);
      return {
        isError: false,
        loginError: { statusCode: 200, error: "", message: "", errors: [] },
      };
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        return {
          isError: true,
          loginError: {
            statusCode: error.response?.status || 500,
            error: error.message,
            message: error.response?.data.message || "Erro ao fazer login",
            errors: error.response?.data.errors || [],
          },
        };
      }
      return {
        isError: true,
        loginError: {
          statusCode: 500,
          error: "Unknown Error",
          message: "Erro ao fazer login",
          errors: [],
        },
      };
    }
  };

  const register = async ({ name, email, password }: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/user", {
        name,
        email,
        password,
      });

      setUser(response.data.user);
      api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsLoading(false);
      return { isError: false, registerError: {} };
    } catch (error) {
      console.error("Register error:", error);
      setIsLoading(false);
      if (error instanceof AxiosError) {
        return {
          isError: true,
          registerError: error.response?.data,
        };
      }
      return { isError: true, registerError: {} };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const updateUser = async () => {
    setIsLoading(true);
    try {
      const user = await api.get<UserType>("/user");
      setUser(user.data);
      localStorage.setItem("user", JSON.stringify(user.data));
      setIsLoading(false);
    } catch (error) {
      console.error("Update user error:", error);
      setIsLoading(false);
    }
  };

  return (
    <authContext.Provider
      value={{
        login,
        user,
        isAuthenticated: !!user,
        register,
        logout,
        isLoading,
        updateUser,
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
