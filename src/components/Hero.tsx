"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, PhoneCall, Calendar, AlertTriangle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

export function Hero() {
  const { settings } = useSettings();
  
  return (
    <section id="hero" className="relative min-h-[95vh] w-full flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_burger.png"
          alt="Premium Burger"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
            <span className={cn("w-2 h-2 rounded-full", settings.is_maintenance_mode ? "bg-red-500" : "bg-accent animate-pulse")} />
            <span className="text-xs font-bold text-accent uppercase tracking-widest leading-none">
              {settings.is_maintenance_mode ? "Closed for Maintenance" : `Now Open in ${settings.address.split(',')[0]}`}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black leading-[1.1] tracking-tight">
            {settings.is_maintenance_mode ? "We'll be" : "The Soul of"} <br />
            <span className="text-gradient drop-shadow-xl">
              {settings.is_maintenance_mode ? "Back Soon" : "Fine Dining"}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 max-w-lg font-light leading-relaxed italic">
            {settings.is_maintenance_mode 
              ? "We're currently updating our kitchen to serve you better. Online ordering is temporarily disabled."
              : "“Savor every moment with our chef-curated masterpieces, delivered with precision and passion.”"
            }
          </p>

          {!settings.is_maintenance_mode && (
            <div className="flex flex-wrap gap-5 pt-4">
              <motion.a
                href="#menu"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-accent text-accent-foreground font-bold uppercase tracking-widest rounded-full flex items-center gap-2 shadow-xl shadow-accent/20 transition-all hover:shadow-accent/40"
              >
                Explore Menu
                <ChevronRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 border border-white/10 text-foreground font-bold uppercase tracking-widest rounded-full flex items-center gap-2 backdrop-blur-xl transition-all hover:bg-white/10"
              >
                Reserve Table
                <Calendar className="w-5 h-5" />
              </motion.a>
            </div>
          )}
        </motion.div>

        {/* Featured Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="glass p-8 rounded-3xl max-w-sm ml-auto space-y-6">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
              <Image 
                src="/images/hero_burger.png" 
                alt="Signature Burger" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gradient">The Signature Wagyu</h3>
                <span className="text-accent font-bold">৳850</span>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Our masterpiece featuring 200g Wagyu beef, truffle aioli, 
                and hand-picked ingredients from local farms.
              </p>
              <button className="w-full py-3 border border-accent/30 text-accent rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:bg-accent hover:text-accent-foreground">
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center p-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
