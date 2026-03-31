"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCustomerAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { data, error: sbError } = await supabase
        .from("customers")
        .select("*")
        .eq("email", formData.email)
        .eq("password", formData.password)
        .single();

      if (sbError || !data) {
        throw new Error("Invalid email or password.");
      }

      login(formData.email);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/30 selection:text-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 mt-20">
        <div className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <Link href="/" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-black uppercase tracking-widest text-gradient">Welcome Back</h1>
            <p className="text-foreground/40 text-sm">Enter your email and the password generated during your first checkout.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2 leading-none">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                <input
                  required
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2 leading-none">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                <input
                  required
                  type="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent text-sm"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
            </button>
            
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-foreground/40 pt-4">
              Tip: Your password was shown to you after your first order.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
