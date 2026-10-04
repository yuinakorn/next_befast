/** Risk-factor pictograms for chapter 2, drawn around (0,0) inside a 30-unit badge. */
export type RiskKind = "food" | "drugs" | "pm25" | "filler" | "stress";

/** Order matches chapter 2 steps 3–7 and SELF_CHECK option ids. */
export const RISK_KINDS: readonly RiskKind[] = ["food", "drugs", "pm25", "filler", "stress"];

export function RiskIcon({ kind }: { kind: RiskKind }) {
  switch (kind) {
    case "food": // burger: sweet, fatty, salty
      return (
        <g>
          <path className="ri-fill" d="M-18,-4 C-18,-16 18,-16 18,-4 Z" />
          <rect className="ri-accent" x="-19" y="-2" width="38" height="6" rx="3" />
          <rect className="ri-fill" x="-18" y="6" width="36" height="7" rx="3.5" />
        </g>
      );
    case "drugs": // cigarette with smoke
      return (
        <g>
          <rect className="ri-fill" x="-20" y="4" width="32" height="8" rx="2" />
          <rect className="ri-accent" x="12" y="4" width="8" height="8" rx="2" />
          <path className="ri-line" d="M16,0 C10,-6 22,-10 16,-18" />
          <path className="ri-line" d="M8,-2 C4,-8 12,-11 8,-17" />
        </g>
      );
    case "pm25": // factory and dust
      return (
        <g>
          <path className="ri-fill" d="M-20,16 V-2 L-10,4 V-2 L0,4 V-12 H8 V16 Z" />
          <circle className="ri-accent" cx="14" cy="-14" r="3" />
          <circle className="ri-accent" cx="20" cy="-5" r="2" />
          <circle className="ri-accent" cx="8" cy="-20" r="2" />
        </g>
      );
    case "filler": // syringe
      return (
        <g transform="rotate(-45)">
          <rect className="ri-fill" x="-14" y="-5" width="22" height="10" rx="2" />
          <rect className="ri-accent" x="-10" y="-3" width="10" height="6" />
          <path className="ri-line" d="M8,0 H20 M-14,-8 V8 M-20,0 H-14" />
        </g>
      );
    case "stress": // frowning face and moon
      return (
        <g>
          <circle className="ri-outline" cx="-4" cy="4" r="14" />
          <path className="ri-line" d="M-11,-1 l5,2 M3,-1 l-5,2 M-10,11 q6,-5 12,0" />
          <path className="ri-accent" d="M18,-20 a9,9 0 1 0 6,14 a7,7 0 1 1 -6,-14 Z" />
        </g>
      );
  }
}
