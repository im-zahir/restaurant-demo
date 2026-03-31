"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Clock, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function BookingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("bookings").insert([
        {
          name: formData.name,
          phone: formData.phone,
          guests: parseInt(formData.guests),
          date: formData.date,
          time: formData.time,
          note: formData.note,
          status: "pending",
        },
      ]);

      if (error) throw error;
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
            <span className="text-xs font-bold text-accent uppercase tracking-widest leading-none">
              Reservation
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Reserve Your <span className="text-gradient">Fine Dining</span> Experience
          </h2>
          <p className="text-foreground/60 max-w-md leading-relaxed">
            Planning a special evening? Secure your table in advance and let us prepare an unforgettable feast for you.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div className="text-sm">
                <p className="text-foreground/40 font-medium">Group Dining</p>
                <p className="font-bold text-base">Up to 20 Guests</p>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div className="text-sm">
                <p className="text-foreground/40 font-medium">Opening Hours</p>
                <p className="font-bold text-base">12PM - 11PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-12 rounded-[40px] text-center space-y-4 border-2 border-accent/20"
            >
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-accent/10">
                <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest text-gradient">Booking Received!</h3>
              <p className="text-foreground/60 text-sm leading-relaxed max-w-xs mx-auto">
                Thank you, {formData.name}! We'll contact you shortly on {formData.phone} to confirm your reservation.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="pt-4 text-xs font-bold text-accent uppercase tracking-wider hover:underline"
              >
                Make another booking
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass p-8 md:p-10 rounded-[40px] space-y-6 shadow-2xl shadow-black/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2 leading-none">Your Name</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2 leading-none">Phone</label>
                  <input
                    required
                    type="tel"
                    placeholder="+880 17..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2 leading-none">Guests</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-accent text-sm"
                  >
                    {[1, 2, 3, 4, 5, 10, 20].map((num) => (
                      <option key={num} value={num} className="bg-background">{num} Guests</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2 leading-none">Date & Time</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-2">
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-accent text-sm uppercase color-scheme-dark"
                    />
                    <input
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-accent text-sm color-scheme-dark"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2 leading-none">Special Requests</label>
                <textarea
                  rows={2}
                  placeholder="Occasion, dietary preferences, etc."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-accent text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent text-accent-foreground rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 transition-all hover:shadow-accent/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
              >
                Confirm Booking
                <Send className="w-5 h-5 fill-current" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
