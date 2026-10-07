/** Static SVG for the six BEFAST scenes. Animated by BefastStage via the ids below. */

const STAR = "M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z";
const EYE = "M44,150 Q160,54 276,150 Q160,246 44,150 Z";

// clock face ticks for the T scene (rounded so server and client markup match)
const TICKS = Array.from({ length: 12 }, (_, k) => {
  const a = (k * Math.PI) / 6, big = k % 3 === 0;
  const r1 = big ? 72 : 78, r2 = 86;
  const r = (v: number) => Math.round(v * 100) / 100;
  return {
    x1: r(122 + r1 * Math.sin(a)), y1: r(150 - r1 * Math.cos(a)),
    x2: r(122 + r2 * Math.sin(a)), y2: r(150 - r2 * Math.cos(a)),
    w: big ? 5 : 3,
  };
});

export const SAY = "วันนี้อากาศดี";

/** `sayText` is the (possibly scrambled) sentence in the S scene. */
export function SymptomScenes({ sayText }: { sayText: string }) {
  return (
    <svg id="scenes" viewBox="0 0 320 300" aria-hidden="true">
      {/* B : balance */}
      <g className="scene" data-k="B">
        <ellipse cx="160" cy="286" rx="72" ry="8" className="shade" />
        <path d="M70,250 q-18,-34 0,-68" className="ln" strokeWidth="4" opacity=".35" />
        <path d="M250,250 q18,-34 0,-68" className="ln" strokeWidth="4" opacity=".35" />
        <g className="sway-fig">
          <rect x="139" y="196" width="18" height="88" rx="9" className="pants" />
          <rect x="163" y="196" width="18" height="88" rx="9" className="pants" />
          <rect x="98" y="124" width="18" height="72" rx="9" className="shirt" transform="rotate(30 107 128)" />
          <rect x="204" y="124" width="18" height="72" rx="9" className="shirt" transform="rotate(-30 213 128)" />
          <circle cx="72" cy="188" r="10" className="skin" />
          <circle cx="248" cy="188" r="10" className="skin" />
          <rect x="116" y="112" width="88" height="100" rx="34" className="shirt" />
          <circle cx="160" cy="80" r="36" className="skin" />
          <path d="M124,82 C118,40 202,40 196,82 C188,68 172,64 160,66 C148,64 132,68 124,82 Z" className="hair" />
          <path d="M140,82 a6,6 0 1 1 6,6 a3.5,3.5 0 1 1 -2.5,-5" className="feat-s" strokeWidth="2.6" />
          <path d="M172,82 a6,6 0 1 1 6,6 a3.5,3.5 0 1 1 -2.5,-5" className="feat-s" strokeWidth="2.6" />
          <path d="M148,102 q4,-5 8,0 t8,0 t8,0" className="feat-s" strokeWidth="3" />
        </g>
        <g className="stars">
          <path d={STAR} className="redf" transform="translate(128 36)" />
          <path d={STAR} className="redf" transform="translate(194 30) scale(.8)" />
          <path d={STAR} className="redf" transform="translate(162 14) scale(.65)" />
        </g>
      </g>

      {/* E : eyes */}
      <g className="scene" data-k="E">
        <g>
          <path d={EYE} fill="#fff" style={{ stroke: "var(--ink)" }} strokeWidth="6" strokeLinejoin="round" />
          <circle cx="160" cy="150" r="48" style={{ fill: "var(--cath)" }} />
          <circle cx="160" cy="150" r="22" className="feat" />
          <circle cx="174" cy="136" r="8" fill="#fff" />
          <path d="M84,112 l-12,-18 M122,92 l-6,-20 M160,86 v-21 M198,92 l6,-20 M236,112 l12,-18" className="ln" strokeWidth="5" />
        </g>
        <g className="eye-ghost" opacity=".5">
          <path d={EYE} fill="none" style={{ stroke: "var(--ink)" }} strokeWidth="5" strokeLinejoin="round" />
          <circle cx="160" cy="150" r="48" style={{ fill: "var(--cath)" }} fillOpacity=".55" />
          <circle cx="160" cy="150" r="22" className="feat" fillOpacity=".6" />
        </g>
      </g>

      {/* F : face */}
      <g className="scene" data-k="F">
        <circle cx="60" cy="156" r="18" className="skin-d" />
        <circle cx="260" cy="156" r="18" className="skin-d" />
        <circle cx="160" cy="152" r="102" className="skin" />
        <path d="M58,146 C52,40 268,40 262,146 C250,112 214,100 186,102 C170,92 150,92 136,102 C104,100 70,112 58,146 Z" className="hair" />
        <line x1="160" y1="36" x2="160" y2="270" className="guide" />
        <path id="browL" d="M104,120 Q123,108 142,118" className="feat-s" strokeWidth="6" />
        <path id="browR" d="M178,118 Q197,108 216,120" className="feat-s" strokeWidth="6" />
        <ellipse cx="124" cy="142" rx="10" ry="13" className="feat" />
        <ellipse id="eyeR" cx="196" cy="142" rx="10" ry="13" className="feat" />
        <circle cx="104" cy="178" r="13" className="redf" opacity=".18" />
        <circle cx="216" cy="178" r="13" className="redf" opacity=".18" />
        <path d="M160,150 q-9,22 2,27" className="feat-s" strokeWidth="4" />
        <path id="mouth" d="M110,196 Q160,238 210,196" className="feat-s" strokeWidth="7" />
        <line id="mouthGuide" x1="110" y1="196" x2="210" y2="196" className="guide-red" />
        <circle cx="110" cy="196" r="6" className="redf" />
        <circle id="cornerR" cx="210" cy="196" r="6" className="redf" />
      </g>

      {/* A : arm */}
      <g className="scene" data-k="A">
        <ellipse cx="160" cy="288" rx="80" ry="8" className="shade" />
        <g transform="rotate(-30 124 166)">
          <rect x="115" y="74" width="18" height="94" rx="9" className="shirt" />
          <circle cx="124" cy="72" r="11" className="skin" />
        </g>
        <g id="armR">
          <rect x="187" y="74" width="18" height="94" rx="9" className="shirt" />
          <circle cx="196" cy="72" r="11" className="skin" />
        </g>
        <rect x="110" y="150" width="100" height="138" rx="38" className="shirt" />
        <circle cx="160" cy="114" r="34" className="skin" />
        <path d="M126,116 C120,74 200,74 194,116 C186,102 172,98 160,100 C148,98 134,102 126,116 Z" className="hair" />
        <circle cx="148" cy="116" r="4" className="feat" />
        <circle cx="172" cy="116" r="4" className="feat" />
        <path d="M150,132 q10,5 20,0" className="feat-s" strokeWidth="3" />
        <text x="160" y="22" textAnchor="middle" className="phone-t" style={{ fontSize: 14 }}>ยกแขนค้างไว้ 10 วินาที</text>
      </g>

      {/* S : speech */}
      <g className="scene" data-k="S">
        <path
          d="M166,50 H290 Q310,50 310,70 V128 Q310,148 290,148 H206 L162,182 L178,148 H166 Q146,148 146,128 V70 Q146,50 166,50 Z"
          className="surf" style={{ stroke: "var(--ink)" }} strokeWidth="4" strokeLinejoin="round"
        />
        <text id="sayText" x="228" y="108" textAnchor="middle" className="say">{sayText}</text>
        <circle cx="40" cy="190" r="12" className="skin-d" />
        <circle cx="96" cy="190" r="66" className="skin" />
        <path d="M30,186 C24,112 168,112 162,186 C154,162 130,150 108,152 C90,146 54,152 30,186 Z" className="hair" />
        <circle cx="78" cy="186" r="6" className="feat" />
        <circle cx="114" cy="186" r="6" className="feat" />
        <path d="M72,222 q6,-7 12,0 t12,0 t12,0 t12,0" className="feat-s" strokeWidth="4" />
        <path d="M140,214 l12,-4 M142,228 l14,2" className="ln" strokeWidth="3" opacity=".45" />
      </g>

      {/* T : time */}
      <g className="scene" data-k="T">
        <circle cx="122" cy="150" r="94" className="surf" style={{ stroke: "var(--ink)" }} strokeWidth="8" />
        {/* 270-minute treatment window: 12 to 4:30 (135 degrees) */}
        <path d="M122,150 L122,64 A86,86 0 0 1 182.81,210.81 Z" className="clock-win" />
        <text x="164" y="132" textAnchor="middle" className="clock-win-t">270 นาที</text>
        <g id="ticks">
          {TICKS.map((t, k) => (
            <line key={k} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={t.w} strokeLinecap="round" style={{ stroke: "var(--ink)" }} />
          ))}
        </g>
        <line id="hourH" x1="122" y1="150" x2="122" y2="102" style={{ stroke: "var(--ink)" }} strokeWidth="8" strokeLinecap="round" />
        <line id="minH" x1="122" y1="150" x2="122" y2="80" style={{ stroke: "var(--ink)" }} strokeWidth="5" strokeLinecap="round" />
        <line id="secH" x1="122" y1="166" x2="122" y2="70" style={{ stroke: "var(--red)" }} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="122" cy="150" r="7" className="redf" />
        <rect x="236" y="92" width="72" height="130" rx="14" style={{ fill: "var(--ink)" }} />
        <rect x="243" y="106" width="58" height="96" rx="6" className="surf" />
        <text x="272" y="140" textAnchor="middle" className="phone-t">โทร</text>
        <text x="272" y="166" textAnchor="middle" className="phone-num">1669</text>
        <circle cx="272" cy="212" r="4" className="surf" />
      </g>
    </svg>
  );
}
