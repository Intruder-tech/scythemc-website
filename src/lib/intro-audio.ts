/**
 * Synthesized trailer score for the 7s intro (Web Audio API, no audio files).
 * Cue times match the CSS timeline in globals.css ("INTRO TRAILER"):
 *   0.0  low drone swells, filter slowly opens
 *   0.5  airy shimmer under "presents"
 *   2.1  BRAAM hit  ("Season 2")
 *   3.0  BRAAM hit, higher ("The harvest begins")
 *   3.3  noise riser, drone drops out for a beat of silence
 *   3.8  blade whoosh → impact: sub boom, crack, metallic scythe "shing"
 *   3.9  warm pad + sparkles with the embers
 *   4.9  bell as the server address appears
 *   6.3  closing whoosh, everything fades with the curtain
 */

export interface IntroAudio {
  ctx: AudioContext;
  /** Schedule every cue still ahead of `elapsed` (seconds into the intro). */
  start(elapsed: number): void;
  setMuted(muted: boolean): void;
  /** Fade out and release the audio device. */
  stop(fade?: number): void;
}

const LEVEL = 0.45;
const SILENT = 0.0001;

function makeNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

export function createIntroAudio(): IntroAudio | null {
  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;

  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = LEVEL;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -12;
  comp.knee.value = 0;
  comp.ratio.value = 12;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;
  master.connect(comp).connect(ctx.destination);

  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx, 2.8, 2.4);
  const wet = ctx.createGain();
  wet.gain.value = 0.4;
  reverb.connect(wet).connect(master);

  const noiseBuf = makeNoise(ctx, 2);
  const sources: AudioScheduledSourceNode[] = [];

  /** Route a node to the mix: `dry` straight, `send` into the reverb. */
  const out = (node: AudioNode, dry = 1, send = 0.3) => {
    if (dry > 0) {
      const g = ctx.createGain();
      g.gain.value = dry;
      node.connect(g).connect(master);
    }
    if (send > 0) {
      const g = ctx.createGain();
      g.gain.value = send;
      node.connect(g).connect(reverb);
    }
  };

  const osc = (type: OscillatorType, freq: number, at: number, until: number) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.start(at);
    o.stop(until);
    sources.push(o);
    return o;
  };

  const noise = (at: number, until: number) => {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    s.start(at);
    s.stop(until);
    sources.push(s);
    return s;
  };

  /* ---------- instruments ---------- */

  function drone(at: number, from: number) {
    const end = 3.72;
    const dur = end - from;
    if (dur < 0.15) return;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 3;
    lp.frequency.setValueAtTime(180 + (from / end) * 700, at);
    lp.frequency.exponentialRampToValueAtTime(900, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(SILENT, at);
    g.gain.exponentialRampToValueAtTime(0.16, at + Math.min(1.2, dur * 0.6));
    g.gain.setValueAtTime(0.16, at + dur - 0.05);
    g.gain.exponentialRampToValueAtTime(SILENT, at + dur); // hard cut: silence before impact
    for (const f of [55, 55 * 1.007, 82.4]) osc("sawtooth", f, at, at + dur + 0.05).connect(lp);
    osc("sine", 55, at, at + dur + 0.05).connect(g);
    lp.connect(g);
    out(g, 1, 0.2);
  }

  function shimmer(at: number) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(SILENT, at);
    g.gain.exponentialRampToValueAtTime(0.05, at + 0.6);
    g.gain.exponentialRampToValueAtTime(SILENT, at + 1.8);
    for (const f of [440, 659.25, 880, 1318.5]) osc("sine", f, at, at + 1.9).connect(g);
    out(g, 0.35, 1);
  }

  function boom(at: number, level: number) {
    const o = osc("sine", 140, at, at + 1.4);
    o.frequency.setValueAtTime(140, at);
    o.frequency.exponentialRampToValueAtTime(36, at + 0.75);
    const g = ctx.createGain();
    g.gain.setValueAtTime(level, at);
    g.gain.exponentialRampToValueAtTime(SILENT, at + 1.3);
    o.connect(g);
    out(g, 1, 0.1);
  }

  function braam(at: number, root: number, level = 0.3) {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 2;
    lp.frequency.setValueAtTime(250, at);
    lp.frequency.exponentialRampToValueAtTime(2200, at + 0.12);
    lp.frequency.exponentialRampToValueAtTime(450, at + 1.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(SILENT, at);
    g.gain.exponentialRampToValueAtTime(level, at + 0.03);
    g.gain.exponentialRampToValueAtTime(SILENT, at + 1.8);
    for (const f of [root, root * 1.004, root * 2, root * 3, root * 2.996]) {
      osc("sawtooth", f, at, at + 1.9).connect(lp);
    }
    lp.connect(g);
    out(g, 1, 0.45);
    boom(at, 0.55);

    const hp = ctx.createBiquadFilter();
    hp.type = "lowpass";
    hp.frequency.value = 1200;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.25, at);
    ng.gain.exponentialRampToValueAtTime(SILENT, at + 0.35);
    noise(at, at + 0.4).connect(hp).connect(ng);
    out(ng, 1, 0.3);
  }

  function riser(at: number, dur: number) {
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 4;
    bp.frequency.setValueAtTime(300, at);
    bp.frequency.exponentialRampToValueAtTime(7000, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(SILENT, at);
    g.gain.exponentialRampToValueAtTime(0.3, at + dur);
    g.gain.exponentialRampToValueAtTime(SILENT, at + dur + 0.03);
    noise(at, at + dur + 0.05).connect(bp).connect(g);

    const tone = osc("sine", 180, at, at + dur + 0.05);
    tone.frequency.exponentialRampToValueAtTime(900, at + dur);
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(SILENT, at);
    tg.gain.exponentialRampToValueAtTime(0.06, at + dur);
    tg.gain.exponentialRampToValueAtTime(SILENT, at + dur + 0.03);
    tone.connect(tg);
    out(g, 1, 0.3);
    out(tg, 1, 0.3);
  }

  function whoosh(at: number, dur: number, from: number, to: number, level: number) {
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(from, at);
    bp.frequency.exponentialRampToValueAtTime(to, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(SILENT, at);
    g.gain.exponentialRampToValueAtTime(level, at + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(SILENT, at + dur);
    noise(at, at + dur + 0.05).connect(bp).connect(g);
    out(g, 1, 0.4);
  }

  function impact(at: number) {
    boom(at, 1);
    braam(at, 55, 0.35);

    // Crack
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2000;
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.45, at);
    cg.gain.exponentialRampToValueAtTime(SILENT, at + 0.18);
    noise(at, at + 0.2).connect(hp).connect(cg);
    out(cg, 1, 0.5);

    // Scythe "shing": inharmonic metal partials with a long ring
    [2093, 3136, 4186, 5274, 6645].forEach((f, i) => {
      const o = osc("sine", f, at, at + 2.4);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.09 / (i + 1), at);
      g.gain.exponentialRampToValueAtTime(SILENT, at + 2.2 - i * 0.25);
      o.connect(g);
      out(g, 0.6, 0.9);
    });
  }

  function pad(at: number, from: number, T: (t: number) => number) {
    const fadeOutAt = Math.max(T(6.3), at + 0.1);
    const endAt = Math.max(T(6.95), fadeOutAt + 0.2);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(SILENT, at);
    g.gain.exponentialRampToValueAtTime(0.2, at + (from > 4 ? 0.3 : 0.9));
    g.gain.setValueAtTime(0.2, fadeOutAt);
    g.gain.exponentialRampToValueAtTime(SILENT, endAt);
    for (const f of [110, 164.81, 220, 261.63]) {
      osc("sawtooth", f, at, endAt + 0.05).connect(lp);
      osc("sawtooth", f * 1.005, at, endAt + 0.05).connect(lp);
    }
    lp.connect(g);
    out(g, 0.5, 0.9);
  }

  function ping(at: number, f: number, level = 0.05) {
    const o = osc("sine", f, at, at + 1.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(level, at);
    g.gain.exponentialRampToValueAtTime(SILENT, at + 1.2);
    o.connect(g);
    out(g, 0.5, 1);
  }

  /* ---------- score ---------- */

  const SPARKLES: [number, number][] = [
    [4.15, 1760], [4.4, 2093], [4.62, 2349], [4.9, 2637], [5.15, 3136], [5.4, 2637], [5.7, 3520],
  ];

  function start(elapsed: number) {
    const now = ctx.currentTime + 0.05;
    const T = (t: number) => now + (t - elapsed);
    const ahead = (t: number) => t >= elapsed - 0.02;

    if (elapsed < 3.55) drone(now, elapsed);
    if (ahead(0.5)) shimmer(T(0.5));
    if (ahead(2.1)) braam(T(2.1), 55);
    if (ahead(3.0)) braam(T(3.0), 65.41);
    if (ahead(3.3)) riser(T(3.3), 0.45);
    if (ahead(3.6)) whoosh(T(3.6), 0.3, 6000, 500, 0.35);
    if (ahead(3.85)) impact(T(3.85));
    if (elapsed < 6.4) pad(T(Math.max(3.9, elapsed)), elapsed, T);
    for (const [t, f] of SPARKLES) if (ahead(t)) ping(T(t), f, 0.035);
    if (ahead(4.9)) {
      ping(T(4.9), 1760, 0.07);
      ping(T(4.9), 2637, 0.035);
    }
    if (ahead(6.3)) whoosh(T(6.3), 0.7, 3000, 200, 0.18);
  }

  function setMuted(muted: boolean) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(muted ? 0 : LEVEL, ctx.currentTime, 0.05);
  }

  let stopped = false;
  function stop(fade = 0.3) {
    if (stopped) return;
    stopped = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
    setTimeout(() => {
      for (const s of sources) {
        try {
          s.stop();
        } catch {
          /* already stopped */
        }
      }
      ctx.close().catch(() => {});
    }, fade * 1000 + 150);
  }

  return { ctx, start, setMuted, stop };
}
