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
