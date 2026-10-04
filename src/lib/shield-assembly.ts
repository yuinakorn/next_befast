/** Pure maths for the chapter 7 shield assembly scene (ShieldStage) and checklist (ShieldChecklist). */
import { windowProgress, type Point } from "./prevent-scene.ts";
import { SHIELD_DISEASE_COUNT, SHIELD_PIECE_COUNT } from "./shield.ts";

/** Behaviours = shield pieces 4–9. Habit `i` (0-based, as in CHAPTER_7.steps) fills piece `4 + i`. */
export const HABIT_COUNT = SHIELD_PIECE_COUNT - SHIELD_DISEASE_COUNT;

/** Where the shield (200×240 units) sits in the scene's 400×320 box: centred. */
export const SHIELD_AT = { x: 105, y: 38, scale: 0.95 } as const;

/** Centre of each behaviour's slot, in shield units (index 0 = piece 4). Fixed by the piece geometry in shield.ts. */
export const HABIT_SLOTS: readonly Point[] = [
  { x: 44, y: 118 },
  { x: 100, y: 118 },
  { x: 156, y: 118 },
  { x: 54, y: 173 },
  { x: 100, y: 190 },
  { x: 146, y: 173 },
];

/** Share of a step's scroll over which its icon travels to the slot; it rests there afterwards. */
export const MOVE_WINDOW = [0.1, 0.62] as const;
/** Icon scale: large when it introduces itself, small once it sits on its piece. */
export const START_SCALE = 1.3;
export const DOCKED_SCALE = 0.8;
/** Where an icon waits before it travels: left of the shield for even habits, right for odd ones. */
const START_Y = 160;
const START_X = { left: 54, right: 346 } as const;

export const slotInScene = (habit: number): Point => ({
  x: SHIELD_AT.x + HABIT_SLOTS[habit].x * SHIELD_AT.scale,
  y: SHIELD_AT.y + HABIT_SLOTS[habit].y * SHIELD_AT.scale,
});

export const startInScene = (habit: number): Point => ({ x: habit % 2 === 0 ? START_X.left : START_X.right, y: START_Y });

/** Smooth start and stop (0–1 in, 0–1 out). */
export const ease = (t: number): number => t * t * (3 - 2 * t);

export type IconPose = Point & {
  scale: number;
  /** Visible at all: icons of later steps stay hidden. */
  shown: boolean;
  /** Arrived in its slot, so its piece is lit. */
  docked: boolean;
};

/**
 * Pose of habit `habit`'s icon while step `step` is active and `t` (0–1) of that step has scrolled.
 * Earlier habits sit in their slots, later ones are hidden. With reduced motion nothing travels:
 * the icon is in its slot as soon as its step starts.
 */
export function iconPose(habit: number, step: number, t: number, reduce: boolean): IconPose {
  const start = startInScene(habit);
  const slot = slotInScene(habit);
  if (habit > step) return { ...start, scale: START_SCALE, shown: false, docked: false };
  const travel = habit < step || reduce ? 1 : windowProgress(t, ...MOVE_WINDOW);
  const e = ease(travel);
  return {
    x: start.x + (slot.x - start.x) * e,
    y: start.y + (slot.y - start.y) * e,
    scale: START_SCALE + (DOCKED_SCALE - START_SCALE) * e,
    shown: true,
    docked: travel >= 1,
  };
}

/** How many shield pieces are lit (the first n): the 4 diseases from chapter 6, plus each habit that has arrived. */
export function litPieces(step: number, t: number, reduce: boolean): number {
  const arrived = reduce || t >= MOVE_WINDOW[1];
  return SHIELD_DISEASE_COUNT + Math.min(HABIT_COUNT, step + (arrived ? 1 : 0));
}

/* ---- checklist ---- */

/** Adds `index` to the ticked list, or removes it if it is already there. The result is sorted. */
export function toggleIndex(ticked: readonly number[], index: number): number[] {
  const next = ticked.includes(index) ? ticked.filter((i) => i !== index) : [...ticked, index];
  return next.sort((a, b) => a - b);
}

export type ChecklistStatus = "empty" | "some" | "complete";

/** Which message the checklist shows: nothing until one item is ticked, encouragement, then the finish. */
export function checklistStatus(count: number, total: number): ChecklistStatus {
  if (count <= 0) return "empty";
  return count >= total ? "complete" : "some";
}
