/** Chapter 1 "brain city" map in a 400×320 SVG box (same coordinates as BRAIN_PATH in dot-brain.ts). */
export type Point = readonly [number, number];
export type DistrictId = "frontal" | "parietal" | "occipital" | "temporal";
export type Road = { from: Point; c1: Point; c2: Point; to: Point };
export type Light = { x: number; y: number; district: DistrictId };

/** Polygon slightly inside BRAIN_PATH, used to keep window lights off the outline. */
export const BRAIN_OUTLINE: readonly Point[] = [
  [80, 168], [78, 128], [98, 88], [132, 60], [170, 44], [215, 38], [260, 42], [298, 60], [330, 82],
  [346, 116], [344, 152], [330, 180], [306, 196], [300, 214], [282, 226], [250, 234], [222, 226],
  [190, 230], [150, 230], [114, 216], [90, 196],
];

/** City districts (rough lobes). Earlier entries win where polygons overlap. */
export const DISTRICTS: Record<DistrictId, readonly Point[]> = {
  frontal: [[60, 40], [170, 30], [165, 120], [150, 240], [60, 240]],
  parietal: [[170, 30], [290, 30], [270, 115], [165, 120]],
  occipital: [[290, 30], [380, 40], [380, 200], [306, 196], [270, 115]],
  temporal: [[165, 120], [270, 115], [306, 196], [282, 232], [150, 240]],
};

/** Blood vessels as roads: a trunk up from the neck that branches into each district. */
export const ROADS = {
  trunk: { from: [206, 320], c1: [206, 296], c2: [208, 268], to: [210, 244] },
  frontal: { from: [210, 244], c1: [188, 218], c2: [150, 200], to: [112, 168] },
  parietal: { from: [210, 244], c1: [214, 196], c2: [220, 140], to: [226, 76] },
  temporal: { from: [210, 244], c1: [232, 232], c2: [252, 218], to: [268, 198] },
  occipital: { from: [210, 244], c1: [252, 220], c2: [300, 196], to: [332, 146] },
} satisfies Record<string, Road>;

export function pointInPolygon([x, y]: Point, poly: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Window lights on a staggered grid, kept where they fall inside the brain and a district. */
export function cityLights(spacing = 18): Light[] {
  const lights: Light[] = [];
  const ids = Object.keys(DISTRICTS) as DistrictId[];
  for (let row = 1; row * spacing < 320; row++) {
    const y = row * spacing;
    const offset = row % 2 ? spacing / 2 : 0;
    for (let x = spacing / 2 + offset; x < 400; x += spacing) {
      if (!pointInPolygon([x, y], BRAIN_OUTLINE)) continue;
      const district = ids.find((id) => pointInPolygon([x, y], DISTRICTS[id]));
      if (district) lights.push({ x, y, district });
    }
  }
  return lights;
}

export function roadD(r: Road): string {
  return `M${r.from.join(",")} C${r.c1.join(",")} ${r.c2.join(",")} ${r.to.join(",")}`;
}

/** Point at `t` (0–1) along a road's cubic Bézier. */
export function pointOnRoad(r: Road, t: number): Point {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * r.from[i] + 3 * u * u * t * r.c1[i] + 3 * u * t * t * r.c2[i] + t * t * t * r.to[i];
  return [f(0), f(1)];
}

/** Where the clot sticks on the frontal road (step 4) and the blood cells backed up behind it. */
export const CLOT_T = 0.55;
export const CLOT_AT = pointOnRoad(ROADS.frontal, CLOT_T);
export const QUEUE_AT: readonly Point[] = [0.47, 0.4, 0.33].map((t) => pointOnRoad(ROADS.frontal, t));
/** Where the occipital road bursts (step 5). */
export const BLEED_AT = pointOnRoad(ROADS.occipital, 0.85);

/** Functions lost when the frontal district goes dark (step 3). */
export const LABELS = [
  { text: "การพูด", at: [104, 150] as Point },
  { text: "การขยับแขน", at: [132, 104] as Point },
] as const;
