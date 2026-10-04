/** Pure maths for the chapter 6 prevention scene (PreventStage). */

/** Progress (0–1) of `t` through the window [from, to], clamped. */
export function windowProgress(t: number, from: number, to: number): number {
  return Math.min(1, Math.max(0, (t - from) / (to - from)));
}

/** Whole number shown by a count-up that reaches `target` at the end of the window. */
export function countUp(t: number, target: number, from: number, to: number): number {
  return Math.round(windowProgress(t, from, to) * target);
}

/** How many of `count` pieces are lit at `t`: none before the window starts, all once it ends. */
export function piecesLit(t: number, count: number, from: number, to: number): number {
  return Math.ceil(windowProgress(t, from, to) * count);
}

export type Point = { x: number; y: number };

/** Point at `t` (0–1) on a cubic Bézier curve. */
export function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

/** Radius offset (-1…1) of the k-th point of a rough ring; fixed, so server and client agree. */
const wobble = (k: number) => 0.6 * Math.sin(k * 2.399) + 0.4 * Math.sin(k * 5.1 + 1);

/** Closed polygon path around (0, 0) with a deterministic jagged radius `base ± amp`. */
export function roughRing(base: number, amp: number, points: number): string {
  const pts = Array.from({ length: points }, (_, k) => {
    const a = (k / points) * Math.PI * 2;
    const r = base + amp * wobble(k);
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join(" L")} Z`;
}
