import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as authService from "@/services/auth";
import { User } from "@/services/auth";
import { API_BASE } from "@/constants/api";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await authService.getToken();
        if (token) {
          const res = await fetch(`${API_BASE}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            setUser(await res.json());
          } else {
            await authService.logout();
          }
        }
      } catch {} finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loginFn = async (username: string, password: string) => {
    const result = await authService.login(username, password);
    setUser(result.user);
  };

  const registerFn = async (username: string, email: string, password: string) => {
    await authService.register(username, email, password);
  };

  const logoutFn = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login: loginFn, register: registerFn, logout: logoutFn, updateUser: setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
