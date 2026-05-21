"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  usePlatoBranches,
  usePlatoCart,
  useCustomer,
} from "@mantaray-digital/plato-sdk/react";
import { plato } from "@/lib/plato";
import { useCart } from "@/lib/cart-store";
import { egp } from "@/lib/format";

type OrderType = "delivery" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { customer, isLoggedIn } = useCustomer();
  const { data: branches } = usePlatoBranches();

  const [branchId, setBranchId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocateError("Your browser doesn't support location sharing.");
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError("Location blocked. Enable it in your browser and try again.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocateError("Couldn't read your location. Try again in a moment.");
        } else {
          setLocateError("Couldn't read your location. Try again in a moment.");
        }
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    );
  };

  useEffect(() => {
    if (!branchId && branches?.[0]?._id) setBranchId(branches[0]._id);
  }, [branches, branchId]);

  useEffect(() => {
    if (isLoggedIn && customer) {
      if (!name) setName(customer.name ?? "");
      if (!phone) setPhone(customer.phone ?? "");
    }
  }, [isLoggedIn, customer, name, phone]);

  const cartInput = useMemo(() => {
    if (!branchId || lines.length === 0) return null;
    const base: any = {
      branchId,
      orderType,
      items: lines.map((l) => ({
        menuItemId: l.menuItemId,
        quantity: l.quantity,
        modifiers: l.modifiers ?? [],
        notes: l.notes,
      })),
    };
    if (orderType === "delivery" && coords) {
      base.addressLatitude = coords.lat;
      base.addressLongitude = coords.lng;
    }
    return base;
  }, [branchId, orderType, lines, coords]);

  const { data: pricing, loading: pricingLoading } = usePlatoCart(cartInput);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    [lines],
  );
  const total = pricing?.total ?? subtotal;
  const tax = pricing?.tax ?? 0;
  const delivery = pricing?.deliveryFee ?? 0;
  const discount = pricing?.promoDiscount ?? 0;

  const canSubmit =
    !!branchId &&
    lines.length > 0 &&
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    (orderType !== "delivery" || (address.trim().length > 0 && coords !== null)) &&
    !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !branchId) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = {
        branchId,
        orderType,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        items: lines.map((l) => ({
          menuItemId: l.menuItemId,
          quantity: l.quantity,
          modifiers: l.modifiers ?? [],
          notes: l.notes,
        })),
        notes: notes.trim() || undefined,
      };
      if (orderType === "delivery") {
        payload.deliveryAddress = address.trim();
        if (coords) {
          payload.deliveryLatitude = coords.lat;
          payload.deliveryLongitude = coords.lng;
        }
      }
      const result = await plato.orders.create(payload);
      try {
        localStorage.setItem("kamelizer_last_phone", phone.trim());
      } catch {}
      clear();
      if (result?.orderId) {
        router.push(`/orders/${result.orderId}`);
      }
    } catch (err: any) {
      setError(err?.message ?? "Couldn't place the order. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0 && !submitting) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-6 text-center">
        <div className="max-w-md space-y-5">
          <span className="eyebrow">Checkout</span>
          <h1 className="editorial text-5xl md:text-6xl">
            Nothing to <em className="not-italic text-blue">brew yet.</em>
          </h1>
          <p className="text-sm font-light text-ground/60">
            Your bag is empty. Pick a cup or two from the menu and come back.
          </p>
          <Link href="/menu" className="btn-primary">Open the menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas pb-32">
      <section className="border-b border-ground/10 px-6 pb-10 pt-12 lg:px-10 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-[1600px]">
          <span className="eyebrow">Checkout</span>
          <h1 className="editorial mt-3 text-[14vw] leading-[0.9] md:text-[110px] lg:text-[140px]">
            Last <em className="not-italic text-blue">cup.</em>
          </h1>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-ground/60">
            One short form. Cash on arrival. We confirm by phone once it's brewed.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pt-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-10 lg:pt-16">
        {/* Form */}
        <form onSubmit={submit} className="space-y-12">
          {/* Order type */}
          <section>
            <span className="eyebrow">How</span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <OrderTypePill
                active={orderType === "delivery"}
                onClick={() => setOrderType("delivery")}
                label="Delivery"
                sub="To your door"
              />
              <OrderTypePill
                active={orderType === "pickup"}
                onClick={() => setOrderType("pickup")}
                label="Pickup"
                sub="From a branch"
              />
            </div>
          </section>

          {/* Branch */}
          {(branches?.length ?? 0) > 1 && (
            <section>
              <span className="eyebrow">From</span>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {branches?.map((b: any) => {
                  const active = b._id === branchId;
                  return (
                    <button
                      key={b._id}
                      type="button"
                      onClick={() => setBranchId(b._id)}
                      className={`rounded-lg border p-4 text-left transition ${
                        active ? "border-blue bg-blue/5" : "border-ground/15 hover:border-ground/30"
                      }`}
                    >
                      <div className="font-display text-xl font-normal">{b.name}</div>
                      {b.address && (
                        <div className="mt-1 text-[12px] font-light text-ground/50">{b.address}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* You */}
          <section className="space-y-6">
            <span className="eyebrow">You</span>
            <label className="block">
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="field mt-1"
                required
              />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Phone</span>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 1XX XXX XXXX"
                className="field mt-1"
                required
              />
            </label>

            {orderType === "delivery" && (
              <div className="space-y-5">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Address</span>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, building, floor, apartment, landmark"
                    rows={3}
                    className="field mt-1 resize-none"
                    required
                  />
                </label>

                <div className="rounded-lg border border-ground/10 bg-ground/[0.02] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">
                        Pin your spot
                      </div>
                      {coords ? (
                        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-light text-blue">
                            <PinIcon />
                            Location pinned
                          </span>
                          <span className="font-mono text-[11px] text-ground/40">
                            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                          </span>
                        </div>
                      ) : (
                        <p className="mt-1.5 text-[12px] font-light text-ground/55">
                          So our courier finds you the first time. Your phone shares this once — we don't track you.
                        </p>
                      )}
                      {locateError && (
                        <p className="mt-2 text-[12px] font-light text-blue">{locateError}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={captureLocation}
                      disabled={locating}
                      className="btn-mini shrink-0"
                    >
                      {locating ? "Locating…" : coords ? "Re-pin" : "Use my location"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <label className="block">
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">
                Notes <span className="text-ground/30">(optional)</span>
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Anything we should know about the brew or the trip?"
                className="field mt-1 resize-none"
              />
            </label>
          </section>

          <div className="hidden lg:block">
            {error && (
              <p className="mb-3 text-[12px] font-light text-blue">{error}</p>
            )}
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary w-full hover:!bg-ground hover:!text-canvas"
            >
              {submitting ? "Placing…" : `Place order · ${egp(total)}`}
            </button>
            <p className="mt-3 text-[11px] font-light text-ground/40">
              Cash on arrival. No card needed.
            </p>
          </div>
        </form>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-ground/10 bg-ground/[0.02] p-6 lg:p-8">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Your bag</span>
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">
                {lines.length} {lines.length === 1 ? "line" : "lines"}
              </span>
            </div>

            <ul className="mt-5 divide-y divide-ground/10">
              {lines.map((l) => (
                <li key={l.lineId} className="flex gap-4 py-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-ground/[0.05]">
                    {l.image && (
                      <Image src={l.image} alt={l.name} fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="editorial truncate text-lg leading-tight">
                        {l.name}{" "}
                        <span className="font-sans text-[11px] font-light text-ground/40">
                          × {l.quantity}
                        </span>
                      </div>
                      <span className="font-mono text-sm text-ground/70">
                        {egp(l.unitPrice * l.quantity)}
                      </span>
                    </div>
                    {l.modifiers && l.modifiers.length > 0 && (
                      <div className="mt-0.5 truncate text-[11px] font-light text-ground/50">
                        {l.modifiers.map((m) => m.optionName).join(" · ")}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 border-t border-ground/10 pt-6 text-sm font-light">
              <Row label="Subtotal" value={egp(subtotal)} />
              {tax > 0 && <Row label="Tax" value={egp(tax)} />}
              {orderType === "delivery" && (
                <Row label="Delivery" value={delivery > 0 ? egp(delivery) : "—"} />
              )}
              {discount > 0 && <Row label="Discount" value={`− ${egp(discount)}`} muted={false} />}
            </div>

            <div className="mt-6 flex items-baseline justify-between border-t border-ground/10 pt-6">
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Total</span>
              <span className="editorial text-4xl">
                {pricingLoading ? "…" : egp(total)}
              </span>
            </div>
          </div>

          <div className="mt-6 lg:hidden">
            {error && (
              <p className="mb-3 text-[12px] font-light text-blue">{error}</p>
            )}
            <button
              onClick={submit}
              disabled={!canSubmit}
              type="button"
              className="btn-primary w-full hover:!bg-ground hover:!text-canvas"
            >
              {submitting ? "Placing…" : `Place order · ${egp(total)}`}
            </button>
            <p className="mt-3 text-[11px] font-light text-ground/40">
              Cash on arrival. No card needed.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrderTypePill({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        active ? "border-blue bg-blue/5" : "border-ground/15 hover:border-ground/30"
      }`}
    >
      <div className="font-display text-xl font-normal leading-none">{label}</div>
      <div className="mt-1 text-[11px] font-light text-ground/50">{sub}</div>
    </button>
  );
}

function Row({ label, value, muted = true }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={muted ? "text-ground/60" : "text-blue"}>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
