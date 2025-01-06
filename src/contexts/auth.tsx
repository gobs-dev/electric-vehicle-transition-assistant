"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useToast } from "@/hooks/use-toast";

interface User {
  name: string;
  country: string;
  car: string;
  monthly_mileage: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  saveUser: (data: User) => void;
}

const USER_KEY_STORAGE = "ev-app-user";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  logout: async () => {},
  saveUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const userStorage = window.localStorage.getItem(USER_KEY_STORAGE);

    return userStorage ? JSON.parse(userStorage) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearAuthState = useCallback(() => {
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      clearAuthState();
    } catch {
      toast({
        title: "Failed to logout",
      });
    }
  }, [toast, clearAuthState]);

  const saveUser = useCallback(async (user: User) => {
    setUser(user);
    window.localStorage.setItem(USER_KEY_STORAGE, JSON.stringify(user));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      logout,
      saveUser,
    }),
    [user, logout, saveUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
