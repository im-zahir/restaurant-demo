"use client";

import { useEffect, useState } from "react";
import { MENU_DATA, CATEGORIES } from "@/lib/data";
import { MenuCard } from "./MenuCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { MenuItem } from "@/types";

export function MenuGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<MenuItem[]>(MENU_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true);

        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data as MenuItem[]);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-4xl mx-auto">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all",
                activeCategory === cat ? "bg-accent text-accent-foreground" : "bg-glass border border-glass-border hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-glass border border-glass-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 opacity-40">
          <p className="text-xl">No items found matching your search.</p>
        </div>
      )}
    </div>
  );
}
