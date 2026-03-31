"use client";

import Image from "next/image";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import { Plus, Flame, Star, Zap } from "lucide-react";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "spicy": return <Flame className="w-3 h-3 text-orange-500" />;
      case "best seller": return <Star className="w-3 h-3 text-yellow-500" />;
      case "new": return <Zap className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="glass group rounded-[32px] overflow-hidden p-5 space-y-5 transition-all hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 backdrop-blur-xl"
    >
      <div className="relative h-56 w-full rounded-2xl overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          {item.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-black/80 backdrop-blur-xl rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 flex items-center gap-1.5 shadow-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 px-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-heading text-xl font-black leading-tight group-hover:text-accent transition-colors duration-300">
            {item.name}
          </h3>
          <span className="text-accent font-black text-lg whitespace-nowrap drop-shadow-sm">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-sm text-foreground/40 line-clamp-2 leading-relaxed h-10 font-light italic">
          {item.description}
        </p>
      </div>

      <button
        onClick={() => addToCart(item)}
        className="w-full py-4 bg-accent/5 border border-accent/20 text-accent rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 shadow-lg hover:shadow-accent/20"
      >
        <Plus className="w-4 h-4" />
        Add to Experience
      </button>
    </motion.div>
  );
}
