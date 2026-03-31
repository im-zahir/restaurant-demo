"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    role: "Food Blogger",
    content: "The Signature Wagyu is hands down the best burger in Dhaka. The truffle aioli is a game changer!",
    rating: 5,
  },
  {
    id: 2,
    name: "Sumiya Khan",
    role: "Regular Customer",
    content: "Ordering via WhatsApp is so convenient. No apps, no hassle. Recommended for everyone!",
    rating: 5,
  },
  {
    id: 3,
    name: "Farhan Ishraq",
    role: "Chef",
    content: "Impeccable taste and presentation. The ambiance at Gourmet Haven is just as good as the food.",
    rating: 4,
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">What Our <span className="text-gradient">Guests</span> Say</h2>
          <p className="text-foreground/40 max-w-xl mx-auto uppercase tracking-widest text-xs font-bold font-sans">
            Real experiences from real food lovers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-[32px] space-y-6 relative group hover:border-accent/30 transition-all"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-accent/10 group-hover:text-accent/20 transition-colors" />
              
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-foreground/10'}`} 
                  />
                ))}
              </div>

              <p className="text-foreground/70 italic leading-relaxed">"{review.content}"</p>

              <div className="pt-4 flex items-center gap-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center font-bold text-accent-foreground text-xs">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">{review.name}</h4>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
