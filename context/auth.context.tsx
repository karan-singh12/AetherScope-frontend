"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuthToken, clearAuthToken, getProfile, updateProfile as apiUpdateProfile } from "../services/auth.service";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setToken(token);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.userId, email: payload.email });

        // Fetch fresh profile details from DB
        (async () => {
          try {
            const freshUser = await getProfile();
            setUser({ id: freshUser.id, email: freshUser.email, name: freshUser.name || undefined });
          } catch (err) {
            console.error("Failed to load fresh user profile", err);
          }
        })();
      } catch (error) {
        console.error("Failed to parse token");
        clearAuthToken();
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (name: string, email: string) => {
    const updatedUser = await apiUpdateProfile(name, email);
    setUser({ id: updatedUser.id, email: updatedUser.email, name: updatedUser.name || undefined });
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
