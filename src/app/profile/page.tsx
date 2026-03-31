"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2, LogOut, Package, Save, CheckCircle2, Clock, ChefHat, XCircle } from "lucide-react";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { customerEmail, logout, isLoaded } = useCustomerAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!customerEmail) {
      router.push("/login");
      return;
    }

    async function fetchUserData() {
      setIsSyncing(true);
      
      // Fetch profile
      const { data: userData } = await supabase
        .from("customers")
        .select("*")
        .eq("email", customerEmail)
        .single();
        
      if (userData) {
        setProfile(userData);
        setFormData({
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
        });
      }

      // Fetch Orders
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", customerEmail)
        .order("created_at", { ascending: false });
        
      if (orderData) {
        setOrders(orderData);
      }
      
      setIsSyncing(false);
    }

    fetchUserData();
  }, [customerEmail, isLoaded, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase
      .from("customers")
      .update({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })
      .eq("email", customerEmail);
      
    setIsSaving(false);
    if (!error) {
      alert("Profile updated successfully!");
    }
  };

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

  if (!isLoaded || isSyncing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Restaurant
            </Link>
            <h1 className="text-4xl font-black uppercase tracking-widest text-gradient">Customer Hub</h1>
            <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">
              Welcome back, {profile?.name}
            </p>
          </div>
          <button 
            onClick={() => { logout(); router.push("/"); }}
            className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-8 rounded-[40px] border border-white/5 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">
                  {profile?.name.charAt(0)}
                </span>
                My Details
              </h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Email (Read Only)</label>
                  <input disabled value={customerEmail || ""} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-foreground/40 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Full Name</label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Delivery Address</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent resize-none" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full py-4 mt-2 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update Profile
                </button>
              </form>
            </div>
          </div>

          {/* Order History & Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 pl-2">
              <Package className="w-6 h-6 text-accent" />
              Order Tracking & History
            </h3>

            {orders.length === 0 ? (
              <div className="glass p-12 rounded-[40px] border border-white/5 text-center flex flex-col items-center justify-center opacity-50">
                <Package className="w-16 h-16 mb-4" />
                <p className="font-bold uppercase tracking-widest">No Orders Yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusConfig = getStatusDisplay(order.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div key={order.id} className="glass rounded-[32px] border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
                      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 md:items-center bg-white/[0.01]">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                          <h4 className="text-lg font-black text-accent">{formatPrice(order.total)}</h4>
                        </div>
                        
                        <div className={cn("px-4 py-3 rounded-xl border flex items-center gap-3 text-xs font-black uppercase tracking-widest w-fit", statusConfig.bg, statusConfig.color)}>
                          <StatusIcon className="w-5 h-5" />
                          {statusConfig.text}
                          {order.status === "pending" && <span className="text-[10px] opacity-70 ml-2">(Est. 30-45m)</span>}
                        </div>
                      </div>
                      
                      <div className="p-6 md:p-8 border-t border-white/5 bg-black/20">
                        <div className="space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-xl border border-white/5">
                              <span className="font-medium text-foreground/80">{item.quantity}x {item.name}</span>
                              <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        
                        {order.status === "pending" && (
                          <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-accent text-center md:text-left">
                              Your food is in the kitchen queue!
                            </p>
                            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden w-full md:w-auto mx-4">
                              <div className="h-full bg-accent w-1/4 animate-pulse rounded-full" />
                            </div>
                          </div>
                        )}
                        {order.status === "preparing" && (
                          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 text-center md:text-left">
                              The Chef is cooking your meal!
                            </p>
                            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden w-full md:w-auto mx-4">
                              <div className="h-full bg-blue-500 w-1/2 rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
