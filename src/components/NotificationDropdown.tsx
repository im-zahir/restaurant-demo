"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bell, ShoppingBag, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "order" | "booking";
  sender: string;
  created_at: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  className?: string;
}

export function NotificationDropdown({ isOpen, notifications, onClose, className }: NotificationDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "absolute top-full mt-4 w-72 glass border border-white/10 rounded-[32px] overflow-hidden z-[100] shadow-2xl shadow-black/50",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-white/5 bg-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Pending Actions</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <Bell className="w-8 h-8 text-foreground/10 mx-auto" />
                <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/40">Nothing to handle</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={`${notif.type}-${notif.id}`}
                  href={notif.type === "order" ? "/admin/orders" : "/admin/bookings"}
                  onClick={onClose}
                  className="flex items-start gap-3 p-4 hover:bg-white/5 border-b border-white/5 transition-colors group/item"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    notif.type === "order" ? "bg-purple-500/10 text-purple-400" : "bg-emerald-500/10 text-emerald-400"
                  )}>
                    {notif.type === "order" ? <ShoppingBag className="w-4 h-4" /> : <CalendarCheck className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover/item:text-accent transition-colors leading-tight">
                      {notif.sender}
                    </p>
                    <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                      {notif.type === "order" ? "New Order" : "New Booking"} • {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
