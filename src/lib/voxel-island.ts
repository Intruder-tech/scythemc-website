import type * as THREE_NS from "three";

type THREE = typeof THREE_NS;

/**
 * A floating Minecraft-style island in the Scythe palette, built from 16-unit blocks
 * (the same scale as skinview3d players: a player is 2 blocks tall).
 * The top surface sits at local y = 0 so players can stand on it.
 */

const S = 16; // block size in world units

/* ---------------- 16x16 pixel textures, painted in code ---------------- */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function texture(three: THREE, paint: (ctx: CanvasRenderingContext2D, r: () => number) => void, seed: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 16;
  const ctx = c.getContext("2d")!;
  paint(ctx, rng(seed));
  const t = new three.CanvasTexture(c);
  t.magFilter = three.NearestFilter;
  t.minFilter = three.NearestFilter;
  t.colorSpace = three.SRGBColorSpace;
  return t;
}

const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
};

/** Glowing azure moss: the island's grass. */
const mossTop = (ctx: CanvasRenderingContext2D, r: () => number) => {
  const tones = ["#0b2a8f", "#0238c7", "#0b4fd8", "#0197fa"];
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const v = r();
      dot(ctx, x, y, v > 0.97 ? "#05e9fb" : tones[Math.min(3, Math.floor(v * 4.2))]);
    }
};

/** Deepslate, with horizontal strata like the real block. */
const deepslate = (ctx: CanvasRenderingContext2D, r: () => number) => {
  const tones = ["#262b45", "#30365a", "#3b426c", "#4a5283"];
  for (let y = 0; y < 16; y++) {
    const band = y % 4 === 0 ? -1 : 0;
    for (let x = 0; x < 16; x++) {
      const i = Math.max(0, Math.min(3, Math.floor(r() * 3.4) + 1 + band));
      dot(ctx, x, y, tones[i]);
    }
  }
};

/** Side of a top block: deepslate with moss drips over the upper rows. */
const mossSide = (ctx: CanvasRenderingContext2D, r: () => number) => {
  deepslate(ctx, r);
  const tones = ["#0238c7", "#0b4fd8", "#0197fa"];
  for (let x = 0; x < 16; x++) {
    const drip = 3 + Math.floor(r() * 3);
    for (let y = 0; y < drip; y++) dot(ctx, x, y, tones[Math.floor(r() * 3)]);
  }
};

/** Sea-lantern-like cyan light block. */
const lantern = (ctx: CanvasRenderingContext2D, r: () => number) => {
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const edge = x === 0 || y === 0 || x === 15 || y === 15;
      const ring = x === 3 || y === 3 || x === 12 || y === 12;
      dot(ctx, x, y, edge ? "#7fe9f5" : ring ? "#c9fbff" : r() > 0.5 ? "#05e9fb" : "#3ff0fc");
    }
};

/** Gold block. */
const gold = (ctx: CanvasRenderingContext2D, r: () => number) => {
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const edge = x === 0 || y === 0 || x === 15 || y === 15;
      dot(ctx, x, y, edge ? "#c98a03" : r() > 0.85 ? "#fff3a3" : r() > 0.4 ? "#fcc604" : "#fde518");
    }
};

/* ---------------- island layout ---------------- */

type Kind = "top" | "stone" | "lantern" | "gold";

function layout(): { x: number; y: number; z: number; kind: Kind }[] {
  const blocks: { x: number; y: number; z: number; kind: Kind }[] = [];
  const r = rng(7);
  // Each layer is an ellipse that shrinks with depth (inverted cone = floating island)
  const layers = [
    { y: 0, rx: 4.6, rz: 3.3 },
    { y: -1, rx: 3.8, rz: 2.6 },
    { y: -2, rx: 2.9, rz: 1.9 },
    { y: -3, rx: 1.9, rz: 1.2 },
    { y: -4, rx: 1.0, rz: 0.7 },
  ];
  for (const L of layers) {
    for (let x = -5; x <= 5; x++)
      for (let z = -4; z <= 4; z++) {
        const d = (x / L.rx) ** 2 + (z / L.rz) ** 2;
        if (d > 1) continue;
        // ragged edges on lower layers
        if (L.y < 0 && d > 0.7 && r() < 0.35) continue;
        let kind: Kind = L.y === 0 ? "top" : "stone";
        if (L.y < 0 && d > 0.55 && r() < 0.12) kind = "lantern";
        blocks.push({ x, y: L.y, z, kind });
      }
  }
  // decorations standing on the surface (away from where the founders stand)
  blocks.push({ x: -4, y: 1, z: -1, kind: "lantern" });
  blocks.push({ x: 4, y: 1, z: 1, kind: "lantern" });
  blocks.push({ x: 0, y: 1, z: -3, kind: "gold" });
  blocks.push({ x: 1, y: 1, z: -3, kind: "gold" });
  blocks.push({ x: 0, y: 2, z: -3, kind: "gold" });
  return blocks;
}

export interface Island {
  group: THREE_NS.Group;
  /** World-space spots for small lights so lanterns cast a cyan glow. */
  lights: THREE_NS.Vector3[];
  dispose(): void;
}

export function buildIsland(three: THREE): Island {
  const group = new three.Group();
  const geo = new three.BoxGeometry(S, S, S);

  const tex = {
    top: texture(three, mossTop, 11),
    side: texture(three, mossSide, 12),
    stone: texture(three, deepslate, 13),
    lantern: texture(three, lantern, 14),
    gold: texture(three, gold, 15),
  };
  const lambert = (map: THREE_NS.Texture) => new three.MeshLambertMaterial({ map });
  const stoneMat = lambert(tex.stone);
  const sideMat = lambert(tex.side);
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z
  const materials: Record<Kind, THREE_NS.Material | THREE_NS.Material[]> = {
    top: [sideMat, sideMat, lambert(tex.top), stoneMat, sideMat, sideMat],
    stone: stoneMat,
    lantern: new three.MeshBasicMaterial({ map: tex.lantern }), // unlit = glows
    gold: lambert(tex.gold),
  };

  const blocks = layout();
  const lights: THREE_NS.Vector3[] = [];
  const m = new three.Matrix4();
  for (const kind of Object.keys(materials) as Kind[]) {
    const list = blocks.filter((b) => b.kind === kind);
    if (!list.length) continue;
    const mesh = new three.InstancedMesh(geo, materials[kind], list.length);
    list.forEach((b, i) => {
      m.makeTranslation(b.x * S, b.y * S - S / 2, b.z * S);
      mesh.setMatrixAt(i, m);
      if (kind === "lantern" && b.y > 0) lights.push(new three.Vector3(b.x * S, b.y * S - S / 2, b.z * S));
    });
    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);
  }

  return {
    group,
    lights,
    dispose() {
      geo.dispose();
      Object.values(tex).forEach((t) => t.dispose());
      Object.values(materials)
        .flat()
        .forEach((mat) => mat.dispose());
    },
  };
}
