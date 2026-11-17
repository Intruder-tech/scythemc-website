"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, Store, Users, Shield, Trophy, Bolt, Archive, Users as UsersIcon } from "lucide-react";

export default function HeroSection() {
  const [players, setPlayers] = useState(0);
  const [status, setStatus] = useState<"online" | "offline">("online");

  // Simulate live server status polling
  useEffect(() => {
    let online = true;
    let count = 0;
    const interval = setInterval(() => {
      count = Math.floor(Math.random() * 45) + 5;
      setPlayers(count);
      setStatus(online ? "online" : "offline");
      online = !online;
    }, 20000);
    // initial
    setPlayers(24);
    setStatus("online");
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative bg-[#06070d] min-h-[calc(100dvh-80px)] flex items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Ambient glow backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00f5ff]/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8b5cf6]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#f43f5e]/10 blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1300px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">

        {/* Left: Text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
            <span className="font-silkscreen text-[10px] font-bold tracking-wider text-[#00f5ff] uppercase bg-[#00f5ff]/10 px-3 py-1 rounded-full border border-[#00f5ff]/30">
              NEXT-GEN MINECRAFT NETWORK
            </span>
            <span className="text-xs font-outfit font-bold text-[#ffffff]/70">1.20 - 1.21.X</span>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-silkscreen text-xs font-bold tracking-widest text-[#8b5cf6] uppercase">
              WELCOME TO
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-black leading-none tracking-tight text-[#ffffff] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              OFFICIAL SCYTHE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#8b5cf6] to-[#f43f5e] drop-shadow-[0_0_25px_rgba(0,245,255,0.5)]">
                STORE
              </span>
            </h1>
            <span className="font-silkscreen text-xs font-bold tracking-widest text-[#8b5cf6] uppercase">
              INDIA'S PREMIER MINECRAFT NETWORK
            </span>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-[#cbd5e1] max-w-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            Welcome to Scythe MC! We&apos;re delighted to have you here. Step into our world, make yourself at home,
            and enjoy your adventure with our wonderful community.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="cyan" size="lg" className="flex items-center gap-2 font-outfit font-bold text-black uppercase tracking-wide shadow-[0_4px_20px_rgba(0,245,255,0.35)] hover:shadow-[0_8px_30px_rgba(0,245,255,0.55)]">
              <Store className="w-5 h-5" />
              VISIT STORE
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#modes" className="flex items-center gap-2 font-outfit font-bold text-[#ffffff] uppercase tracking-wide border-border hover:border-[#00f5ff]">
                <Gamepad className="w-5 h-5" />
                EXPLORE MODES
              </a>
            </Button>
            <a
              href="https://discord.gg/C4p9fJ5aTS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-lg border border-[#5865f2]/50 bg-[#5865f2]/15 text-[#d1d5ff] font-outfit font-bold text-sm uppercase tracking-wide hover:bg-[#5865f2]/30 hover:text-white transition-all shadow-[0_0_12px_rgba(88,101,242,0.18)]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.071 3.252.144 4.771 1.691 4.919 4.862.142 3.139-1.797 4.865-4.832 4.865-1.137 0-2.163-.396-2.956-1.063-.756-1.612-1.801-2.73-3.076-3.011-2.19-.48-4.168 1.328-4.168 3.607 0 .257.086 1.195.339 2.23-.697-.144-1.39-.337-2.076-.745-.013.244-.025 1.485.031 3.102.128 3.527 1.292 5.392 3.607 4.65-1.094.28-1.787.972-1.787 1.947 0 .572.23 1.486.675 2.23-.856-.024-1.595-.363-2.064-.997-.103 2.491 1.483 4.38 3.298 4.38-1.394 0-2.47-.98-2.604-2.107-.247-2.075 1.658-3.646 3.432-3.646 1.113 0 2.045.662 2.342 1.47-.646.077-1.29.107-1.923.107-1.425 0-2.245-.795-2.245-1.873 0-.467.198-1.198.566-1.686 1.055.665 2.403 1.057 3.86 1.057 4.636 0 7.184-3.847 7.184-8.386 0-1.268-.221-2.36-.567-3.296.167-.033 7.592-.065 9.536-1.01.202-1.44.279-3.62.143-4.803-1.182-3.228-4.763-4.819-8.034-4.907z"/></svg>
              DISCORD
            </a>
          </div>

          {/* Server connect card */}
          <Card className="max-w-sm border-border/60 bg-[#0c0f1e]/80 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-2 text-xs font-outfit font-bold leading-none">
                <span className="flex items-center gap-1.5">
                  <UsersIcon className="w-3 h-3 text-[#00f5ff]" />
                  <span id="heroConnectText">CHECKING SERVER STATUS…</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-[#10b981]/15 text-[#10b981] px-2 py-0.5 rounded border border-[#10b981]/30">
                  JAVA & BEDROCK
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between bg-[#11152a] border border-[#00f5ff]/30 rounded-lg p-4 cursor-pointer hover:bg-[#171d3a] hover:border-[#00f5ff] transition-all group">
                <div>
                  <span className="block text-[9px] font-bold text-[#64748b] tracking-wider uppercase">SERVER DOMAIN (CLICK TO COPY)</span>
                  <span className="block font-outfit font-black text-[#ffffff] text-lg tracking-wide">
                    PLAY.SCYTHEMC.FUN<span className="text-[#00f5ff]">:25565</span>
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#00f5ff]/15 text-[#00f5ff] font-outfit font-bold text-[10px] border border-[#00f5ff]/40 group-hover:bg-[#00f5ff] group-hover:text-black transition-all">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h6.828a2 2 0 002-2H8a2 2 0 00-2-2z" />
                    </svg>
                    COPY IP
                  </span>
                  <span className="text-[9px] text-[#64748b] font-bold tracking-wide uppercase">PORT: 25565</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live player stats row */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-[#00f5ff]/40 bg-[#0e1224]/80 backdrop-blur shadow-[0_6px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(0,245,255,0.2)] animate-pulse">
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              <div className="absolute inset-0 rounded-full border border-[#10b981]/40 animate-ping" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="block text-[11px] font-outfit font-bold text-[#ffffff]">SCYTHE NETWORK</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-[#cbd5e1]" />
                <span className="text-sm font-outfit font-bold text-[#cbd5e1]">
                  <span className="font-black">{players}</span> PLAYERS ONLINE
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded text-[9px] font-bold tracking-wider bg-[#00f5ff]/15 text-[#00f5ff] border border-[#00f5ff]/30">
              128-TICK
            </span>
          </div>
        </motion.div>

        {/* Right: Visual card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div
            className="w-full max-w-xs mb-4 bg-[#0e1224]/90 border border-[#00f5ff]/40 rounded-full px-4 py-2 backdrop-blur shadow-[0_6px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(0,245,255,0.2)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="relative w-2.5 h-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <div className="absolute inset-0 rounded-full border border-[#10b981]/50 animate-ping" />
                </div>
                <span className="font-outfit font-bold text-xs tracking-wide text-[#ffffff]">SCYTHE NETWORK</span>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${status === "online" ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40" : "bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/40"}`}>
                {status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <UsersIcon className="w-3 h-3 text-[#cbd5e1]" />
              <span className="text-xs text-[#94a3b8] font-bold">{players} PLAYERS ONLINE</span>
            </div>
          </div>

          <div className="relative w-full max-w-xs group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a14]/95 via-[#080a14]/35 to-transparent z-10" />
            <div className="relative z-20 rounded-[24px] overflow-hidden border border-[#00f5ff]/35 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.25)] bg-[#080a14]">
              <Image
                src="/logo.webp"
                alt="Official Scythe Store Champion"
                className="w-full h-auto aspect-[1/1] object-cover group-hover:scale-105 transition-transform duration-500"
                priority
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRo4AAABXRUJQVlA4ILoAAAAwAAUCDQUAAQB8AAQAAP78A/+qAwA="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080a14]/80 via-[#080a14]/20 to-transparent pointer-events-none" />
            </div>
            <a
              href="https://www.instagram.com/nageshh449/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#0a0d1a]/90 border border-[#f59e0b]/55 text-[#fbbf24] px-4 py-2 rounded-full text-[11px] font-silkscreen font-bold tracking-wide hover:bg-[#f59e0b]/20 hover:text-white transition-all shadow-[0_8px_30px_rgba(245,158,11,0.25)]"
            >
              <span className="text-[#fbbf24]">★</span>
              FOUNDER-NAGESH449
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
