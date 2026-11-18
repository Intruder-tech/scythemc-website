"use client";

import { useState } from "react";
import Image from "next/image";
import { Carousel } from "@ark-ui/react/carousel";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Slide {
  src: string;
  alt: string;
  caption?: string;
}

interface OverlayCarouselProps {
  slides: Slide[];
  /** Autoplay delay in ms. */
  delay?: number;
  className?: string;
}

const chunky =
  "flex items-center justify-center rounded-lg border-2 border-ink-950 transition-transform active:translate-y-1 active:shadow-none";

/**
 * Ark UI carousel with every control overlaid on the image: prev/next on the sides,
 * caption + counter, page indicators and a play/pause toggle along the bottom.
 * Autoplays and loops; drag/swipe to scroll.
 */
export default function OverlayCarousel({ slides, delay = 1500, className }: OverlayCarouselProps) {
  const [page, setPage] = useState(0);
  const current = slides[page];

  return (
    <Carousel.Root
      defaultPage={0}
      slideCount={slides.length}
      loop
      allowMouseDrag
      autoplay={{ delay }}
      onPageChange={(d) => setPage(d.page)}
      className={cn("relative", className)}
    >
      <Carousel.ItemGroup className="overflow-hidden rounded-xl border-2 border-ink-700 bg-ink-900 shadow-[0_8px_0_var(--color-ink-950)]">
        {slides.map((s, i) => (
          <Carousel.Item key={s.src} index={i}>
            <div className="relative aspect-video">
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1240px"
                className="object-cover"
                priority={i === 0}
                draggable={false}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>

      {/* Bottom scrim so the overlay controls stay readable on bright screenshots */}
      <div className="pointer-events-none absolute inset-x-[2px] bottom-[2px] h-1/3 rounded-b-[10px] bg-linear-to-t from-ink-950/90 to-transparent" />

      <Carousel.Control>
        <Carousel.PrevTrigger
          aria-label="Previous screenshot"
          className={cn(chunky, "absolute left-3 top-1/2 h-12 w-12 -translate-y-1/2 bg-azure text-frost shadow-[0_4px_0_var(--color-royal)] sm:left-5")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Carousel.PrevTrigger>
        <Carousel.NextTrigger
          aria-label="Next screenshot"
          className={cn(chunky, "absolute right-3 top-1/2 h-12 w-12 -translate-y-1/2 bg-azure text-frost shadow-[0_4px_0_var(--color-royal)] sm:right-5")}
        >
          <ChevronRight className="h-6 w-6" />
        </Carousel.NextTrigger>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
          <div className="min-w-0">
            <p className="font-pixel text-[11px] text-gold">
              {String(page + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            {current?.caption && (
              <p className="mt-1 truncate font-display text-lg tracking-wide text-frost sm:text-2xl">{current.caption}</p>
            )}
          </div>

          <Carousel.IndicatorGroup className="hidden items-center gap-1.5 sm:flex">
            {slides.map((s, i) => (
              <Carousel.Indicator
                key={s.src}
                index={i}
                aria-label={`Go to screenshot ${i + 1}`}
                className="h-2 w-2 cursor-pointer rounded-full border border-ink-950 bg-frost/40 transition-all hover:bg-frost/80 data-current:w-6 data-current:bg-gold"
              />
            ))}
          </Carousel.IndicatorGroup>

          <Carousel.AutoplayTrigger
            className={cn(chunky, "group h-10 w-10 shrink-0 bg-gold text-ink-950 shadow-[0_3px_0_var(--color-ember)]")}
          >
            <Pause className="hidden h-4 w-4 group-data-pressed:block" />
            <Play className="h-4 w-4 group-data-pressed:hidden" />
          </Carousel.AutoplayTrigger>
        </div>
      </Carousel.Control>
    </Carousel.Root>
  );
}
