/**
 * Pictograms for the 6 behaviours of chapter 7, drawn around (0,0) in a ±22 box.
 * Monochrome on purpose (`.c7-g` lines, `.c7-gf` solids): colour is reserved for the shield.
 * Order matches CHAPTER_7.steps and shield pieces 4–9.
 */
export type HabitKind = "weight" | "smoke" | "alcohol" | "calm" | "veg" | "move";

export const HABIT_KINDS: readonly HabitKind[] = ["weight", "smoke", "alcohol", "calm", "veg", "move"];

export function HabitIcon({ kind }: { kind: HabitKind }) {
  switch (kind) {
    case "weight": // bathroom scale
      return (
        <g>
          <rect className="c7-g" x="-20" y="-18" width="40" height="36" rx="8" />
          <path className="c7-g" d="M-10,-4 A10,10 0 0 1 10,-4 Z" />
          <path className="c7-g" d="M0,-4 L4,-10" />
          <path className="c7-g" d="M-9,9 H9" />
        </g>
      );
    case "smoke": // cigarette, crossed out
      return (
        <g>
          <circle className="c7-g" r="20" />
          <path className="c7-g" d="M-12,4 H6" />
          <path className="c7-g" d="M11,4 H12" />
          <path className="c7-g" d="M3,-2 C0,-6 6,-9 3,-13" />
          <path className="c7-g" d="M-14,-14 L14,14" />
        </g>
      );
    case "alcohol": // wine glass, crossed out
      return (
        <g>
          <circle className="c7-g" r="20" />
          <path className="c7-g" d="M-7,-12 H7 C7,-2 4,3 0,3 C-4,3 -7,-2 -7,-12 Z" />
          <path className="c7-g" d="M0,3 V12 M-6,12 H6" />
          <path className="c7-g" d="M-14,-14 L14,14" />
        </g>
      );
    case "calm": // crescent moon and stars: rest
      return (
        <g transform="translate(-3 0) scale(.9)">
          <path className="c7-gf" d="M4,-20 A19,19 0 1 0 20,8 A15,15 0 0 1 4,-20 Z" />
          <circle className="c7-gf" cx="14" cy="-12" r="2.6" />
          <circle className="c7-gf" cx="17" cy="-3" r="1.9" />
        </g>
      );
    case "veg": // bowl of leafy greens
      return (
        <g>
          <path className="c7-gf" d="M0,5 C-8,-3 -7,-13 0,-20 C7,-13 8,-3 0,5 Z" />
          <path className="c7-gf" transform="rotate(-52 0 5)" d="M0,5 C-7,-2 -6,-11 0,-17 C6,-11 7,-2 0,5 Z" />
          <path className="c7-gf" transform="rotate(52 0 5)" d="M0,5 C-7,-2 -6,-11 0,-17 C6,-11 7,-2 0,5 Z" />
          <path className="c7-g" d="M-19,7 H19 C19,17 10,22 0,22 C-10,22 -19,17 -19,7 Z" />
        </g>
      );
    case "move": // runner
      return (
        <g>
          <circle className="c7-gf" cx="6" cy="-15" r="4.5" />
          <path className="c7-g" d="M3,-8 L-2,4" />
          <path className="c7-g" d="M3,-7 L-5,-2 M3,-7 L11,-1" />
          <path className="c7-g" d="M-2,4 L6,9 L4,18 M-2,4 L-9,10 L-17,8" />
        </g>
      );
  }
}
