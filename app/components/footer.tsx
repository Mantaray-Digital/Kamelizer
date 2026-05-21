import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-ground/10 bg-canvas">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo.jpg"
              alt="Kamelizer Co-Coffee"
              width={120}
              height={120}
              className="h-24 w-24 rounded-full ring-1 ring-ground/10"
            />
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-ground/60">
              Artisanal coffee for the urban oasis. Slow brews and warm rituals,
              roasted with intent and served with care.
            </p>
          </div>

          <FooterCol title="Visit">
            <li>
              <a
                href="https://maps.app.goo.gl/yDAXHqwTwwL8gjGN8"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ground"
              >
                District 5 · New Cairo
              </a>
            </li>
            <li>
              <a
                href="https://maps.app.goo.gl/gRpBJEQcvu2ecGVH7"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ground"
              >
                Majarrah · Sheikh Zayed
              </a>
            </li>
            <li>
              <a
                href="https://share.google/LZ4A0A5G2bXSQ5qBN"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ground"
              >
                The Drive · New Cairo
              </a>
            </li>
            <li>
              <a
                href="https://maps.app.goo.gl/ETrJt5BatKEQ3oYz7"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ground"
              >
                Somabay · Red Sea
              </a>
            </li>
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

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ground/10 pt-6 text-[11px] uppercase tracking-ultra font-normal text-ground/40 md:flex-row md:items-center">
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
      <h4 className="mb-4 text-[11px] uppercase tracking-ultra font-normal text-ground/40">{title}</h4>
      <ul className="space-y-2 text-sm font-light text-ground/80">{children}</ul>
    </div>
  );
}
