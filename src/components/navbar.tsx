"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import {
  Check,
  Copy,
  Crown,
  Ellipsis,
  House,
  Images,
  MessageSquareQuote,
  MessagesSquare,
  Sparkles,
  Store,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { DISCORD_URL, SERVER_ADDRESS, useCopy } from "@/lib/server";

/*
 * Pill navigation inspired by One UI: a floating rounded bar with a filled pill that
 * slides to the active item. On phones the main tabs move to a floating bottom bar
 * (within thumb reach) and the rest live in a rounded bottom sheet.
 */

type Item = { id: string; label: string; href: string; icon: typeof House };

// Absolute hrefs so they also work from /founder.
const ITEMS: Item[] = [
  { id: "home", label: "Home", href: "/#home", icon: House },
  { id: "features", label: "Features", href: "/#features", icon: Sparkles },
  { id: "store", label: "Store", href: "/#store", icon: Store },
  { id: "how-to-buy", label: "How to buy", href: "/#how-to-buy", icon: Ticket },
  { id: "gallery", label: "Gallery", href: "/#gallery", icon: Images },
  { id: "reviews", label: "Reviews", href: "/#reviews", icon: MessageSquareQuote },
  { id: "staff", label: "Staff", href: "/#staff", icon: Users },
  { id: "founder", label: "Founder", href: "/founder", icon: Crown },
];
const DESKTOP = ["home", "features", "store", "how-to-buy", "gallery", "staff", "founder"];
const MOBILE_TABS = ["home", "store", "staff", "founder"];
const byId = (id: string) => ITEMS.find((i) => i.id === id)!;

/** Which section is in the middle of the screen (or "founder" on /founder). */
function useActiveSection(): string {
  const pathname = usePathname();
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (pathname?.startsWith("/founder")) return;
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      // a thin band across the middle of the viewport decides the active section
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return pathname?.startsWith("/founder") ? "founder" : active;
}

export default function Navbar() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [copied, copy] = useCopy(SERVER_ADDRESS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const moreActive = !MOBILE_TABS.includes(active);

  return (
    <MotionConfig reducedMotion="user">
      {/* ---------- Top floating pill ---------- */}
      <div className="pointer-events-none sticky top-0 z-50 px-3 pt-3">
        <nav
          aria-label="Main"
          className={`pointer-events-auto mx-auto flex max-w-[1240px] items-center justify-between gap-3 rounded-full border px-2 transition-[height,background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? "h-14 border-ink-700/80 bg-ink-950/80 shadow-[0_10px_30px_rgba(3,6,32,0.55)] backdrop-blur-xl"
              : "h-16 border-ink-800 bg-ink-900/70 backdrop-blur-md"
          }`}
        >
          <Link href="/#home" className="flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-ink-800/70">
            <Image src="/logo.webp" alt="Scythe MC" width={44} height={44} className="h-10 w-10" priority />
            <span className="font-display text-lg leading-none tracking-wide">
              SCYTHE <span className="text-gold">MC</span>
            </span>
          </Link>

          {/* Link track with the sliding active pill */}
          <LayoutGroup id="desktop-nav">
            <ul className="hidden items-center gap-0.5 rounded-full bg-ink-950/60 p-1 lg:flex">
              {DESKTOP.map((id) => {
                const it = byId(id);
                const on = active === id;
                return (
                  <li key={id} className="relative">
                    {on && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-azure shadow-[0_2px_0_var(--color-royal)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Link
                      href={it.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative z-10 block rounded-full px-3.5 py-2 text-sm font-bold transition-colors xl:px-4 ${
                        on ? "text-frost" : "text-mist hover:text-frost"
                      }`}
                    >
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={copy}
              className="hidden h-11 items-center gap-2 rounded-full border border-ink-700 bg-ink-950/60 px-4 font-pixel text-[11px] text-frost transition-colors hover:border-azure md:flex"
              aria-label={`Copy server address ${SERVER_ADDRESS}`}
            >
              {copied ? <Check className="h-4 w-4 text-cyan" /> : <Copy className="h-4 w-4 text-azure" />}
              <span className="hidden xl:inline">{copied ? "COPIED!" : "PLAY.SCYTHEMC.FUN"}</span>
              <span className="xl:hidden">{copied ? "COPIED" : "IP"}</span>
            </button>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-full bg-azure px-4 font-display text-sm uppercase tracking-wide text-frost shadow-[0_3px_0_var(--color-royal)] transition-transform active:translate-y-[2px] active:shadow-none"
            >
              <MessagesSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Discord</span>
            </a>
          </div>
        </nav>
      </div>

      {/* ---------- Phone: floating bottom tab bar ---------- */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
        <LayoutGroup id="mobile-nav">
          <nav
            aria-label="Main (mobile)"
            className="pointer-events-auto mx-auto flex max-w-md items-center justify-between rounded-full border border-ink-700/80 bg-ink-950/85 p-1.5 shadow-[0_12px_32px_rgba(3,6,32,0.6)] backdrop-blur-xl"
          >
            {[...MOBILE_TABS.map(byId), { id: "more", label: "More", href: "", icon: Ellipsis }].map((it) => {
              const on = it.id === "more" ? moreActive || sheet : active === it.id && !sheet;
              const inner = (
                <>
                  {on && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-azure/90"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 flex flex-col items-center gap-0.5">
                    <it.icon className="h-5 w-5" />
                    <span className="text-[10px] font-bold leading-none">{it.label}</span>
                  </span>
                </>
              );
              const cls = `relative flex h-14 flex-1 items-center justify-center rounded-full transition-colors ${
                on ? "text-frost" : "text-mist"
              }`;
              return it.id === "more" ? (
                <button key="more" onClick={() => setSheet((s) => !s)} aria-expanded={sheet} className={cls}>
                  {inner}
                </button>
              ) : (
                <Link key={it.id} href={it.href} onClick={() => setSheet(false)} className={cls} aria-current={on ? "page" : undefined}>
                  {inner}
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>
      </div>

      {/* ---------- Phone: "More" bottom sheet ---------- */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(false)}
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-label="More"
              className="fixed inset-x-3 bottom-[96px] z-50 rounded-[28px] border border-ink-700 bg-ink-900 p-3 shadow-[0_20px_50px_rgba(3,6,32,0.7)] lg:hidden"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-ink-700" />
              <div className="mb-2 flex items-center justify-between px-2">
                <p className="font-display text-xl tracking-wide">More</p>
                <button onClick={() => setSheet(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="overflow-hidden rounded-[20px] bg-ink-950">
                {ITEMS.filter((i) => !MOBILE_TABS.includes(i.id)).map((it) => (
                  <li key={it.id} className="border-b border-ink-800 last:border-b-0">
                    <Link
                      href={it.href}
                      onClick={() => setSheet(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 font-bold ${active === it.id ? "text-cyan" : "text-frost"}`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-800">
                        <it.icon className="h-4 w-4" />
                      </span>
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={copy}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink-700 bg-ink-950 font-pixel text-[11px]"
                >
                  {copied ? <Check className="h-4 w-4 text-cyan" /> : <Copy className="h-4 w-4 text-azure" />}
                  {copied ? "COPIED!" : "COPY IP"}
                </button>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-azure font-display uppercase tracking-wide text-frost"
                >
                  <MessagesSquare className="h-4 w-4" />
                  Discord
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
