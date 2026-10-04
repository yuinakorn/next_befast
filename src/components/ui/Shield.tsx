import { useId } from "react";
import { SHIELD_OUTLINE, SHIELD_PIECES, isPieceLit, type ShieldLit } from "@/lib/shield";

/**
 * The protection shield: 10 pieces (0–3 = the 4 diseases of chapter 6, 4–9 = the 6 behaviours
 * of chapter 7). Geometry lives in a 200×240 box; styles are in src/styles/shield.css.
 *
 * Lit mechanism (one rule): a piece is lit when its `<path class="shield-piece" data-piece="i">`
 * has the class `on`. Two ways to set it:
 *  - React-driven (a checklist, a quiz): pass `lit` as a count (first n pieces) or an array of
 *    piece indexes, e.g. `<Shield lit={[4, 6]} />`.
 *  - scroll-driven (GSAP): leave `lit` out and call `setShieldLit(root, lit)` from src/lib/shield.ts
 *    (it toggles `.on` on the DOM; React does not touch the class again while `lit` stays unset).
 * When all 10 pieces are lit the shield gets a soft halo (CSS only, `:has()`).
 * Each piece also carries `data-kind="disease" | "habit"` for styling.
 */

type ShapeProps = {
  lit?: ShieldLit;
  className?: string;
};

/** The shield as an SVG `<g>` (200×240 units, origin top-left) to place inside your own `<svg>`. */
export function ShieldShape({ lit, className }: ShapeProps) {
  const clipId = `shield-clip-${useId().replace(/:/g, "")}`;
  return (
    <g className={className ? `shield ${className}` : "shield"}>
      <path className="shield-halo" d={SHIELD_OUTLINE} />
      <clipPath id={clipId}>
        <path d={SHIELD_OUTLINE} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {SHIELD_PIECES.map((piece, i) => (
          <path
            key={i}
            className={isPieceLit(i, lit) ? "shield-piece on" : "shield-piece"}
            data-piece={i}
            data-kind={piece.kind}
            d={piece.d}
          />
        ))}
      </g>
      <path className="shield-frame" d={SHIELD_OUTLINE} />
    </g>
  );
}

type Props = ShapeProps & {
  /** Thai description for assistive tech. Without it the shield is decorative (`aria-hidden`). */
  label?: string;
};

/** Stand-alone shield (its own `<svg>`); size it with CSS height or width. */
export function Shield({ lit, className, label }: Props) {
  return (
    <svg
      className="shield-svg"
      viewBox="-8 -4 216 252"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <ShieldShape lit={lit} className={className} />
    </svg>
  );
}
