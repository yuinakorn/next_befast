import type { StrokeType } from "./TypeToggle";

/** Out of 10 strokes: about 8 are a blocked vessel, about 2 a burst one (the step titles say so in words). */
const CLOT_COUNT = 8;
const TOTAL = 10;
const FIGURE = "M-9,15 V1 C-9,-6 -5,-9 0,-9 C5,-9 9,-6 9,1 V15 Z";

/**
 * Ten small people under the step text: the type the step is about is filled `ink`, the rest stay
 * outlines, with a gap between the 8 and the 2. Decorative: the title already says "ราว 8 ใน 10".
 */
export function StrokeRatio({ type }: { type: StrokeType }) {
  return (
    <div className="stroke-ratio" aria-hidden="true">
      {Array.from({ length: TOTAL }, (_, i) => {
        const kind: StrokeType = i < CLOT_COUNT ? "clot" : "bleed";
        return (
          <svg
            key={i}
            className={kind === type ? "ratio-person on" : "ratio-person"}
            data-gap={i === CLOT_COUNT ? "" : undefined}
            viewBox="-12 -22 24 38"
            style={{ ["--i" as string]: kind === type ? (type === "clot" ? i : i - CLOT_COUNT) : 0 }}
          >
            <circle cy="-15" r="6" />
            <path d={FIGURE} />
          </svg>
        );
      })}
    </div>
  );
}
