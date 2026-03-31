"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, MessageCircle, Plus, Minus, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { OrderForm } from "./OrderForm";

import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"cart" | "checkout" | "success">("cart");
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const generateWhatsAppURL = () => {
    const phoneNumber = settings.whatsapp_number.replace(/\D/g, ""); 
    let message = `🍽️ *New Order from ${settings.restaurant_name}*\n\n`;
    message += "Hello, I'd like to place an order:\n\n";

    cart.forEach((item) => {
      message += `• *${item.name}* x${item.quantity} — ${formatPrice(item.price * item.quantity)}\n`;
    });

    message += `\n💰 *Total: ${formatPrice(totalPrice)}*\n\n`;
    message += "--- Customer Details ---\n";
    message += "Name: \n";
    message += "Phone: \n";
    message += "Address: \n";
    message += "Note: \n\n";
    message += "_Please confirm my order. Thank you!_";

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  if (totalItems === 0 && !isOpen) return null;

  const isClosed = settings.is_maintenance_mode;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] bg-accent text-accent-foreground px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold group shadow-accent/40 lg:right-12"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-accent">
            {totalItems}
          </span>
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all group-hover:max-w-xs">
          View Cart ({formatPrice(totalPrice)})
        </span>
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-glass-border z-[80] flex flex-col"
            >
              <div className="p-6 border-b border-glass-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-bold uppercase tracking-widest">
                    {view === "cart" ? "Your Order" : view === "checkout" ? "Checkout" : "Complete"}
                  </h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {view === "cart" ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                        <ShoppingBag className="w-16 h-16" />
                        <p className="text-xl font-medium">Your cart is empty.</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5">
                            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm leading-tight uppercase tracking-wide">{item.name}</h4>
                              <button onClick={() => removeFromCart(item.id)} className="p-1 text-foreground/40 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-accent text-sm font-bold">{formatPrice(item.price)}</p>
                            <div className="flex items-center gap-3 pt-2">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center hover:bg-white/5 disabled:opacity-20" disabled={item.quantity <= 1}>
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center hover:bg-white/5">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-6 border-t border-glass-border space-y-4 bg-black/20">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-foreground/60 uppercase tracking-widest text-[10px] font-black">Subtotal</span>
                      <span className="text-2xl font-black text-gradient">{formatPrice(totalPrice)}</span>
                    </div>

                    {isClosed && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-widest text-red-500">Kitchen Closed</p>
                          <p className="text-[10px] text-foreground/60 font-bold leading-tight">
                            Online ordering is currently disabled for maintenance. Please check back later!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setView("checkout")}
                        disabled={cart.length === 0 || isClosed}
                        className={cn(
                          "w-full py-4 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]",
                          (cart.length === 0 || isClosed) && "opacity-20 pointer-events-none grayscale"
                        )}
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Checkout on Website
                      </button>
                    
                      <a
                        href={isClosed ? "#" : generateWhatsAppURL()}
                        target={isClosed ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className={cn(
                          "w-full py-4 border border-glass-border bg-white/5 text-foreground rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all hover:bg-white/10",
                          (cart.length === 0 || isClosed) && "opacity-20 pointer-events-none grayscale"
                        )}
                      >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        Order via WhatsApp
                      </a>
                    </div>
                    
                    <button
                      onClick={clearCart}
                      className="w-full py-3 text-foreground/40 text-xs font-bold uppercase tracking-widest hover:text-foreground transition-colors"
                    >
                      Clear All Items
                    </button>
                  </div>
                </>
              ) : view === "checkout" ? (
                <OrderForm 
                  onBack={() => setView("cart")} 
                  onSuccess={(pwd) => {
                    if (pwd) setGeneratedPassword(pwd);
                    setView("success");
                  }} 
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-6 text-center">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20 text-emerald-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-gradient">Order Confirmed!</h3>
                  <p className="text-sm font-medium text-foreground/60">
                    Thank you for your order. We are preparing it right away!
                  </p>
                  
                  {generatedPassword && (
                    <div className="mt-4 p-4 border border-accent/20 bg-accent/5 rounded-2xl w-full text-left space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        Simulated Email Sent
                      </p>
                      <p className="text-sm">We've created an account for you so you can track your order!</p>
                      <p className="text-sm">Your temporary password is: <span className="font-mono bg-black/50 px-2 py-1 rounded text-accent font-bold">{generatedPassword}</span></p>
                      <p className="text-xs text-foreground/40 mt-1">You can log in at the top right to check your status.</p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setView("cart");
                      setIsOpen(false);
                      setGeneratedPassword(null);
                    }}
                    className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 text-foreground rounded-full font-bold uppercase tracking-widest transition-all"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
