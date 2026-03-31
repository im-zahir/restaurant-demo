"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";

interface RestaurantSettings {
  restaurant_name: string;
  whatsapp_number: string;
  address: string;
  currency: string;
  timezone: string;
  is_maintenance_mode: boolean;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  email_notifications: boolean;
  order_alerts: boolean;
  delivery_charge: number;
  min_order: number;
}

interface SettingsContextType {
  settings: RestaurantSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [settings, setSettings] = useState<RestaurantSettings>({
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
    min_order: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
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
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
