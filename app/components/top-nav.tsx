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
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          aria-label="Kamelizer Coffee · home"
          className="group flex items-center gap-3"
        >
          <Image
            src="/images/logo.jpg"
            alt="Kamelizer Co-Coffee"
            width={96}
            height={96}
            priority
            className="h-14 w-14 rounded-full ring-1 ring-ground/10 transition group-hover:ring-blue sm:h-12 sm:w-12"
          />
          <span className="hidden font-display text-[22px] font-normal leading-none tracking-[-0.02em] text-ground sm:inline">
            Kamelizer
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-[11px] uppercase tracking-ultra font-normal text-ground/70 md:flex">
          <Link href="/menu" className="transition hover:text-ground">Menu</Link>
          <Link href="/#story" className="transition hover:text-ground">Story</Link>
          <Link href="/#locations" className="transition hover:text-ground">Locations</Link>
          <Link href="/login" className="transition hover:text-ground">{accountLabel}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="group relative flex items-center gap-2 rounded-full border border-ground/20 px-4 py-2 text-[11px] uppercase tracking-ultra transition hover:border-blue hover:text-blue"
            aria-label="Open cart"
          >
            <span>Bag</span>
            <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-ground px-1.5 text-[10px] font-normal text-canvas group-hover:bg-blue">
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
          <ul className="mx-auto flex max-w-[1600px] flex-col px-6 py-2 text-[12px] uppercase tracking-ultra font-normal text-ground/80">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
