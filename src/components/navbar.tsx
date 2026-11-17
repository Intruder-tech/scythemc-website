"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, Gamepad, Store, Users, Crown, Ticket } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "HOME", href: "#home", icon: Gamepad },
  { label: "MODES", href: "#modes", icon: Crown },
  { label: "STORE", href: "#store", icon: Store },
  { label: "RULES", href: "#rules", icon: Ticket },
  { label: "STAFF", href: "#staff", icon: Users },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-[1000] transition-all duration-300",
        isScrolled
          ? "bg-[#07080f]/94 backdrop-blur-2xl border-b border-blue/40"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            href="#home"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/logo.webp"
              alt="Scythe MC Logo"
              width={44}
              height={44}
              className="w-10 h-10 object-contain drop-shadow-[0_0_16px_rgba(0,136,255,0.6)] transition-transform hover:scale-105 hover:rotate-[-3deg]"
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="font-outfit text-sm font-black tracking-tight text-[#f1f5f9] drop-shadow-[0_0_10px_rgba(0,136,255,0.4)]">
                OFFICIAL SCYTHE{" "}
                <span className="text-[#0088ff]">STORE</span>
              </span>
              <span className="font-silkscreen text-[10px] font-bold tracking-wider text-[#0088ff] uppercase">
                PLAY.SCYTHEMC.FUN:25565
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-silkscreen text-xs font-bold tracking-wider px-3.5 py-2 rounded-md text-[#cdd6f4] hover:text-[#ffffff] hover:bg-[#ffffff]/06 transition-all hover:drop-shadow-[0_0_8px_rgba(0,136,255,0.7)]"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="w-3.5 h-3.5 mr-1.5 text-[#0088ff]" />
                {link.label}
              </Link>
            ))}
            <a
              href="https://discord.gg/C4p9fJ5aTS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-md border border-yellow/50 bg-yellow/10 text-[#ffffff] hover:bg-yellow/20 hover:text-[#06070d] transition-all shadow-[0_0_12px_rgba(255,204,0,0.25)]"
            >
              <svg className="w-3.5 h-3.5 text-[#0088ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.071 3.252.144 4.771 1.691 4.919 4.862.142 3.139-1.797 4.865-4.832 4.865-1.137 0-2.163-.396-2.956-1.063-.756-1.612-1.801-2.73-3.076-3.011-2.19-.48-4.168 1.328-4.168 3.607 0 .257.086 1.195.339 2.23-.697-.144-1.39-.337-2.076-.745-.013.244-.025 1.485.031 3.102.128 3.527 1.292 5.392 3.607 4.65-1.094.28-1.787.972-1.787 1.947 0 .572.23 1.486.675 2.23-.856-.024-1.595-.363-2.064-.997-.103 2.491 1.483 4.38 3.298 4.38-1.394 0-2.47-.98-2.604-2.107-.247-2.075 1.658-3.646 3.432-3.646 1.113 0 2.045.662 2.342 1.47-.646.077-1.29.107-1.923.107-1.425 0-2.245-.795-2.245-1.873 0-.467.198-1.198.566-1.686 1.055.665 2.403 1.057 3.86 1.057 4.636 0 7.184-3.847 7.184-8.386 0-1.268-.221-2.36-.567-3.296.167-.033 7.592-.065 9.536-1.01.202-1.44.279-3.62.143-4.803-1.182-3.228-4.763-4.819-8.034-4.907z"/></svg>
              <span className="font-silkscreen text-xs font-bold uppercase text-[#0088ff]">Discord</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffcc00] animate-pulse shadow-[0_0_7px_#ffcc00]" />
            </a>
          </div>

          {/* Header actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue/30 bg-[#101428] text-[#f1f5f9] text-[12px] font-outfit font-bold hover:bg-[#161c38] hover:border-blue transition-all shadow-[0_0_14px_rgba(0,136,255,0.25)]">
              <span className="w-2 h-2 rounded-full bg-[#ffcc00] animate-pulse shadow-[0_0_7px_#ffcc00]" />
              <span className="font-silkscreen text-[12px] font-bold">PLAY.SCYTHEMC.FUN</span>
              <span className="text-[#0088ff]">:25565</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue/20 text-[#0088ff] border border-blue/40">COPY</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-blue/35 bg-blue/12 text-[#0088ff] text-[12px] font-outfit font-bold hover:bg-blue/25 hover:text-[#06070d] transition-all shadow-[0_0_14px_rgba(0,136,255,0.3)]">
              <svg className="w-4 h-4 text-[#ffcc00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v2l4.2v2h4v-2l4 4m-13.8 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-silkscreen text-[11px] font-bold text-[#0088ff]">CART</span>
              <span className="w-5 h-5 rounded-full bg-[#ffcc00] text-[10px] font-black text-[#06070d] flex items-center justify-center shadow-[0_0_7px_rgba(255,204,0,0.6)]">0</span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center gap-2 p-2 rounded-md border border-blue/40 hover:bg-[#ffffff]/05 transition-all"
            onClick={() => setMobileOpen((p) => !p)}
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#f1f5f9]" /> : <Menu className="w-5 h-5 text-[#f1f5f9]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-blue/40 bg-[#07080f]/96 backdrop-blur-2xl pb-6 pt-2"
          >
            <div className="flex flex-col gap-1 px-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#f1f5f9] hover:bg-[#ffffff]/05 hover:text-[#0088ff] transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon className="w-4 h-4 text-[#0088ff]" />
                  <span className="font-silkscreen text-xs font-bold">{link.label}</span>
                </Link>
              ))}
              <a
                href="https://discord.gg/C4p9fJ5aTS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-yellow/50 bg-yellow/10 text-[#ffffff] hover:bg-yellow/20 hover:text-[#06070d] transition-all mt-2"
                onClick={() => setMobileOpen(false)}
              >
                <svg className="w-4 h-4 text-[#0088ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.071 3.252.144 4.771 1.691 4.919 4.862.142 3.139-1.797 4.865-4.832 4.865-1.137 0-2.163-.396-2.956-1.063-.756-1.612-1.801-2.73-3.076-3.011-2.19-.48-4.168 1.328-4.168 3.607 0 .257.086 1.195.339 2.23-.697-.144-1.39-.337-2.076-.745-.013.244-.025 1.485.031 3.102.128 3.527 1.292 5.392 3.607 4.65-1.094.28-1.787.972-1.787 1.947 0 .572.23 1.486.675 2.23-.856-.024-1.595-.363-2.064-.997-.103 2.491 1.483 4.38 3.298 4.38-1.394 0-2.47-.98-2.604-2.107-.247-2.075 1.658-3.646 3.432-3.646 1.113 0 2.045.662 2.342 1.47-.646.077-1.29.107-1.923.107-1.425 0-2.245-.795-2.245-1.873 0-.467.198-1.198.566-1.686 1.055.665 2.403 1.057 3.86 1.057 4.636 0 7.184-3.847 7.184-8.386 0-1.268-.221-2.36-.567-3.296.167-.033 7.592-.065 9.536-1.01.202-1.44.279-3.62.143-4.803-1.182-3.228-4.763-4.819-8.034-4.907z"/></svg>
                <span className="font-silkscreen text-xs font-bold text-[#0088ff]">Discord</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
