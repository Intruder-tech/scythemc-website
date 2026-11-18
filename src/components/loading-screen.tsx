"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { createIntroAudio, type IntroAudio } from "@/lib/intro-audio";

/**
 * 7-second cinematic intro. The whole timeline lives in globals.css (".intro-*"),
 * driven by one shared 7s clock; this component only mounts it, locks scroll,
 * and unmounts when the clock (or a skip) finishes.
 */

// Deterministic pseudo-random embers, identical on server and client.
const EMBERS = Array.from({ length: 24 }, (_, i) => {
  const r = (n: number) => ((i * 9301 + n * 49297) % 233280) / 233280;
  return {
    left: `${6 + r(1) * 88}%`,
    size: 3 + Math.round(r(2) * 4),
    drift: `${Math.round((r(3) - 0.5) * 120)}px`,
    duration: `${2.2 + r(4) * 1.4}s`,
    delay: `${3.85 + r(5) * 1.6}s`,
    color: ["var(--color-gold)", "var(--color-cyan)", "var(--color-sun)"][i % 3],
  };
});

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** sessionStorage key; also read by the inline <head> script in app/layout.tsx. */
export const INTRO_SEEN_KEY = "scythe-intro-seen";

function introSeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false; // storage blocked: just show the intro
  }
}

function markIntroSeen() {
  try {
    // Only persist; don't set html[data-intro] here or the CSS would hide the trailer mid-play.
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage blocked: intro will show again next load */
  }
}

export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [skipping, setSkipping] = useState(false);
  // The trailer waits on a "click to enter" screen: that click is the user gesture browsers
  // require before any audio, so the trailer then plays WITH sound from the first frame.
  const [waiting, setWaiting] = useState(true);
  // "off" = not started (browser blocked autoplay or not tried yet), "on" = playing, "muted" = started then muted
  const [sound, setSound] = useState<"off" | "on" | "muted">("off");
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<IntroAudio | null>(null);
  const startedRef = useRef(false);

  /** Seconds into the intro, read from the CSS clock itself so audio lines up with the visuals. */
  const elapsed = useCallback(() => {
    const clock = rootRef.current
      ?.getAnimations()
      .find((a) => (a as CSSAnimation).animationName === "intro-clock");
    return clock?.currentTime != null ? Number(clock.currentTime) / 1000 : 0;
  }, []);

  /** Start the score from wherever the visuals are. Must run inside a user gesture unless autoplay is allowed. */
  const startSound = useCallback(() => {
    if (startedRef.current) return;
    audioRef.current ??= createIntroAudio();
    const audio = audioRef.current;
    if (!audio) return;
    audio.ctx
      .resume()
      .then(() => {
        if (startedRef.current || audio.ctx.state !== "running") return;
        startedRef.current = true;
        audio.start(elapsed());
        setSound("on");
      })
      .catch(() => {});
  }, [elapsed]);

  const toggleSound = useCallback(() => {
    if (!startedRef.current) return startSound();
    setSound((s) => {
      const next = s === "on" ? "muted" : "on";
      audioRef.current?.setMuted(next === "muted");
      return next;
    });
  }, [startSound]);

  const skip = useCallback(() => {
    markIntroSeen();
    audioRef.current?.stop(0.3);
    setWaiting(false);
    setSkipping(true);
  }, []);

  /** Leave the gate: start sound (inside the gesture) and release the paused timeline. */
  const enter = useCallback(() => {
    markIntroSeen();
    startSound();
    setWaiting(false);
  }, [startSound]);

  // Skip the gate when the browser already allows audio (sites the visitor engages with often),
  // or when the visitor prefers reduced motion (the trailer is skipped for them anyway).
  useEffect(() => {
    // Once per browser session: a refresh after the intro goes straight to the site.
    // (The <head> script in layout.tsx already hid the overlay before first paint.)
    if (introSeen()) {
      queueMicrotask(() => setDone(true));
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const policy = (navigator as Navigator & { getAutoplayPolicy?: (t: string) => string }).getAutoplayPolicy?.(
      "audiocontext",
    );
    let allowed = policy === "allowed";
    if (!reduced && policy === undefined) {
      audioRef.current ??= createIntroAudio();
      allowed = audioRef.current?.ctx.state === "running";
    }
    if (reduced || allowed) queueMicrotask(enter);
    return () => {
      // Release fully so a re-mount (React Strict Mode in dev) builds a fresh context.
      audioRef.current?.stop(0.2);
      audioRef.current = null;
      startedRef.current = false;
    };
  }, [enter]);

  useEffect(() => {
    if (done) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      else if (waiting) enter(); // any other key enters, with sound
      else if (e.key === "Enter" || e.key === " ") skip();
      else if (e.key === "m" || e.key === "M") toggleSound();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [done, waiting, enter, skip, toggleSound]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Scythe MC intro"
      className={`intro fixed inset-0 z-[100] overflow-hidden ${skipping ? "is-skipping" : ""} ${
        waiting ? "is-waiting cursor-pointer" : ""
      }`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) {
          audioRef.current?.stop(0.2);
          setDone(true);
        }
      }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        if (waiting) enter();
        else startSound(); // fallback: any click on the trailer turns sound on
      }}
    >
      {/* Click-to-enter gate (unlocks audio) */}
      {waiting && (
        <div className="intro-gate absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <Image src="/logo.webp" alt="" width={256} height={256} priority className="w-36 sm:w-44" />
          <p className="animate-pulse font-pixel text-sm text-gold sm:text-base">CLICK ANYWHERE TO ENTER</p>
          <p className="flex items-center gap-2 font-pixel text-[11px] text-mist">
            <Volume2 className="h-4 w-4 text-cyan" />
            SOUND ON · BEST WITH HEADPHONES
          </p>
          <button
            onClick={skip}
            className="absolute bottom-8 rounded-md border-2 border-ink-700 px-3 py-1.5 font-pixel text-[11px] text-dim transition-colors hover:border-gold hover:text-gold"
          >
            SKIP INTRO ▸
          </button>
        </div>
      )}
      {/* Stage: everything between the letterbox bars */}
      <div
        className="intro-stage absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, #0a1a5c 0%, #030620 68%)" }}
      >
        <div className="intro-shake absolute inset-0 flex items-center justify-center">
          {/* Title cards */}
          <p className="intro-card-1 absolute px-6 text-center font-pixel text-xs uppercase text-mist sm:text-sm">
            Scythe MC Network
            <span className="mt-3 block text-[10px] text-dim sm:text-xs">presents</span>
          </p>
          <p className="intro-card-2 logo-type absolute font-display text-[clamp(64px,14vw,180px)] uppercase leading-none tracking-wide text-azure">
            Season 2
          </p>
          <p className="intro-card-3 logo-type-gold absolute px-4 text-center font-display text-[clamp(44px,8vw,110px)] uppercase leading-[0.95] tracking-wide">
            The harvest
            <br />
            begins
          </p>

          {/* Logo reveal */}
          <div
            className="intro-rays pointer-events-none absolute h-[130vmax] w-[130vmax]"
            style={{
              background:
                "repeating-conic-gradient(rgba(5,233,251,0.13) 0deg 4deg, transparent 4deg 18deg)",
              maskImage: "radial-gradient(circle, black 8%, transparent 45%)",
              WebkitMaskImage: "radial-gradient(circle, black 8%, transparent 45%)",
            }}
          />
          <div className="relative flex flex-col items-center">
            <div className="intro-flare pointer-events-none absolute top-1/2 h-[2px] w-[92vw] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,var(--color-cyan)_35%,#fff_50%,var(--color-cyan)_65%,transparent)]" />
            <div className="intro-flare pointer-events-none absolute top-1/2 h-10 w-[60vw] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(5,233,251,0.35),transparent_70%)]" />
            <Image
              src="/logo.webp"
              alt=""
              width={256}
              height={256}
              priority
              className="intro-logo relative w-[min(58vw,256px)] drop-shadow-[0_12px_0_rgba(3,6,32,0.9)]"
            />
            <p className="intro-address mt-6 font-pixel text-xs text-frost sm:text-sm">PLAY.SCYTHEMC.FUN</p>
          </div>

          {/* Embers */}
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="intro-ember absolute bottom-[8vh]"
              style={
                {
                  left: e.left,
                  width: e.size,
                  height: e.size,
                  background: e.color,
                  animationDuration: e.duration,
                  animationDelay: e.delay,
                  "--drift": e.drift,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Blade slash + flash */}
        <div className="intro-slash pointer-events-none absolute left-[20vw] top-1/2 h-[5px] w-[60vw] bg-[linear-gradient(90deg,transparent,var(--color-cyan)_30%,#fff_55%,var(--color-cyan)_80%,transparent)] shadow-[0_0_24px_var(--color-cyan)]" />
        <div className="intro-flash pointer-events-none absolute inset-0 bg-[#e8fdff]" />

        {/* Film look: vignette + grain */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,6,32,0.85)_100%)]" />
        <div
          className="intro-grain pointer-events-none absolute -inset-[10%] opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      {/* Letterbox bars */}
      <div className="intro-bar intro-bar-top absolute inset-x-0 top-0 flex items-center justify-between bg-[#030208] px-4 sm:px-8">
        <button
          onClick={toggleSound}
          aria-pressed={sound === "on"}
          className={`flex items-center gap-2 rounded-md border-2 px-3 py-1.5 font-pixel text-[11px] transition-colors ${
            sound === "off"
              ? "animate-pulse border-gold text-gold"
              : "border-ink-700 text-mist hover:border-gold hover:text-gold"
          }`}
        >
          {sound === "on" ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {sound === "off" ? "TAP FOR SOUND" : sound === "on" ? "SOUND ON" : "MUTED"}
        </button>
        <button
          onClick={skip}
          className="rounded-md border-2 border-ink-700 px-3 py-1.5 font-pixel text-[11px] text-mist transition-colors hover:border-gold hover:text-gold"
        >
          SKIP ▸
        </button>
      </div>
      <div className="intro-bar intro-bar-bottom absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#030208] px-4 sm:px-8">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-ink-900">
          <div className="intro-progress h-full bg-gold" />
        </div>
        <span className="font-pixel text-[10px] text-dim sm:text-[11px]">LOADING WORLD…</span>
        <span className="font-pixel text-[10px] text-dim sm:text-[11px]">SCYTHE MC</span>
      </div>
    </div>
  );
}
