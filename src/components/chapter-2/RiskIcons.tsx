/** Risk-factor pictograms for chapter 2, drawn around (0,0) inside a 30-unit badge. */
export type RiskKind = "bp" | "lifestyle" | "smoke" | "stress" | "drugs";

/** Order matches chapter 2 steps 3–7 and SELF_CHECK option ids. */
export const RISK_KINDS: readonly RiskKind[] = ["bp", "lifestyle", "smoke", "stress", "drugs"];

export function RiskIcon({ kind }: { kind: RiskKind }) {
  switch (kind) {
    case "bp": // blood-pressure gauge with squeeze bulb
      return (
        <g>
          <circle className="ri-outline" cx="0" cy="-5" r="14" />
          <path className="ri-line" d="M-9,-1 H-6 M0,-14 V-11 M9,-1 H6" />
          <path className="ri-line-accent" d="M0,-5 L6,-11" />
          <circle className="ri-accent" cx="0" cy="-5" r="2.5" />
          <path className="ri-line" d="M0,9 V13" />
          <ellipse className="ri-fill" cx="0" cy="19" rx="5" ry="6" />
        </g>
      );
    case "lifestyle": // person sitting at a chair, with a burger
      return (
        <g>
          <circle className="ri-fill" cx="-10" cy="-14" r="5" />
          <rect className="ri-fill" x="-15" y="-8" width="8" height="16" rx="4" />
          <rect className="ri-fill" x="-14" y="2" width="20" height="7" rx="3.5" />
          <rect className="ri-fill" x="2" y="2" width="7" height="18" rx="3.5" />
          <path className="ri-line" d="M-20,-4 V20 M-20,12 H-1" />
          <g transform="translate(12 -12) scale(.5)">
            <path className="ri-fill" d="M-18,-4 C-18,-16 18,-16 18,-4 Z" />
            <rect className="ri-accent" x="-19" y="-2" width="38" height="6" rx="3" />
            <rect className="ri-fill" x="-18" y="6" width="36" height="7" rx="3.5" />
          </g>
        </g>
      );
    case "smoke": // cigarette with smoke, and a wine glass
      return (
        <g>
          <rect className="ri-fill" x="-23" y="7" width="20" height="7" rx="2" />
          <rect className="ri-accent" x="-11" y="7" width="8" height="7" rx="2" />
          <path className="ri-line" d="M-20,3 C-25,-3 -15,-7 -20,-14 M-13,3 C-17,-3 -9,-6 -13,-12" />
          <path className="ri-fill" d="M4,-16 H20 C20,-6 16,0 12,0 C8,0 4,-6 4,-16 Z" />
          <path className="ri-line" d="M12,0 V13 M6,14 H18" />
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
    case "drugs": // capsule and tablet
      return (
        <g>
          <g transform="rotate(-40 -4 -5)">
            <rect className="ri-outline" x="-18" y="-11" width="28" height="12" rx="6" />
            <path className="ri-accent" d="M-18,-5 a6,6 0 0 1 6,-6 H-4 V1 H-12 a6,6 0 0 1 -6,-6 Z" />
            <path className="ri-line" d="M-4,-11 V1" />
          </g>
          <circle className="ri-outline" cx="9" cy="11" r="7" />
          <path className="ri-line" d="M4,11 H14" />
        </g>
      );
  }
}
