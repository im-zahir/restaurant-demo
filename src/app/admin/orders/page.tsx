"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  ChefHat,
  ChevronDown,
  Loader2,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { ManualOrderModal } from "@/components/ManualOrderModal";

export default function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setOrders(data);
    setIsLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    
    if (!error) fetchOrders();
  }

  const filteredOrders = orders.filter(o => filter === "all" || o.status === filter);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "delivered": 
        return { icon: CheckCircle2, text: "Delivered", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" };
      case "cancelled": 
        return { icon: XCircle, text: "Cancelled", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" };
      case "preparing":
        return { icon: ChefHat, text: "Preparing", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" };
      default: 
        return { icon: Clock, text: "Pending", color: "text-orange-500 animate-pulse", bg: "bg-orange-500/10 border-orange-500/20" };
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-widest text-gradient">Website Orders</h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Manage direct online orders and deliveries</p>
        </div>
        <div className="flex flex-wrap bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
          {["all", "pending", "preparing", "delivered", "cancelled"].map((f) => {
            const count = f === "all" ? orders.length : orders.filter(o => o.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  filter === f ? "bg-accent text-accent-foreground" : "text-foreground/40 hover:text-foreground"
                )}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-4 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Manual Order
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-20 text-center opacity-20 uppercase tracking-widest font-black flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              Syncing Orders...
            </div>
          ) : filteredOrders.map((order) => {
            const statusConfig = getStatusDisplay(order.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedId === order.id;

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[32px] border border-white/5 overflow-hidden transition-all hover:border-white/10"
              >
                {/* Header overview */}
                <div 
                  className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{order.customer_name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center text-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Total Amount</p>
                      <p className="text-xl font-black text-accent">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={cn("px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-black uppercase tracking-widest", statusConfig.bg, statusConfig.color)}>
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.text}
                    </div>
                    <ChevronDown className={cn("w-5 h-5 text-foreground/40 transition-transform", isExpanded && "rotate-180")} />
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5"
                    >
                      {/* Customer Info */}
                      <div className="p-6 flex-1 space-y-6">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Delivery Details</h5>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <p className="text-sm">{order.address}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-accent shrink-0" />
                            <p className="text-sm font-medium">{order.customer_phone}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-4">Quick Actions</h5>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "preparing"); }} disabled={order.status === "preparing"} className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-30 transition-colors">Start Cooking</button>
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "delivered"); }} disabled={order.status === "delivered"} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-30 transition-colors">Mark Delivered</button>
                            <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "cancelled"); }} disabled={order.status === "cancelled"} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-30 transition-colors">Cancel Order</button>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6 flex-1 space-y-6 bg-black/20">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Order Items</h5>
                        <div className="space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                              <span className="font-medium">{item.quantity}x {item.name}</span>
                              <span className="text-accent font-bold">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Manual Order Modal Injection */}
      <ManualOrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchOrders();
        }}
      />
    </div>
  );
}
