"use client";

import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRouter } from "next/navigation";
import { ChefHat, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (login(password)) {
        router.push("/admin");
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 bg-[url('/images/hero_burger.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="glass p-10 rounded-[40px] border-2 border-accent/20 shadow-2xl shadow-accent/5 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto border-4 border-accent/5">
              <ChefHat className="w-10 h-10 text-accent" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-widest text-gradient">Gourmet Hub</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-none px-2">Administrative Access</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-3">Master Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all`}
                />
              </div>
              {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest px-3">Invalid Password</p>}
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enter Dashboard <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-[10px] font-medium text-foreground/20 uppercase tracking-[0.2em] pt-4">
            Authorized Personnel Only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
