"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, Sparkles, Zap, Leaf, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme, ThemeType } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function DesignSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, currentMode, setTheme, toggleMode } = useTheme();

  const themes: { id: ThemeType; name: string; icon: any; color: string }[] = [
    { id: "luxury", name: "Luxury Gold", icon: Sparkles, color: "bg-[#D4AF37]" },
    { id: "vibrant", name: "Vibrant Red", icon: Zap, color: "bg-[#E31837]" },
    { id: "minimal", name: "Modern Minimal", icon: Leaf, color: "bg-[#0F172A]" },
  ];

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 left-0 bg-background border border-accent/20 p-5 rounded-[32px] shadow-2xl backdrop-blur-3xl w-72 space-y-5"
          >
            <div className="flex items-center justify-between px-2 pb-3 border-b border-accent/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                Design Palette
              </p>
              <button 
                onClick={toggleMode}
                className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground transition-all flex items-center gap-2 group"
              >
                {currentMode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                <span className="text-[10px] font-bold uppercase">{currentMode === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>

            <div className="space-y-2">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-white/5 text-foreground/60"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                      isActive ? "bg-white/20" : theme.color
                    )}>
                      <Icon size={16} className={isActive ? "text-white" : "text-white"} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all",
          isOpen ? "bg-foreground text-background" : "bg-background border border-white/10 text-accent backdrop-blur-md"
        )}
      >
        {isOpen ? <X size={24} /> : <Palette size={24} />}
      </motion.button>
    </div>
  );
}
