/** Pure maths for the chapter 8 scene (RememberStage): monitor, calendar, shelf and family. */
import { cubicPoint, windowProgress, type Point } from "./prevent-scene.ts";
import { ease } from "./shield-assembly.ts";

/* ---- step 0: blood-pressure monitor ---- */

/**
 * The figures the monitor counts up to. They only make the picture read as a blood-pressure
 * monitor; they are not a target. The copy sends readers to their doctor for their own target.
 */
export const BP_READING = { sys: 120, dia: 80 } as const;
/** Share of the step's scroll over which the numbers climb; the rest lets them rest on the reading. */
export const BP_WINDOW = [0.05, 0.8] as const;

export type BpReading = { sys: number; dia: number };

/** Numbers on the monitor at `t` (0–1 through step 0). Reduced motion shows the reading at once. */
export function bpAt(t: number, reduce: boolean): BpReading {
  const w = reduce ? 1 : windowProgress(t, ...BP_WINDOW);
  return { sys: Math.round(w * BP_READING.sys), dia: Math.round(w * BP_READING.dia) };
}

/* ---- step 1: calendar ---- */

export const MONTH_COUNT = 12;
export const THAI_MONTHS: readonly string[] = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
/** Any year works for a drawing; it is never shown. */
export const CAL_YEAR = 2026;
export const CAL_COLS = 7;
export const CAL_ROWS = 6;
/** The page the calendar ends on and the day that gets circled. */
export const CHECKUP = { month: MONTH_COUNT - 1, day: 15 } as const;
/** Share of the step's scroll over which the pages flip; the circle is drawn once they stop. */
export const FLIP_WINDOW = [0.05, 0.72] as const;
export const CIRCLE_AT = 0.78;

/** Month index (0 = January … 11) showing at `t` (0–1 through step 1). Reduced motion shows the last page. */
export function monthAt(t: number, reduce: boolean): number {
  if (reduce) return MONTH_COUNT - 1;
  return Math.min(MONTH_COUNT - 1, Math.floor(windowProgress(t, ...FLIP_WINDOW) * MONTH_COUNT));
}

/** The 6×7 grid of a month, Sunday first: day numbers, `null` for blank cells. */
export function monthGrid(year: number, month: number): (number | null)[] {
  const offset = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: CAL_COLS * CAL_ROWS }, (_, i) => {
    const day = i - offset + 1;
    return day >= 1 && day <= days ? day : null;
  });
}

/** Row and column (0-based) of `day` in the grid returned by `monthGrid`. */
export function cellOf(year: number, month: number, day: number): { row: number; col: number } {
  const i = monthGrid(year, month).indexOf(day);
  return { row: Math.floor(i / CAL_COLS), col: i % CAL_COLS };
}

/** The check-up day is circled once the pages have stopped flipping. */
export const circled = (t: number, reduce: boolean): boolean => reduce || t >= CIRCLE_AT;

/* ---- step 2: shelf ---- */

/** The bottle comes down onto the shelf, then the "no" sign is drawn over the unverified jar. */
export const BOTTLE_WINDOW = [0.05, 0.5] as const;
export const SIGN_WINDOW = [0.56, 0.9] as const;
/** Where the bottle starts: this far above the shelf (scene units), tilted this many degrees. */
export const BOTTLE_LIFT = 74;
export const BOTTLE_TILT = -16;

export type BottlePose = { lift: number; tilt: number };

export function bottlePose(t: number, reduce: boolean): BottlePose {
  const rest = reduce ? 0 : 1 - ease(windowProgress(t, ...BOTTLE_WINDOW));
  // `rest` is exactly 0 once the bottle has landed; keep the tilt a plain 0 rather than -0
  return { lift: rest * BOTTLE_LIFT, tilt: rest === 0 ? 0 : rest * BOTTLE_TILT };
}

/** 0–1: how much of the prohibition sign is drawn. */
export const signProgress = (t: number, reduce: boolean): number => (reduce ? 1 : windowProgress(t, ...SIGN_WINDOW));

/** The sign is a ring and a slash; the ring is drawn first, the slash finishes it. Both 0–1. */
export function signStrokes(sign: number): { ring: number; slash: number } {
  return { ring: windowProgress(sign, 0, 0.6), slash: windowProgress(sign, 0.5, 1) };
}

/* ---- step 3: family ---- */

/** Hearts, in scene units (viewBox 400×320). The person is drawn around their heart. */
export const SELF_HEART: Point = { x: 200, y: 176 };
/** Father, mother, child, elderly person: the light reaches them in this order. */
export const FAMILY_HEARTS: readonly Point[] = [
  { x: 70, y: 100 },
  { x: 330, y: 100 },
  { x: 70, y: 252 },
  { x: 330, y: 252 },
];
export const LIGHT_WINDOWS: readonly (readonly [number, number])[] = [
  [0.08, 0.38],
  [0.26, 0.56],
  [0.44, 0.74],
  [0.62, 0.92],
];
const ROUTE_BEND = 0.18;

/** Progress (0–1) of the light travelling to family member `i`. Reduced motion: already there. */
export function lightProgress(t: number, i: number, reduce: boolean): number {
  return reduce ? 1 : windowProgress(t, ...LIGHT_WINDOWS[i]);
}

/** Cubic route from `from` to `to`, bowed sideways by a share of its length so the four routes do not overlap. */
export function lightRoute(from: Point, to: Point, bend: number = ROUTE_BEND): [Point, Point, Point, Point] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const nx = -dy * bend;
  const ny = dx * bend;
  return [
    from,
    { x: from.x + dx / 3 + nx, y: from.y + dy / 3 + ny },
    { x: from.x + (2 * dx) / 3 + nx, y: from.y + (2 * dy) / 3 + ny },
    to,
  ];
}

/** Position of the light on `route` at `p` (0–1). */
export function lightPoint(route: readonly [Point, Point, Point, Point], p: number): Point {
  return cubicPoint(route[0], route[1], route[2], route[3], p);
}

export const familyRoutes = (): [Point, Point, Point, Point][] => FAMILY_HEARTS.map((h) => lightRoute(SELF_HEART, h));
