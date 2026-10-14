/** Pure maths for the closing recap scene (RecapStage) and the image it saves (recap-poster.ts). */
import { windowProgress, type Point } from "./prevent-scene.ts";
import { ease } from "./shield-assembly.ts";
import { SHIELD_PIECE_COUNT } from "./shield.ts";

/** The three pictures, in step order: BEFAST → 1669, the 270-minute ring, the 90% shield. */
export const RECAP_ITEMS = 3;
/** The step after the three sentences, where the pictures sit side by side. */
export const POSTER_STEP = RECAP_ITEMS;
export const BEFAST = ["B", "E", "F", "A", "S", "T"] as const;
/** Thrombolysis window in minutes (4.5 h), the figure the ring counts up to. */
export const WINDOW_MINUTES = 270;
/** The figure in the prevention headline ("ป้องกันได้ถึง 90%"). */
export const PREVENTABLE = 90;

export type Pose = Point & { scale: number };

/**
 * Each picture is drawn around (0, 0) inside a 120×150 box and placed in the 400×320 scene at one of
 * three poses: large in the middle while its sentence is up (hero), small in the tray along the bottom
 * once explained (tray), and in its column of the final three-across board (poster).
 */
export const HERO: Pose = { x: 200, y: 122, scale: 1.45 };
export const trayPose = (i: number): Pose => ({ x: 110 + 90 * i, y: 282, scale: 0.36 });
export const posterPose = (i: number): Pose => ({ x: 68 + 132 * i, y: 136, scale: 0.95 });

/** Share of a step's scroll over which pictures change place; they rest for the rest of it. */
export const MOVE = 0.22;
/** Share of a picture's own step (after it has arrived) over which it builds itself. */
const BUILD_END = 0.85;

const mix = (a: Pose, b: Pose, t: number): Pose => {
  const k = ease(t);
  if (k >= 1) return b; // exact end pose, no rounding drift
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, scale: a.scale + (b.scale - a.scale) * k };
};

export type ItemState = Pose & {
  /** Visible at all: pictures of later steps are only an empty tray slot. */
  shown: boolean;
  /** How far the picture has drawn itself (0–1). */
  build: number;
};

/**
 * State of picture `i` while step `step` is active and `t` (0–1) of that step has scrolled.
 * The first picture starts in the middle; each later one grows out of its tray slot as the previous
 * one shrinks back into its own. On the last step all three travel to the board. With reduced motion
 * nothing travels or builds: every picture jumps to where it rests, fully drawn.
 */
export function itemState(i: number, step: number, t: number, reduce: boolean): ItemState {
  const move = reduce ? 1 : windowProgress(t, 0, MOVE);
  const tray = trayPose(i);
  if (step < i) return { ...tray, shown: false, build: 0 };
  if (step === POSTER_STEP) {
    const from = i === RECAP_ITEMS - 1 ? HERO : tray;
    return { ...mix(from, posterPose(i), move), shown: true, build: 1 };
  }
  if (step === i) {
    const pose = i === 0 ? HERO : mix(tray, HERO, move);
    const build = reduce ? 1 : windowProgress(t, i === 0 ? 0 : MOVE, BUILD_END);
    return { ...pose, shown: true, build };
  }
  // step > i: explained already, back in the tray
  const pose = step === i + 1 ? mix(HERO, tray, move) : tray;
  return { ...pose, shown: true, build: 1 };
}

/** Picture 1: the six letters pop in, one turns red ("แม้ข้อเดียว"), an arrow, the clock, then 1669. */
export function befastBuild(b: number) {
  return {
    tiles: Math.min(BEFAST.length, Math.floor(windowProgress(b, 0, 0.36) * BEFAST.length + 1e-9)),
    hit: b >= 0.42,
    arrow: windowProgress(b, 0.46, 0.62),
    clock: b >= 0.62,
    call: b >= 0.78,
  };
}

/** Picture 2: the ring draws round as the minutes count up to the end of the window. */
export function ringBuild(b: number) {
  const arc = windowProgress(b, 0, 0.9);
  return { arc, minutes: Math.round(arc * WINDOW_MINUTES) };
}

/** Picture 3: the shield's 10 pieces light one by one while the percentage climbs. */
export function shieldBuild(b: number) {
  const t = windowProgress(b, 0, 0.9);
  return { pieces: Math.ceil(t * SHIELD_PIECE_COUNT), percent: Math.round(t * PREVENTABLE) };
}

/** Run of text drawn in one font: numbers (and the % / . around them) wear the numeral font. */
export type TextRun = { text: string; num: boolean };

export function numberRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  for (const m of text.matchAll(/(\d[\d.,]*%?)|([^\d]+)/g)) {
    const num = m[1] !== undefined;
    const last = runs[runs.length - 1];
    if (last && last.num === num) last.text += m[0];
    else runs.push({ text: m[0], num });
  }
  return runs;
}

const segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter("th", { granularity: "word" }) : null;
const words = (s: string) => (segmenter ? Array.from(segmenter.segment(s), (x) => x.segment) : Array.from(s));

/**
 * Greedy line breaking for Thai text drawn on a canvas. Lines break at the spaces between phrases
 * first (DESIGN.md › The Whole Phrase Rule); a phrase wider than `max` on its own is broken between
 * words (Intl.Segmenter), never inside one. `measure` returns a string's drawn width.
 */
export function wrapLines(text: string, max: number, measure: (s: string) => number): string[] {
  const lines: string[] = [];
  let line = "";
  const push = (piece: string, sep: string) => {
    const next = line ? line + sep + piece : piece;
    if (!line || measure(next) <= max) line = next;
    else {
      lines.push(line);
      line = piece;
    }
  };
  for (const phrase of text.split(" ")) {
    if (measure(phrase) <= max) push(phrase, " ");
    else {
      let first = true;
      for (const w of words(phrase)) {
        push(w, first ? " " : "");
        first = false;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}
