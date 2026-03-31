"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Ayesha Ahmed",
    role: "Food Critic",
    content: "The Wagyu burger is a revelation. The truffle aioli adds a layer of sophistication you rarely find in Dhaka.",
    rating: 5,
  },
  {
    name: "Rahat Kabir",
    role: "Regular Customer",
    content: "Seamless ordering experience via WhatsApp. The food arrived hot and the packaging was premium.",
    rating: 5,
  },
  {
    name: "Samantha Jane",
    role: "Travel Vlogger",
    content: "LuxeDine lives up to its name. The ambiance (from what I've seen) and the taste are top-tier.",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight">
            Loved by <span className="text-gradient">Connoisseurs</span>
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto">
            Don't just take our word for it. Here's what our most discerning guests have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-[32px] space-y-6 relative group hover:border-accent/40 transition-colors"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-accent/10 group-hover:text-accent/20 transition-colors" />
              
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground/80 italic leading-relaxed">
                "{review.content}"
              </p>

              <div className="pt-4 border-t border-white/5">
                <p className="font-bold text-lg">{review.name}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-accent/60">
                  {review.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
