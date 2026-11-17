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
    badgeColor: "bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/40",
    icon: Shield,
    iconColor: "text-[#4ade80]",
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
    badgeColor: "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40",
    icon: ShieldHalf,
    iconColor: "text-[#38bdf8]",
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
    badgeColor: "bg-[#c084fc]/20 text-[#c084fc] border-[#c084fc]/40",
    icon: Trophy,
    iconColor: "text-[#c084fc]",
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
    badgeColor: "bg-[#f472b6]/20 text-[#f472b6] border-[#f472b6]/40",
    icon: Medal,
    iconColor: "text-[#f472b6]",
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
    variant: "cyan" as const,
    highlight: true,
  },
  {
    id: "thescythe",
    name: "THE SCYTHE",
    price: 799,
    badge: "THE SCYTHE",
    badgeColor: "bg-gradient-to-r from-[#f43f5e]/25 to-[#8b5cf6]/25 text-[#ff5e7e] border-[#ff5e7e] shadow-[0_0_15px_rgba(255,94,126,0.4)]",
    icon: Crown,
    iconColor: "text-[#ff5e7e]",
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
    variant: "violet" as const,
    supreme: true,
  },
];

export default function StoreSection() {
  return (
    <section id="store" className="bg-[#06070d] border-y border-border/50 py-20">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="font-silkscreen text-[11px] font-bold tracking-widest text-[#00f5ff] uppercase">
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
                  ? "bg-[#00f5ff]/12 text-white border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.25)]"
                  : "bg-[#111428] text-[#94a3b8] border-border hover:bg-[#171b38] hover:text-white hover:border-[#00f5ff]/30"
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
                className={`rounded-xl border p-6 flex flex-col gap-4 relative ${isHighlight ? "border-transparent bg-gradient-to-b from-[#181226] to-[#0d0c18] shadow-[0_0_30px_rgba(244,114,182,0.15)]" : "bg-[#0b0d18] border-border hover:border-[#ffffff]/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"}`}
              >
                {rank.supreme && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#f43f5e] to-[#00f5ff] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_2px_12px_rgba(244,63,94,0.6)]">
                    ULTIMATE TIER
                  </div>
                )}
                {rank.highlight && !rank.supreme && (
                  <div className="absolute -top-3 right-3 z-10 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(236,72,153,0.6)]">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <rank.icon className="w-4 h-4 ${rank.iconColor}" />
                  <span className={`font-silkscreen text-[10px] font-bold uppercase ${rank.badgeColor.replace("border-", "")} border`}>
                    {rank.badge}
                  </span>
                </div>
                <h3 className="font-silkscreen text-sm font-bold text-[#ffffff]">{rank.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-[#00f5ff] font-outfit font-bold">₹</span>
                  <span className="text-2xl font-outfit font-black text-[#ffffff]">{rank.price}</span>
                  <span className="text-xs font-silkscreen text-[#94a3b8] uppercase tracking-wider">/ Monthly</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#000000]/40 border border-[#ffffff]/10 rounded-lg">
                  {rank.stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 p-1.5 bg-[#ffffff]/03 border border-[#ffffff]/05 rounded text-[10px] text-[#cbd5e1]">
                      <span className="w-3 h-3 text-[#00f5ff]">
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
                      <span className="w-3 h-3 text-[#10b981] text-[10px]">✓</span>
                      <span className="text-xs text-[#cbd5e1] leading-tight">{p}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={rank.variant}
                  size="sm"
                  className="w-full font-outfit font-bold uppercase tracking-wide mt-2 shadow-[0_4px_15px_rgba(0,245,255,0.25)] hover:shadow-[0_6px_25px_rgba(0,245,255,0.45)]"
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
