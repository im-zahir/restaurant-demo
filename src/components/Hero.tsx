"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, PhoneCall, Calendar, AlertTriangle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function Hero() {
  const { settings } = useSettings();
  const { currentTheme } = useTheme();
  
  return (
    <section id="hero" className={cn(
      "relative min-h-[95vh] w-full flex items-center pt-20 overflow-hidden transition-all duration-700 bg-background",
      currentTheme === "minimal" ? "flex flex-col justify-center text-center" : ""
    )}>
      
      {/* LUXURY BACKGROUND */}
      {currentTheme === "luxury" && (
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
      )}

      <div className={cn(
        "relative z-10 max-w-7xl mx-auto px-6 grid gap-12 items-center w-full",
        currentTheme === "minimal" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "space-y-8",
            currentTheme === "minimal" ? "mx-auto max-w-3xl" : ""
          )}
        >
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm",
            currentTheme === "vibrant" ? "bg-accent/10 border-accent/20" : "bg-accent/20 border-accent/30"
          )}>
            <span className={cn("w-2 h-2 rounded-full", settings.is_maintenance_mode ? "bg-red-500" : "bg-accent animate-pulse")} />
            <span className="text-xs font-bold text-accent uppercase tracking-widest leading-none">
              {settings.is_maintenance_mode ? "Closed for Maintenance" : `Now Open in ${settings.address.split(',')[0]}`}
            </span>
          </div>

          <h1 className={cn(
            "font-heading font-black leading-[1.1] tracking-tight transition-all duration-500",
            currentTheme === "luxury" ? "text-5xl md:text-7xl lg:text-8xl" :
            currentTheme === "vibrant" ? "text-6xl md:text-8xl lg:text-9xl text-accent uppercase italic" :
            "text-4xl md:text-6xl lg:text-7xl"
          )}>
            {settings.is_maintenance_mode ? "We'll be" : currentTheme === "vibrant" ? "Taste the" : "The Soul of"} <br />
            <span className={cn(
              "drop-shadow-xl",
              currentTheme === "vibrant" ? "text-foreground not-italic mt-2 block" : "text-gradient"
            )}>
              {settings.is_maintenance_mode ? "Back Soon" : currentTheme === "vibrant" ? "Victory" : "Fine Dining"}
            </span>
          </h1>

          <p className={cn(
            "text-lg md:text-xl text-foreground/70 leading-relaxed transition-all",
            currentTheme === "luxury" ? "italic font-light max-w-lg" : 
            currentTheme === "minimal" ? "mx-auto max-w-2xl" : "font-bold max-w-lg"
          )}>
            {settings.is_maintenance_mode 
              ? "We're currently updating our kitchen to serve you better. Online ordering is temporarily disabled."
              : currentTheme === "vibrant" 
                ? "Bite into the boldest flavors in town. Fast, fresh, and fiercely delicious."
                : "“Savor every moment with our chef-curated masterpieces, delivered with precision and passion.”"
            }
          </p>

          {!settings.is_maintenance_mode && (
            <div className={cn(
              "flex flex-wrap gap-5 pt-4",
              currentTheme === "minimal" ? "justify-center" : ""
            )}>
              <motion.a
                href="#menu"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "px-8 py-4 font-bold uppercase tracking-widest flex items-center gap-2 transition-all",
                  currentTheme === "vibrant" ? "bg-accent text-accent-foreground rounded-2xl shadow-2xl shadow-accent/40" : "bg-accent text-accent-foreground rounded-full shadow-xl shadow-accent/20"
                )}
              >
                {currentTheme === "vibrant" ? "Order Now" : "Explore Menu"}
                <ChevronRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "px-8 py-4 border font-bold uppercase tracking-widest flex items-center gap-2 transition-all",
                  currentTheme === "vibrant" ? "bg-background border-accent/20 text-accent rounded-2xl" : "bg-white/5 border-white/10 text-foreground rounded-full backdrop-blur-xl"
                )}
              >
                Reserve Table
                <Calendar className="w-5 h-5" />
              </motion.a>
            </div>
          )}
        </motion.div>

        {/* VIBRANT & LUXURY FEATURED CONTENT */}
        {currentTheme !== "minimal" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: currentTheme === "vibrant" ? 5 : 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:block"
          >
            {currentTheme === "vibrant" ? (
              <div className="relative w-full aspect-square max-w-lg ml-auto">
                <div className="absolute inset-0 bg-accent rounded-full blur-[100px] opacity-20 animate-pulse" />
                <Image 
                  src="/images/hero_burger.png" 
                  alt="Vibrant Burger" 
                  fill 
                  className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] scale-125" 
                />
              </div>
            ) : (
              <div className="glass p-8 rounded-[40px] max-w-sm ml-auto space-y-6">
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                  <Image src="/images/hero_burger.png" alt="Signature Burger" fill className="object-cover" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gradient">The Signature Wagyu</h3>
                    <span className="text-accent font-bold">৳850</span>
                  </div>
                  <p className="text-sm text-foreground/60 leading-relaxed font-light italic">
                    Our masterpiece featuring 200g Wagyu beef, truffle aioli...
                  </p>
                  <button className="w-full py-3 bg-accent/5 border border-accent/20 text-accent rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all">
                    Add to Experience
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* MINIMAL BOTTOM IMAGE */}
      {currentTheme === "minimal" && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 relative w-full h-64 md:h-96 max-w-5xl mx-auto"
        >
          <Image src="/images/hero_burger.png" alt="Minimal Burger" fill className="object-contain grayscale opacity-50 contrast-125" />
        </motion.div>
      )}

      {/* Scroll Down */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center p-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
