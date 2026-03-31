"use client";

import { useState, useEffect, createContext, useContext } from "react";

export type ThemeType = "luxury" | "vibrant" | "minimal";
export type ModeType = "light" | "dark";

interface ThemeContextType {
  currentTheme: ThemeType;
  currentMode: ModeType;
  setTheme: (theme: ThemeType) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("luxury");
  const [currentMode, setCurrentMode] = useState<ModeType>("dark");

  // Load theme and mode from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("restaurant-theme") as ThemeType;
    if (savedTheme && ["luxury", "vibrant", "minimal"].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
    const savedMode = localStorage.getItem("restaurant-mode") as ModeType;
    if (savedMode && ["light", "dark"].includes(savedMode)) {
      setCurrentMode(savedMode);
    }
  }, []);

  // Update classes when theme or mode changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-luxury", "theme-vibrant", "theme-minimal", "light", "dark");
    root.classList.add(`theme-${currentTheme}`, currentMode);
    
    localStorage.setItem("restaurant-theme", currentTheme);
    localStorage.setItem("restaurant-mode", currentMode);
  }, [currentTheme, currentMode]);

  const setTheme = (theme: ThemeType) => setCurrentTheme(theme);
  const toggleMode = () => setCurrentMode(prev => prev === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ currentTheme, currentMode, setTheme, toggleMode }}>
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
