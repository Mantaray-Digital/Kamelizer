# Kamelizer Coffee — Storefront Build Handoff

> **Audience:** Cloud (or any Claude/Claude Code instance) building the Kamelizer Coffee storefront from scratch.
>
> **Mission:** Recreate the exact same architecture and feature set as the existing "Twenty Grams" storefront, but for **Kamelizer Coffee**. The brand identity (name, logo, copy, colors, font, images) changes — the engineering does not.
>
> **Inputs you have:**
> 1. This document (every code file, exact contents, file paths).
> 2. An `assets/` folder containing all the Kamelizer brand images.
> 3. The Instagram handle: <https://www.instagram.com/kamelizercoffee> — visit it to confirm the color/font direction described in §3 below.
> 4. Plato SDK credentials for the Kamelizer Coffee restaurant (see §2).

---

## 1. What you're building

A **Next.js 16 + Tailwind + TypeScript** customer-facing storefront for **Kamelizer Coffee**, powered by the `@mantaray-digital/plato-sdk`. It includes:

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, marquee, story, signature drinks, order paths, locations |
| `/menu` | Full menu with category rail, search, item cards |
| `/login` | Phone + OTP sign-in (Plato customer auth) |
| `/checkout` | Delivery or pickup checkout (cash on delivery) |
| `/orders/[id]` | Order tracking with status timeline + cancel button |
| `/table/[tableId]` | Dine-in QR ordering — call waiter, build the table bill |

Plus global UI: top nav, cart drawer, item modal, footer.

Cart state lives in `localStorage`. The Plato SDK handles auth, menu, pricing, orders, and the dine-in QR flow.

---

## 2. Credentials

Create `.env.local` at the app root:

```ini
NEXT_PUBLIC_PLATO_CONVEX_URL=https://quick-lapwing-50.eu-west-1.convex.cloud/
NEXT_PUBLIC_PLATO_API_KEY=plato_sk_XZSnX31W6tDM3KMLwLGmiiUhldnoeD2v2FCcN1J76Yk
```

> These are **public per-restaurant** keys, intended for the client bundle. Same security model as Supabase anon keys. Don't reuse outside the Kamelizer storefront.

---

## 3. Brand identity — Kamelizer Coffee

### 3.1 Font

Reference Instagram: <https://www.instagram.com/kamelizercoffee>

**Display font (headlines):** *Retro serif display.*
- Bold weight
- Rounded / ball terminals on serifs
- High stroke contrast (thick stems, thin hairlines)
- Slightly warm, vintage editorial feel
- NOT geometric — humanist / old-style proportions

**Closest free Google Fonts match (use this):** **`Playfair Display`** at weight 700/900.

Fallbacks in order of preference:
1. `Playfair Display` (Bold/Black) — primary choice
2. `Libre Baskerville` (Bold) — slightly more neutral
3. `DM Serif Display` — cleaner but similar feel

**Body / subtext font:** clean, lightweight sans-serif. Use **`Inter`** (Google Font) — matches what the brand uses on Instagram tiles ("More movement. New routine. Longer days.").

**Premium alternatives** (skip unless the client provides files): Canela (Commercial Type), Tobias (ABC Dinamo), Freight Display Pro (GarageFonts).

### 3.2 Colors

Look at the images in `assets/`. The dominant colors are warm, vintage-editorial. **Use 3–4 colors maximum.** Confirmed accent from the Instagram tiles is the electric/sky blue used on "Iced Cup" highlight text.

**Default palette (override only if `assets/` clearly dictates different dominants):**

| Token | Hex | Role |
|---|---|---|
| `--c-canvas` | `#F4ECDD` (warm cream) | Background ("ink" equivalent) |
| `--c-ground` | `#2A1A0F` (deep coffee brown) | Text & contrast ("bone" equivalent) |
| `--c-blue` | `#3FA9F5` (electric sky blue) | Accent — used on highlighted nouns, hover states, focus rings |
| `--c-tan` | `#C89F6B` (warm muted tan) | Optional 4th — soft separators, secondary surfaces |

**Process Cloud must follow:**
1. Open 5–6 representative images from `assets/`.
2. Pick the single most dominant background tone → that becomes `--c-canvas`.
3. Pick the strongest contrast text/object color → `--c-ground`.
4. Keep the **electric blue** accent (`#3FA9F5`) — this is on-brand from Instagram.
5. Add at most one extra warm neutral if a 4th is needed.

Tailwind uses these as CSS variables (see §6 — tailwind.config.ts and globals.css).

### 3.3 Voice / copy direction

Twenty Grams' voice was *"weighing everything that matters."* Kamelizer's voice should lean **warm, editorial, slow-roast** — match the Instagram captions. Rewrite all body copy (headings, hero lines, marquee words, signature copy) to fit Kamelizer's identity. **Do not keep "Twenty Grams", "20g", "weight", or "Cairo · Egypt"** verbatim — substitute Kamelizer's brand language.

### 3.4 Images

Drop everything from `assets/` into `app/public/images/`. Rename them with sequential, semantic names:
- `kamelizer-01.jpg`, `kamelizer-02.jpg`, … through whatever you have.
- The logo image goes to `app/public/images/logo.jpg` (or `.png`).

Then update the `src="/images/..."` paths throughout the page files to use the new names.

---

## 4. Tech stack & setup

### 4.1 Prerequisites

- Node.js 20+
- pnpm 9+ (or npm — adjust commands)

### 4.2 Bootstrap

```bash
# from the project root
mkdir app
cd app
pnpm init -y
```

### 4.3 `app/package.json`

Overwrite with:

```json
{
  "name": "kamelizer-storefront",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@mantaray-digital/plato-sdk": "latest",
    "convex": "^1.16.0",
    "next": "16.2.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
}
```

Install:
```bash
pnpm install
```

### 4.4 `app/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4.5 `app/next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
```

> (The Twenty Grams `next.config.ts` had a `/20grams` rewrite — drop that for Kamelizer unless the client asks for a similar path prefix.)

### 4.6 `app/postcss.config.mjs`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 4.7 `app/tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canvas = warm cream background. Ground = deep coffee brown text.
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        ground: "rgb(var(--c-ground) / <alpha-value>)",
        blue: "#3FA9F5",
        tan: "#C89F6B",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        ultra: "0.4em",
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "fade-up": "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "pour": "pour 2.2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pour: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-4px) rotate(-2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

> **Important rename:** the Twenty Grams version used the tokens `ink` (white canvas) and `bone` (black text). For Kamelizer we rename them to `canvas` (cream) and `ground` (coffee brown). Throughout every TSX file below, replace any `ink` → `canvas` and any `bone` → `ground`. The accent token changes `sky` → `blue`.

---

## 5. Folder layout

```
kamelizer-storefront/
├── assets/                      # original brand images (you started with this)
├── app/                         # ← Next.js project root
│   ├── app/
│   │   ├── checkout/page.tsx
│   │   ├── login/page.tsx
│   │   ├── menu/page.tsx
│   │   ├── orders/[id]/page.tsx
│   │   ├── table/[tableId]/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── cart-drawer.tsx
│   │   ├── footer.tsx
│   │   ├── item-modal.tsx
│   │   ├── providers.tsx
│   │   └── top-nav.tsx
│   ├── lib/
│   │   ├── cart-store.tsx
│   │   ├── format.ts
│   │   ├── plato.ts
│   │   └── ui-store.tsx
│   ├── public/
│   │   ├── fonts/               # if you use a self-hosted font; else skip
│   │   └── images/              # all Kamelizer images go here
│   ├── .env.local               # credentials (§2)
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── KAMELIZER_HANDOFF.md         # this file
```

---

## 6. Global styles

### 6.1 `app/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-display: "Playfair Display", "Libre Baskerville", "Georgia", serif;
  --font-sans: "Inter", "Helvetica Neue", system-ui, sans-serif;
  --font-mono: ui-monospace, "SFMono-Regular", "JetBrains Mono", monospace;

  /* Kamelizer palette — confirm hex after sampling assets/ */
  --c-canvas: 244 236 221;   /* #F4ECDD warm cream  */
  --c-ground: 42 26 15;      /* #2A1A0F deep coffee */
  color-scheme: light;
}

html,
body {
  background: rgb(var(--c-canvas));
  color: rgb(var(--c-ground));
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection {
  background: #3FA9F5;
  color: #ffffff;
}

@layer components {
  .pill {
    @apply inline-flex items-center gap-2 rounded-full border border-ground/20 px-4 py-1.5 text-[11px] uppercase tracking-ultra;
  }
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-ground px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.3em] text-canvas transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none;
  }
  .btn-primary:hover {
    background-color: #3FA9F5;
    color: #ffffff;
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center gap-2 rounded-full border border-ground/30 px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.3em] text-ground transition hover:bg-ground hover:text-canvas active:scale-[0.98];
  }
  .btn-mini {
    @apply inline-flex items-center justify-center rounded-full border border-ground/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em];
  }
  .field {
    @apply w-full rounded-none border-0 border-b border-ground/30 bg-transparent px-0 py-3 text-[15px] text-ground placeholder:text-ground/30 focus:outline-none;
  }
  .field:focus {
    border-color: #3FA9F5;
  }
  .editorial {
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 0.92;
    letter-spacing: -0.015em;
  }
}

.grain::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  opacity: 0.05;
  mix-blend-mode: multiply;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(42,26,15,0.6) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(42,26,15,0.4) 1px, transparent 1px);
  background-size: 3px 3px, 5px 5px;
}

.scroll-hide::-webkit-scrollbar { display: none; }
.scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
```

> **Key differences from Twenty Grams' `globals.css`:**
> - Color tokens renamed (`--c-ink`→`--c-canvas`, `--c-bone`→`--c-ground`); cream + brown instead of white + black.
> - `.editorial` switches to a serif (`var(--font-display)` = Playfair Display) with normal case and looser line-height, instead of the all-caps condensed sans look Twenty Grams used. This is the single biggest visual shift — Kamelizer's vintage editorial vibe lives here.
> - Accent recolored from `#BFDBE9` (pale sky) to `#3FA9F5` (electric blue).
> - Grain texture uses `multiply` blend with dark dots on a warm canvas (Twenty Grams used `overlay` with white dots on black).

### 6.2 `app/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { TopNav } from "@/components/top-nav";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["700", "900"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kamelizer Coffee — Specialty Coffee",
  description:
    "Kamelizer Coffee — specialty coffee, slow brews, and warm rituals. Order for delivery, pickup, or scan the QR at your table.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
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
```

> Twenty Grams used a self-hosted `road-radio-bold.otf`. For Kamelizer we pull Playfair Display straight from Google Fonts via `next/font/google` — no font files needed in `public/fonts/`. If the client later supplies a premium font (Canela, Tobias, etc.), swap the `Playfair_Display(...)` import for a `localFont({...})` like the Twenty Grams version had.

---

## 7. Lib (shared logic)

### 7.1 `app/lib/plato.ts`

```ts
import { PlatoStore } from "@mantaray-digital/plato-sdk";

declare global {
  // eslint-disable-next-line no-var
  var __plato__: PlatoStore | undefined;
}

function makeStore(): PlatoStore {
  const convexUrl = process.env.NEXT_PUBLIC_PLATO_CONVEX_URL;
  const apiKey = process.env.NEXT_PUBLIC_PLATO_API_KEY;

  if (!convexUrl || !apiKey) {
    throw new Error(
      "Missing Plato credentials. Set NEXT_PUBLIC_PLATO_CONVEX_URL and NEXT_PUBLIC_PLATO_API_KEY in .env.local.",
    );
  }

  return new PlatoStore({ convexUrl, apiKey });
}

export const plato: PlatoStore =
  globalThis.__plato__ ?? (globalThis.__plato__ = makeStore());
```

### 7.2 `app/lib/format.ts`

```ts
export function egp(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toLocaleString("en-EG", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} EGP`;
}

export function eta(date?: number | null): string {
  if (!date) return "—";
  const d = new Date(date);
  const mins = Math.max(0, Math.round((d.getTime() - Date.now()) / 60_000));
  if (mins === 0) return "any minute";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}
```

### 7.3 `app/lib/ui-store.tsx`

```tsx
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
```

### 7.4 `app/lib/cart-store.tsx`

```tsx
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
```

> `STORAGE_KEY` is `kamelizer_cart_v1` (was `20g_cart_v1`).

---

## 8. Components

### 8.1 `app/components/providers.tsx`

```tsx
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
          <p className="text-sm opacity-70">
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
```

### 8.2 `app/components/top-nav.tsx`

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/ui-store";
import { useCart } from "@/lib/cart-store";
import { useCustomer } from "@mantaray-digital/plato-sdk/react";

export function TopNav() {
  const { openCart } = useUI();
  const { totalQuantity } = useCart();
  const { isLoggedIn, customer } = useCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);

  const accountLabel = isLoggedIn ? customer?.name?.split(" ")[0] ?? "Account" : "Sign in";

  return (
    <header className="sticky top-0 z-40 border-b border-ground/10 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" aria-label="Kamelizer Coffee · home" className="group flex items-center">
          <Image
            src="/images/logo.jpg"
            alt="Kamelizer Coffee"
            width={120}
            height={120}
            priority
            className="h-16 w-auto rounded-md transition group-hover:opacity-80"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-ultra text-ground/70 md:flex">
          <Link href="/menu" className="hover:text-ground">Menu</Link>
          <Link href="/#story" className="hover:text-ground">Story</Link>
          <Link href="/#locations" className="hover:text-ground">Locations</Link>
          <Link href="/login" className="hover:text-ground">{accountLabel}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="group relative flex items-center gap-2 rounded-full border border-ground/20 px-4 py-2 text-[11px] uppercase tracking-ultra transition hover:border-blue hover:text-blue"
            aria-label="Open cart"
          >
            <span>Bag</span>
            <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-ground px-1.5 text-[10px] font-medium text-canvas group-hover:bg-blue">
              {totalQuantity}
            </span>
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="grid h-9 w-9 place-items-center rounded-full border border-ground/20 text-ground/70 transition hover:border-ground hover:text-ground md:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-ground/10 bg-canvas/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto flex max-w-[1600px] flex-col px-6 py-2 text-[12px] uppercase tracking-ultra text-ground/80">
            <MobileLink href="/menu" onNavigate={() => setMobileOpen(false)}>Menu</MobileLink>
            <MobileLink href="/#story" onNavigate={() => setMobileOpen(false)}>Story</MobileLink>
            <MobileLink href="/#locations" onNavigate={() => setMobileOpen(false)}>Locations</MobileLink>
            <MobileLink href="/login" onNavigate={() => setMobileOpen(false)}>{accountLabel}</MobileLink>
          </ul>
        </nav>
      )}
    </header>
  );
}

function MobileLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <li className="border-b border-ground/10 last:border-0">
      <Link href={href} onClick={onNavigate} className="block py-4 hover:text-ground">
        {children}
      </Link>
    </li>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
```

### 8.3 `app/components/footer.tsx`

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ground/10 bg-canvas">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl leading-none">Kamelizer</span>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ground/60">
              Specialty coffee, slow brews, and warm rituals. Roasted with intent.
              Served with care.
            </p>
          </div>

          <FooterCol title="Visit">
            {/* Replace with real Kamelizer branches when known */}
            <li>Branch one</li>
            <li>Branch two</li>
          </FooterCol>

          <FooterCol title="Order">
            <li><Link href="/menu" className="hover:text-ground">Menu</Link></li>
            <li><Link href="/checkout" className="hover:text-ground">Checkout</Link></li>
            <li><Link href="/login" className="hover:text-ground">Track an order</Link></li>
          </FooterCol>

          <FooterCol title="Hours">
            <li>Daily · 8am–11pm</li>
            <li className="pt-3 text-ground/60">Brewed daily</li>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ground/10 pt-6 text-[11px] uppercase tracking-ultra text-ground/40 md:flex-row md:items-center">
          <span>© Kamelizer Coffee</span>
          <span>Built on Plato by Mantaray Digital</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] uppercase tracking-ultra text-ground/40">{title}</h4>
      <ul className="space-y-2 text-sm text-ground/80">{children}</ul>
    </div>
  );
}
```

### 8.4 `app/components/cart-drawer.tsx`

```tsx
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
        <div className="absolute inset-0 bg-ground/40 backdrop-blur-sm" />
      </div>

      <aside
        className={`fixed right-0 top-0 z-[55] flex h-full w-full max-w-md flex-col border-l border-ground/10 bg-canvas transition-transform duration-500 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!cartOpen}
      >
        <header className="flex items-center justify-between border-b border-ground/10 px-6 py-5">
          <div>
            <div className="text-[11px] uppercase tracking-ultra text-ground/50">Your bag</div>
            <div className="editorial text-2xl">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </div>
          </div>
          <button
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full border border-ground/20 hover:bg-ground hover:text-canvas"
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
                <p className="text-sm text-ground/60">
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
                          <div className="mt-1 text-[11px] text-ground/50">
                            {l.modifiers.map((m) => m.optionName).join(" · ")}
                          </div>
                        )}
                        {l.notes && (
                          <div className="mt-1 text-[11px] italic text-ground/40">"{l.notes}"</div>
                        )}
                      </div>
                      <button
                        onClick={() => remove(l.lineId)}
                        className="text-[11px] uppercase tracking-ultra text-ground/40 hover:text-blue"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(l.lineId, l.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 hover:border-ground"
                          aria-label="Decrease"
                        >−</button>
                        <span className="w-5 text-center text-sm">{l.quantity}</span>
                        <button
                          onClick={() => setQuantity(l.lineId, l.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-ground/20 hover:border-ground"
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
              <span className="text-[11px] uppercase tracking-ultra text-ground/50">Subtotal</span>
              <span className="editorial text-3xl">{egp(subtotal)}</span>
            </div>
            <p className="mb-4 text-[11px] text-ground/40">
              Tax, delivery and promo are calculated at checkout.
            </p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
```

### 8.5 `app/components/item-modal.tsx`

```tsx
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
          className="absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-canvas/70 text-ground/70 backdrop-blur hover:text-ground"
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
                <p className="mt-3 max-w-xl text-sm text-ground/60">{item.description}</p>
              )}
              <div className="mt-4 text-[11px] uppercase tracking-ultra text-ground/40">
                Base · {egp(item.price)}
              </div>

              <div className="my-8 h-px w-full bg-ground/10" />

              {modsLoading && <SkeletonLine />}
              {groups?.map((g) => (
                <fieldset key={g._id} className="mb-8">
                  <legend className="mb-3 flex items-center gap-3 text-[12px] uppercase tracking-ultra text-ground/70">
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
                          className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm transition ${
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
                <label className="mb-2 block text-[11px] uppercase tracking-ultra text-ground/40">
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
                    className="grid h-10 w-10 place-items-center rounded-full border border-ground/20 hover:border-ground"
                    aria-label="Decrease"
                  >−</button>
                  <span className="w-8 text-center font-display text-2xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ground/20 hover:border-ground"
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
```

---

## 9. Pages

> All pages follow the **exact structure** from Twenty Grams. Reproduce them verbatim with these substitutions:
>
> - `ink` → `canvas`
> - `bone` → `ground`
> - `sky` → `blue`
> - Hero / signature / story copy → Kamelizer-flavoured (write fresh in the same tonal range — see §10 for copy guidance)
> - Image paths → `/images/kamelizer-XX.jpg` matching whatever you copy into `public/images/`
> - "20g" big typographic backdrop → swap for a Kamelizer mark (e.g. a "K" or the word "Kamelizer" at huge `text-[40vw]` opacity-low)
> - Locations → ask the client for real Kamelizer branches; placeholder until then
> - `Twenty Grams` everywhere → `Kamelizer Coffee`

### 9.1 `app/app/page.tsx` (landing)

This is the largest file. Reproduce the Twenty Grams landing page (hero, marquee, story, signatures, order paths, editorial photo break, QR explainer, locations) **structurally identically** with the color/copy substitutions above. Refer to §11 for the full source.

Suggested Kamelizer marquee words (replace the Twenty Grams list):
```
"Slow brews", "House Espresso", "Iced Cup", "Drip Coffee",
"Warm Rituals", "Kamelizer", "Single Origin"
```

Suggested hero headline (swap the `editorial` copy):
```
The slow craft
of a <em className="not-italic text-blue">good cup.</em>
```

The three signature cards become e.g.:
- `01 — The Bean` · House Espresso
- `02 — The Pour` · Iced Cup
- `03 — The Slow` · Drip of the Day

### 9.2 `app/app/menu/page.tsx`

Drop in the menu page (search + category rail + grid). No structural changes — only color/token substitutions (`bg-ink` → `bg-canvas`, `text-bone` → `text-ground`, `border-sky` → `border-blue`, etc.). Hero copy becomes:
```
Every <em className="not-italic text-blue">cup.</em>
```

> When an item has no image, the Twenty Grams fallback rendered `20g` as the placeholder. Replace with `K` or the word `Kamelizer` (smaller font) in the menu and table pages.

### 9.3 `app/app/checkout/page.tsx`

Use as-is from §11 with the token substitutions. No logic change.

Hero copy becomes:
```
Last <em className="not-italic text-blue">cup.</em>
```

### 9.4 `app/app/login/page.tsx`

Use as-is with substitutions. The hero image switches from `/images/20g-27.png` to a Kamelizer image. Copy stays structurally the same.

### 9.5 `app/app/orders/[id]/page.tsx`

Use as-is with substitutions. Headline variants:
- Cancelled: `It's <em>off.</em>`
- Done: `Enjoy every <em>sip.</em>` (was `gram` in Twenty Grams)
- In progress: status label (unchanged)

### 9.6 `app/app/table/[tableId]/page.tsx`

Use as-is with substitutions. The "20g" placeholder when an item has no image becomes "K" or "Kamelizer".

---

## 10. Copy guidance

When rewriting body copy from Twenty Grams to Kamelizer, hold these principles:

1. **Same length, same rhythm.** If Twenty Grams says *"Twenty grams of coffee. Twenty grams of cacao. Twenty seconds of steam. We measure everything that matters — so you don't have to."* — the Kamelizer equivalent should be three short clauses + a closing line.
2. **Vintage editorial, not corporate.** Lean into rituals, slow craft, warmth.
3. **Keep the highlighted-noun pattern.** Every editorial headline has one accent-blue word (`<em className="not-italic text-blue">…</em>`). Pick the most loaded noun and highlight it.
4. **No "weight," "grams," "20g."** Substitute with Kamelizer-native vocabulary (cups, brews, pours, beans, rituals).
5. **Brand voice:** match Kamelizer's Instagram captions — warm, second-person, lightly poetic.

Example transformations:

| Twenty Grams | Kamelizer |
|---|---|
| `The weight of a moment.` | `The slow craft of a good cup.` |
| `Built on obsession.` | `Brewed with intent.` |
| `Three things we get right.` | `Three pours we get right.` |
| `However you want it.` | `However you take it.` |
| `Four corners. One weight.` | `A few corners. One craft.` |
| `Enjoy every gram.` | `Enjoy every sip.` |
| `© Twenty Grams · All weight, no waste.` | `© Kamelizer Coffee` |

---

## 11. Source reference — Twenty Grams files (verbatim)

> Mechanical reproduction: copy each file below, run the substitutions from §9, save to the matching path in your new project.

The full source of every page lives in the **Twenty Grams** repository at:
- `app/app/page.tsx` — landing
- `app/app/menu/page.tsx` — menu
- `app/app/checkout/page.tsx` — checkout
- `app/app/login/page.tsx` — login
- `app/app/orders/[id]/page.tsx` — order tracking
- `app/app/table/[tableId]/page.tsx` — dine-in QR

If you don't have direct access to the Twenty Grams files when building Kamelizer, ask the project owner (Mantaray Digital) to share them — or treat the Plato SDK README (the README that lives in this folder under `README.md`) as your contract: build whatever pages call these SDK methods in the same logical order.

The SDK contract you must satisfy:

- **`usePlatoBranches()` → branchId** — used by menu, checkout, table pages.
- **`usePlatoMenu({ branchId })`** — categories + items for menu & table pages.
- **`usePlatoItem(activeItemId)` + `usePlatoModifiers(activeItemId)`** — item modal.
- **`useCustomer()`** — phone+OTP login flow (request/verify/logout).
- **`usePlatoCart(cartInput | null)`** — live checkout pricing breakdown.
- **`plato.orders.create(...)`** — places delivery/pickup/dine_in orders.
- **`usePlatoOrder(orderId, { customerPhone? })`** — order tracking page; poll with `setInterval(refetch, 15_000)`.
- **`plato.orders.cancel(orderId, { customerPhone?, reason? })`** — only allowed while `status === "pending"`.
- **`plato.tables.resolve(tableId)`** — first call on the `/table/[tableId]` page.
- **`plato.tables.callWaiter(tableId)`** — button on the dine-in page; respect `deduped` flag to show "On the way" rather than "Sent".

Full method reference is in the SDK README that ships in this same handoff folder (`README.md`). Read §10 of that README before building `/table/[tableId]` — there are validation rules (e.g. `dine_in requires tableId`, table must match branch) that will throw at order-create time if missed.

---

## 12. Build order (recommended)

1. **Project scaffold + Tailwind** (sections 4 + 5 + 6.1).
2. **Drop `assets/` into `public/images/`**, rename files, save the logo.
3. **Sample colors from images**, finalize the 3–4 hex values, update CSS variables and the Tailwind config.
4. **`lib/`** — port `format.ts`, `plato.ts`, `ui-store.tsx`, `cart-store.tsx` (just change `STORAGE_KEY`).
5. **`components/providers.tsx`** — wires the SDK, cart, and UI providers.
6. **`layout.tsx`** — wires Playfair Display + Inter from Google Fonts.
7. **`top-nav.tsx` + `footer.tsx`** — global chrome, easiest to land first and verify the color tokens look right end-to-end.
8. **`menu/page.tsx`** — fetches branches + menu; first real SDK integration. Verify the credentials work here.
9. **`item-modal.tsx` + `cart-drawer.tsx`** — completes the "browse → add" loop.
10. **`checkout/page.tsx`** — exercises `usePlatoCart` and `plato.orders.create`.
11. **`orders/[id]/page.tsx`** — tracks the order you just placed.
12. **`login/page.tsx`** — OTP sign-in for repeat customers.
13. **`table/[tableId]/page.tsx`** — dine-in QR flow. Generate a test table in the Plato dashboard and test with `/table/<id>`.
14. **`page.tsx`** (landing) — last, because it's the most copy-heavy and you'll want the rest of the system live to validate links.

Run `pnpm dev` after each step and check both desktop + mobile viewports.

---

## 13. Acceptance checklist

Before shipping:

- [ ] Brand: nowhere in the codebase does the literal text "Twenty Grams", "20g", "weight", "Cairo · Egypt", "Sheikh Zayed", or "Road Radio" appear.
- [ ] Colors: only the 3–4 Kamelizer hex values are used; no leftover `#BFDBE9` (Twenty Grams sky blue) or `#0a0a0a`-ish ink/bone values.
- [ ] Font: every heading uses `font-display` (Playfair Display) — not the old Twenty Grams Road Radio condensed look.
- [ ] All `Image` `src` attributes point to files that actually exist in `public/images/`.
- [ ] `.env.local` contains the Kamelizer Plato credentials (§2). The provider redirect screen ("credentials missing") never appears in normal use.
- [ ] `pnpm typecheck` and `pnpm build` both pass cleanly.
- [ ] Manual smoke: place a delivery order, place a pickup order, scan a test QR and place a dine-in order, request and verify OTP, cancel a pending order.
- [ ] On mobile: cart drawer opens, item modal scrolls, dine-in bottom sheet works.

---

## 14. Things to ask the Kamelizer client

(Doesn't block the first preview, but flag for them.)

1. Final branch list + addresses (for the locations section + footer).
2. Hours of operation (footer + locations card).
3. Final logo file (SVG preferred). Default until then is the JPG you have in `assets/`.
4. Approved tagline (for the hero) — they may want a specific Arabic/English line.
5. Whether they want a `/about` page (Twenty Grams has it as a scroll section, not a route — same can apply).

---

## 15. Things that are intentionally NOT in v1

(Match Twenty Grams scope.)

- Online payments — Plato is cash-only in this release. The checkout reflects this.
- WebSocket / live updates — order tracking polls every 15 s. Don't try to subscribe.
- Multi-language — English only. If Kamelizer wants Arabic, add `next-intl` after v1 ships.
- Returning-customer addresses — guests use raw `deliveryAddress` + lat/lng. Saved addresses are available only after OTP sign-in.

---

That's it. Run through the build order in §12, lean on §11 + the Plato SDK README for the page contracts, and ping if anything in §3 (palette / font) doesn't match what you see in `assets/` once you sample it.
