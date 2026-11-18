import OverlayCarousel, { type Slide } from "@/components/ui/carousel-1";

export const SCREENSHOTS: Slide[] = [
  { src: "/screenshots/2026-11-03_14.05.04.png", alt: "Scythe MC in-game screenshot 1" },
  { src: "/screenshots/2026-11-17T13_27_09.png", alt: "Scythe MC in-game screenshot 2" },
  { src: "/screenshots/2026-11-17T13_43_06.png", alt: "Scythe MC in-game screenshot 3" },
  { src: "/screenshots/2026-11-17T17_15_10.png", alt: "Scythe MC in-game screenshot 4" },
  { src: "/screenshots/new%20png%201.png", alt: "Scythe MC in-game screenshot 5" },
  { src: "/screenshots/new%20png%202.png", alt: "Scythe MC in-game screenshot 6" },
  { src: "/screenshots/new%20png%203.png", alt: "Scythe MC in-game screenshot 7" },
  { src: "/screenshots/new%20png%204.png", alt: "Scythe MC in-game screenshot 8" },
];

export default function ScreenshotCarousel() {
  return (
    <section id="gallery" className="border-b-2 border-ink-800 py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-10">
          <p className="font-pixel text-xs text-gold">FROM THE SERVER</p>
          <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">Gallery</h2>
        </div>

        <OverlayCarousel slides={SCREENSHOTS} delay={2750} />

        <p className="mt-6 text-sm text-dim">Drag or swipe to browse. More screenshots added as the network grows.</p>
      </div>
    </section>
  );
}
