"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartModifier = {
  groupName: string;
  optionName: string;
  priceAdjustment: number;
};

export type CartLine = {
  lineId: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  image?: string | null;
  quantity: number;
  modifiers?: CartModifier[];
  notes?: string;
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "lineId">) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, q: number) => void;
  clear: () => void;
  totalQuantity: number;
};

const CartCtx = createContext<CartState | null>(null);
const STORAGE_KEY = "kamelizer_cart_v1";

function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sameLine(a: CartLine, b: Omit<CartLine, "lineId">) {
  if (a.menuItemId !== b.menuItemId) return false;
  if ((a.notes ?? "") !== (b.notes ?? "")) return false;
  const am = a.modifiers ?? [];
  const bm = b.modifiers ?? [];
  if (am.length !== bm.length) return false;
  const key = (m: CartModifier) => `${m.groupName}|${m.optionName}`;
  const ak = am.map(key).sort().join("~");
  const bk = bm.map(key).sort().join("~");
  return ak === bk;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const add = useCallback((incoming: Omit<CartLine, "lineId">) => {
    setLines((prev) => {
      const existing = prev.findIndex((l) => sameLine(l, incoming));
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = {
          ...copy[existing],
          quantity: copy[existing].quantity + incoming.quantity,
        };
        return copy;
      }
      return [...prev, { ...incoming, lineId: makeId() }];
    });
  }, []);

  const remove = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const setQuantity = useCallback((lineId: string, q: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.lineId === lineId ? { ...l, quantity: q } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      add,
      remove,
      setQuantity,
      clear,
      totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    [lines, add, remove, setQuantity, clear],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
