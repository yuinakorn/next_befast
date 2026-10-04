/** Chapter 1 "brain city" map in a 400×360 SVG box. */
export type Point = readonly [number, number];
export type DistrictId = "frontal" | "parietal" | "occipital" | "temporal";
export type Road = { from: Point; c1: Point; c2: Point; to: Point };
export type Light = { x: number; y: number; district: DistrictId };

/** Front-facing brain silhouette used only by chapter 1. */
export const CITY_BRAIN_PATH =
  "M200,48 C178,27 139,31 116,58 C84,54 64,76 62,105 C37,115 26,143 39,169 " +
  "C22,192 31,223 57,239 C52,266 79,286 109,279 C124,304 163,306 187,284 " +
  "C196,276 199,260 200,244 C201,260 204,276 213,284 C237,306 276,304 291,279 " +
  "C321,286 348,266 343,239 C369,223 378,192 361,169 C374,143 363,115 338,105 " +
  "C336,76 316,54 284,58 C261,31 222,27 200,48 Z";

/** Polygon slightly inside CITY_BRAIN_PATH, used to keep cellular lights off the outline. */
export const BRAIN_OUTLINE: readonly Point[] = [
  [200, 52], [170, 39], [140, 44], [116, 66], [88, 64], [70, 86], [68, 111], [45, 124],
  [36, 148], [46, 169], [34, 194], [44, 219], [64, 232], [60, 257], [83, 277], [109, 271],
  [127, 294], [160, 298], [185, 278], [200, 248], [215, 278], [240, 298], [273, 294], [291, 271],
  [317, 277], [340, 257], [336, 232], [356, 219], [366, 194], [354, 169], [364, 148], [355, 124],
  [332, 111], [330, 86], [312, 64], [284, 66], [260, 44], [230, 39],
];

/** Four readable territories. Earlier entries win where polygons touch. */
export const DISTRICTS: Record<DistrictId, readonly Point[]> = {
  frontal: [[24, 28], [198, 28], [198, 188], [160, 170], [120, 178], [78, 160], [24, 188]],
  parietal: [[202, 28], [376, 28], [376, 184], [330, 168], [282, 182], [240, 166], [202, 184]],
  occipital: [[202, 184], [240, 166], [282, 182], [330, 168], [376, 184], [376, 330], [202, 330]],
  temporal: [[24, 188], [78, 160], [120, 178], [160, 170], [198, 188], [198, 330], [24, 330]],
};

/** Blood vessels as roads: one central trunk with four deliberate branches. */
export const ROADS = {
  trunk: { from: [200, 360], c1: [200, 330], c2: [200, 282], to: [200, 250] },
  frontal: { from: [200, 250], c1: [174, 236], c2: [137, 215], to: [96, 184] },
  parietal: { from: [200, 250], c1: [188, 199], c2: [166, 137], to: [143, 82] },
  temporal: { from: [200, 250], c1: [226, 236], c2: [263, 218], to: [294, 194] },
  occipital: { from: [200, 250], c1: [235, 220], c2: [292, 186], to: [329, 139] },
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
  { text: "การพูด", at: [91, 169] as Point },
  { text: "การขยับแขน", at: [126, 112] as Point },
] as const;
