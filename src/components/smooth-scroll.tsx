"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Site-wide smooth (inertial) wheel scrolling via Lenis.
 * - Touch devices keep native scrolling (already smooth, and cheapest).
 * - Off for visitors who prefer reduced motion.
 * - Paused while something locks the page (the intro trailer sets overflow:hidden).
 * - Same-page anchor links ("#store", "/#store" while on "/") glide instead of jumping.
 */
let current: Lenis | null = null;

/** Jump to the very top right now, resetting any smooth-scroll momentum/target. */
export function scrollToTopNow() {
  if (current) current.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export default function SmoothScroll() {
  const pathname = usePathname();

  // New page: drop the previous page's scroll target so Lenis doesn't glide back toward it.
  // (Links to a section, e.g. "/#store", keep their hash and are left alone.)
  useEffect(() => {
    if (!current || window.location.hash) return;
    current.resize();
    current.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      virtualScroll: () => document.documentElement.style.overflow !== "hidden",
    });
    current = lenis;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      // preventDefault makes next/link skip its own (instant) navigation; its onClick still runs.
      e.preventDefault();
      lenis.scrollTo(target); // the page's scroll-padding-top already clears the navbar
      window.history.pushState(null, "", url.hash);
    };
    // capture phase: runs before next/link's handler
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
      current = null;
    };
  }, []);

  return null;
}
