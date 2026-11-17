"use client";

import { motion } from "framer-motion";
import { Shield, Trophy, Bolt, Crown, Gamepad, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    color: "text-[#00f5ff] bg-[#00f5ff]/10 border-[#00f5ff]/30",
    title: "Zero-Tolerance Anti-Cheat",
    desc: "Custom machine-learning anti-cheat filters out combat hacks, macros, and movement exploits instantly for pure 100% fair play.",
  },
  {
    icon: Trophy,
    color: "text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/30",
    title: "INR Cash & Spawner Tournaments",
    desc: "Compete using your in-game coins to win real Indian Rupee cash prizes, high-yield spawners, and exclusive champion scythes.",
  },
  {
    icon: Bolt,
    color: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30",
    title: "Instant Rank Delivery",
    desc: "Automated store backend delivers ranks, prefixes, custom cosmetics, and kit permissions within 30 seconds of checkout.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-[#06070d] border-y border-border/50 py-20"
    >
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-silkscreen text-[11px] font-bold tracking-widest text-[#00f5ff] uppercase">
            Built for Champions
          </span>
          <h2 className="text-3xl md:text-4xl font-outfit font-black tracking-tight text-[#ffffff] uppercase mt-3">
            Why Play on ScytheMC?
          </h2>
          <p className="text-[#94a3b8] text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
            Engineered for extreme performance, anti-cheat security, and competitive fair-play.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-border bg-[#0b0d18] p-8 hover:border-[#00f5ff]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all group"
            >
              <div className="w-12 h-12 rounded-md flex items-center justify-center mb-5 ${feature.color} group-hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-outfit font-bold text-[#ffffff] mb-3">{feature.title}</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
