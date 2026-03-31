"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Utensils, CalendarCheck, Users, Banknote, TrendingUp, Clock, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalBookings: 0,
    pendingActions: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [{ count: itemCount }, { count: bookingCount }, { data: pendingData }, { data: ordersData }] = await Promise.all([
        supabase.from("menu_items").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("id").eq("status", "pending"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      const calculatedRevenue = ordersData
        ?.filter(o => o.status === "delivered")
        .reduce((sum, o) => sum + Number(o.total), 0) || 0;

      const pendingOrdersCount = ordersData?.filter(o => o.status === "pending").length || 0;

      setStats({
        totalItems: itemCount || 0,
        totalBookings: bookingCount || 0,
        pendingActions: (pendingData?.length || 0) + pendingOrdersCount,
        totalOrders: ordersData?.length || 0,
        revenue: calculatedRevenue,
      });
      setRecentOrders(ordersData?.slice(0, 5) || []);
      setIsLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Menu Items", value: stats.totalItems, icon: Utensils, color: "text-blue-400" },
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "text-emerald-400" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-purple-400" },
    { label: "Pending Actions", value: stats.pendingActions, icon: Clock, color: "text-orange-400" },
    { label: "Estimated Revenue", value: formatPrice(stats.revenue), icon: Banknote, color: "text-accent" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-widest text-gradient">Dashboard</h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Restaurant Overview & Analytics</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-foreground/60">
          Last updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 rounded-3xl space-y-4 border border-white/5 group hover:border-accent/20 transition-all"
            >
              <div className={cn("p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform", stat.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{stat.label}</p>
                <h3 className="text-2xl font-black">{isLoading ? "..." : stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6">
          <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentOrders.length === 0 && !isLoading && (
               <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest text-center py-4">No recent activity</p>
            )}
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className={cn("w-2 h-2 rounded-full", order.status === "delivered" ? "bg-emerald-500" : order.status === "cancelled" ? "bg-red-500" : "bg-accent animate-pulse")} />
                <div className="flex-1">
                  <p className="text-sm font-bold">New Order from {order.customer_name}</p>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-accent/5 to-transparent">
          <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/admin/menu" className="flex flex-col gap-3 p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all text-center items-center">
              <Utensils className="w-6 h-6 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
            </Link>
            <Link href="/admin/bookings" className="flex flex-col gap-3 p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all text-center items-center">
              <CalendarCheck className="w-6 h-6 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Bookings</span>
            </Link>
            <Link href="/admin/orders" className="col-span-2 md:col-span-1 flex flex-col gap-3 p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all text-center items-center">
              <ShoppingBag className="w-6 h-6 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fixed missing import
import { cn } from "@/lib/utils";
