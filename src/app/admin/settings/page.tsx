"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { AdminToast } from "@/components/AdminToast";

type SettingsSection = "General" | "Branding" | "Notifications" | "Ordering" | "Security";

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    restaurant_name: "Gourmet Haven",
    whatsapp_number: "+8801700000000",
    address: "Gulshan-2, Dhaka, Bangladesh",
    currency: "BDT",
    timezone: "UTC+6",
    is_maintenance_mode: false,
    primary_color: "#C5A572",
    secondary_color: "#1A1A1A",
    logo_url: "",
    email_notifications: true,
    order_alerts: true,
    delivery_charge: 0,
    min_order: 0
  });

  const [toast, setToast] = useState({ isVisible: false, message: "", subMessage: "" });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("restaurant_settings")
          .select("*")
          .eq("id", 1)
          .single();
        
        if (data) setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("restaurant_settings")
        .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
      
      if (error) throw error;
      setToast({
        isVisible: true,
        message: "Settings Updated!",
        subMessage: "Your restaurant configurations have been saved successfully."
      });
    } catch (err) {
      console.error("Error saving settings:", err);
      setToast({
        isVisible: true,
        message: "Save Failed",
        subMessage: "There was an error updating your settings. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { title: "General", icon: Globe, desc: "Name, location, and currency" },
    { title: "Branding", icon: Palette, desc: "Logo and accent colors" },
    { title: "Notifications", icon: Bell, desc: "Alerts and order sounds" },
    { title: "Ordering", icon: Smartphone, desc: "WhatsApp and availability" },
    { title: "Security", icon: Shield, desc: "Password and access control" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <AdminToast 
        isVisible={toast.isVisible}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-widest text-gradient">System Settings</h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Configure Your Global Restaurant Parameters</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-4">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.title;
            return (
              <button
                key={s.title}
                onClick={() => setActiveSection(s.title as SettingsSection)}
                className={cn(
                  "w-full glass p-6 rounded-[32px] border flex items-center gap-6 text-left transition-all group",
                  isActive ? "bg-accent/10 border-accent/20" : "border-white/5 hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "bg-white/5 group-hover:bg-white/10 group-hover:text-accent"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={cn("font-bold text-sm uppercase tracking-widest", isActive ? "text-accent" : "text-foreground")}>{s.title}</h4>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest leading-none mt-1">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-2 glass p-6 md:p-10 rounded-[40px] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header inside content */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                <div className="p-2 rounded-xl bg-accent/10 text-accent">
                  {sections.find(s => s.title === activeSection)?.icon && 
                    (() => {
                      const Icon = sections.find(s => s.title === activeSection)!.icon;
                      return <Icon className="w-5 h-5" />;
                    })()
                  }
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest">{activeSection} Configuration</h3>
              </div>

              {activeSection === "General" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Restaurant Name</label>
                    <input 
                      value={settings.restaurant_name}
                      onChange={(e) => setSettings({...settings, restaurant_name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent outline-none" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Business Address</label>
                    <input 
                      value={settings.address}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent outline-none" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Menu Currency</label>
                    <select 
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent outline-none appearance-none cursor-pointer"
                    >
                      <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="EUR">EUR (€) - Euro</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Primary Timezone</label>
                    <select 
                      value={settings.timezone}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent outline-none appearance-none cursor-pointer"
                    >
                      <option value="UTC+6">UTC+6 (Dhaka)</option>
                      <option value="UTC+0">UTC+0 (London/GMT)</option>
                      <option value="UTC-5">UTC-5 (New York)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === "Branding" && (
                <div className="space-y-10 pt-4">
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="space-y-4 grow">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Restaurant Logo</label>
                      <div className="flex items-center gap-6 p-6 bg-white/5 border border-dashed border-white/20 rounded-[32px] relative group cursor-pointer hover:bg-white/10 transition-all">
                        <div className="w-20 h-20 rounded-2xl bg-black/20 flex items-center justify-center border border-white/10 overflow-hidden relative">
                          {settings.logo_url ? (
                            <img src={settings.logo_url} className="w-full h-full object-cover" alt="Logo" />
                          ) : (
                            <ChefHat className="w-8 h-8 text-white/20" />
                          )}
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5 text-accent" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">Update Brand Asset</p>
                          <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">PNG, JPG or SVG up to 2MB</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setSettings({ ...settings, logo_url: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Brand Accent Color</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="color" 
                          value={settings.primary_color}
                          onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                          className="w-16 h-16 bg-transparent border-none cursor-pointer" 
                        />
                        <input 
                          value={settings.primary_color}
                          onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                          className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono w-32 focus:border-accent outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Notifications" && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-accent/20 transition-all">
                    <div className="space-y-1">
                      <p className="font-bold uppercase tracking-widest text-sm">Order Alerts</p>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Receive browser notifications for new orders</p>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, order_alerts: !settings.order_alerts})}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all",
                        settings.order_alerts ? "bg-accent" : "bg-white/10"
                      )}
                    >
                      <div className={cn("w-4 h-4 bg-white rounded-full transition-all", settings.order_alerts ? "translate-x-6" : "translate-x-0")} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-accent/20 transition-all">
                    <div className="space-y-1">
                      <p className="font-bold uppercase tracking-widest text-sm">Email Weekly Reports</p>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Summary of analytics sent to your admin email</p>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, email_notifications: !settings.email_notifications})}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all",
                        settings.email_notifications ? "bg-accent" : "bg-white/10"
                      )}
                    >
                      <div className={cn("w-4 h-4 bg-white rounded-full transition-all", settings.email_notifications ? "translate-x-6" : "translate-x-0")} />
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "Ordering" && (
                <div className="space-y-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">WhatsApp Sales Number</label>
                      <input 
                        value={settings.whatsapp_number}
                        onChange={(e) => setSettings({...settings, whatsapp_number: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent outline-none" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Standard Delivery Charge</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 text-sm">{settings.currency === "BDT" ? "৳" : "$"}</span>
                        <input 
                          type="number"
                          value={settings.delivery_charge}
                          onChange={(e) => setSettings({...settings, delivery_charge: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-10 text-sm focus:border-accent outline-none" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-accent/5 border border-accent/10 rounded-[32px] space-y-4 group">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                          Status Override 
                          {settings.is_maintenance_mode && <AlertCircle className="w-4 h-4 animate-pulse" />}
                        </h4>
                        <p className="font-bold">Maintenance Mode</p>
                        <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Temporarily disable the menu and checkout for customers</p>
                      </div>
                      <button 
                        onClick={() => setSettings({...settings, is_maintenance_mode: !settings.is_maintenance_mode})}
                        className={cn(
                          "w-12 h-6 rounded-full p-1 transition-all",
                          settings.is_maintenance_mode ? "bg-red-500" : "bg-emerald-500/20 text-emerald-500"
                        )}
                      >
                        <div className={cn("w-4 h-4 bg-white rounded-full transition-all", settings.is_maintenance_mode ? "translate-x-6" : "translate-x-0")} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "Security" && (
                <div className="space-y-8 pt-4">
                  <div className="p-8 glass border border-red-500/10 rounded-[32px] bg-red-500/[0.02] space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Change Admin Password</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-red-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">New Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-accent outline-none" />
                        </div>
                      </div>
                    </div>
                    <button className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all">
                      Update Security Credentials
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const ChefHat = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 13.8V21h12v-7.2" />
    <path d="M11 2h2a4 4 0 0 1 4 4v1a2 2 0 1 1-2 2h-1a2 2 0 1 1-2-2V6a4 4 0 0 1 4-4Z" />
    <path d="M4 11V8a4 4 0 0 1 4-4h1" />
  </svg>
);

