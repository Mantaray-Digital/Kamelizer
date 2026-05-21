"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePlatoMenu } from "@mantaray-digital/plato-sdk/react";
import { plato } from "@/lib/plato";
import { egp } from "@/lib/format";

type TableInfo = {
  _id: string;
  tableNumber?: string | number;
  branchId: string;
  branchName?: string;
};

type Item = {
  _id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable?: boolean;
};

type Category = { _id: string; name: string; items?: Item[] };

type Line = { menuItemId: string; name: string; price: number; quantity: number; image?: string | null };

type PageProps = { params: Promise<{ tableId: string }> };

export default function TablePage({ params }: PageProps) {
  const { tableId } = use(params);

  const [table, setTable] = useState<TableInfo | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result: any = await (plato as any).tables.resolve(tableId);
        if (mounted) setTable(result);
      } catch (err: any) {
        if (mounted) setTableError(err?.message ?? "We couldn't find that table.");
      } finally {
        if (mounted) setResolving(false);
      }
    })();
    return () => { mounted = false; };
  }, [tableId]);

  const branchId = table?.branchId ?? null;
  const {
    categories: rawCategories,
    items: rawItems,
    loading: menuLoading,
  } = usePlatoMenu(branchId ? { branchId } : undefined);

  const categories: Category[] = useMemo(() => {
    if (!rawCategories) return [];
    return rawCategories.map((c) => ({
      _id: c._id,
      name: c.name,
      items: (rawItems ?? []).filter((i) => i.categoryId === c._id),
    }));
  }, [rawCategories, rawItems]);

  const [lines, setLines] = useState<Line[]>([]);
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);

  const add = useCallback((item: Item) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.menuItemId === item._id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], quantity: copy[i].quantity + 1 };
        return copy;
      }
      return [...prev, { menuItemId: item._id, name: item.name, price: item.price, quantity: 1, image: item.imageUrl ?? null }];
    });
  }, []);

  const setQty = (menuItemId: string, q: number) => {
    setLines((prev) => prev.map((l) => l.menuItemId === menuItemId ? { ...l, quantity: q } : l).filter((l) => l.quantity > 0));
  };

  const [waiter, setWaiter] = useState<"idle" | "calling" | "sent" | "deduped">("idle");
  const callWaiter = async () => {
    setWaiter("calling");
    try {
      const result: any = await (plato as any).tables.callWaiter(tableId);
      setWaiter(result?.deduped ? "deduped" : "sent");
      setTimeout(() => setWaiter("idle"), 5000);
    } catch {
      setWaiter("idle");
    }
  };

  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState(false);

  const sendOrder = async () => {
    if (lines.length === 0 || !table) return;
    setSubmitting(true);
    setOrderError(null);
    try {
      await (plato as any).orders.create({
        branchId: table.branchId,
        orderType: "dine_in",
        tableId: tableId,
        items: lines.map((l) => ({ menuItemId: l.menuItemId, quantity: l.quantity })),
      });
      setLines([]);
      setOrderSent(true);
      setSheetOpen(false);
      setTimeout(() => setOrderSent(false), 5000);
    } catch (err: any) {
      setOrderError(err?.message ?? "Couldn't send the order. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (resolving) {
    return (
      <div className="grid min-h-[80vh] place-items-center px-6">
        <span className="eyebrow animate-pulse">Setting your table…</span>
      </div>
    );
  }

  if (tableError || !table) {
    return (
      <div className="grid min-h-[80vh] place-items-center px-6 text-center">
        <div className="max-w-md space-y-4">
          <span className="eyebrow">Table not found</span>
          <h1 className="editorial text-5xl">
            That QR <em className="not-italic text-blue">didn't open.</em>
          </h1>
          <p className="text-sm font-light text-ground/60">
            {tableError ?? "Try scanning the code on your table again, or ask a barista for help."}
          </p>
        </div>
      </div>
    );
  }

  const totalQty = lines.reduce((s, l) => s + l.quantity, 0);

  return (
    <div className="bg-canvas pb-40">
      {/* Hero strip */}
      <section className="border-b border-ground/10 px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Table</span>
            <h1 className="editorial mt-2 text-6xl md:text-7xl">
              {table.tableNumber ? `№ ${table.tableNumber}` : "At the table"}
            </h1>
            {table.branchName && (
              <p className="mt-2 text-sm font-light text-ground/60">{table.branchName}</p>
            )}
          </div>

          <button
            onClick={callWaiter}
            disabled={waiter === "calling"}
            className="btn-ghost"
          >
            {waiter === "calling" && "Calling…"}
            {waiter === "sent" && "Sent ✓"}
            {waiter === "deduped" && "On the way"}
            {waiter === "idle" && "Call a waiter"}
          </button>
        </div>
      </section>

      {orderSent && (
        <div className="bg-blue/10 px-6 py-3 text-center text-[12px] uppercase tracking-ultra font-normal text-blue">
          Order sent to the kitchen ✓
        </div>
      )}

      {/* Menu */}
      <main className="mx-auto max-w-[1600px] px-6 pt-10 lg:px-10 lg:pt-16">
        {menuLoading && (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-48 animate-pulse rounded bg-ground/10" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-24 animate-pulse rounded-lg bg-ground/[0.06]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!menuLoading && categories.map((cat) => (
          <section key={cat._id} className="mb-16">
            <div className="mb-6 border-b border-ground/10 pb-3">
              <span className="eyebrow">{cat.items?.length ?? 0} items</span>
              <h2 className="editorial mt-2 text-4xl md:text-5xl">{cat.name}</h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {(cat.items ?? []).map((item) => {
                const line = lines.find((l) => l.menuItemId === item._id);
                return (
                  <li
                    key={item._id}
                    className="flex items-center gap-4 rounded-lg border border-ground/10 bg-canvas p-3 transition hover:border-ground/30"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-ground/[0.05]">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <span className="font-display text-2xl font-normal text-ground/20">K</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="editorial truncate text-xl leading-tight">{item.name}</div>
                      <div className="mt-1 font-mono text-[12px] text-ground/60">{egp(item.price)}</div>
                    </div>
                    {line ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setQty(item._id, line.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 text-sm font-light hover:border-ground"
                          aria-label="Decrease"
                        >−</button>
                        <span className="w-5 text-center text-sm font-light">{line.quantity}</span>
                        <button
                          onClick={() => setQty(item._id, line.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 text-sm font-light hover:border-ground"
                          aria-label="Increase"
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => add(item)}
                        disabled={item.isAvailable === false}
                        className="btn-mini disabled:opacity-30"
                      >
                        Add
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>

      {/* Bottom sheet */}
      {lines.length > 0 && (
        <>
          <button
            onClick={() => setSheetOpen(true)}
            className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full bg-ground px-6 py-4 text-canvas shadow-xl lg:left-auto lg:right-10 lg:w-[480px]"
          >
            <span className="text-[11px] uppercase tracking-ultra font-normal">
              {totalQty} {totalQty === 1 ? "item" : "items"} · review the bill
            </span>
            <span className="font-mono">{egp(subtotal)}</span>
          </button>

          <div
            className={`fixed inset-0 z-50 transition ${
              sheetOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setSheetOpen(false)}
          >
            <div className="absolute inset-0 bg-ground/40 backdrop-blur-sm" />
          </div>

          <aside
            className={`fixed inset-x-0 bottom-0 z-[55] max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-ground/10 bg-canvas p-6 transition-transform duration-400 ${
              sheetOpen ? "translate-y-0" : "translate-y-full"
            } lg:left-auto lg:right-10 lg:bottom-10 lg:max-w-md lg:rounded-2xl lg:border`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="eyebrow">Your table bill</span>
              <button
                onClick={() => setSheetOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-ground/20 text-lg font-light hover:bg-ground hover:text-canvas"
                aria-label="Close"
              >×</button>
            </div>

            <ul className="divide-y divide-ground/10">
              {lines.map((l) => (
                <li key={l.menuItemId} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="editorial truncate text-lg leading-tight">{l.name}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-ground/50">
                      {egp(l.price)} × {l.quantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setQty(l.menuItemId, l.quantity - 1)}
                      className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 text-sm font-light hover:border-ground"
                      aria-label="Decrease"
                    >−</button>
                    <span className="w-5 text-center text-sm font-light">{l.quantity}</span>
                    <button
                      onClick={() => setQty(l.menuItemId, l.quantity + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 text-sm font-light hover:border-ground"
                      aria-label="Increase"
                    >+</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between border-t border-ground/10 pt-4">
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Subtotal</span>
              <span className="editorial text-3xl">{egp(subtotal)}</span>
            </div>

            {orderError && (
              <p className="mt-3 text-[12px] font-light text-blue">{orderError}</p>
            )}

            <button
              onClick={sendOrder}
              disabled={submitting}
              className="btn-primary mt-5 w-full"
            >
              {submitting ? "Sending…" : "Send to the kitchen"}
            </button>
            <p className="mt-3 text-[11px] font-light text-ground/40">
              Pay your waiter when you're ready to leave.
            </p>
          </aside>
        </>
      )}
    </div>
  );
}
