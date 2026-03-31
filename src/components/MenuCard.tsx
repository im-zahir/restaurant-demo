"use client";

import Image from "next/image";
import { MenuItem } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import { Plus, Flame, Star, Zap } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();
  const { currentTheme } = useTheme();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group overflow-hidden p-5 space-y-5 transition-all transition-duration-500",
        currentTheme === "luxury" ? "glass rounded-[var(--radius-card)] hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 backdrop-blur-xl" :
        currentTheme === "vibrant" ? "bg-white border-2 border-accent/20 rounded-[var(--radius-card)] hover:border-accent hover:shadow-xl" :
        "bg-white border border-slate-200 rounded-[var(--radius-card)] hover:shadow-md"
      )}
    >
      <div className={cn(
        "relative w-full overflow-hidden transition-all duration-500",
        currentTheme === "luxury" ? "h-56 rounded-2xl shadow-inner" :
        currentTheme === "vibrant" ? "h-64 rounded-xl rotate-1 group-hover:rotate-0" :
        "h-48 rounded-lg"
      )}>
        <div className={cn(
          "absolute inset-0 z-10 transition-colors duration-500",
          currentTheme === "luxury" ? "bg-black/20 group-hover:bg-transparent" : "bg-transparent"
        )} />
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-110",
            currentTheme === "minimal" ? "grayscale group-hover:grayscale-0" : ""
          )}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          {item.tags?.map((tag) => (
            <span key={tag} className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 shadow-xl transition-all",
              currentTheme === "vibrant" ? "bg-accent text-white border-transparent" : "bg-black/80 text-white border-white/10 backdrop-blur-xl"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", currentTheme === "vibrant" ? "bg-white" : "bg-accent animate-pulse")} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 px-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className={cn(
            "text-xl font-black leading-tight transition-colors duration-300",
            currentTheme === "luxury" ? "font-heading group-hover:text-accent" : "font-sans group-hover:text-accent"
          )}>
            {item.name}
          </h3>
          <span className={cn(
            "font-black text-lg whitespace-nowrap",
            currentTheme === "vibrant" ? "text-accent bg-accent/10 px-2 py-0.5 rounded-lg" : "text-accent"
          )}>
            {formatPrice(item.price)}
          </span>
        </div>
        <p className={cn(
          "text-sm line-clamp-2 leading-relaxed h-10 transition-all",
          currentTheme === "luxury" ? "text-foreground/40 font-light italic" : "text-foreground/60"
        )}>
          {item.description}
        </p>
      </div>

      <button
        onClick={() => addToCart(item)}
        className={cn(
          "w-full py-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95",
          currentTheme === "luxury" ? "bg-accent/5 border border-accent/20 text-accent rounded-2xl shadow-lg hover:bg-accent hover:text-accent-foreground" :
          currentTheme === "vibrant" ? "bg-accent text-white rounded-xl shadow-xl shadow-accent/20 hover:scale-[1.02]" :
          "bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        )}
      >
        <Plus className="w-4 h-4" />
        {currentTheme === "luxury" ? "Add to Experience" : "Add to Cart"}
      </button>
    </motion.div>
  );
}
