"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/hooks/useAdminAuth";
import { 
  LayoutDashboard, 
  Utensils, 
  CalendarCheck, 
  Settings, 
  LogOut, 
  ChefHat,
  ChevronRight,
  ShoppingBag,
  Menu,
  X,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useEffect, useRef } from "react";
import { AdminToast } from "@/components/AdminToast";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationDropdown } from "@/components/NotificationDropdown";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Menu Manager", href: "/admin/menu", icon: Utensils },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, isAuthenticated, isLoaded } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({ orders: 0, bookings: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; subMessage: string }>({
    isVisible: false,
    message: "",
    subMessage: "",
  });
  
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    async function fetchPending() {
      const [{ data: orders }, { data: bookings }] = await Promise.all([
        supabase.from("orders").select("id, customer_name, created_at").eq("status", "pending").order("created_at", { ascending: false }),
        supabase.from("bookings").select("id, name, created_at").eq("status", "pending").order("created_at", { ascending: false }),
      ]);

      const formattedNotifications = [
        ...(orders?.map(o => ({ ...o, type: "order", sender: o.customer_name })) || []),
        ...(bookings?.map(b => ({ ...b, type: "booking", sender: b.name })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(formattedNotifications);
      setPendingCounts({
        orders: orders?.length || 0,
        bookings: bookings?.length || 0
      });
    }

    if (!isLoginPage && isAuthenticated) {
      fetchPending();

      // Subscribe to real-time changes
      const ordersChannel = supabase
        .channel("admin-orders-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
          fetchPending();
          if (payload.eventType === "INSERT") {
            setToast({
              isVisible: true,
              message: "New Order Received!",
              subMessage: "A customer just placed a fresh order. Check the list!",
            });
          }
        })
        .subscribe();

      const bookingsChannel = supabase
        .channel("admin-bookings-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => {
          fetchPending();
          if (payload.eventType === "INSERT") {
            setToast({
              isVisible: true,
              message: "New Booking!",
              subMessage: "A customer requested a table. View details now!",
            });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(ordersChannel);
        supabase.removeChannel(bookingsChannel);
      };
    }
  }, [isLoginPage, isAuthenticated]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ChefHat className="w-12 h-12 text-accent animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) return <div className="min-h-screen bg-[#050505]">{children}</div>;

  if (!isAuthenticated) return null; // Logic in useAdminAuth will redirect

  const totalPending = pendingCounts.orders + pendingCounts.bookings;

  return (
    <div className="flex min-h-screen bg-[#020202] text-foreground flex-col md:flex-row">
      <AdminToast 
        isVisible={toast.isVisible}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/40 z-50">
        <div className="flex items-center gap-3">
          <ChefHat className="text-accent w-6 h-6" />
          <h2 className="text-lg font-black text-gradient uppercase tracking-widest">Admin Hub</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="relative group p-2">
              <Bell className={cn("w-5 h-5", totalPending > 0 ? "text-accent" : "text-foreground/20")} />
              {totalPending > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-black">
                  {totalPending}
                </span>
              )}
            </button>
            <NotificationDropdown 
              isOpen={isNotificationOpen} 
              notifications={notifications} 
              onClose={() => setIsNotificationOpen(false)} 
              className="right-0"
            />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/5 border border-white/10 rounded-xl"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidemenu Overlays */}
      <AnimatePresence>
        {(isSidebarOpen || isNotificationOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => { setIsSidebarOpen(false); setIsNotificationOpen(false); }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 w-64 border-r border-white/5 bg-black/90 md:bg-black/40 flex flex-col p-6 space-y-8 z-50 transition-transform duration-300 md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="hidden md:flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <ChefHat className="text-accent w-8 h-8" />
            <h2 className="text-xl font-black text-gradient uppercase tracking-widest">Admin Hub</h2>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-white/5 rounded-xl transition-colors group"
            >
              <Bell className={cn("w-5 h-5 transition-all text-foreground/20 group-hover:text-foreground", totalPending > 0 && "text-accent animate-bounce group-hover:text-accent")} />
              {totalPending > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[#020202]">
                  {totalPending}
                </span>
              )}
            </button>
            <NotificationDropdown 
              isOpen={isNotificationOpen} 
              notifications={notifications} 
              onClose={() => setIsNotificationOpen(false)} 
              className="right-0"
            />
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 pt-8 md:pt-0">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const pendingCount = link.href === "/admin/orders" ? pendingCounts.orders : link.href === "/admin/bookings" ? pendingCounts.bookings : 0;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "relative flex items-center justify-between p-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-accent/10 text-accent border border-accent/20" 
                    : "text-foreground/40 hover:text-foreground hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">{link.name}</span>
                </div>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-[8px] font-black rounded-full text-white">
                    {pendingCount}
                  </span>
                )}
                {isActive && pendingCount === 0 && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={logout}
          className="mt-auto flex items-center gap-3 p-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase text-xs font-black tracking-[0.2em]"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-x-hidden overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
