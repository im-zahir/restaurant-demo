"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminToastProps {
  message: string;
  subMessage?: string;
  isVisible: boolean;
  onClose: () => void;
}

export function AdminToast({ message, subMessage, isVisible, onClose }: AdminToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          className="fixed bottom-10 right-10 z-[200] max-w-sm w-full"
        >
          <div className="glass p-6 rounded-[32px] border-2 border-accent/20 shadow-2xl shadow-accent/20 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 group-hover:bg-accent/40 transition-colors" />
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6 text-accent animate-tada" />
              </div>
              
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-black uppercase tracking-widest text-gradient">{message}</h4>
                {subMessage && (
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-relaxed">
                    {subMessage}
                  </p>
                )}
              </div>

              <button 
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-foreground/20 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
