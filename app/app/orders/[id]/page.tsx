"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePlatoOrder } from "@mantaray-digital/plato-sdk/react";
import { plato } from "@/lib/plato";
import { egp, eta } from "@/lib/format";

type Step = { key: string; label: string };

const COMMON: Step[] = [
  { key: "pending", label: "Placed" },
  { key: "in_progress", label: "Brewing" },
  { key: "ready", label: "Ready" },
];

const TIMELINE_BY_TYPE: Record<string, Step[]> = {
  delivery: [...COMMON, { key: "out_for_delivery", label: "On the way" }, { key: "delivered", label: "Delivered" }],
  pickup: [...COMMON, { key: "picked_up", label: "Picked up" }],
  takeaway: [...COMMON, { key: "picked_up", label: "Picked up" }],
  dine_in: [...COMMON, { key: "served", label: "Served" }],
};

const DEFAULT_TIMELINE = TIMELINE_BY_TYPE.delivery;

type PageProps = { params: Promise<{ id: string }> };

export default function OrderTrackingPage({ params }: PageProps) {
  const { id: orderId } = use(params);

  const [storedPhone, setStoredPhone] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      const v = localStorage.getItem("kamelizer_last_phone");
      if (v) setStoredPhone(v);
    } catch {}
  }, []);

  const { data: order, loading, refetch } = usePlatoOrder(
    orderId,
    storedPhone ? { customerPhone: storedPhone } : undefined,
  );

  useEffect(() => {
    const t = setInterval(() => {
      try {
        refetch?.();
      } catch {}
    }, 15_000);
    return () => clearInterval(t);
  }, [refetch]);

  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const status: string = order?.status ?? "pending";
  const orderType: string = order?.type ?? "delivery";
  const isCancelled = status === "cancelled";
  const isDone =
    status === "delivered" || status === "served" || status === "picked_up";
  const isPending = status === "pending";

  const timeline = TIMELINE_BY_TYPE[orderType] ?? DEFAULT_TIMELINE;

  const activeIdx = useMemo(() => {
    if (isCancelled) return -1;
    const i = timeline.findIndex((s) => s.key === status);
    return i >= 0 ? i : 0;
  }, [status, isCancelled, timeline]);

  const cancel = async () => {
    if (!isPending) return;
    const ok = window.confirm("Cancel this order? This can't be undone.");
    if (!ok) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await plato.orders.cancel(orderId, {
        ...(storedPhone ? { customerPhone: storedPhone } : {}),
        reason: "Customer cancelled",
      });
      refetch?.();
    } catch (err: any) {
      setCancelError(err?.message ?? "Couldn't cancel. Try again or call us.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-6">
        <span className="eyebrow animate-pulse">Loading your order…</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-6 text-center">
        <div className="max-w-md space-y-4">
          <span className="eyebrow">Not found</span>
          <h1 className="editorial text-5xl">No order at that link.</h1>
          <p className="text-sm font-light text-ground/60">
            Double check the link, or open the menu and brew a fresh one.
          </p>
          <Link href="/menu" className="btn-primary">Open the menu</Link>
        </div>
      </div>
    );
  }

  const headline = isCancelled ? (
    <>It's <em className="not-italic text-blue">off.</em></>
  ) : isDone ? (
    <>Enjoy every <em className="not-italic text-blue">sip.</em></>
  ) : (
    <>
      {timeline[activeIdx]?.label ?? "Working on it"}.{" "}
      <em className="not-italic text-blue">Stand by.</em>
    </>
  );

  const items = order.items ?? [];

  return (
    <div className="bg-canvas pb-32">
      <section className="border-b border-ground/10 px-6 pb-10 pt-12 lg:px-10 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Order #{order.orderNumber ?? order._id.slice(-6)}</span>
            {order.createdAt && (
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/40">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            )}
          </div>
          <h1 className="editorial mt-3 text-[12vw] leading-[0.95] md:text-[90px] lg:text-[120px]">
            {headline}
          </h1>
          {order.estimatedReadyAt && !isCancelled && !isDone && (
            <p className="mt-4 text-sm font-light text-ground/60">
              Estimated ready in{" "}
              <span className="text-ground">{eta(order.estimatedReadyAt)}</span>.
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pt-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-10 lg:pt-16">
        {/* Timeline */}
        <section>
          <span className="eyebrow">Progress</span>
          {isCancelled ? (
            <div className="mt-6 rounded-lg border border-ground/10 bg-ground/[0.03] p-6">
              <h3 className="editorial text-3xl">Cancelled.</h3>
              <p className="mt-2 text-sm font-light text-ground/60">
                Nothing was charged. Place a fresh order any time.
              </p>
            </div>
          ) : (
            <ol className="mt-6 space-y-0">
              {timeline.map((s, i) => {
                const reached = i <= activeIdx;
                const current = i === activeIdx;
                return (
                  <li key={s.key} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div
                        className={`grid h-7 w-7 place-items-center rounded-full border transition ${
                          reached
                            ? current
                              ? "border-blue bg-blue text-canvas"
                              : "border-ground bg-ground text-canvas"
                            : "border-ground/20 bg-canvas text-ground/30"
                        }`}
                      >
                        {reached && !current ? (
                          <CheckIcon />
                        ) : current ? (
                          <span className="h-2 w-2 rounded-full bg-canvas" />
                        ) : (
                          <span className="text-[10px]">{i + 1}</span>
                        )}
                      </div>
                      {i < timeline.length - 1 && (
                        <span
                          className={`my-1 w-px flex-1 ${
                            i < activeIdx ? "bg-ground/30" : "bg-ground/10"
                          }`}
                        />
                      )}
                    </div>
                    <div className="-mt-1 pb-8">
                      <div
                        className={`font-display text-2xl font-normal leading-tight ${
                          reached ? "" : "text-ground/30"
                        }`}
                      >
                        {s.label}
                      </div>
                      {current && (
                        <div className="mt-1 text-[12px] uppercase tracking-ultra font-normal text-blue">
                          In progress
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {isPending && (
            <div className="mt-6 border-t border-ground/10 pt-6">
              {cancelError && (
                <p className="mb-3 text-[12px] font-light text-blue">{cancelError}</p>
              )}
              <button
                onClick={cancel}
                disabled={cancelling}
                className="text-[11px] uppercase tracking-ultra font-normal text-ground/40 transition hover:text-blue"
              >
                {cancelling ? "Cancelling…" : "Cancel this order"}
              </button>
            </div>
          )}
        </section>

        {/* Summary */}
        <aside>
          <div className="rounded-lg border border-ground/10 bg-ground/[0.02] p-6 lg:p-8">
            <span className="eyebrow">Receipt</span>
            <ul className="mt-5 divide-y divide-ground/10">
              {items.map((it: any, i: number) => (
                <li key={it._id ?? i} className="flex items-baseline justify-between py-3">
                  <div className="min-w-0 flex-1">
                    <div className="editorial truncate text-lg leading-tight">
                      {it.name}{" "}
                      <span className="font-sans text-[11px] font-light text-ground/40">
                        × {it.quantity}
                      </span>
                    </div>
                    {it.modifiers && it.modifiers.length > 0 && (
                      <div className="mt-0.5 truncate text-[11px] font-light text-ground/50">
                        {it.modifiers.map((m: any) => m.optionName).join(" · ")}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-sm text-ground/70">
                    {egp((it.unitPrice ?? it.price ?? 0) * (it.quantity ?? 1))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-ground/10 pt-4 text-sm font-light">
              {typeof order.subtotal === "number" && (
                <Row label="Subtotal" value={egp(order.subtotal)} />
              )}
              {typeof order.tax === "number" && order.tax > 0 && (
                <Row label="Tax" value={egp(order.tax)} />
              )}
              {typeof order.deliveryFee === "number" && order.deliveryFee > 0 && (
                <Row label="Delivery" value={egp(order.deliveryFee)} />
              )}
              {typeof order.discount === "number" && order.discount > 0 && (
                <Row label="Discount" value={`− ${egp(order.discount)}`} />
              )}
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-ground/10 pt-4">
              <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/50">Total</span>
              <span className="editorial text-3xl">{egp(order.total ?? 0)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-1 text-[12px] font-light text-ground/50">
            {order.deliveryAddress && <div>{order.deliveryAddress}</div>}
            {order.paymentMethod && (
              <div className="uppercase tracking-ultra text-ground/40">
                {order.paymentMethod} · {order.paymentStatus}
              </div>
            )}
          </div>

          <Link href="/menu" className="btn-ghost mt-8 w-full">Order another</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ground/60">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
