import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "LuxeDine | Signature Flavors & WhatsApp Ordering",
  description: "Dine in elegance. Experience ultra-premium culinary masterpieces with seamless WhatsApp ordering and table reservations.",
};

import { CustomerAuthProvider } from "@/hooks/useCustomerAuth";
import { SettingsProvider } from "@/hooks/useSettings";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} font-sans min-h-full flex flex-col antialiased`} suppressHydrationWarning>
        <SettingsProvider>
          <CustomerAuthProvider>
            {children}
            <FloatingWhatsApp />
          </CustomerAuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
