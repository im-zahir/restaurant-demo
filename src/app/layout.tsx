import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gourmet Haven | Premium WhatsApp-Native Dining",
  description: "Experience the finest flavors with seamless WhatsApp ordering and instant table bookings. Dhaka's premier dining destination.",
};

import { CustomerAuthProvider } from "@/hooks/useCustomerAuth";
import { SettingsProvider } from "@/hooks/useSettings";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans min-h-full flex flex-col antialiased`} suppressHydrationWarning>
        <SettingsProvider>
          <CustomerAuthProvider>
            {children}
          </CustomerAuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
