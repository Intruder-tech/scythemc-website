/**
 * Painted 64x64 Minecraft skins (classic 4px arms), drawn in code so faces can change
 * expression at runtime (blink, happy).
 *
 * Shading follows how Minecraft skin artists work, so characters read as authentic
 * rather than flat:
 *  - every material has a 4-tone ramp (deep, shadow, base, highlight), hue-shifted:
 *    shadows lean cool, highlights lean warm
 *  - faces are lit from above: top faces brightest, sides a half-step down, backs and
 *    undersides darkest, lower rows of each face fall into shadow
 *  - cloth and hair get sparse 1px flecks for texture; skin stays smooth
 *  - hand-placed details (hair strands, folds, seams, pocket, laces) use fixed tones
 *  - overlay layers add 3D hair tufts, a hood, and raised sleeve cuffs
 */

export type Expression = "open" | "blink" | "happy";

type RGB = [number, number, number];
type Ramp = [RGB, RGB, RGB, RGB]; // deep, shadow, base, highlight

/** Base colours for a character; every ramp is generated from these. */
export interface Look {
  hoodie?: string;
  trim?: string;
  hair?: string;
  skin?: string;
  eyes?: string;
  jeans?: string;
}

const DEFAULT_LOOK: Required<Look> = {
  hoodie: "#1d3590",
  trim: "#0197fa",
  hair: "#573420",
  skin: "#d59672",
  eyes: "#05c8f0",
  jeans: "#283270",
};

/** Outfit + hair variants so each staff member reads as a different person. */
export const LOOKS = {
  founder: {} as Look,
  developer: { hoodie: "#262b45", trim: "#05e9fb", hair: "#211a1a", skin: "#c98a62", eyes: "#6b4a2b", jeans: "#1f2440" } as Look,
  helper: { hoodie: "#0a86e0", trim: "#e8eaf3", hair: "#c49a58", skin: "#e9b48c", eyes: "#2f8fd8", jeans: "#2d3a78" } as Look,
  manager: { hoodie: "#c99a06", trim: "#0238c7", hair: "#6a3018", skin: "#c98d64", eyes: "#5a3a22", jeans: "#232a52" } as Look,
};

/* ---------------- colour helpers ---------------- */

const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

function toHsl([r, g, b]: RGB): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function fromHsl(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** Move hue `h` toward `target` by up to `amt` degrees along the short way round. */
function toward(h: number, target: number, amt: number) {
  const d = ((target - h + 540) % 360) - 180;
  return h + Math.sign(d) * Math.min(Math.abs(d), amt);
}

/** Hue-shifted 4-tone ramp: shadows drift toward blue-violet, highlights toward warm yellow. */
function ramp(base: string): Ramp {
  const [h, s, l] = toHsl(hex(base));
  return [
    fromHsl(toward(h, 250, 12), s * 1.04, l * 0.62),
    fromHsl(toward(h, 250, 6), s * 1.02, l * 0.83),
    hex(base),
    fromHsl(toward(h, 50, 6), s * 0.96, l + (1 - l) * 0.22),
  ];
}

function noise(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

/* ---------------- palette keys ----------------
 * Each key = material + optional fixed tone (0 deep … 3 highlight).
 * No fixed tone means the tone comes from the face's lighting.
 */
type Mat = "skin" | "hair" | "hoodie" | "trim" | "jeans" | "shoe" | "gold" | "gem" | "eyes" | "white" | "mouth" | "sole" | "blush";
const KEYS: Record<string, { m: Mat; t?: number; tex?: boolean }> = {
  // skin
  S: { m: "skin" }, s: { m: "skin", t: 1 }, e: { m: "skin", t: 0 }, L: { m: "skin", t: 3 },
  P: { m: "blush", t: 2 },
  // hair (textured)
  H: { m: "hair", tex: true }, h: { m: "hair", t: 3 }, d: { m: "hair", t: 1 }, D: { m: "hair", t: 0 },
  // eyes / brows / mouth
  W: { m: "white", t: 3 }, Y: { m: "eyes", t: 3 }, Z: { m: "eyes", t: 1 }, E: { m: "hair", t: 0 },
  M: { m: "mouth", t: 1 }, m: { m: "mouth", t: 2 }, T: { m: "white", t: 3 },
  // hoodie (textured) + details
  O: { m: "hoodie", tex: true }, o: { m: "hoodie", t: 1 }, "0": { m: "hoodie", t: 0 }, Q: { m: "hoodie", t: 3 },
  A: { m: "trim" }, a: { m: "trim", t: 1 },
  G: { m: "gold", t: 2 }, I: { m: "gem", t: 3 }, B: { m: "gem", t: 1 },
  // jeans (textured), shoes
  J: { m: "jeans", tex: true }, j: { m: "jeans", t: 3 }, q: { m: "jeans", t: 1 },
  K: { m: "shoe" }, k: { m: "sole", t: 2 }, g: { m: "gold", t: 2 },
};

type Light = "front" | "side" | "back" | "top" | "bottom";
const LIGHT_OFFSET: Record<Light, number> = { top: 0.6, front: 0, side: -0.5, back: -0.9, bottom: -1.2 };

/* ---------------- face designs ---------------- */

/* Head front rows 2–7 (rows 0–1 are the fringe). Default is a calm closed-mouth smile. */
const FACE: Record<Expression, string[]> = {
  open: ["dEESSEEd", "SWYSSYWS", "SWZSSZWS", "SLSssSLS", "SSSmmSSS", "sSSSSSSs"],
  blink: ["dEESSEEd", "SSSSSSSS", "SEESSEES", "SLSssSLS", "SSSmmSSS", "sSSSSSSs"],
  // eyes soften (upper lid drops), cheeks lift with a hint of blush, mouth opens into a smile
  happy: ["dEESSEEd", "SEYSSYES", "SWZSSZWS", "SPSssSPS", "SSMTTMSS", "sSSmmSSs"],
};

export function drawFounderSkin(canvas: HTMLCanvasElement, expr: Expression = "open"): HTMLCanvasElement {
  return drawCharacterSkin(canvas, expr, LOOKS.founder);
}

export function drawCharacterSkin(canvas: HTMLCanvasElement, expr: Expression = "open", look: Look = {}): HTMLCanvasElement {
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(64, 64);
  const lk = { ...DEFAULT_LOOK, ...look };

  const RAMPS: Record<Mat, Ramp> = {
    skin: ramp(lk.skin),
    hair: ramp(lk.hair),
    hoodie: ramp(lk.hoodie),
    trim: ramp(lk.trim),
    jeans: ramp(lk.jeans),
    eyes: ramp(lk.eyes),
    shoe: ramp("#dfe2ee"),
    gold: ramp("#fcc604"),
    gem: ramp("#05c8f0"),
    white: ramp("#eceef6"),
    mouth: ramp("#b4614c"), // soft lip tone; tone 1 is the open-mouth shadow
    sole: ramp("#0b0e24"),
    blush: ramp("#e48a76"),
  };

  /** Paint rows of palette keys ('.' = transparent) with lighting for one face of a box. */
  const paint = (x0: number, y0: number, rows: string[], light: Light = "front") => {
    const h = rows.length;
    rows.forEach((row, j) => {
      [...row].forEach((ch, i) => {
        const key = KEYS[ch];
        if (!key) return;
        const x = x0 + i;
        const y = y0 + j;
        let tone: number;
        if (key.t !== undefined) {
          tone = key.t;
        } else {
          let t = 2 + LIGHT_OFFSET[light];
          if (key.tex) {
            // cloth/hair: lower quarter of each face falls into shadow
            if (h > 3 && j >= Math.ceil(h * 0.75)) t -= 1;
            // half-steps resolve as a sparse dither, the way pixel artists blend tones
            const frac = t - Math.floor(t);
            t = Math.floor(t) + (frac >= 0.5 && (x * 3 + y) % 4 === 0 ? 1 : 0);
            // hair: rare 1px highlight strands; cloth stays clean
            if (key.m === "hair" && noise(x, y) > 0.9) t += 1;
          } else {
            // skin and flat materials stay smooth; detail comes from hand-placed tones
            t = Math.round(t);
          }
          tone = t;
        }
        const c = RAMPS[key.m][Math.max(0, Math.min(3, tone))];
        const k = (y * 64 + x) * 4;
        img.data[k] = c[0];
        img.data[k + 1] = c[1];
        img.data[k + 2] = c[2];
        img.data[k + 3] = 255;
      });
    });
  };
  const block = (ch: string, w: number, h: number) => Array.from({ length: h }, () => ch.repeat(w));
  const mirror = (rows: string[]) => rows.map((r) => [...r].reverse().join(""));

  /* ---------------- HEAD ---------------- */
  paint(8, 8, ["dHhHHhHd", "HdLHHdLH", ...FACE[expr]], "front");
  const side = ["HhHHHhHd", "HHHdHHHH", "HHHHHdSS", "HHHdsSSS", "HHHesSSS", "HHdssSSS", "HdSSSSSs", "dsSSSsss"];
  paint(0, 8, side, "side");
  paint(16, 8, mirror(side), "side");
  paint(8, 0, ["HhHHdHhH", "HHhHHdHH", "dHHhHHhH", "HhHHhHHd", "HHdHHhHH", "hHHhHHdH", "HHhHdHHh", "HdHHhHHH"], "top");
  paint(16, 0, block("s", 8, 8), "bottom");
  paint(24, 8, ["HhHHdHhH", "HHhHHHdH", "HdHHhHHH", "HHHdHHhH", "hHHHHdHH", "dHhHHHHd", "DdHHdHdD", "sDsSSsDs"], "back");

  // Hat layer: hair tufts standing off the head for volume
  paint(40, 0, ["h.HhH.Hh", "HHh.HHhH", "hHHHhH.H", ".HhHHHhH", "HHHhH.HH", "hH.HHhHh", "HHhHHHH.", "H.HHhH.H"], "top");
  paint(40, 8, ["HhH.dHhH", "d.h..H.d", ...block(".", 8, 6)], "front");
  const hatSide = ["HhHHHhHH", "HHH.HH.H", "Hd.H....", "H.......", "d.......", ...block(".", 8, 3)];
  paint(32, 8, hatSide, "side");
  paint(48, 8, mirror(hatSide), "side");
  paint(56, 8, ["hHHhHHhH", "HHhHHhHH", "HhHHHHhH", "HHH.HHHH", "H.HH.HH.", ".D....D.", ...block(".", 8, 2)], "back");

  /* ---------------- BODY (hoodie) ---------------- */
  paint(20, 16, ["QQQQQQQQ", ...block("O", 8, 3)], "top"); // shoulders
  paint(28, 16, block("o", 8, 4), "bottom");
  paint(20, 20, [
    "oOQSSQOo", // hood collar + neck
    "oOWOOWOo", // drawstrings
    "oOWOOWOo",
    "oOGOOGOo", // gold aglets
    "oOOIIOOo", // gem emblem
    "oOOBBOOo",
    "oOOOOOOo",
    "oOooooOo", // pocket
    "oOOOOOOo",
    "oOOOOOOo",
    "oOooooOo",
    "AAAAAAAA", // hem
  ], "front");
  const bodySide = [...block("O", 4, 11), "AAAA"];
  paint(16, 20, bodySide, "side");
  paint(28, 20, mirror(bodySide), "side");
  paint(32, 20, ["oQQQQQQo", "QOOOOOOQ", "o0OOOO0o", "oo0000oo", ...block("O", 8, 7), "AAAAAAAA"], "back");
  // Jacket layer: hood resting on the back, raised collar at the front
  paint(32, 36, ["oQQQQQQo", "QOooooOQ", ".OOOOOO.", "..0000..", ...block(".", 8, 8)], "back");
  paint(20, 36, ["QQ....QQ", "o......o", ...block(".", 8, 10)], "front");

  /* ---------------- ARMS (sleeves, cuffs, hands) ---------------- */
  const sleeve = [...block("O", 4, 9), "AAAA", "SSSS", "ssss"];
  const arms = [
    { base: [40, 16], over: [40, 32] }, // right arm + its overlay
    { base: [32, 48], over: [48, 48] }, // left arm + its overlay
  ] as const;
  for (const { base: [x, y], over: [ox, oy] } of arms) {
    paint(x + 4, y, ["QQQQ", ...block("O", 4, 3)], "top");
    paint(x + 8, y, block("s", 4, 4), "bottom"); // palm
    paint(x, y + 4, sleeve, "side");
    paint(x + 4, y + 4, sleeve, "front");
    paint(x + 8, y + 4, sleeve, "side");
    paint(x + 12, y + 4, sleeve, "back");
    // raised cuff on the overlay layer
    const cuff = [...block(".", 4, 8), "aaaa", "AAAA", ...block(".", 4, 2)];
    for (let f = 0; f < 4; f++) paint(ox + f * 4, oy + 4, cuff, (["side", "front", "side", "back"] as Light[])[f]);
  }

  /* ---------------- LEGS (jeans, sneakers) ---------------- */
  const leg = [...block("J", 4, 9), "KKKK", "KggK", "kkkk"];
  for (const [x, y] of [
    [0, 16],
    [16, 48],
  ] as const) {
    paint(x + 4, y, block("J", 4, 4), "top");
    paint(x + 8, y, block("k", 4, 4), "bottom");
    paint(x, y + 4, leg, "side");
    paint(x + 4, y + 4, leg, "front");
    paint(x + 8, y + 4, mirror(leg), "side");
    paint(x + 12, y + 4, leg, "back");
  }

  ctx.putImageData(img, 0, 0);
  return canvas;
}

/**
 * Cape in the logo colours, painted as an HD cape (8x = 512x256) so a logo can sit on it
 * crisply: royal cloth, gold border, and either the SCYTHE MC logo (outer side, seen from
 * behind) or a pixel scythe crescent. Each cape texel is an 8x8 block, so the cloth keeps
 * the Minecraft pixel look.
 */
export function drawCape(canvas: HTMLCanvasElement, logo?: CanvasImageSource, clothColor = "#0238c7"): HTMLCanvasElement {
  const S = 8;
  canvas.width = 64 * S;
  canvas.height = 32 * S;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  const cloth = ramp(clothColor);
  const gold = ramp("#fcc604");
  const blade = ramp("#05e9fb");
  const put = (x: number, y: number, [r, g, b]: RGB) => {
    ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
    ctx.fillRect(x * S, y * S, S, S);
  };
  const crescent = new Set(["3,3", "4,3", "5,3", "6,3", "2,4", "7,4", "7,5", "8,5", "8,6", "8,7", "7,8", "4,6", "5,7", "5,8", "5,9", "5,10", "5,11", "5,12", "4,13"]);
  /** One 10x16 cape side. */
  const face = (x0: number, y0: number, dim: number, emblem: boolean) => {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 10; x++) {
        const tone = Math.max(0, Math.min(3, 2 - dim - (y > 11 ? 1 : 0) + (y < 2 ? 1 : 0)));
        const edge = x === 0 || x === 9 || y === 15;
        if (emblem && crescent.has(`${x},${y}`)) put(x0 + x, y0 + y, blade[y < 9 ? 3 : 1]);
        else put(x0 + x, y0 + y, edge ? gold[Math.max(1, tone)] : cloth[tone]);
      }
    }
  };
  face(1, 1, 0, !logo); // outer side (faces away from the player's back)
  face(12, 1, 1, true); // inner side
  for (let y = 1; y < 17; y++) {
    put(0, y, gold[1]);
    put(11, y, gold[1]);
  }
  for (let x = 1; x < 11; x++) {
    put(x, 0, cloth[3]);
    put(x + 10, 0, cloth[0]);
  }
  if (logo) {
    // Logo across the upper back of the cape, inside the gold border.
    const size = 8 * S; // 8 texels wide
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(logo, 2 * S, 2.5 * S, size, size);
  }
  return canvas;
}
