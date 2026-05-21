"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const MARQUEE = [
  "Slow brews",
  "House Espresso",
  "Iced Cup",
  "Drip of the Day",
  "Warm Rituals",
  "Kamelizer",
  "Single Origin",
  "Belgian Hot Chocolate",
  "Co · Coffee",
];

const SIGNATURES = [
  {
    number: "01",
    title: "The Bean",
    headline: "House Espresso.",
    body: "A house-roasted base. Built for a balanced shot — chocolatey, gentle, never bitter.",
    image: "/images/kamelizer-30.png",
  },
  {
    number: "02",
    title: "The Pour",
    headline: "Iced Cup.",
    body: "Cold-pressed, slow-poured, and crowned with a soft milk wash. Built for long, slow afternoons.",
    image: "/images/kamelizer-02.png",
  },
  {
    number: "03",
    title: "The Slow",
    headline: "Drip of the Day.",
    body: "A rotating single-origin pour. Hand-brewed, served black, meant to be sipped over a quiet hour.",
    image: "/images/kamelizer-03.png",
  },
];

const PATHS = [
  {
    label: "Delivery",
    headline: "To your door.",
    body: "Anywhere we deliver. Cash on arrival. We confirm by phone once it's brewed.",
    href: "/menu",
    cta: "Order in",
  },
  {
    label: "Pickup",
    headline: "Skip the line.",
    body: "Order ahead, walk in, take it warm. We'll have it ready under your name.",
    href: "/menu",
    cta: "Order ahead",
  },
  {
    label: "At the table",
    headline: "Scan and stay.",
    body: "Sit down, scan the QR on your table, and let the kitchen know what you'd like next.",
    href: "/menu",
    cta: "See how it works",
  },
];

const LOCATIONS = [
  {
    name: "District 5",
    area: "New Cairo",
    line: "Inside Mindhaus Campus — a daytime room with warm light and slow pours.",
    hours: "Daily · 8am – 11pm",
    map: "https://maps.app.goo.gl/yDAXHqwTwwL8gjGN8",
  },
  {
    name: "Majarrah",
    area: "Sheikh Zayed",
    line: "Our west-side room. Same coffee, longer afternoons.",
    hours: "Daily · 8am – 11pm",
    map: "https://maps.app.goo.gl/gRpBJEQcvu2ecGVH7",
  },
  {
    name: "The Drive",
    area: "New Cairo",
    line: "At The Drive by Waterway. Built for the everyday brew.",
    hours: "Daily · 8am – 11pm",
    map: "https://share.google/LZ4A0A5G2bXSQ5qBN",
  },
  {
    name: "Somabay",
    area: "Red Sea",
    line: "A coastal corner. Slower mornings, longer drips.",
    hours: "Daily · 8am – 11pm",
    map: "https://maps.app.goo.gl/ETrJt5BatKEQ3oYz7",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-canvas">
      <Hero />
      <Marquee />
      <Story />
      <Signatures />
      <PhotoBreak />
      <OrderPaths />
      <DineInExplainer />
      <Locations />
    </div>
  );
}

/* ─────────────────── HERO ─────────────────── */

function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden border-b border-ground/10">
      {/* Huge background letter */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -bottom-[8vw] -right-[6vw] font-display text-[60vw] font-normal leading-none tracking-[-0.05em] text-ground/[0.05]">
          K
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 lg:px-10 lg:pb-32 lg:pt-28">
        <div className={mounted ? "animate-fade-up" : "opacity-0"}>
          <span className="eyebrow">Kamelizer · Co · Coffee</span>
          <h1 className="editorial mt-6 text-[16vw] leading-[0.92] md:text-[120px] lg:text-[180px]">
            The slow craft
            <br />
            of a <em className="not-italic text-blue">good cup.</em>
          </h1>
          <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-ground/60">
            We roast our own beans. We pull a quieter shot. We pour a longer brew.
            Specialty coffee for warm rituals, slow mornings, and good days.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/menu" className="btn-primary">Open the menu</Link>
            <Link href="/#story" className="btn-ghost">Our story</Link>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-ground/[0.06] lg:aspect-[3/4]">
          <Image
            src="/images/kamelizer-02.png"
            alt="Iced Cup at Kamelizer Coffee"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-canvas">
            <span className="text-[11px] uppercase tracking-ultra font-normal">№ 02 · Iced Cup</span>
            <span className="font-display text-2xl font-normal leading-none">Slow.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── MARQUEE ─────────────────── */

function Marquee() {
  const words = [...MARQUEE, ...MARQUEE];
  return (
    <section
      aria-hidden="true"
      className="border-b border-ground/10 bg-ground py-8 text-canvas"
    >
      <div className="scroll-hide flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-12 whitespace-nowrap pr-12">
          {words.map((w, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className="font-display text-5xl font-normal italic leading-none md:text-7xl">
                {w}
              </span>
              <span className="h-2 w-2 rounded-full bg-blue" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── STORY ─────────────────── */

function Story() {
  return (
    <section id="story" className="border-b border-ground/10 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div>
          <span className="eyebrow">Story</span>
          <h2 className="editorial mt-4 text-6xl md:text-7xl lg:text-[110px] lg:leading-[0.95]">
            Brewed with <em className="not-italic text-blue">intent.</em>
          </h2>
        </div>

        <div className="space-y-7 text-[15px] font-light leading-relaxed text-ground/75">
          <p>
            Kamelizer started in a small room with one machine and a single bag of beans.
            We were tired of fast cups served in a hurry — coffee that tasted like a checklist
            instead of a craft.
          </p>
          <p>
            So we slowed down. We learned to roast. We bought the best green coffee we could
            afford, then a little better the next month. We poured a thousand bad shots before
            we poured a good one.
          </p>
          <p>
            Today, every cup is built on the same small idea: slow craft, warm welcome, and
            a coffee you'll remember on the walk home.
          </p>

          <div className="grid grid-cols-3 gap-6 border-t border-ground/10 pt-8 text-[12px] uppercase tracking-ultra font-normal text-ground/60">
            <div>
              <div className="font-display text-3xl font-normal text-ground">02</div>
              <div className="mt-2">Branches</div>
            </div>
            <div>
              <div className="font-display text-3xl font-normal text-ground">07</div>
              <div className="mt-2">Drinks on rotation</div>
            </div>
            <div>
              <div className="font-display text-3xl font-normal text-ground">24h</div>
              <div className="mt-2">From roast to cup</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── SIGNATURES ─────────────────── */

function Signatures() {
  return (
    <section className="border-b border-ground/10 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Signatures</span>
            <h2 className="editorial mt-4 text-6xl md:text-7xl lg:text-[110px] lg:leading-[0.95]">
              Three pours we
              <br />
              <em className="not-italic text-blue">get right.</em>
            </h2>
          </div>
          <Link href="/menu" className="btn-ghost">See the whole menu</Link>
        </div>

        <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
          {SIGNATURES.map((s) => (
            <li key={s.number} className="group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-ground/[0.06]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute left-4 top-4 rounded-full bg-canvas/85 px-3 py-1 text-[10px] uppercase tracking-ultra font-normal backdrop-blur">
                  {s.number} — {s.title}
                </div>
              </div>
              <h3 className="editorial mt-6 text-4xl leading-tight">
                {s.headline}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-ground/60">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────── PHOTO BREAK ─────────────────── */

function PhotoBreak() {
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden border-b border-ground/10">
      <Image
        src="/images/kamelizer-22.png"
        alt="Kamelizer drinks"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-ground/50 via-ground/10 to-transparent" />
      <div className="absolute inset-0 mx-auto flex max-w-[1600px] items-end px-6 pb-12 lg:px-10 lg:pb-20">
        <div className="max-w-xl text-canvas">
          <span className="eyebrow !text-canvas/60">Seasonal</span>
          <h2 className="editorial mt-3 text-5xl md:text-7xl lg:text-[100px] lg:leading-[0.95]">
            Meet the <em className="not-italic text-blue">drinks.</em>
          </h2>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-canvas/80">
            New pours every season, brewed for the weather. Locked in for the summer.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── ORDER PATHS ─────────────────── */

function OrderPaths() {
  return (
    <section className="border-b border-ground/10 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16">
          <span className="eyebrow">Order</span>
          <h2 className="editorial mt-4 text-6xl md:text-7xl lg:text-[110px] lg:leading-[0.95]">
            However you <em className="not-italic text-blue">take it.</em>
          </h2>
        </div>

        <ul className="grid grid-cols-1 divide-y divide-ground/10 border-y border-ground/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {PATHS.map((p, i) => (
            <li key={p.label} className="p-8 lg:p-12">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">{p.label}</span>
                <span className="font-display text-2xl font-normal text-ground/30">0{i + 1}</span>
              </div>
              <h3 className="editorial mt-6 text-4xl md:text-5xl">
                {p.headline.split(" ").slice(0, -1).join(" ")}{" "}
                <em className="not-italic text-blue">
                  {p.headline.split(" ").slice(-1)[0]}
                </em>
              </h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-ground/60">{p.body}</p>
              <Link href={p.href} className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-ultra font-normal hover:text-blue">
                {p.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────── DINE IN EXPLAINER ─────────────────── */

function DineInExplainer() {
  return (
    <section className="border-b border-ground/10 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-24">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-ground/[0.06]">
          <Image
            src="/images/kamelizer-15.png"
            alt="QR ordering at the table"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <span className="eyebrow">At the table</span>
          <h2 className="editorial mt-4 text-6xl md:text-7xl lg:text-[100px] lg:leading-[0.95]">
            Scan, sit, <em className="not-italic text-blue">stay.</em>
          </h2>
          <ol className="mt-10 space-y-7 text-[15px] font-light leading-relaxed text-ground/75">
            <Step n="01" t="Scan the QR" b="On every table. No app to install — opens in your browser." />
            <Step n="02" t="Build the bill" b="Browse the same menu, add what you'd like. Call a waiter at any point." />
            <Step n="03" t="Pay when you leave" b="Settle with your waiter. No QR codes for cards, no awkward apps." />
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ n, t, b }: { n: string; t: string; b: string }) {
  return (
    <li className="flex gap-6 border-t border-ground/10 pt-7">
      <span className="font-display text-3xl font-normal text-ground/30">{n}</span>
      <div>
        <div className="font-display text-2xl font-normal leading-tight">{t}</div>
        <div className="mt-1 text-sm font-light text-ground/60">{b}</div>
      </div>
    </li>
  );
}

/* ─────────────────── LOCATIONS ─────────────────── */

function Locations() {
  return (
    <section id="locations" className="px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Locations</span>
            <h2 className="editorial mt-4 text-6xl md:text-7xl lg:text-[110px] lg:leading-[0.95]">
              A few corners. <br />
              One <em className="not-italic text-blue">craft.</em>
            </h2>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-ground/10 md:grid-cols-2">
          {LOCATIONS.map((loc) => (
            <li key={loc.name} className="group bg-canvas p-8 lg:p-12">
              <div className="flex items-center justify-between">
                <span className="eyebrow">{loc.area}</span>
                <span className="text-[11px] uppercase tracking-ultra font-normal text-ground/40">
                  {loc.hours}
                </span>
              </div>
              <h3 className="editorial mt-3 text-4xl md:text-5xl">{loc.name}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-ground/60">{loc.line}</p>
              <a
                href={loc.map}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-ultra font-normal transition group-hover:text-blue"
              >
                Open on Google Maps
                <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-wrap items-baseline justify-between gap-6 border-t border-ground/10 pt-8">
          <p className="max-w-md text-sm font-light leading-relaxed text-ground/60">
            More rooms are coming. Follow along on{" "}
            <a
              href="https://www.instagram.com/kamelizercoffee"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-blue/40 underline-offset-2 transition hover:decoration-blue"
            >
              Instagram
            </a>
            .
          </p>
          <Link href="/menu" className="btn-primary">Start an order</Link>
        </div>
      </div>
    </section>
  );
}
