"use client";

import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/ui-store";
import { useCart } from "@/lib/cart-store";
import { egp } from "@/lib/format";
import { ItemModal } from "./item-modal";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { lines, setQuantity, remove, totalQuantity } = useCart();

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  return (
    <>
      <ItemModal />

      <div
        className={`fixed inset-0 z-50 transition ${
          cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden={!cartOpen}
      >
        <div className="absolute inset-0" />
      </div>

      <aside
        className={`fixed right-0 top-0 z-[55] flex h-full w-full max-w-md flex-col border-l border-ground/10 bg-canvas transition-transform duration-500 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!cartOpen}
      >
        <header className="flex items-center justify-between border-b border-ground/10 px-6 py-5">
          <div>
            <div className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Your bag</div>
            <div className="editorial mt-1 text-2xl">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </div>
          </div>
          <button
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full border border-ground/20 text-lg font-light hover:bg-ground hover:text-canvas"
            aria-label="Close cart"
          >
            ×
          </button>
        </header>

        <div className="scroll-hide flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div className="space-y-4">
                <div className="editorial text-3xl">Your bag is empty.</div>
                <p className="text-sm font-light text-ground/60">
                  Lattes and slow brews are one tap away.
                </p>
                <Link href="/menu" onClick={closeCart} className="btn-ghost">
                  Browse menu
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-ground/10">
              {lines.map((l) => (
                <li key={l.lineId} className="flex gap-4 py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-ground/[0.05]">
                    {l.image && (
                      <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="editorial text-lg leading-tight">{l.name}</div>
                        {l.modifiers && l.modifiers.length > 0 && (
                          <div className="mt-1 text-[11px] font-light text-ground/50">
                            {l.modifiers.map((m) => m.optionName).join(" · ")}
                          </div>
                        )}
                        {l.notes && (
                          <div className="mt-1 text-[11px] font-light italic text-ground/40">"{l.notes}"</div>
                        )}
                      </div>
                      <button
                        onClick={() => remove(l.lineId)}
                        className="text-[11px] uppercase tracking-ultra font-normal text-ground/40 transition hover:text-blue"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(l.lineId, l.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 text-sm font-light hover:border-ground"
                          aria-label="Decrease"
                        >−</button>
                        <span className="w-5 text-center text-sm font-light">{l.quantity}</span>
                        <button
                          onClick={() => setQuantity(l.lineId, l.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 text-sm font-light hover:border-ground"
                          aria-label="Increase"
                        >+</button>
                      </div>
                      <div className="font-mono text-sm">{egp(l.unitPrice * l.quantity)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-ground/10 px-6 py-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Subtotal</span>
              <span className="editorial text-3xl">{egp(subtotal)}</span>
            </div>
            <p className="mb-4 text-[11px] font-light text-ground/40">
              Tax, delivery and promo are calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full hover:!bg-ground hover:!text-canvas"
            >
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
