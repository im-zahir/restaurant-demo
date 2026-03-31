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
  description: "Dine in elegance. Experience ultra-premium culinary masterpieces with seamless WhatsApp ordering and table reservations in Dhaka.",
  keywords: ["restaurant", "luxury dining", "dhaka food", "whatsapp ordering", "fine dining", "luxe dine"],
  openGraph: {
    title: "LuxeDine | Signature Flavors",
    description: "Ultra-premium culinary masterpieces with seamless ordering.",
    type: "website",
    locale: "en_BD",
  },
};

import { CustomerAuthProvider } from "@/hooks/useCustomerAuth";
import { SettingsProvider } from "@/hooks/useSettings";
import { ThemeProvider } from "@/hooks/useTheme";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { DesignSwitcher } from "@/components/DesignSwitcher";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} font-sans min-h-full flex flex-col antialiased transition-colors duration-500`} suppressHydrationWarning>
        <ThemeProvider>
          <SettingsProvider>
            <CustomerAuthProvider>
              {children}
              <FloatingWhatsApp />
              <DesignSwitcher />
            </CustomerAuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
