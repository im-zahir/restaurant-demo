import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuGrid } from "@/components/MenuGrid";
import { BookingForm } from "@/components/BookingForm";
import { Reviews } from "@/components/Reviews";
import { Location } from "@/components/Location";
import { CartSheet } from "@/components/CartSheet";
import { CartProvider } from "@/hooks/useCart";

export default function Home() {
  return (
    <CartProvider>
      <main className="relative min-h-screen selection:bg-accent selection:text-accent-foreground">
        <Navbar />
        <Hero />
        
        <section id="menu" className="py-24 bg-background relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tight">
                Epicurean <span className="text-gradient">Selection</span>
              </h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg font-light italic leading-relaxed">
                “A curated journey through the world’s finest ingredients, 
                reimagined for the modern palate.”
              </p>
            </div>
            
            <MenuGrid />
          </div>
        </section>

        <BookingForm />

        <Reviews />

        <Location />

        <CartSheet />

        {/* Footer */}
        <footer className="py-20 border-t border-glass-border bg-black/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left space-y-4">
              <div className="flex flex-col items-center md:items-start group">
                <span className="text-3xl font-heading font-black text-gradient uppercase tracking-tight leading-none">LuxeDine</span>
                <span className="text-[10px] font-bold text-accent/60 uppercase tracking-[0.4em] mt-1 pl-1">Signature Experience</span>
              </div>
              <p className="text-sm text-foreground/40 leading-relaxed">
                Dhaka's premier dining destination. <br />
                Elevating culinary experiences since 2026.
              </p>
            </div>
            
            <div className="flex justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/60">
              <div className="flex flex-col gap-4">
                <a href="#hero" className="hover:text-accent transition-all">Home</a>
                <a href="#menu" className="hover:text-accent transition-all">Menu</a>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#booking" className="hover:text-accent transition-all">Booking</a>
                <a href="#reviews" className="hover:text-accent transition-all">Reviews</a>
              </div>
            </div>

            <div className="text-center md:text-right space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">Contact Us</p>
              <p className="text-lg font-bold text-accent">+880 1711-223344</p>
              <p className="text-xs text-foreground/40">Gulshan-2, Dhaka, Bangladesh</p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/20">
              © 2026 LuxeDine Signature. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>
    </CartProvider>
  );
}
