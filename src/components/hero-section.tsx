"use client";

import Image from "next/image";
import { Check, Copy, MessagesSquare, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DISCORD_URL, SERVER_ADDRESS, SERVER_HOST, SERVER_PORT, useCopy, useServerStatus } from "@/lib/server";

function StatusLine() {
  const status = useServerStatus();

  if (status.state === "loading") {
    return (
      <span className="flex items-center gap-2 text-sm text-dim">
        <span className="h-2.5 w-2.5 rounded-full bg-steel" />
        Checking server status…
      </span>
    );
  }
  if (status.state === "offline") {
    return (
      <span className="flex items-center gap-2 text-sm font-bold text-ember">
        <span className="h-2.5 w-2.5 rounded-full bg-ember" />
        Server offline right now
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 text-sm font-bold text-cyan">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-60" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-cyan" />
      </span>
      {status.players} {status.players === 1 ? "player" : "players"} online
    </span>
  );
}

export default function HeroSection() {
  const [copied, copy] = useCopy(SERVER_ADDRESS);

  return (
    <section id="home" className="relative overflow-hidden border-b-2 border-ink-800">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_1fr]">
        {/* Copy */}
        <div className="flex flex-col items-start gap-7">
          <span className="rounded-full border-2 border-ink-700 bg-ink-900 px-3 py-1 font-pixel text-[11px] text-mist">
            JAVA &amp; BEDROCK · 1.20 – 1.21.X
          </span>

          <h1 className="font-display text-6xl uppercase leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl">
            <span className="logo-type block text-azure">Official</span>
            <span className="logo-type block text-frost">Scythe</span>
            <span className="logo-type-gold block">Store</span>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-mist">
            India&apos;s home for Scythe MC ranks, spawners, crate keys and tournament entries. Pay with UPI,
            claim on Discord, get your perks in-game.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <a href="#store">
                <Store className="h-5 w-5" />
                Visit store
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                <MessagesSquare className="h-5 w-5 text-azure" />
                Join Discord
              </a>
            </Button>
          </div>

          {/* Server address */}
          <div className="w-full max-w-md rounded-xl border-2 border-ink-700 bg-ink-900 p-4 shadow-[0_6px_0_var(--color-ink-950)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <StatusLine />
              <span className="font-pixel text-[10px] text-dim">PORT {SERVER_PORT}</span>
            </div>
            <button
              onClick={copy}
              className="group flex w-full items-center justify-between gap-3 rounded-lg border-2 border-ink-950 bg-ink-950 px-4 py-3 text-left transition-colors hover:border-azure"
              aria-label={`Copy server address ${SERVER_ADDRESS}`}
            >
              <span className="font-display text-xl tracking-wide sm:text-2xl">
                {SERVER_HOST.toUpperCase()}
              </span>
              <span
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-display text-sm uppercase ${
                  copied ? "bg-cyan text-ink-950" : "bg-azure text-frost"
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
        </div>

        {/* Logo on a pedestal of solid rings */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-ink-800 bg-ink-900" />
          <div className="absolute inset-[12%] rounded-full border-2 border-ink-700 bg-ink-800" />
          <div className="absolute inset-[24%] rounded-full bg-royal/40" />
          <Image
            src="/logo.webp"
            alt="Scythe MC logo"
            width={256}
            height={256}
            priority
            className="relative w-[70%] max-w-[300px] drop-shadow-[0_10px_0_rgba(3,6,32,0.9)]"
          />
          <a
            href="/founder"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink-950 bg-gold px-4 py-1.5 font-pixel text-[11px] text-ink-950 shadow-[0_3px_0_var(--color-ember)]"
          >
            ★ FOUNDER · NAGESH449
          </a>
        </div>
      </div>
    </section>
  );
}
