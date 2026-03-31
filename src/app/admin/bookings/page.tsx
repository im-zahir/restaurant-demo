"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CalendarCheck, 
  Users, 
  Clock, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock as PendingIcon,
  Trash2,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BookingsManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setBookings(data);
    setIsLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);
    
    if (!error) fetchBookings();
  }

  const filteredBookings = bookings.filter(b => filter === "all" || b.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <PendingIcon className="w-4 h-4 text-orange-500 animate-pulse" />;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-widest text-gradient">Booking Records</h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Manage Customer Reservations & Real-time confirmations</p>
        </div>
        <div className="flex flex-wrap bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                filter === f ? "bg-accent text-accent-foreground" : "text-foreground/40 hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-20 text-center opacity-20 uppercase tracking-widest font-black">Syncing Bookings...</div>
          ) : filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "glass p-6 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center gap-8 group transition-all hover:bg-white/[0.02]",
                booking.status === "confirmed" && "border-emerald-500/20 bg-emerald-500/[0.02]",
                booking.status === "cancelled" && "border-red-500/20 bg-red-500/[0.02]"
              )}
            >
              <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl min-w-[100px]">
                <span className="text-2xl font-black text-accent">{booking.date.split("-")[2]}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="space-y-1">
                  <h4 className="font-bold text-lg leading-none">{booking.name}</h4>
                  <div className="flex items-center gap-2 text-foreground/40 text-xs font-medium">
                    <Phone className="w-3 h-3" />
                    {booking.phone}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent/60" />
                    <span className="text-sm font-bold">{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent/60" />
                    <span className="text-sm font-bold">{booking.guests} Guests</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-4 py-2 rounded-full border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                    booking.status === "confirmed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                    booking.status === "cancelled" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                    "bg-orange-500/10 border-orange-500/20 text-orange-400"
                  )}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(booking.id, "confirmed")}
                  disabled={booking.status === "confirmed"}
                  className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/20 transition-all hover:bg-emerald-500 hover:text-white disabled:opacity-0 disabled:pointer-events-none"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => updateStatus(booking.id, "cancelled")}
                  disabled={booking.status === "cancelled"}
                  className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/20 transition-all hover:bg-red-500 hover:text-white disabled:opacity-0 disabled:pointer-events-none"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
