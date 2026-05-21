import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { TopNav } from "@/components/top-nav";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import "./globals.css";

// Playfair Display loaded at LIGHT weights — 400 is the lightest available.
// Includes italic for accent words inside <em> tags.
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Kamelizer Coffee — Specialty Coffee",
  description:
    "Kamelizer Coffee — specialty coffee, slow brews, and warm rituals. Order for delivery, pickup, or scan the QR at your table.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain min-h-screen bg-canvas text-ground">
        <Providers>
          <TopNav />
          <main className="min-h-[calc(100vh-80px)]">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
