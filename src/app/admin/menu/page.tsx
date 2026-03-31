"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Search, Edit3, Loader2, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "Burgers",
    image: "/images/hero_burger.png",
    tags: [],
    isFeatured: false,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    setIsLoading(true);
    const [{ data: menuData }, { data: orderData }] = await Promise.all([
      supabase.from("menu_items").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("items")
    ]);
    
    if (menuData) {
      const orderCounts: Record<string, number> = {};
      if (orderData) {
        orderData.forEach(o => {
          o.items?.forEach((cartItem: any) => {
            orderCounts[cartItem.id] = (orderCounts[cartItem.id] || 0) + cartItem.quantity;
          });
        });
      }
      
      const finalItems = menuData.map(item => ({
        ...item,
        timesOrdered: orderCounts[item.id] || 0
      }));
      setItems(finalItems as any[]);
    }
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (!error) fetchMenu();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    
    // Destructure out the differently named properties to avoid DB schema errors
    const { isFeatured, timesOrdered, ...itemData } = newItem as any;
    
    if (newItem.id) {
      // Update existing item
      const { error } = await supabase.from("menu_items").update({
        ...itemData,
        is_featured: isFeatured || false,
      }).eq("id", newItem.id);
      
      if (!error) {
        closeModal();
        fetchMenu();
      } else {
        alert("Failed to update: " + error.message);
      }
    } else {
      // Insert new item
      const { error } = await supabase.from("menu_items").insert([
        {
          ...itemData,
          is_featured: isFeatured || false,
          id: Math.random().toString(36).substr(2, 9), // Simple ID for now
          is_available: true,
        },
      ]);

      if (!error) {
        closeModal();
        fetchMenu();
      } else {
        alert("Failed to create: " + error.message);
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setNewItem({ name: "", description: "", price: 0, category: "Burgers", image: "/images/hero_burger.png", tags: [], isFeatured: false });
    }, 200); // Wait for modal animation
  };

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const allCategories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-widest text-gradient">Menu Manager</h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Full CRUD Control of Your Restaurant Offerings</p>
        </div>
        <button
          onClick={() => {
            setNewItem({ name: "", description: "", price: 0, category: "Burgers", image: "/images/hero_burger.png", tags: [], isFeatured: false });
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto px-6 py-4 md:py-3 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add New Dish
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
        />
      </div>

      <div className="glass rounded-[40px] border border-white/5 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 uppercase text-[10px] font-black tracking-widest text-foreground/40">
              <th className="p-6">Dish Name</th>
              <th className="p-6">Category</th>
              <th className="p-6 text-center">Ordered</th>
              <th className="p-6 text-right">Price</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">Loading Menu...</p>
                </td>
              </tr>
            ) : filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                    <span className="font-bold text-sm">{item.name}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5 leading-none w-fit">
                      {item.category}
                    </span>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map(t => (
                          <span key={t} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-accent/20 text-accent rounded-sm leading-none">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-lg">
                    {(item as any).timesOrdered || 0} times
                  </span>
                </td>
                <td className="p-6 text-right font-black text-accent text-sm">{formatPrice(item.price)}</td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setNewItem({ ...item, isFeatured: (item as any).is_featured }); setIsModalOpen(true); }} className="p-2 text-foreground/20 hover:text-white transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-foreground/20 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass p-10 rounded-[40px] z-[110] border-2 border-accent/20 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-widest text-gradient">{newItem.id ? "Edit Food Item" : "Add New Item"}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-4">
                  <input required placeholder="Dish Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="number" placeholder="Price (BDT)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent" value={newItem.price || ""} onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) })} />
                    
                    <div>
                      <input 
                        list="categories" 
                        required 
                        placeholder="Category (Type new or select)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent" 
                        value={newItem.category} 
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} 
                      />
                      <datalist id="categories">
                        {allCategories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                  </div>
                  
                  <textarea required placeholder="Brief Description" rows={2} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent resize-none" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
                  
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/10 hover:border-accent/50 transition-colors bg-white/5">
                    <div className="relative w-16 h-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group">
                      {newItem.image && newItem.image !== "/images/hero_burger.png" ? (
                        <img src={newItem.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-foreground/20 group-hover:text-accent transition-colors" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewItem({ ...newItem, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-1">Dish Image</p>
                      <p className="text-[10px] text-foreground/40 leading-tight">Click the square to set image. Leave blank for default.</p>
                      {newItem.image && newItem.image !== "/images/hero_burger.png" && (
                        <button type="button" onClick={() => setNewItem({ ...newItem, image: "/images/hero_burger.png"})} className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2 hover:underline inline-flex items-center gap-1"><Trash2 className="w-3 h-3"/> Remove</button>
                      )}
                    </div>
                  </div>

                  <input 
                    placeholder="Tags (comma separated, e.g. Spicy, Best Seller, Premium)" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent" 
                    value={newItem.tags?.join(", ") || ""} 
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} 
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all">{newItem.id ? "Save Changes" : "Create Food Item"}</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
