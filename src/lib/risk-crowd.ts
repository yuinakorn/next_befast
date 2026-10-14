/** Pure maths for chapter 2's "1 ใน 4": the four people zoom out into a crowd of 40, ten of them red. */
import { ease } from "./shield-assembly.ts";

export const COLS = 10;
export const ROWS = 4;
export const CROWD = COLS * ROWS;
/** Where the four people stand before the zoom (scene x, y; the scene is 400×320). */
export const PEOPLE_X = [80, 160, 240, 320] as const;
export const PEOPLE_Y = 150;
export const CROWD_SCALE = 0.36;

/** Crowd slot of each of the four people: row 1, spread across. */
export const PERSON_SLOT = [11, 13, 16, 18] as const;
/** Red slots besides the chosen person's: nine, scattered, none of them one of the four. */
const OTHER_RED = [2, 7, 9, 20, 24, 27, 31, 35, 38] as const;

export const slotAt = (slot: number) => ({
  x: 200 + ((slot % COLS) - (COLS - 1) / 2) * 36,
  y: 66 + Math.floor(slot / COLS) * 46,
});

/** The ten red slots for this visit: the chosen person's, plus nine fixed ones (1 in 4 of 40). */
export function redSlots(chosen: number): number[] {
  return [PERSON_SLOT[chosen], ...OTHER_RED];
}

/** Share of step 0's scroll over which the view zooms out; before it, the four stand alone. */
export const ZOOM_WINDOW = [0.4, 0.8] as const;

/** Zoom (0–1) at `t` through step 0. Reduced motion: the crowd appears at once halfway through. */
export function crowdZoom(t: number, reduce: boolean): number {
  if (reduce) return t >= (ZOOM_WINDOW[0] + ZOOM_WINDOW[1]) / 2 ? 1 : 0;
  const [a, b] = ZOOM_WINDOW;
  return ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
}

/** Pose of one of the four people as the view zooms out: from its own spot to its crowd slot. */
export function personPose(i: number, zoom: number) {
  const to = slotAt(PERSON_SLOT[i]);
  return {
    x: PEOPLE_X[i] + (to.x - PEOPLE_X[i]) * zoom,
    y: PEOPLE_Y + (to.y - PEOPLE_Y) * zoom,
    scale: 1 + (CROWD_SCALE - 1) * zoom,
  };
}

/** Opacity of crowd slot `slot` (not one of the four): the crowd fills in from the middle outwards. */
export function crowdOpacity(slot: number, zoom: number): number {
  const { x } = slotAt(slot);
  const delay = (Math.abs(x - 200) / 162) * 0.5;
  return Math.min(1, Math.max(0, (zoom - delay) / 0.5));
}
