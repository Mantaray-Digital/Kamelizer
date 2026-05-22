import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { TopNav } from "@/components/top-nav";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kamelizer Coffee — Specialty Coffee",
  description:
    "Kamelizer Coffee — specialty coffee, slow brews, and warm rituals. Order for delivery, pickup, or scan the QR at your table.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
