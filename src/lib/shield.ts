/** Geometry and "which pieces are lit" logic for the reusable <Shield> (src/components/ui/Shield.tsx). */

export const SHIELD_PIECE_COUNT = 10;
/** Pieces 0–3 are the 4 diseases (chapter 6); pieces 4–9 are the 6 behaviours (chapter 7). */
export const SHIELD_DISEASE_COUNT = 4;

/** Shield outline in a 200×240 box. Pieces are clipped to this shape. */
export const SHIELD_OUTLINE = "M16,22 H184 V104 C184,166 150,208 100,236 C50,208 16,166 16,104 Z";

export type ShieldPieceKind = "disease" | "habit";
export type ShieldPiece = { d: string; kind: ShieldPieceKind };

/** Gap between neighbouring pieces, in shield units. */
const GAP = 5;
/** Outer edges overshoot the outline; the clip path trims them flush with the frame. */
const X0 = 0;
const X1 = 200;
const Y0 = 8;
const Y1 = 250;

type Rect = readonly [x0: number, y0: number, x1: number, y1: number];

const rectPath = ([x0, y0, x1, y1]: Rect) => `M${x0},${y0} H${x1} V${y1} H${x0} Z`;

/** Cuts the span [lo, hi] at `cuts`, leaving a GAP between neighbours (outer ends stay as given). */
function spans(lo: number, hi: number, cuts: readonly number[]): [number, number][] {
  const edges = [lo, ...cuts, hi];
  return edges.slice(0, -1).map((a, i) => [i === 0 ? a : a + GAP / 2, i === cuts.length ? hi : edges[i + 1] - GAP / 2]);
}

const BAND_A = spans(Y0, Y1, [85, 152]); // top band, middle row, bottom row
const COLS_4 = spans(X0, X1, [58, 100, 142]);
const COLS_3 = spans(X0, X1, [72, 128]);

const row = (cols: [number, number][], [y0, y1]: [number, number]): string[] =>
  cols.map(([x0, x1]) => rectPath([x0, y0, x1, y1]));

/** 4 disease pieces across the top band, then 6 behaviour pieces in two rows of 3 (left to right). */
export const SHIELD_PIECES: readonly ShieldPiece[] = [
  ...row(COLS_4, BAND_A[0]).map((d): ShieldPiece => ({ d, kind: "disease" })),
  ...row(COLS_3, BAND_A[1]).map((d): ShieldPiece => ({ d, kind: "habit" })),
  ...row(COLS_3, BAND_A[2]).map((d): ShieldPiece => ({ d, kind: "habit" })),
];

/** Lit pieces: a count (the first n pieces) or an explicit list of piece indexes. */
export type ShieldLit = number | readonly number[];

export function isPieceLit(index: number, lit: ShieldLit | undefined): boolean {
  if (lit === undefined) return false;
  return typeof lit === "number" ? index < lit : lit.includes(index);
}

/** Scroll-driven scenes: set the `.on` class on every `.shield-piece` under `root`. */
export function setShieldLit(root: ParentNode, lit: ShieldLit): void {
  root.querySelectorAll<SVGElement>(".shield-piece").forEach((el) => {
    el.classList.toggle("on", isPieceLit(Number(el.dataset.piece), lit));
  });
}
