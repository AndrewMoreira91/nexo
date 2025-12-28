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
import {
  AuthContextType,
  ErrorResponse,
  LoginData,
  RegisterData,
  UserResponse,
} from "./auth.context.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("accessToken");
  }
};

const getStoredToken = (): string | null => localStorage.getItem("accessToken");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
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
        setAuthToken(storedToken);
        await getUser();
      } else {
        setUser(null);
        setAuthToken(null);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (user: UserType, accessToken: string) => {
    setUser(user);
    setAuthToken(accessToken);
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
    setAuthToken(null);
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
        isAuthenticated: !!user,
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
