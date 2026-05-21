"use client";

import { createContext, useContext, useMemo, useState } from "react";

type UIState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
};

const UICtx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const value = useMemo<UIState>(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      activeItemId,
      setActiveItemId,
    }),
    [cartOpen, activeItemId],
  );

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
