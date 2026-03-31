"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function Location() {
  const { settings } = useSettings();
  const { currentMode } = useTheme();

  return (
    <section id="location" className="py-24 bg-background relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-tight">
                Visit Our <br />
                <span className="text-gradient">Sanctuary</span>
              </h2>
              <p className="text-foreground/60 max-w-md leading-relaxed">
                Nestled in the heart of the city, we offer an escape into a world of refined tastes and sophisticated surroundings. 
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Our Address</p>
                  <p className="text-lg font-medium text-foreground/80">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Operating Hours</p>
                  <div className="space-y-1 text-lg font-medium text-foreground/80">
                    <p>Mon - Fri: 12 PM - 11 PM</p>
                    <p>Sat - Sun: 10 AM - 12 AM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Direct Contact</p>
                  <p className="text-lg font-medium text-foreground/80">{settings.whatsapp_number}</p>
                </div>
              </div>
            </div>

            <motion.a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
            >
              Get Directions
              <Navigation className="w-5 h-5 text-accent" />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group transition-all duration-700"
          >
            <iframe
              title="Restaurant Location"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14604.425785002498!2d90.39423405!3d23.7792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7075c3f309d%3A0xe54d9c75953503f8!2sGulshan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd`}
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                filter: currentMode === "dark" 
                  ? "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(1)" 
                  : "none" 
              }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-100 transition-all duration-700"
            />
            
            <div className={cn(
              "absolute inset-0 pointer-events-none border-[12px] border-background rounded-[40px] transition-all duration-700",
              currentMode === "dark" ? "shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" : "shadow-none"
            )} />
            <div className="absolute inset-0 pointer-events-none border-2 border-accent/10 rounded-[40px]" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
