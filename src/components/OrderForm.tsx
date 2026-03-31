"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

interface OrderFormProps {
  onBack: () => void;
  onSuccess: (generatedPassword?: string) => void;
}

export function OrderForm({ onBack, onSuccess }: OrderFormProps) {
  const { cart, totalPrice, clearCart } = useCart();
  const { login, customerEmail } = useCustomerAuth();
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (settings.is_maintenance_mode) {
      alert("We are currently closed for maintenance. Please try again later!");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalEmail = customerEmail || formData.email;
      let generatedPwd = undefined;
      
      // Check if user exists by email ONLY if they aren't logged in
      if (!customerEmail) {
        const { data: existingUser } = await supabase
          .from("customers")
          .select("id")
          .eq("email", finalEmail)
          .single();
          
        if (!existingUser) {
          // Auto-Register new user
          generatedPwd = Math.random().toString(36).slice(-6).toUpperCase();
          await supabase.from("customers").insert([{
            email: finalEmail,
            password: generatedPwd,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
          }]);
        }
      }
      
      // Submit order
      const { error } = await supabase.from("orders").insert([
        {
          customer_name: formData.name,
          customer_email: finalEmail,
          customer_phone: formData.phone,
          address: formData.address,
          items: cart,
          total: totalPrice,
          status: "pending",
        },
      ]);

      if (error) throw error;
      
      // Auto-login locally if not already logged in
      if (!customerEmail) {
        login(finalEmail);
      }
      
      clearCart();
      onSuccess(generatedPwd);
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6 text-sm font-bold uppercase tracking-widest px-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <div className="flex-1 overflow-y-auto px-6">
        <h3 className="text-xl font-black uppercase tracking-widest text-gradient mb-6">Delivery Details</h3>
        
        <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Full Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent"
              placeholder="Your Name"
            />
          </div>
          
          {!customerEmail && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Email Address</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent"
                placeholder="you@email.com"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Phone Number</label>
            <input 
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent"
              placeholder="+880..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Delivery Address</label>
            <textarea 
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent resize-none h-24"
              placeholder="Full address with details"
            />
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mt-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Payment Method</p>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-accent border-2 border-background" />
              <span className="text-sm font-bold">Cash on Delivery</span>
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-glass-border bg-black/20">
        <button
          form="order-form"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
