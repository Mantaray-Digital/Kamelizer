"use client";

import { PlatoProvider } from "@mantaray-digital/plato-sdk/react";
import { CartProvider } from "@/lib/cart-store";
import { UIProvider } from "@/lib/ui-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_PLATO_CONVEX_URL;
  const apiKey = process.env.NEXT_PUBLIC_PLATO_API_KEY;

  if (!convexUrl || !apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ground p-10">
        <div className="max-w-md text-center space-y-4">
          <h1 className="editorial text-3xl">Plato credentials missing</h1>
          <p className="text-sm opacity-70 font-light">
            Set <code className="font-mono">NEXT_PUBLIC_PLATO_CONVEX_URL</code> and{" "}
            <code className="font-mono">NEXT_PUBLIC_PLATO_API_KEY</code> in{" "}
            <code className="font-mono">.env.local</code>, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PlatoProvider config={{ convexUrl, apiKey }}>
      <CartProvider>
        <UIProvider>{children}</UIProvider>
      </CartProvider>
    </PlatoProvider>
  );
}
