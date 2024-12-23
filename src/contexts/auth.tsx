"use client";

import {
  User as FirebaseUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axiosClient from "@/lib/axiosClient";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { User } from "@prisma/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  firebaseUser?: FBUser;
  logInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<User | false>;
  saveUser: (data: User | null) => void;
}

interface FBUser {
  email: string;
  name: string;
  firebaseUserId: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  firebaseUser: undefined,
  logInWithGoogle: async () => {},
  logout: async () => {},
  checkUser: async () => false,
  saveUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FBUser>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTokenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const checkUser = useCallback(async () => {
    try {
      const response = await axiosClient.get("/users");
      setUser(response?.data);
      return response?.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
      return false;
    }
  }, []);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    // delete axiosClient.instance.defaults.headers.common.Authorization;
  }, []);

  const refreshToken = useCallback(
    async (firebaseUser: FirebaseUser) => {
      try {
        const token = await firebaseUser.getIdToken(true);
        // axios.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
        return token;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        clearAuthState();
        return null;
      }
    },
    [clearAuthState]
  );

  const setupTokenRefresh = useCallback(
    (firebaseUser: FirebaseUser) => {
      // Clear any existing listener
      if (refreshTokenTimeoutRef.current) {
        clearTimeout(refreshTokenTimeoutRef.current);
      }

      // Set up a new listener that refreshes the token every 55 minutes
      refreshTokenTimeoutRef.current = setInterval(async () => {
        await refreshToken(firebaseUser);
      }, 55 * 60 * 1000); // 55 minutes
    },
    [refreshToken]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log("fbUser", fbUser);
      setIsLoading(true);
      if (fbUser) {
        setFirebaseUser({
          email: fbUser.email || "",
          name: fbUser.displayName || "",
          firebaseUserId: fbUser.uid,
        });
        setIsLoggedIn(true);
        await refreshToken(fbUser);
        setupTokenRefresh(fbUser);
        try {
          const userData = await checkUser();
          if (userData) {
            setUser(userData);
          }
        } catch {
          toast({
            title: "Failed to retrieve user information",
            description: "Please reload the page.",
          });
        }
      } else {
        clearAuthState();
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      if (refreshTokenTimeoutRef.current) {
        clearInterval(refreshTokenTimeoutRef.current);
      }
    };
  }, [checkUser, clearAuthState, toast, refreshToken, setupTokenRefresh]);

  const logInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      toast({
        title: "Failed to retrieve user information",
        description: "Please reload the page",
      });
      throw error;
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try {
      await auth.signOut();
      clearAuthState();
    } catch {
      toast({
        title: "Failed to logout",
      });
    }
  }, [toast, clearAuthState]);

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config) => {
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 errors, token refresh, etc.
        if (error.response?.status === 401) {
          // Attempt to refresh token or logout
          await logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]); // Add other dependencies if needed

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isLoggedIn,
      firebaseUser,
      logInWithGoogle,
      logout,
      checkUser,
      saveUser: setUser,
    }),
    [
      user,
      firebaseUser,
      isLoading,
      isLoggedIn,
      logInWithGoogle,
      logout,
      checkUser,
      setUser,
    ]
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
