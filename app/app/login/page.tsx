"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCustomer } from "@mantaray-digital/plato-sdk/react";

export default function LoginPage() {
  const { isLoggedIn, customer, requestOtp, verifyOtp, logout } = useCustomer();

  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) return;
    setPending(true);
    try {
      await requestOtp(phone.trim());
      setStage("otp");
    } catch (err: any) {
      setError(err?.message ?? "Couldn't send the code. Try again.");
    } finally {
      setPending(false);
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) return;
    setPending(true);
    try {
      await verifyOtp(phone.trim(), code.trim());
    } catch (err: any) {
      setError(err?.message ?? "That code didn't match. Try again.");
    } finally {
      setPending(false);
    }
  };

  if (isLoggedIn) {
    const firstName = customer?.name?.split(" ")[0] ?? "friend";
    return (
      <div className="grid min-h-[80vh] place-items-center px-6">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <span className="eyebrow">You're in</span>
          <h1 className="editorial text-5xl md:text-6xl">
            Welcome back, <em className="not-italic text-blue">{firstName}.</em>
          </h1>
          <p className="text-sm font-light text-ground/60">
            Your bag, your saved addresses and your order history all carry over.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link href="/menu" className="btn-primary">Open the menu</Link>
            <button
              onClick={() => logout()}
              className="text-[11px] uppercase tracking-ultra font-normal text-ground/40 transition hover:text-blue"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
      {/* Editorial photo side */}
      <aside className="relative hidden overflow-hidden bg-ground/[0.04] lg:block">
        <Image
          src="/images/kamelizer-30.png"
          alt="Kamelizer Coffee"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ground/40 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-md text-canvas">
          <span className="eyebrow !text-canvas/60">Members</span>
          <h2 className="editorial mt-3 text-5xl">
            One number. <em className="not-italic text-blue">Every cup.</em>
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-canvas/70">
            Sign in once and we'll remember your drink, your address, and your past orders.
          </p>
        </div>
      </aside>

      {/* Form side */}
      <section className="flex items-center justify-center px-6 py-16 lg:px-16">
        <div className="w-full max-w-sm">
          <span className="eyebrow">
            {stage === "phone" ? "Sign in" : "Verify"}
          </span>

          {stage === "phone" ? (
            <>
              <h1 className="editorial mt-3 text-5xl md:text-6xl">
                What's your <em className="not-italic text-blue">number?</em>
              </h1>
              <p className="mt-4 text-sm font-light leading-relaxed text-ground/60">
                We'll send a one-time code. No password. No promo spam.
              </p>

              <form onSubmit={submitPhone} className="mt-10 space-y-8">
                <label className="block">
                  <span className="eyebrow">Mobile</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 1XX XXX XXXX"
                    className="field mt-2"
                    required
                  />
                </label>

                {error && (
                  <p className="text-[12px] font-light text-blue">{error}</p>
                )}

                <button type="submit" disabled={pending} className="btn-primary w-full">
                  {pending ? "Sending…" : "Send code"}
                </button>

                <p className="text-[11px] font-light text-ground/40">
                  By continuing you agree to our terms and the way we cherish your data.
                </p>
              </form>
            </>
          ) : (
            <>
              <h1 className="editorial mt-3 text-5xl md:text-6xl">
                Check your <em className="not-italic text-blue">phone.</em>
              </h1>
              <p className="mt-4 text-sm font-light leading-relaxed text-ground/60">
                We sent a six-digit code to{" "}
                <span className="font-mono text-ground/80">{phone}</span>.
              </p>

              <form onSubmit={submitCode} className="mt-10 space-y-8">
                <label className="block">
                  <span className="eyebrow">Code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="••••••"
                    className="field mt-2 tracking-[0.5em] text-center text-2xl"
                    required
                  />
                </label>

                {error && (
                  <p className="text-[12px] font-light text-blue">{error}</p>
                )}

                <button type="submit" disabled={pending} className="btn-primary w-full">
                  {pending ? "Verifying…" : "Verify"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage("phone");
                    setCode("");
                    setError(null);
                  }}
                  className="block w-full text-center text-[11px] uppercase tracking-ultra font-normal text-ground/40 transition hover:text-blue"
                >
                  Use a different number
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
