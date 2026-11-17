"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import LoadingScreen from "@/components/loading-screen";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import StoreSection from "@/components/store-section";
import ScreenshotCarousel from "@/components/screenshot-carousel";

export default function Page() {
  const [showLoading, setShowLoading] = useState(true);

  // Ambient particle canvas (Minecraft-style embers & coins — blue/yellow)
  useEffect(() => {
    const canvas = document.getElementById("ambient-canvas") as
      | HTMLCanvasElement
      | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      type: "coin" | "ember";
      opacity: number;
      pulse: number;
      color: string;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 38;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 2.5,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -(Math.random() * 0.5 + 0.2),
        type: Math.random() > 0.65 ? "coin" : "ember",
        opacity: Math.random() * 0.6 + 0.25,
        pulse: Math.random() * Math.PI,
        color: Math.random() > 0.5 ? "#0088ff" : "#ffcc00",
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += 0.025;
        if (p.y < -15) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        ctx.save();
        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.globalAlpha = Math.max(0, currentOpacity);
        if (p.type === "coin") {
          ctx.fillStyle = "#ffcc00";
          ctx.fillRect(
            Math.round(p.x),
            Math.round(p.y),
            p.size + 1,
            p.size + 1,
          );
          ctx.fillStyle = "#d97706";
          ctx.fillRect(
            Math.round(p.x) + 1,
            Math.round(p.y) + 1,
            p.size - 1,
            p.size - 1,
          );
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
        ctx.restore();
      }
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {};

  return (
    <div className="relative min-h-screen flex flex-col">
      <canvas id="ambient-canvas" className="fixed inset-0 -z-10 pointer-events-none opacity-75" />

      {/* Announcement ticker — blue + yellow only */}
      <aside className="relative z-20 bg-gradient-to-r from-[#06070d] via-[#0b0d18] to-[#06070d] border-b border-blue/30 font-silkscreen text-[11px] font-bold tracking-wider px-6 py-2.5 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-6 animate-[marquee_20s_linear_infinite]">
          <span className="flex items-center gap-1.5 text-[#0088ff]/90">
            <span className="w-3 h-3 text-[#ffcc00]">★</span> SERVER RANKS ARE NOW LIVE! VIP (₹169), VIP+ (₹269), MVP (₹399), MVP+ (₹449), THE SCYTHE (₹799)!
          </span>
          <span className="text-blue/70 mx-2">•</span>
          <span className="flex items-center gap-1.5 text-[#ffcc00]/90">
            <span className="w-3 h-3 text-[#0088ff]">◆</span> SPAWNERS & SPAWN EGG STORE IS LIVE! SKELETON (₹10), CREEPER (₹15), IRON GOLEM (₹20), EGGS (₹50)!
          </span>
          <span className="text-blue/70 mx-2">•</span>
          <span className="flex items-center gap-1.5 text-[#0088ff]/90">
            <span className="w-3 h-3 text-[#ffcc00]">⚡</span> SEASON 1 LAUNCH: USE CODE <strong className="text-[#ffffff]">SCYTHE20</strong> FOR 20% OFF!
          </span>
          <span className="text-blue/70 mx-2">•</span>
          <span className="flex items-center gap-1.5 text-[#ffcc00]/90">
            <span className="w-3 h-3 text-[#0088ff]">🎫</span> UPI PAYMENTS ACTIVE: SCAN QR & CLAIM IN #TICKET-CHANNEL ON DISCORD!
          </span>
          <span className="text-blue/70 mx-2">•</span>
          <span className="flex items-center gap-1.5 text-[#0088ff]/90">
            <span className="w-3 h-3 text-[#ffcc00]">★</span> SERVER RANKS ARE NOW LIVE! VIP (₹169), VIP+ (₹269), MVP (₹399), MVP+ (₹449), THE SCYTHE (₹799)!
          </span>
          <span className="text-blue/70 mx-2">•</span>
          <span className="flex items-center gap-1.5 text-[#ffcc00]/90">
            <span className="w-3 h-3 text-[#0088ff]">◆</span> SPAWNERS & SPAWN EGG STORE IS LIVE! SKELETON (₹10), CREEPER (₹15), IRON GOLEM (₹20), EGGS (₹50)!
          </span>
          <span className="text-blue/70 mx-2">•</span>
          <span className="flex items-center gap-1.5 text-[#0088ff]/90">
            <span className="w-3 h-3 text-[#ffcc00]">⚡</span> SEASON 1 LAUNCH: USE CODE <strong className="text-[#ffffff]">SCYTHE20</strong> FOR 20% OFF!
          </span>
          <span className="text-blue/70 mx-2">•</span>
          <span className="flex items-center gap-1.5 text-[#ffcc00]/90">
            <span className="w-3 h-3 text-[#0088ff]">🎫</span> UPI PAYMENTS ACTIVE: SCAN QR & CLAIM IN #TICKET-CHANNEL ON DISCORD!
          </span>
        </div>
      </aside>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <main className="relative z-10 flex-1" style={{ opacity: showLoading ? 0 : 1, transition: "opacity 0.6s ease-in-out" }}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <StoreSection />
        <ScreenshotCarousel />

        <footer className="border-t border-blue/20 bg-[#0b0d18] py-12">
          <div className="max-w-[1300px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="font-outfit font-bold text-sm text-[#ffffff]">SCYTHE</span>
              <span className="text-[#0088ff]">MC</span>
              <span className="text-xs text-[#64748b]">• PLAY.SCYTHEMC.FUN:25565</span>
            </div>
            <div className="flex gap-4 text-xs text-[#94a3b8] font-silkscreen uppercase tracking-widest">
              <a href="#" className="hover:text-[#0088ff] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#0088ff] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#0088ff] transition-colors">Discord</a>
              <a href="#" className="hover:text-[#0088ff] transition-colors">Store</a>
            </div>
            <div className="text-[10px] text-[#64748b] font-silkscreen uppercase tracking-wider">
              © 2026 Scythe MC Network. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
    </div>
  );
}
