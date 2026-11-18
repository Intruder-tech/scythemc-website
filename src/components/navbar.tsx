"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Menu, MessagesSquare, X } from "lucide-react";
import { DISCORD_URL, SERVER_ADDRESS, useCopy } from "@/lib/server";

const NAV_LINKS = [
  // Absolute so the links also work from /founder.
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "Store", href: "/#store" },
  { label: "How to buy", href: "/#how-to-buy" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Staff", href: "/#staff" },
  { label: "Founder", href: "/founder" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, copy] = useCopy(SERVER_ADDRESS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b-2 transition-colors ${
        scrolled || open ? "border-ink-800 bg-ink-950/95 backdrop-blur" : "border-transparent bg-ink-950"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/#home" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.webp" alt="Scythe MC" width={48} height={48} className="h-12 w-12" priority />
          <span className="font-display text-xl leading-none tracking-wide">
            SCYTHE <span className="text-gold">MC</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-bold text-mist transition-colors hover:bg-ink-900 hover:text-frost"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={copy}
            className="flex h-10 items-center gap-2 rounded-lg border-2 border-ink-700 bg-ink-900 px-3 font-pixel text-xs text-frost transition-colors hover:border-azure"
            aria-label={`Copy server address ${SERVER_ADDRESS}`}
          >
            {copied ? <Check className="h-4 w-4 text-cyan" /> : <Copy className="h-4 w-4 text-azure" />}
            {copied ? "COPIED!" : "PLAY.SCYTHEMC.FUN"}
          </button>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center gap-2 rounded-lg border-2 border-ink-950 bg-azure px-4 font-display text-sm uppercase tracking-wide text-frost shadow-[0_3px_0_var(--color-royal)] transition-transform active:translate-y-[3px] active:shadow-none"
          >
            <MessagesSquare className="h-4 w-4" />
            Discord
          </a>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-ink-700 lg:hidden"
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-ink-800 bg-ink-950 px-4 pb-5 pt-2 lg:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-3 font-bold text-mist hover:bg-ink-900 hover:text-frost"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
            <button
              onClick={copy}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-ink-700 bg-ink-900 font-pixel text-xs"
            >
              {copied ? <Check className="h-4 w-4 text-cyan" /> : <Copy className="h-4 w-4 text-azure" />}
              {copied ? "COPIED!" : "COPY IP"}
            </button>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-ink-950 bg-azure font-display uppercase text-frost"
            >
              <MessagesSquare className="h-4 w-4" />
              Discord
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
