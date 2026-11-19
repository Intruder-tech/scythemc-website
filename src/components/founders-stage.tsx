"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type * as THREE_NS from "three";
import type { PlayerObject } from "skinview3d";
import { drawCape } from "@/lib/founder-skin-art";
import { buildIsland } from "@/lib/voxel-island";
import { scrollToTopNow } from "@/components/smooth-scroll";

/**
 * "The Founders' Island": one live 3D scene with both founders standing on a floating
 * Minecraft island. Scrolling drives a cinematic camera (wide shot → founder → co-founder
 * → pull back) while the matching info cards slide in on the opposite side, so the two
 * characters and their details sit on a diagonal.
 *
 * The founders breathe, follow the cursor, wave, hop when clicked, and every so often
 * turn to each other and say hi. Speech bubbles are HTML pinned above their heads.
 */

export interface Actor {
  name: string;
  skinUrl: string;
  capeColor: string;
  lines: string[];
  /** Said to the other founder during their little "hello" moment. */
  greet: string;
}

interface Props {
  founder: Actor;
  coFounder: Actor;
  intro: ReactNode;
  founderCard: ReactNode;
  coFounderCard: ReactNode;
  outro: ReactNode;
}

type V3 = [number, number, number];
type Shot = { pos: V3; look: V3 };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (p: number) => {
  const x = clamp(p, 0, 1);
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Where the founders stand (16 units = 1 block). Diagonal: founder front-left, co-founder back-right. */
const STAND: [V3, V3] = [
  [-18, 0, 10],
  [20, 0, -12],
];

const SHOTS: Record<"desktop" | "mobile", Record<"wide" | "founder" | "co" | "outro", Shot>> = {
  desktop: {
    wide: { pos: [0, 50, 235], look: [0, 30, 0] },
    founder: { pos: [-40, 28, 82], look: [-4, 16, 6] }, // founder left of frame, card on the right
    co: { pos: [64, 30, 50], look: [12, 20, -12] }, // co-founder right of frame, card on the left
    outro: { pos: [0, 58, 230], look: [0, -14, 0] },
  },
  mobile: {
    wide: { pos: [0, 70, 330], look: [0, 44, 0] },
    founder: { pos: [-26, 30, 112], look: [-18, 14, 10] },
    co: { pos: [28, 30, 96], look: [20, 14, -12] },
    outro: { pos: [0, 70, 320], look: [0, -20, 0] },
  },
};

/** Camera keyframes along scroll progress 0..1 (pairs hold a shot, gaps fly between shots). */
const TIMELINE: [number, keyof (typeof SHOTS)["desktop"]][] = [
  [0, "wide"],
  [0.2, "wide"],
  [0.33, "founder"],
  [0.5, "founder"],
  [0.63, "co"],
  [0.8, "co"],
  [0.93, "outro"],
  [1, "outro"],
];

/** Card visibility windows: [fade-in start, fade-in end, fade-out start, fade-out end]. */
const WINDOWS: [number, number, number, number][] = [
  [-1, 0, 0.12, 0.2], // intro
  [0.26, 0.33, 0.5, 0.56], // founder
  [0.6, 0.67, 0.8, 0.86], // co-founder
  [0.9, 0.96, 2, 3], // outro
];

const CLICK_LINES = ["HEHE, HI THERE!", "WOAH! EASY THERE!", "YOU FOUND ME!"];

function shotAt(p: number, mobile: boolean): Shot {
  const set = SHOTS[mobile ? "mobile" : "desktop"];
  for (let i = 0; i < TIMELINE.length - 1; i++) {
    const [a, sa] = TIMELINE[i];
    const [b, sb] = TIMELINE[i + 1];
    if (p <= b) {
      const t = ease((p - a) / (b - a || 1));
      return { pos: lerp3(set[sa].pos, set[sb].pos, t), look: lerp3(set[sa].look, set[sb].look, t) };
    }
  }
  return set.outro;
}

function visibility(p: number, [a, b, c, d]: [number, number, number, number]) {
  if (p < a || p > d) return 0;
  if (p < b) return ease((p - a) / (b - a));
  if (p <= c) return 1;
  return 1 - ease((p - c) / (d - c));
}

export default function FoundersStage({ founder, coFounder, intro, founderCard, coFounderCard, outro }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const actorsRef = useRef<[Actor, Actor]>([founder, coFounder]);
  const [bubbles, setBubbles] = useState<[string, string]>([founder.lines[0], coFounder.lines[0]]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // The film starts at the first shot: always open this page at the top, including on
  // refresh and back/forward (where browsers would otherwise restore an old position).
  useEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    scrollToTopNow();
    const raf = requestAnimationFrame(scrollToTopNow); // after Next.js finishes its own scroll handling
    const onShow = (e: PageTransitionEvent) => e.persisted && scrollToTopNow();
    window.addEventListener("pageshow", onShow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pageshow", onShow);
      window.history.scrollRestoration = prev;
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    Promise.all([import("skinview3d"), import("three"), import("skinview-utils")])
      .then(([sv, three, utils]) => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const canvas = canvasRef.current;
        if (disposed || !section || !stage || !canvas) return;

        const actors = actorsRef.current;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const say = (i: number, text: string) =>
          setBubbles((prev) => {
            const next: [string, string] = [prev[0], prev[1]];
            next[i] = text;
            return next;
          });

        /* ---------- scene ---------- */
        const viewer = new sv.SkinViewer({
          canvas,
          width: stage.clientWidth,
          height: stage.clientHeight,
          fov: 38,
          pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        });
        viewer.autoRotate = false;
        viewer.controls.enabled = false;
        viewer.controls.update = () => false; // the camera is driven by scroll, not OrbitControls
        viewer.globalLight.intensity = 2.3;
        viewer.cameraLight.intensity = 1.1;
        const rim = new three.DirectionalLight(0x05e9fb, 0.9); // cyan rim light from behind-right
        rim.position.set(60, 40, -80);
        const warm = new three.DirectionalLight(0xfcc604, 0.25); // faint gold fill from the left
        warm.position.set(-80, 20, 40);
        viewer.scene.add(rim, warm);

        const islandRoot = new three.Group();
        viewer.scene.add(islandRoot);
        const island = buildIsland(three);
        islandRoot.add(island.group);

        // Actor 1 is the viewer's own player; actor 2 is a second PlayerObject in the same scene.
        const p1 = viewer.playerObject;
        const w1 = viewer.playerWrapper;
        viewer.scene.remove(w1);
        islandRoot.add(w1);
        const p2 = new sv.PlayerObject();
        const w2 = new three.Group();
        w2.add(p2);
        islandRoot.add(w2);

        // The founder stands in the foreground of the co-founder's close-up, so he fades out
        // during that shot (a focus pull) instead of poking out from behind the card.
        const founderMats: THREE_NS.Material[] = [];
        p1.traverse((o) => {
          const mat = (o as THREE_NS.Mesh).material;
          if (!mat) return;
          for (const m of Array.isArray(mat) ? mat : [mat]) {
            m.transparent = true;
            founderMats.push(m);
          }
        });

        const feetY = (p: PlayerObject) => new three.Box3().setFromObject(p.skin).min.y;
        w1.position.set(STAND[0][0], STAND[0][1] - feetY(p1), STAND[0][2]);
        w2.position.set(STAND[1][0], STAND[1][1] - feetY(p2), STAND[1][2]);

        const pixelTexture = (c: HTMLCanvasElement) => {
          const t = new three.CanvasTexture(c);
          t.magFilter = three.NearestFilter;
          t.minFilter = three.NearestFilter;
          t.colorSpace = three.SRGBColorSpace;
          return t;
        };
        const loadImage = (src: string) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });

        const textures: THREE_NS.Texture[] = [];
        void viewer.loadSkin(actors[0].skinUrl, { model: "auto-detect" }).catch(() => {});
        loadImage(actors[1].skinUrl)
          .then((img) => {
            if (disposed) return;
            const c = document.createElement("canvas");
            utils.loadSkinToCanvas(c, img);
            const t = pixelTexture(c);
            textures.push(t);
            p2.skin.map = t;
            p2.skin.modelType = utils.inferModelType(c);
          })
          .catch(() => {});
        loadImage("/logo.webp")
          .then((logo) => {
            if (disposed) return;
            viewer.loadCape(drawCape(document.createElement("canvas"), logo, actors[0].capeColor));
            const t = pixelTexture(drawCape(document.createElement("canvas"), logo, actors[1].capeColor));
            textures.push(t);
            p2.cape.map = t;
            p2.backEquipment = "cape";
          })
          .catch(() => {});

        /* ---------- rising sparks ---------- */
        const N = 140;
        const sparkPos = new Float32Array(N * 3);
        const sparkCol = new Float32Array(N * 3);
        const sparkSpeed = new Float32Array(N);
        const gold = new three.Color("#fcc604");
        const cyan = new three.Color("#05e9fb");
        const respawn = (i: number, anywhere: boolean) => {
          sparkPos[i * 3] = (Math.random() - 0.5) * 160;
          sparkPos[i * 3 + 1] = anywhere ? Math.random() * 120 - 50 : -55;
          sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 110;
          sparkSpeed[i] = 4 + Math.random() * 9;
        };
        for (let i = 0; i < N; i++) {
          respawn(i, true);
          const c = i % 3 === 0 ? cyan : gold;
          sparkCol.set([c.r, c.g, c.b], i * 3);
        }
        const sparkGeo = new three.BufferGeometry();
        sparkGeo.setAttribute("position", new three.BufferAttribute(sparkPos, 3));
        sparkGeo.setAttribute("color", new three.BufferAttribute(sparkCol, 3));
        const sparkMat = new three.PointsMaterial({ size: 1.8, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false });
        islandRoot.add(new three.Points(sparkGeo, sparkMat));

        /* ---------- behaviour ---------- */
        type State = {
          p: PlayerObject;
          w: THREE_NS.Group;
          base: number;
          waveStart: number;
          waveEnd: number;
          nextWave: number;
          hopAt: number;
          yaw: number;
          pitch: number;
          line: number;
          clicks: number;
        };
        const st: [State, State] = [
          { p: p1, w: w1, base: 0.3, waveStart: 0.8, waveEnd: 3.2, nextWave: 12, hopAt: -10, yaw: 0, pitch: 0, line: 0, clicks: 0 },
          { p: p2, w: w2, base: -0.35, waveStart: 2.4, waveEnd: 4.8, nextWave: 15, hopAt: -10, yaw: 0, pitch: 0, line: 0, clicks: 0 },
        ];
        let time = 0;
        const startWave = (s: State, len = 2.4) => {
          s.waveStart = time;
          s.waveEnd = time + len;
          s.nextWave = s.waveEnd + 9 + Math.random() * 5;
        };

        let nextSocial = 9;
        let socialUntil = 0;
        let initiator = 1;
        const pointer = { x: 0, y: 0, at: -10 };
        const v = new three.Vector3();

        const screenOf = (obj: THREE_NS.Object3D, lift: number) => {
          obj.getWorldPosition(v);
          v.y += lift;
          v.project(viewer.camera);
          return { x: (v.x * 0.5 + 0.5) * stage.clientWidth, y: (-v.y * 0.5 + 0.5) * stage.clientHeight, behind: v.z > 1 };
        };

        viewer.animation = new sv.FunctionAnimation((_player, _progress, rawDelta) => {
          const dt = Math.min(rawDelta, 0.1);
          time += dt;

          // Scroll progress through the section drives the whole film.
          const rect = section.getBoundingClientRect();
          const scrollable = Math.max(1, rect.height - window.innerHeight);
          const p = clamp(-rect.top / scrollable, 0, 1);
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;

          // Camera
          const mobile = stage.clientWidth / stage.clientHeight < 0.9;
          const shot = shotAt(p, mobile);
          const drift = reduced ? 0 : 1;
          viewer.camera.position.set(
            shot.pos[0] + Math.sin(time * 0.25) * 3 * drift,
            shot.pos[1] + Math.sin(time * 0.33) * 1.5 * drift,
            shot.pos[2],
          );
          viewer.camera.lookAt(shot.look[0], shot.look[1], shot.look[2]);

          // Focus pull: hide the founder while the camera is on the co-founder
          const founderFade = 1 - visibility(p, [0.54, 0.62, 0.84, 0.9]);
          for (const m of founderMats) m.opacity = founderFade;
          w1.visible = founderFade > 0.01;

          // Island floats
          islandRoot.position.y = reduced ? 0 : Math.sin(time * 0.6) * 1.4;
          islandRoot.rotation.y = reduced ? 0 : Math.sin(time * 0.15) * 0.05;

          // Cards
          cardRefs.current.forEach((el, i) => {
            if (!el) return;
            const vis = visibility(p, WINDOWS[i]);
            el.style.opacity = String(vis);
            el.style.transform = `translateY(${(1 - vis) * 24}px)`;
            el.style.visibility = vis < 0.01 ? "hidden" : "visible";
            el.style.pointerEvents = vis > 0.5 ? "auto" : "none";
          });

          // Every so often the founders turn to each other and say hi
          if (!reduced && time >= nextSocial) {
            initiator = 1 - initiator;
            socialUntil = time + 3.2;
            startWave(st[initiator], 2.6);
            say(initiator, actors[initiator].greet);
            nextSocial = time + 16 + Math.random() * 6;
          }
          const social = time < socialUntil;

          st.forEach((s, i) => {
            const k = s.p.skin;
            // scheduled waves with a new line
            if (!reduced && !social && time >= s.nextWave) {
              startWave(s);
              const lines = actors[i].lines;
              s.line = (s.line + 1) % lines.length;
              say(i, lines[s.line]);
            }
            // breathing + hop
            const breath = reduced ? 0 : Math.sin(time * 2.1 + i);
            const hopP = clamp((time - s.hopAt) / 0.5, 0, 1);
            const hop = hopP < 1 ? Math.sin(Math.PI * hopP) * 1.6 : 0;
            s.p.position.y = breath * 0.1 + hop;
            k.leftArm.rotation.z = 0.06 + breath * 0.04;
            k.leftArm.rotation.x = Math.sin(time * 1.05 + i) * 0.05;
            k.leftLeg.rotation.x = hop ? -0.25 * Math.sin(Math.PI * hopP) : 0;
            k.rightLeg.rotation.x = hop ? 0.25 * Math.sin(Math.PI * hopP) : 0;
            // wave beside the head (Euler order makes -z swing the raised arm outward)
            const w = clamp((time - s.waveStart) / (s.waveEnd - s.waveStart), 0, 1);
            const waving = time >= s.waveStart && time <= s.waveEnd;
            const up = waving ? ease(w / 0.12) * ease((1 - w) / 0.12) : 0;
            k.rightArm.rotation.x = -2.7 * up + (1 - up) * Math.sin(time * 1.05 + Math.PI + i) * 0.05;
            k.rightArm.rotation.z = (-0.06 - breath * 0.04) * (1 - up) - (0.4 + Math.sin(time * 7.5) * 0.26) * up;
            s.p.cape.rotation.x = 0.18 + Math.sin(time * 1.6 + i) * 0.05 + hop * 0.12;

            // where to look: each other, the visitor's cursor, or around
            let ty: number;
            let tp: number;
            if (social) {
              const o = st[1 - i].w.position;
              ty = clamp(Math.atan2(o.x - s.w.position.x, o.z - s.w.position.z) - s.base, -1.6, 1.6);
              tp = 0;
            } else if (time - pointer.at < 3) {
              const h = screenOf(k.head, 6);
              const r = canvas.getBoundingClientRect();
              ty = clamp((pointer.x - (r.left + h.x)) / (window.innerWidth * 0.45), -1, 1) * 0.9;
              tp = clamp((pointer.y - (r.top + h.y)) / (window.innerHeight * 0.5), -1, 1) * 0.45;
            } else {
              ty = Math.sin(time * 0.5 + i * 2) * 0.3;
              tp = Math.sin(time * 0.7 + i) * 0.05 - 0.03;
            }
            const ks = Math.min(1, dt * 4);
            s.yaw += (ty - s.yaw) * ks;
            s.pitch += (tp - s.pitch) * ks;
            s.w.rotation.y = s.base + s.yaw * 0.45;
            k.head.rotation.y = clamp(s.yaw * 0.6, -1, 1);
            k.head.rotation.x = s.pitch;
            k.head.rotation.z = up * Math.sin(time * 4) * 0.04;

            // pin the speech bubble above the head
            const el = bubbleRefs.current[i];
            if (el) {
              const b = screenOf(k.head, 13);
              el.style.transform = `translate(${b.x}px, ${b.y}px)`;
              el.style.opacity = b.behind ? "0" : String(i === 0 ? founderFade : 1);
            }
          });

          // sparks drift upward
          for (let i = 0; i < N; i++) {
            sparkPos[i * 3 + 1] += sparkSpeed[i] * dt * (reduced ? 0 : 1);
            if (sparkPos[i * 3 + 1] > 75) respawn(i, false);
          }
          sparkGeo.attributes.position.needsUpdate = true;
        });
        setReady(true);

        /* ---------- input ---------- */
        const onMove = (e: PointerEvent) => {
          pointer.x = e.clientX;
          pointer.y = e.clientY;
          pointer.at = time;
        };
        const raycaster = new three.Raycaster();
        const onClick = (e: MouseEvent) => {
          const r = canvas.getBoundingClientRect();
          const ndc = new three.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
          raycaster.setFromCamera(ndc, viewer.camera);
          const hits = st
            .map((s, i) => ({ i, d: raycaster.intersectObject(s.w, true)[0]?.distance }))
            .filter((h) => h.d !== undefined)
            .sort((a, b) => (a.d as number) - (b.d as number));
          if (!hits.length) return;
          const s = st[hits[0].i];
          s.hopAt = time;
          if (!reduced) startWave(s, 1.6);
          say(hits[0].i, CLICK_LINES[s.clicks++ % CLICK_LINES.length]);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        canvas.addEventListener("click", onClick);

        const io = new IntersectionObserver(([entry]) => {
          viewer.renderPaused = !entry.isIntersecting;
        });
        io.observe(section);
        const ro = new ResizeObserver(() => viewer.setSize(stage.clientWidth, stage.clientHeight));
        ro.observe(stage);

        cleanup = () => {
          window.removeEventListener("pointermove", onMove);
          canvas.removeEventListener("click", onClick);
          io.disconnect();
          ro.disconnect();
          island.dispose();
          sparkGeo.dispose();
          sparkMat.dispose();
          textures.forEach((t) => t.dispose());
          viewer.dispose();
        };
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  // No WebGL: show the same content as a simple stacked layout.
  if (failed) {
    return (
      <section className="founders-sky relative overflow-hidden py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 sm:px-6">
          {intro}
          {founderCard}
          {coFounderCard}
          {outro}
        </div>
      </section>
    );
  }

  const cardBase = "absolute will-change-transform";
  return (
    <section ref={sectionRef} aria-label="The founders" className="relative h-[320vh]">
      <div ref={stageRef} className="founders-sky sticky top-0 h-[100svh] w-full overflow-hidden">
        <div aria-hidden className="founders-stars pointer-events-none absolute inset-0" />
        <div aria-hidden className="founders-aurora pointer-events-none absolute inset-x-0 top-0 h-[65%]" />

        <canvas
          ref={canvasRef}
          aria-label={`${founder.name} and ${coFounder.name} standing on a floating island`}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />

        {/* speech bubbles pinned above each head */}
        {[0, 1].map((i) => (
          <div
            key={i}
            ref={(el) => {
              bubbleRefs.current[i] = el;
            }}
            className={`pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-300 ${ready ? "" : "hidden"}`}
            style={{ transform: "translate(-9999px, 0)" }}
            aria-live="polite"
          >
            <div className="-translate-x-1/2 -translate-y-full">
              <div
                key={bubbles[i]}
                className="relative whitespace-nowrap rounded-lg border-2 border-ink-950 bg-frost px-3 py-1.5 font-pixel text-[10px] text-ink-950 shadow-[0_4px_0_var(--color-ink-950)] sm:text-xs"
                style={{ animation: "bubble-pop 0.35s cubic-bezier(0.3, 1.6, 0.5, 1) both", transformOrigin: "50% 100%" }}
              >
                {bubbles[i]}
                <span className="absolute -bottom-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-ink-950 bg-frost" />
              </div>
            </div>
          </div>
        ))}

        {/* story cards, faded in/out by scroll */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            className={`${cardBase} inset-x-4 top-[16%] text-center`}
          >
            {intro}
          </div>
          <div
            ref={(el) => {
              cardRefs.current[1] = el;
            }}
            className={`${cardBase} inset-x-4 bottom-28 lg:bottom-auto lg:left-auto lg:right-[6%] lg:top-1/2 lg:w-[440px] lg:-translate-y-1/2`}
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {founderCard}
          </div>
          <div
            ref={(el) => {
              cardRefs.current[2] = el;
            }}
            className={`${cardBase} inset-x-4 bottom-28 lg:bottom-auto lg:left-[6%] lg:right-auto lg:top-1/2 lg:w-[440px] lg:-translate-y-1/2`}
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {coFounderCard}
          </div>
          <div
            ref={(el) => {
              cardRefs.current[3] = el;
            }}
            className={`${cardBase} inset-x-4 bottom-28 text-center lg:bottom-16`}
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {outro}
          </div>
        </div>

        {/* scroll progress */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-20 h-1 bg-ink-900/60">
          <div ref={progressRef} className="h-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
