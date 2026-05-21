"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePlatoItem, usePlatoModifiers } from "@mantaray-digital/plato-sdk/react";
import { useUI } from "@/lib/ui-store";
import { useCart, type CartModifier } from "@/lib/cart-store";
import { egp } from "@/lib/format";

export function ItemModal() {
  const { activeItemId, setActiveItemId, openCart } = useUI();
  const { add } = useCart();
  const { data: item, loading: itemLoading } = usePlatoItem(activeItemId);
  const { data: groups, loading: modsLoading } = usePlatoModifiers(activeItemId);

  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setPicked({});
    setQuantity(1);
    setNotes("");
  }, [activeItemId]);

  const close = () => setActiveItemId(null);

  useEffect(() => {
    if (!activeItemId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItemId]);

  const flatModifiers = useMemo<CartModifier[]>(() => {
    if (!groups) return [];
    const out: CartModifier[] = [];
    for (const g of groups) {
      const ids = picked[g._id] ?? [];
      for (const optId of ids) {
        const opt = g.options?.find((o) => o._id === optId);
        if (opt) {
          out.push({
            groupName: g.name,
            optionName: opt.name,
            priceAdjustment: opt.priceAdjustment ?? 0,
          });
        }
      }
    }
    return out;
  }, [groups, picked]);

  const unitPrice = useMemo(() => {
    const base = item?.price ?? 0;
    const adj = flatModifiers.reduce((s, m) => s + m.priceAdjustment, 0);
    return base + adj;
  }, [item, flatModifiers]);

  const togglePick = (groupId: string, optionId: string, max: number | undefined) => {
    setPicked((prev) => {
      const current = prev[groupId] ?? [];
      const has = current.includes(optionId);
      if (has) return { ...prev, [groupId]: current.filter((x) => x !== optionId) };
      if (max === 1) return { ...prev, [groupId]: [optionId] };
      if (max && current.length >= max) return prev;
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  const canAdd = useMemo(() => {
    if (!item || !groups) return false;
    for (const g of groups) {
      const ids = picked[g._id] ?? [];
      if (g.isRequired && ids.length < (g.minSelections ?? 1)) return false;
    }
    return true;
  }, [item, groups, picked]);

  const handleAdd = () => {
    if (!item || !canAdd) return;
    add({
      menuItemId: item._id,
      name: item.name,
      unitPrice,
      image: item.imageUrl ?? null,
      quantity,
      modifiers: flatModifiers,
      notes: notes.trim() || undefined,
    });
    close();
    openCart();
  };

  if (!activeItemId) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ground/60 backdrop-blur-sm md:items-center"
      onClick={close}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-ground/10 bg-canvas md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-canvas/70 text-lg font-light text-ground/70 backdrop-blur hover:text-ground"
        >×</button>

        {item?.imageUrl && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ground/[0.05]">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="100vw" />
          </div>
        )}

        <div className="p-6 md:p-10">
          {itemLoading && <SkeletonLine />}
          {item && (
            <>
              <h2 className="editorial text-4xl md:text-5xl">{item.name}</h2>
              {item.description && (
                <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-ground/60">
                  {item.description}
                </p>
              )}
              <div className="mt-4 text-[11px] uppercase tracking-ultra font-normal text-ground/40">
                Base · {egp(item.price)}
              </div>

              <div className="my-8 h-px w-full bg-ground/10" />

              {modsLoading && <SkeletonLine />}
              {groups?.map((g) => (
                <fieldset key={g._id} className="mb-8">
                  <legend className="mb-3 flex items-center gap-3 text-[12px] uppercase tracking-ultra font-normal text-ground/70">
                    {g.name}
                    {g.isRequired && <span className="text-blue">Required</span>}
                    {g.maxSelections && g.maxSelections > 1 && (
                      <span className="text-ground/40">· pick up to {g.maxSelections}</span>
                    )}
                  </legend>
                  <div className="grid gap-2 md:grid-cols-2">
                    {g.options?.map((opt) => {
                      const checked = (picked[g._id] ?? []).includes(opt._id);
                      return (
                        <label
                          key={opt._id}
                          className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-light transition ${
                            checked ? "border-blue bg-blue/10" : "border-ground/15 hover:border-ground/30"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type={g.maxSelections === 1 ? "radio" : "checkbox"}
                              name={g._id}
                              checked={checked}
                              onChange={() => togglePick(g._id, opt._id, g.maxSelections)}
                              className="accent-blue"
                            />
                            {opt.name}
                          </span>
                          {opt.priceAdjustment ? (
                            <span className="text-ground/50">+{egp(opt.priceAdjustment)}</span>
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              <div className="mb-8">
                <label className="mb-2 block text-[11px] uppercase tracking-ultra font-normal text-ground/40">
                  Special notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="No sugar, extra ice, etc."
                  className="field resize-none"
                />
              </div>

              <div className="sticky bottom-0 -mx-6 flex flex-col gap-4 border-t border-ground/10 bg-canvas/95 px-6 py-4 backdrop-blur md:-mx-10 md:flex-row md:items-center md:justify-between md:px-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ground/20 text-base font-light hover:border-ground"
                    aria-label="Decrease"
                  >−</button>
                  <span className="w-8 text-center font-display text-2xl font-normal">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ground/20 text-base font-light hover:border-ground"
                    aria-label="Increase"
                  >+</button>
                </div>
                <button onClick={handleAdd} disabled={!canAdd} className="btn-primary flex-1 md:max-w-sm">
                  Add · {egp(unitPrice * quantity)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonLine() {
  return <div className="h-6 w-2/3 animate-pulse rounded bg-ground/10" />;
}
