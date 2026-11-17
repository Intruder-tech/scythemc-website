"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ShieldHalf, Trophy, Medal, Crown, Archive, House, Tags, Users, Skull } from "lucide-react";

const ranks = [
  {
    id: "vip",
    name: "VIP Rank",
    price: 169,
    badge: "VIP",
    badgeColor: "bg-blue/20 text-[#0088ff] border border-blue/40",
    icon: Shield,
    iconColor: "text-[#0088ff]",
    stats: [
      { label: "Home", val: "3" },
      { label: "AH Listings", val: "4" },
      { label: "Team Members", val: "5" },
      { label: "Kit", val: "VIP KIT" },
    ],
    perks: [
      "VIP Prefix in chat & tab",
      "Full Ender Chest Access",
      "VIP Kit Access",
      "Standard Priority Join Queue",
    ],
    commands: ["/home 3", "/ah", "/kits vip"],
    variant: "outline" as const,
  },
  {
    id: "vipplus",
    name: "VIP+ Rank",
    price: 269,
    badge: "VIP+",
    badgeColor: "bg-blue/20 text-[#0088ff] border border-blue/40",
    icon: ShieldHalf,
    iconColor: "text-[#0088ff]",
    stats: [
      { label: "Home", val: "4" },
      { label: "AH Listing", val: "4" },
      { label: "Team Members", val: "5" },
      { label: "Kit", val: "VIP & VIP+ KIT" },
    ],
    perks: [
      "VIP+ Prefix in chat & tab",
      "Full Ender Chest Access",
      "Dual Kit Access (VIP & VIP+ Kit)",
      "Private Teleport Delay Bypass",
      "Priority Event Queue Access",
    ],
    commands: ["/home 4", "/ah", "/kits", "/condense"],
    variant: "outline" as const,
  },
  {
    id: "mvp",
    name: "MVP Rank",
    price: 399,
    badge: "MVP",
    badgeColor: "bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/40",
    icon: Trophy,
    iconColor: "text-[#ffcc00]",
    stats: [
      { label: "Home", val: "5" },
      { label: "AH Listings", val: "5" },
      { label: "Team Members", val: "7" },
      { label: "Kit", val: "MVP KIT" },
    ],
    perks: [
      "MVP Prefix in chat & tab",
      "Full Ender Chest Access",
      "MVP Kit Access",
      "Instant Workbench & Anvil Access",
      "Priority Event Queue Access",
    ],
    commands: ["/home 5", "/ah 5", "/kits mvp", "/craft", "/near"],
    variant: "outline" as const,
  },
  {
    id: "mvpplus",
    name: "MVP+ Rank",
    price: 449,
    badge: "MVP+",
    badgeColor: "bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/40",
    icon: Medal,
    iconColor: "text-[#ffcc00]",
    stats: [
      { label: "Home", val: "6" },
      { label: "AH Listings", val: "5" },
      { label: "Team Members", val: "7" },
      { label: "Kit", val: "MVP & MVP+ KIT" },
    ],
    perks: [
      "Custom MVP+ Prefix in chat & tab",
      "Full Ender Chest Access",
      "Dual Kits: MVP & MVP+ Kit",
      "Lobby Flight (/fly in Hub)",
      "On-Demand Item Repair Command",
      "VIP Event Priority Queue",
      "Exclusive Aura & Particle Cosmetics",
    ],
    commands: ["/home 6", "/ah 5", "/kits", "/fly (Hub)", "/repair"],
    variant: "yellow" as const,
    highlight: true,
  },
  {
    id: "thescythe",
    name: "THE SCYTHE",
    price: 799,
    badge: "THE SCYTHE",
    badgeColor: "bg-gradient-to-r from-[#0088ff]/30 to-[#ffcc00]/30 text-[#ffffff] border border-blue/50 shadow-[0_0_15px_rgba(0,136,255,0.4)]",
    icon: Crown,
    iconColor: "text-[#ffffff]",
    stats: [
      { label: "Home", val: "8" },
      { label: "AH Listing", val: "8" },
      { label: "Team Members", val: "10" },
      { label: "Kit", val: "THE SCYTHE KIT" },
    ],
    perks: [
      "Animated THE SCYTHE Prefix",
      "Full Ender Chest Access",
      "THE SCYTHE Ascended Kit",
      "Full Realm Flight Privileges (/fly)",
      "Custom Nickname Command (/nick)",
      "Permanent 100% Full Server Queue Bypass",
      "Guaranteed VIP Event & Tournament Slot",
      "Sovereign Particle Trails & Wings",
    ],
    commands: ["/home 8", "/ah 8", "/kits thescythe", "/fly", "/nick"],
    variant: "blue" as const,
    supreme: true,
  },
];

export default function StoreSection() {
  return (
    <section id="store" className="bg-[#06070d] border-y border-blue/20 py-20">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="font-silkscreen text-[11px] font-bold tracking-widest text-[#0088ff] uppercase">
            Official Server Store
          </span>
          <h2 className="text-3xl md:text-4xl font-outfit font-black tracking-tight text-[#ffffff] uppercase mt-3">
            Equip Your Arsenal
          </h2>
          <p className="text-[#94a3b8] text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
            Select your desired monthly ranks, crate keys, or tournament coins.
            Supports all major Indian payment gateways (UPI, GPay, Paytm) and International Cards.
          </p>
        </div>

        {/* Store subnav */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["RANKS (5 TIERS)", "SPAWNERS & EGGS", "CRATE KEYS", "TOURNAMENTS"].map((cat, i) => (
            <button
              key={cat}
              className={`font-silkscreen text-xs font-bold tracking-wider px-5 py-2.5 rounded-lg border transition-all ${
                i === 0
                  ? "bg-blue/15 text-[#0088ff] border-blue/40 shadow-[0_0_20px_rgba(0,136,255,0.25)]"
                  : "bg-[#111428] text-[#94a3b8] border-blue/20 hover:bg-[#171b38] hover:text-[#0088ff] hover:border-blue/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ranks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
          {ranks.map((rank) => {
            const isHighlight = rank.highlight || rank.supreme;
            return (
              <motion.div
                key={rank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: ranks.indexOf(rank) * 0.05 }}
                whileHover={{ y: -6 }}
                className={`rounded-xl border p-6 flex flex-col gap-4 relative ${isHighlight ? "border-transparent bg-gradient-to-b from-[#181226] to-[#0d0c18] shadow-[0_0_30px_rgba(255,204,0,0.15)]" : "bg-[#0b0d18] border-blue/30 hover:border-blue/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"}`}
              >
                {rank.supreme && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#0088ff] to-[#ffcc00] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_2px_12px_rgba(0,136,255,0.6)]">
                    ULTIMATE TIER
                  </div>
                )}
                {rank.highlight && !rank.supreme && (
                  <div className="absolute -top-3 right-3 z-10 bg-[#ffcc00] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-[#06070d] shadow-[0_2px_10px_rgba(255,204,0,0.6)]">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <rank.icon className="w-4 h-4 ${rank.iconColor}" />
                  <span className={`font-silkscreen text-[10px] font-bold uppercase border ${rank.badgeColor}`}>
                    {rank.badge}
                  </span>
                </div>
                <h3 className="font-silkscreen text-sm font-bold text-[#ffffff]">{rank.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-[#0088ff] font-outfit font-bold">₹</span>
                  <span className="text-2xl font-outfit font-black text-[#ffffff]">{rank.price}</span>
                  <span className="text-xs font-silkscreen text-[#94a3b8] uppercase tracking-wider">/ Monthly</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#000000]/40 border border-blue/20 rounded-lg">
                  {rank.stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 p-1.5 bg-[#ffffff]/03 border border-blue/20 rounded text-[10px] text-[#cbd5e1]">
                      <span className="w-3 h-3 text-[#0088ff]">
                        <House size={14} />
                      </span>
                      <span>{s.label}: </span>
                      <span className="text-[#ffffff] font-bold">{s.val}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  {rank.perks.map((p, i) => (
                    <div key={i} className="flex items-start gap-1.5 my-1">
                      <span className="w-3 h-3 text-[#ffcc00] text-[10px]">✓</span>
                      <span className="text-xs text-[#cbd5e1] leading-tight">{p}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={rank.variant}
                  size="sm"
                  className="w-full font-outfit font-bold uppercase tracking-wide mt-2 shadow-[0_4px_15px_rgba(0,136,255,0.25)] hover:shadow-[0_6px_25px_rgba(0,136,255,0.45)]"
                >
                  ADD TO CART (₹{rank.price})
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
