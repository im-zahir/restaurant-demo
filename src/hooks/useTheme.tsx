"use client";

import { useState, useEffect, createContext, useContext } from "react";

export type ThemeType = "luxury" | "vibrant" | "minimal";

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("luxury");

  // Load theme from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("restaurant-theme") as ThemeType;
    if (savedTheme && ["luxury", "vibrant", "minimal"].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Update localStorage and document class when theme changes
  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem("restaurant-theme", theme);
    
    // Apply theme class to html tag for global CSS targeting
    const root = document.documentElement;
    root.classList.remove("theme-luxury", "theme-vibrant", "theme-minimal");
    root.classList.add(`theme-${theme}`);
  };

  // Synchronize class on mount/theme state change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-luxury", "theme-vibrant", "theme-minimal");
    root.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
