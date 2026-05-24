"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

type User = {
  id_anggota: number;
  username: string;
  role: "admin" | "user";
  no_anggota: string;
  status_anggota: string;
  nama_lengkap?: string;
  nim?: string;
  email?: string;
  angkatan?: string;
  fakultas?: string;
  program_studi?: string;
  no_hp?: string;
  alamat_domisili?: string;
  foto_profil?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("sadam_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem("sadam_token");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("sadam_token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Simple route protection logic
  useEffect(() => {
    if (isLoading) return;

    const isAuthRoute = pathname === "/login" || pathname === "/daftar" || pathname === "/";
    const isAdminRoute = pathname?.startsWith("/admin");

    if (!user && !isAuthRoute) {
      router.push("/login");
    } else if (user && isAuthRoute && pathname !== "/") {
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } else if (user && isAdminRoute && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem("sadam_token", token);
    setUser(userData);
    router.push(userData.role === "admin" ? "/admin" : "/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("sadam_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
