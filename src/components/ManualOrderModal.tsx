"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Plus, Minus, Loader2, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManualOrderModal({ isOpen, onClose, onSuccess }: ManualOrderModalProps) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: { item: any, quantity: number } }>({});

  useEffect(() => {
    if (isOpen) {
      fetchMenu();
    } else {
      // Reset state on close
      setFormData({ name: "", phone: "", email: "", address: "" });
      setSelectedItems({});
    }
  }, [isOpen]);

  async function fetchMenu() {
    setIsLoadingMenu(true);
    const { data } = await supabase.from("menu_items").select("*").eq("is_available", true);
    if (data) setMenuItems(data);
    setIsLoadingMenu(false);
  }

  const handleQuantity = (item: any, delta: number) => {
    setSelectedItems(prev => {
      const current = prev[item.id]?.quantity || 0;
      const next = Math.max(0, current + delta);
      
      const newMap = { ...prev };
      if (next === 0) {
        delete newMap[item.id];
      } else {
        newMap[item.id] = { item, quantity: next };
      }
      return newMap;
    });
  };

  const totalPrice = Object.values(selectedItems).reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(selectedItems).length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Format cart array
    const cartItems = Object.values(selectedItems).map(({ item, quantity }) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
    }));

    try {
      // Optional: Check if email exists to auto-link
      if (formData.email) {
        const { data: existing } = await supabase.from("customers").select("id").eq("email", formData.email).single();
        if (!existing) {
          await supabase.from("customers").insert([{
            email: formData.email,
            password: Math.random().toString(36).slice(-6).toUpperCase(),
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
          }]);
        }
      }

      const { error } = await supabase.from("orders").insert([{
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        address: formData.address || "Walk-in/Pickup",
        items: cartItems,
        total: totalPrice,
        status: "delivered", // Manual orders are usually taken directly
      }]);

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Error creating order: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] glass rounded-[40px] border border-white/10 shadow-2xl flex flex-col overflow-hidden bg-[#0A0A0A]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <h2 className="text-xl font-black uppercase tracking-widest text-gradient">Create Manual Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form id="manual-order-form" onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Customer Details Left */}
          <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto bg-black/20 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2">Customer Info</h3>
            
            <div className="space-y-4">
              <input 
                required 
                placeholder="Customer Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent"
              />
              <input 
                required 
                type="tel"
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent"
              />
              <input 
                type="email"
                placeholder="Email (Optional, links profile)" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent"
              />
              <textarea 
                placeholder="Delivery Address (Leave blank for Walk-in)" 
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent resize-none"
              />
            </div>
          </div>

          {/* Menu Items Right */}
          <div className="w-full md:w-2/3 flex flex-col h-[50vh] md:h-auto">
            <div className="p-4 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2">Add Items to Cart</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {isLoadingMenu ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                menuItems.map(item => {
                  const qty = selectedItems[item.id]?.quantity || 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0 hidden sm:block">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-accent text-[10px] font-bold uppercase tracking-widest">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {qty > 0 && (
                          <>
                            <button type="button" onClick={() => handleQuantity(item, -1)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{qty}</span>
                          </>
                        )}
                        <button type="button" onClick={() => handleQuantity(item, 1)} className="w-8 h-8 rounded-full border border-white/10 bg-accent/10 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Total Footer */}
            <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Total Order Value</p>
                <p className="text-2xl font-black text-gradient">{formatPrice(totalPrice)}</p>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting || totalPrice === 0}
                className="px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Place Order
              </button>
            </div>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
