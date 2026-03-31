"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export function FloatingWhatsApp() {
  const { settings } = useSettings();

  if (settings.is_maintenance_mode) return null;

  return (
    <motion.a
      href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 transition-all group"
    >
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      <MessageCircle size={32} className="relative z-10 fill-current" />
      
      {/* Tooltip */}
      <span className="absolute right-20 bg-background/80 backdrop-blur-md border border-white/10 text-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chat with us
      </span>
    </motion.a>
  );
}
