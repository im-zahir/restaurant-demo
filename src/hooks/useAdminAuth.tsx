"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else if (pathname.startsWith("/admin") && !pathname.includes("/login")) {
      router.push("/admin/login");
    }
    setIsLoaded(true);
  }, [pathname, router]);

  const login = (password: string) => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    router.push("/");
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoaded, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
