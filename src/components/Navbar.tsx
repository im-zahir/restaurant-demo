"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, UtensilsCrossed, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { customerEmail, isLoaded } = useCustomerAuth();
  const { settings } = useSettings();
  const { currentTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Menu", href: "#menu" },
    { name: "Book a Table", href: "#booking" },
    { name: "Reviews", href: "#reviews" },
    { name: "Location", href: "#location" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        isScrolled 
          ? "bg-glass backdrop-blur-md border-b border-glass-border py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <div className={cn(
              "absolute inset-0 rounded-full transition-transform duration-500",
              currentTheme === "vibrant" ? "bg-accent scale-110" : "bg-accent/20 scale-0 group-hover:scale-100"
            )} />
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-10 h-10 object-contain relative z-10" />
            ) : (
              <div className={cn(
                "relative z-10 p-2 border rounded-full transition-all",
                currentTheme === "vibrant" ? "bg-accent text-white border-white/20 shadow-lg shadow-accent/40" : "bg-black/40 border-accent/30 text-accent backdrop-blur-sm"
              )}>
                <ChefHat className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex flex-col -space-y-1">
            <span className={cn(
              "text-2xl font-black transition-all leading-none",
              currentTheme === "luxury" ? "font-heading text-gradient tracking-tight" : 
              currentTheme === "vibrant" ? "font-sans text-accent uppercase italic scale-110" :
              "font-sans text-foreground tracking-widest"
            )}>
              {currentTheme === "vibrant" ? "BiteNow" : "LuxeDine"}
            </span>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em] pl-1 transition-opacity",
              currentTheme === "minimal" ? "opacity-40" : "text-accent/60"
            )}>
              {currentTheme === "vibrant" ? "The Bold Taste" : "Signature"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          <button className="relative p-2 text-foreground hover:text-accent transition-colors">
            <ShoppingCart className="w-6 h-6" />
          </button>
          {isLoaded && (
            <Link 
              href={customerEmail ? "/profile" : "/login"}
              className="px-6 py-2 bg-foreground/5 hover:bg-foreground/10 text-xs font-bold uppercase tracking-widest rounded-full transition-colors border border-foreground/5"
            >
              {customerEmail ? "My Profile" : "Login"}
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="relative p-2 text-foreground">
            <ShoppingCart className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-glass-border p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-foreground/80 hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isLoaded && (
              <Link
                href={customerEmail ? "/profile" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-accent hover:text-accent/80 transition-colors uppercase mt-4"
              >
                {customerEmail ? "My Profile" : "Login"}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
