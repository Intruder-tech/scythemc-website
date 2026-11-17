"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const LOADING_TOTAL_MS = 3000;

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [stage, setStage] = useState<"logo" | "text" | "done">("logo");

  useEffect(() => {
    const logoTimer = setTimeout(() => setStage("text"), LOADING_TOTAL_MS);
    const textTimer = setTimeout(() => setStage("done"), LOADING_TOTAL_MS + 2200);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
    };
  }, []);

  useEffect(() => {
    if (stage === "done") {
      const completeTimer = setTimeout(onComplete, 600);
      return () => clearTimeout(completeTimer);
    }
  }, [stage, onComplete]);

  if (stage === "done") return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#06070d] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out">
      {stage === "logo" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center"
        >
          <Image
            src="/logo.webp"
            alt="Scythe MC Logo"
            width={2048}
            height={2048}
            className="w-40 h-40 object-contain drop-shadow-[0_0_40px_rgba(0,136,255,0.6)]"
            priority
          />
          <span className="mt-6 text-xs font-silkscreen tracking-widest text-[#0088ff]/70 uppercase">
            INITIALIZING NETWORK…
          </span>
        </motion.div>
      )}
      {stage === "text" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-3"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#0088ff] to-[#ffcc00] drop-shadow-[0_0_25px_rgba(0,136,255,0.5)] font-outfit"
          >
            SCYTHE
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.15 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#0088ff] to-[#ffcc00] drop-shadow-[0_0_25px_rgba(0,136,255,0.5)] font-outfit"
          >
            MC
          </motion.span>
          <span className="text-xs font-silkscreen tracking-widest text-[#0088ff]/50 uppercase">
            PLAY.SCYTHEMC.FUN:25565
          </span>
        </motion.div>
      )}
    </div>
  );
}
