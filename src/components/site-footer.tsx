import Image from "next/image";
import { DISCORD_URL, SERVER_ADDRESS } from "@/lib/site";

const LINKS = [
  { label: "Store", href: "/#store" },
  { label: "How to buy", href: "/#how-to-buy" },
  { label: "Discord", href: DISCORD_URL, external: true },
  { label: "Founder", href: "/founder" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink-950 py-12">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-8 px-4 sm:px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <Image src="/logo.webp" alt="" width={56} height={56} className="h-14 w-14" />
          <div>
            <p className="font-display text-xl tracking-wide">
              SCYTHE <span className="text-gold">MC</span>
            </p>
            <p className="font-pixel text-[11px] text-mist">{SERVER_ADDRESS.toUpperCase()}</p>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-bold text-mist transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className="text-center text-sm text-dim md:text-right">
          © 2026 Scythe MC Network.
          <br />
          Not affiliated with Mojang or Microsoft.
        </p>
      </div>
    </footer>
  );
}
