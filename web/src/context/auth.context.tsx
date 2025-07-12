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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type UserResponse = {
  user: UserType;
  accessToken: string;
};

const getStoredToken = (): string | null => localStorage.getItem("accessToken");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      const response = await api.get<UserType>("/user");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();

      if (storedToken) {
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        setIsAuthenticated(true);
        await getUser();
      } else {
        setUser(null);
        setIsAuthenticated(false);
        delete api.defaults.headers.common.Authorization;
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (user: UserType, accessToken: string) => {
    setUser(user);
    setIsAuthenticated(true);
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    localStorage.setItem("accessToken", accessToken);
  };

  const handleAuthError = (
    error: unknown,
    defaultMsg: string
  ): ErrorResponse => {
    if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      return {
        statusCode: status || 500,
        error: error.message,
        message: data?.message || defaultMsg,
        errors: data?.errors || [],
      };
    }
    return {
      statusCode: 500,
      error: "Unknown Error",
      message: defaultMsg,
      errors: [],
    };
  };

  const login = async ({ email, password }: LoginData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post<UserResponse>("login", {
        email,
        password,
      });
      handleAuthSuccess(data.user, data.accessToken);
      return { isError: false, error: null };
    } catch (err) {
      return {
        isError: true,
        error: handleAuthError(err, "Erro ao fazer login"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ name, email, password }: RegisterData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post<UserResponse>("/user", {
        name,
        email,
        password,
      });
      handleAuthSuccess(data.user, data.accessToken);
      return { isError: false, error: null };
    } catch (err) {
      return {
        isError: true,
        error: handleAuthError(err, "Erro ao registrar"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common.Authorization;
  };

  const updateUser = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<UserType>("/user");
      setUser(data);
    } catch (err) {
      handleAuthError(err, "Erro ao atualizar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        updateUser,
        user,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
