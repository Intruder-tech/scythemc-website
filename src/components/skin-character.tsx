"use client";

import { useEffect, useRef, useState } from "react";
import { drawCape, drawCharacterSkin, type Expression, type Look } from "@/lib/founder-skin-art";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (p: number) => p * p * (3 - 2 * p);

export interface SkinCharacterProps {
  /** Used for the accessible label. */
  name: string;
  /** URL of a real 64x64 Minecraft skin. Without it, a painted character is drawn from `look`. */
  skinUrl?: string;
  /** Outfit/hair colours for the painted character. */
  look?: Look;
  /** Give the character a Scythe cape. */
  cape?: boolean;
  /** Image URL printed on the back of the cape (e.g. the server logo). */
  capeLogo?: string;
  /** Cape cloth colour (hex). Defaults to Scythe royal blue. */
  capeColor?: string;
  /** Speech-bubble lines, one per wave. */
  lines: string[];
  /** Lines said when clicked. */
  clickLines?: string[];
  /** Seconds before the first wave, so several characters on one page don't wave in sync. */
  firstWave?: number;
  /** Smaller bubble + tighter framing for cards. */
  compact?: boolean;
}

/**
 * A living 3D Minecraft character:
 * breathes and sways, head + body follow the visitor's cursor, blinks, waves every few
 * seconds with a happy face, hops when clicked, and talks through a speech bubble.
 * Blink/happy expressions apply to painted characters; real skins keep their own face.
 * Rendering pauses while the character is off-screen.
 */
export default function SkinCharacter({
  name,
  skinUrl,
  look,
  cape = false,
  capeLogo,
  capeColor,
  lines,
  clickLines = ["HEHE, HI THERE!", "WOAH! EASY THERE!", "YOU FOUND ME!"],
  firstWave = 0.4,
  compact = false,
}: SkinCharacterProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [bubble, setBubble] = useState(lines[0]);
  // Keep the latest text props without re-creating the 3D scene.
  const textRef = useRef({ lines, clickLines });
  useEffect(() => {
    textRef.current = { lines, clickLines };
  }, [lines, clickLines]);
  const lookKey = JSON.stringify(look ?? {});

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    import("skinview3d")
      .then(({ SkinViewer, FunctionAnimation }) => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (disposed || !wrap || !canvas) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const paintLook: Look = JSON.parse(lookKey);
        const painted = skinUrl ? null : document.createElement("canvas");

        const viewer = new SkinViewer({
          canvas,
          width: wrap.clientWidth,
          height: wrap.clientHeight,
          skin: skinUrl ?? drawCharacterSkin(painted!, "open", paintLook),
          model: skinUrl ? "auto-detect" : "default",
          cape: cape ? drawCape(document.createElement("canvas"), undefined, capeColor) : undefined,
          zoom: compact ? 0.78 : 0.85,
          fov: 38,
        });
        viewer.autoRotate = false;
        if (cape && capeLogo) {
          const logo = new Image();
          logo.onload = () => !disposed && viewer.loadCape(drawCape(document.createElement("canvas"), logo, capeColor));
          logo.src = capeLogo;
        }
        viewer.controls.enableZoom = false;
        viewer.controls.enablePan = false;
        viewer.globalLight.intensity = 2.6;
        viewer.cameraLight.intensity = 1.3;

        /* ---- behaviour state ---- */
        let time = 0;
        let waveStart = firstWave;
        let waveEnd = firstWave + 2.4;
        let nextWave = waveEnd + 8 + Math.random() * 4;
        let hopAt = -10;
        let happyUntil = 0;
        let nextBlink = 1.5 + Math.random() * 2;
        let blinkUntil = 0;
        let expr: Expression = "open";
        let line = 0;
        let clicks = 0;
        let yaw = 0;
        let pitch = 0;
        const pointer = { x: 0, y: 0, at: -10 };

        const setExpr = (next: Expression) => {
          if (!painted || next === expr) return;
          expr = next;
          viewer.loadSkin(drawCharacterSkin(painted, next, paintLook), { model: "default" });
        };
        const startWave = (len = 2.4) => {
          waveStart = time;
          waveEnd = time + len;
          nextWave = waveEnd + 9 + Math.random() * 5;
        };

        viewer.animation = new FunctionAnimation((player, _progress, rawDelta) => {
          const delta = Math.min(rawDelta, 0.1); // no jumps after the tab was hidden
          time += delta;
          const s = player.skin;

          // Breathing + idle sway
          const breath = reduced ? 0 : Math.sin(time * 2.1);
          const hopP = clamp((time - hopAt) / 0.5, 0, 1);
          const hop = hopP < 1 ? Math.sin(Math.PI * hopP) * 1.6 : 0;
          player.position.y = breath * 0.1 + hop;
          s.leftArm.rotation.z = 0.06 + breath * 0.04;
          s.leftArm.rotation.x = Math.sin(time * 1.05) * 0.05;
          s.leftLeg.rotation.x = hop ? -0.25 * Math.sin(Math.PI * hopP) : 0;
          s.rightLeg.rotation.x = hop ? 0.25 * Math.sin(Math.PI * hopP) : 0;

          // Wave: raise, wave beside the head, lower
          if (!reduced && time >= nextWave) {
            startWave();
            const l = textRef.current.lines;
            setBubble(l[(line = (line + 1) % l.length)]);
          }
          const w = clamp((time - waveStart) / (waveEnd - waveStart), 0, 1);
          const waving = time >= waveStart && time <= waveEnd;
          const up = waving ? ease(clamp(w / 0.12, 0, 1)) * ease(clamp((1 - w) / 0.12, 0, 1)) : 0;
          s.rightArm.rotation.x = -2.7 * up + (1 - up) * Math.sin(time * 1.05 + Math.PI) * 0.05;
          // Euler order applies z before the x-raise, so once raised, -z swings the arm outward.
          s.rightArm.rotation.z = (-0.06 - breath * 0.04) * (1 - up) - (0.4 + Math.sin(time * 7.5) * 0.26) * up;

          // Cape drifts with breathing and flicks up on a hop
          if (cape) player.cape.rotation.x = 0.18 + Math.sin(time * 1.6) * 0.05 + hop * 0.12;

          // Look at the visitor, or glance around when they're idle
          const active = time - pointer.at < 3;
          const ty = active ? pointer.x * 0.9 : Math.sin(time * 0.55 + firstWave) * 0.3;
          const tp = active ? pointer.y * 0.45 : Math.sin(time * 0.8) * 0.06 - 0.03;
          const k = Math.min(1, delta * 5);
          yaw += (ty - yaw) * k;
          pitch += (tp - pitch) * k;
          player.rotation.y = 0.15 + yaw * 0.35;
          s.head.rotation.y = yaw * 0.65;
          s.head.rotation.x = pitch;
          s.head.rotation.z = up * Math.sin(time * 4) * 0.04;
          s.body.rotation.z = up * 0.03 + (reduced ? 0 : Math.sin(time * 0.7) * 0.012);

          // Face
          if (time >= nextBlink) {
            blinkUntil = time + 0.13;
            nextBlink = time + (Math.random() < 0.2 ? 0.3 : 2.5 + Math.random() * 3);
          }
          setExpr(up > 0.3 || time < happyUntil ? "happy" : time < blinkUntil ? "blink" : "open");
        });
        setReady(true);

        /* ---- input ---- */
        const onMove = (e: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          pointer.x = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.45), -1, 1);
          pointer.y = clamp((e.clientY - (r.top + r.height * 0.3)) / (window.innerHeight * 0.5), -1, 1);
          pointer.at = time;
        };
        let down: { x: number; y: number } | null = null;
        const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
        const onUp = (e: PointerEvent) => {
          if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) {
            hopAt = time;
            happyUntil = time + 1.6;
            if (!reduced && !(time >= waveStart && time <= waveEnd)) startWave(1.6);
            const c = textRef.current.clickLines;
            setBubble(c[clicks++ % c.length]);
          }
          down = null;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointerup", onUp);

        // Save GPU: only render while on screen.
        const io = new IntersectionObserver(([entry]) => {
          viewer.renderPaused = !entry.isIntersecting;
        });
        io.observe(wrap);
        const ro = new ResizeObserver(() => viewer.setSize(wrap.clientWidth, wrap.clientHeight));
        ro.observe(wrap);

        cleanup = () => {
          window.removeEventListener("pointermove", onMove);
          canvas.removeEventListener("pointerdown", onDown);
          canvas.removeEventListener("pointerup", onUp);
          io.disconnect();
          ro.disconnect();
          viewer.dispose();
        };
      })
      .catch(() => {
        /* renderer failed to load (e.g. no WebGL); the loading label stays */
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [skinUrl, lookKey, cape, capeLogo, capeColor, firstWave, compact]);

  return (
    <div className="relative h-full w-full">
      <div
        key={bubble}
        // Centred by a full-width flex row (no translate tricks that can stack with the pop
        // animation), and capped to the card width so long lines wrap instead of clipping.
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-2"
        aria-live="polite"
      >
        <div
          className={`relative max-w-full rounded-lg border-2 border-ink-950 bg-frost text-center font-pixel leading-snug text-ink-950 shadow-[0_4px_0_var(--color-ink-950)] ${
            compact ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-xs"
          }`}
          style={{ animation: "bubble-pop 0.35s cubic-bezier(0.3, 1.6, 0.5, 1) both", transformOrigin: "50% 100%" }}
        >
          {bubble}
          <span className="absolute -bottom-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-ink-950 bg-frost" />
        </div>
      </div>
      <div ref={wrapRef} className="absolute inset-0 top-[11%] cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          aria-label={`${name}'s Minecraft character, waving hello`}
          className={`h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
        {!ready && (
          <span className="absolute inset-0 flex items-center justify-center font-pixel text-xs text-dim">
            LOADING…
          </span>
        )}
      </div>
    </div>
  );
}
