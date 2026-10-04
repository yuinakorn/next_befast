/** Side-view brain silhouette in a 400×300 box (frontal lobe left, cerebellum and brainstem bottom right). */
export const BRAIN_VIEWBOX = { width: 400, height: 300 } as const;
export const BRAIN_PATH =
  "M70,170 C55,120 85,62 150,48 C190,30 250,32 295,55 C340,72 362,112 352,150 C346,176 330,190 312,196 " +
  "C318,214 304,232 282,232 C266,246 236,246 222,232 L216,262 C214,272 200,274 196,264 L192,236 " +
  "C160,240 128,236 106,222 C82,210 74,192 70,170 Z";

export type Dot = { x: number; y: number; r: number; order: number };

/** Small deterministic PRNG so the dot layout is identical on every visit. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Places `count` dots inside the shape tested by `isInside` (BRAIN_VIEWBOX coordinates).
 * `order` is a random rank 0..count-1: a dot stays lit while order < litCount(lit, count).
 */
export function generateDots(count: number, seed: number, isInside: (x: number, y: number) => boolean): Dot[] {
  const rand = mulberry32(seed);
  const dots: Dot[] = [];
  for (let guard = 0; dots.length < count && guard < count * 50; guard++) {
    const x = rand() * BRAIN_VIEWBOX.width;
    const y = rand() * BRAIN_VIEWBOX.height;
    if (isInside(x, y)) dots.push({ x, y, r: 1.4 + rand() * 1.4, order: 0 });
  }
  const ranks = dots.map((_, i) => i);
  for (let i = ranks.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  dots.forEach((d, i) => {
    d.order = ranks[i];
  });
  return dots;
}

/** Number of dots that stay lit for a 0–1 `lit` value. */
export function litCount(lit: number, total: number): number {
  return Math.round(Math.min(1, Math.max(0, lit)) * total);
}

/** The closing relights the brain that the opening dimmed: `min` of the dots at progress 0, all of them at 1. */
export function relit(progress: number, min: number): number {
  return min + (1 - min) * Math.min(1, Math.max(0, progress));
}
