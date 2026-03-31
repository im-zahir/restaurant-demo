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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass group rounded-3xl overflow-hidden p-4 space-y-4 transition-all hover:border-accent/40"
    >
      <div className="relative h-48 w-full rounded-2xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {item.tags?.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
              {getTagIcon(tag)}
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg leading-tight group-hover:text-accent transition-colors">
            {item.name}
          </h3>
          <span className="text-accent font-black whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-sm text-foreground/50 line-clamp-2 leading-relaxed h-10">
          {item.description}
        </p>
      </div>

      <button
        onClick={() => addToCart(item)}
        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Add to Cart
      </button>
    </motion.div>
  );
}
