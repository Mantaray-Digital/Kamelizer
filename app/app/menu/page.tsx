"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePlatoBranches, usePlatoMenu } from "@mantaray-digital/plato-sdk/react";
import { useUI } from "@/lib/ui-store";
import { egp } from "@/lib/format";

type Category = {
  _id: string;
  name: string;
  description?: string | null;
  items?: Item[];
};

type Item = {
  _id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable?: boolean;
  categoryId?: string;
};

export default function MenuPage() {
  const { data: branches, loading: branchesLoading } = usePlatoBranches();
  const branchId = branches?.[0]?._id ?? null;
  const {
    categories: rawCategories,
    items: rawItems,
    loading: menuLoading,
  } = usePlatoMenu(branchId ? { branchId } : undefined);
  const { setActiveItemId } = useUI();

  const categories: Category[] = useMemo(() => {
    if (!rawCategories) return [];
    return rawCategories.map((c) => ({
      _id: c._id,
      name: c.name,
      description: c.description ?? null,
      items: (rawItems ?? []).filter((i) => i.categoryId === c._id),
    }));
  }, [rawCategories, rawItems]);

  const [search, setSearch] = useState("");
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!activeCatId && categories[0]) setActiveCatId(categories[0]._id);
  }, [categories, activeCatId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((c) => ({
        ...c,
        items: (c.items ?? []).filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            (i.description ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((c) => (c.items ?? []).length > 0);
  }, [categories, search]);

  const scrollToCat = (id: string) => {
    setActiveCatId(id);
    const el = sectionRefs.current[id];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const loading = branchesLoading || menuLoading;

  return (
    <div className="bg-canvas pb-32">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ground/10 px-6 pb-12 pt-12 lg:px-10 lg:pb-20 lg:pt-20">
        <div className="pointer-events-none absolute inset-0 select-none opacity-[0.04]">
          <div className="font-display text-[40vw] leading-none tracking-[-0.05em] text-ground">K</div>
        </div>

        <div className="relative mx-auto flex max-w-[1600px] flex-col gap-6">
          <span className="eyebrow">The Menu</span>
          <h1 className="editorial text-[14vw] leading-[0.9] md:text-[120px] lg:text-[160px]">
            Every <em className="not-italic text-blue">cup.</em>
          </h1>
          <p className="max-w-md text-sm font-light leading-relaxed text-ground/60">
            Single-origin espresso, slow brews, seasonal pours, and a few warm
            things to eat. Tap an item to customise it.
          </p>
        </div>
      </section>

      {/* Search + sticky category rail */}
      <div className="sticky top-[72px] z-30 border-b border-ground/10 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:gap-8 lg:px-10">
          <div className="relative w-full lg:max-w-xs">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the menu"
              className="w-full rounded-full border border-ground/15 bg-transparent py-2.5 pl-9 pr-4 text-sm font-light placeholder:text-ground/40 focus:border-blue focus:outline-none"
            />
          </div>

          <nav className="scroll-hide -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-1 lg:px-0">
            {filtered.map((c) => {
              const active = c._id === activeCatId;
              return (
                <button
                  key={c._id}
                  onClick={() => scrollToCat(c._id)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-ultra transition ${
                    active
                      ? "border-ground bg-ground text-canvas"
                      : "border-ground/20 text-ground/70 hover:border-ground"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Items */}
      <main className="mx-auto max-w-[1600px] px-6 pt-12 lg:px-10 lg:pt-16">
        {loading && <MenuSkeleton />}

        {!loading && filtered.length === 0 && (
          <div className="grid place-items-center py-32 text-center">
            <div>
              <h2 className="editorial text-4xl">Nothing matches.</h2>
              <p className="mt-3 text-sm font-light text-ground/50">
                Try a different word, or clear the search.
              </p>
            </div>
          </div>
        )}

        {!loading && filtered.map((cat) => (
          <section
            key={cat._id}
            ref={(el: HTMLDivElement | null) => {
              sectionRefs.current[cat._id] = el;
            }}
            className="mb-20"
          >
            <div className="mb-8 flex items-end justify-between gap-6 border-b border-ground/10 pb-4">
              <div>
                <span className="eyebrow">{(cat.items?.length ?? 0)} items</span>
                <h2 className="editorial mt-2 text-5xl md:text-6xl">{cat.name}</h2>
              </div>
              {cat.description && (
                <p className="hidden max-w-sm text-sm font-light leading-relaxed text-ground/50 md:block">
                  {cat.description}
                </p>
              )}
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(cat.items ?? []).map((item) => (
                <li key={item._id}>
                  <button
                    onClick={() => setActiveItemId(item._id)}
                    disabled={item.isAvailable === false}
                    className="group block w-full text-left disabled:opacity-50"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-ground/[0.06]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <span className="font-display text-7xl font-normal text-ground/15">K</span>
                        </div>
                      )}
                      {item.isAvailable === false && (
                        <div className="absolute inset-0 grid place-items-center bg-canvas/70 backdrop-blur-sm">
                          <span className="rounded-full border border-ground/40 px-3 py-1 text-[10px] uppercase tracking-ultra">
                            Sold out
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="editorial text-2xl leading-tight">{item.name}</h3>
                      <span className="font-mono text-sm text-ground/70">{egp(item.price)}</span>
                    </div>
                    {item.description && (
                      <p className="mt-1.5 line-clamp-2 text-[13px] font-light leading-relaxed text-ground/50">
                        {item.description}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] w-full rounded-lg bg-ground/[0.06]" />
          <div className="mt-4 h-5 w-2/3 rounded bg-ground/10" />
          <div className="mt-2 h-3 w-1/2 rounded bg-ground/10" />
        </div>
      ))}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-ground/40"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
