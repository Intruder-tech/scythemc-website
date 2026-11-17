"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const SCREENSHOTS: Array<{ src: string; alt: string }> = [
  {
    src: "/screenshots/2026-11-03_14.05.04.png",
    alt: "Scythe MC Screenshot 1",
  },
  {
    src: "/screenshots/2026-11-17T13_43_06.png",
    alt: "Scythe MC Screenshot 2",
  },
];

interface ScreenshotCarouselProps {
  className?: string;
}

export default function ScreenshotCarousel({
  className,
}: ScreenshotCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (!container) return;
      const { scrollLeft, clientWidth, scrollWidth } = container;
      const scrollProgress = scrollLeft / Math.max(scrollWidth - clientWidth, 1);
      const index = Math.round(scrollProgress * (SCREENSHOTS.length - 1));
      setActiveIndex(Math.max(0, Math.min(SCREENSHOTS.length - 1, index)));
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollBy = (step: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({ left: step * scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      className={[
        "relative py-20 border-y border-blue/20 bg-[#0b0d18]/40",
        className,
      ].join(" ")}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-outfit font-bold tracking-tight text-[#ffffff] uppercase">
            Network Gallery
          </h2>
          <p className="text-xs font-silkscreen tracking-widest text-[#0088ff] uppercase">
            Scythe MC Network
          </p>
        </div>

        <div
          ref={scrollRef}
          className="relative overflow-hidden rounded-2xl border border-blue/40 bg-[#06070d]/60 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex flex-nowrap gap-4 pb-8 pt-6 px-8"
            style={{
              transform: `translateX(${-activeIndex * (100 / SCREENSHOTS.length)}%)`,
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {SCREENSHOTS.map((shot, idx) => (
              <motion.div
                key={shot.src}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div
                  className="relative group overflow-hidden rounded-xl border border-blue/30 bg-[#000000]/40 shadow-lg h-[300px] md:h-[340px] w-full"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 85vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06070d]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-sm font-outfit text-[#ffffff]">
                      {shot.alt}
                    </span>
                  </div>
                </div>
                <span
                  className={`mt-3 text-xs font-silkscreen tracking-widest ${
                    activeIndex === idx
                      ? "text-[#0088ff]"
                      : "text-[#64748b]"
                  }`}
                >
                  {idx + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {SCREENSHOTS.length > 1 && (
            <>
              <button
                onClick={() => scrollBy(-1)}
                disabled={activeIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-blue/40 bg-[#06070d]/80 backdrop-blur text-[#0088ff] hover:bg-blue hover:text-[#06070d] transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center shadow-[0_0_20px_rgba(0,136,255,0.3)]"
                aria-label="Previous screenshot"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollBy(1)}
                disabled={activeIndex === SCREENSHOTS.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-blue/40 bg-[#06070d]/80 backdrop-blur text-[#0088ff] hover:bg-blue hover:text-[#06070d] transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center shadow-[0_0_20px_rgba(0,136,255,0.3)]"
                aria-label="Next screenshot"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {SCREENSHOTS.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {SCREENSHOTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const container = scrollRef.current;
                    if (!container) return;
                    const scrollAmount =
                      (container.clientWidth * 0.85 * idx) /
                      (SCREENSHOTS.length - 1);
                    container.scrollTo({ left: scrollAmount, behavior: "smooth" });
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? "bg-[#0088ff] w-6 shadow-[0_0_10px_rgba(0,136,255,0.6)]"
                      : "bg-blue/30 hover:bg-[#0088ff]"
                  }`}
                  aria-label={`Go to screenshot ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-[#64748b] text-center font-silkscreen uppercase tracking-widest">
          More screenshots added regularly — gallery grows with the network.
        </p>
      </div>
    </section>
  );
}
