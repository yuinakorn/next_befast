"use client";

import { CHAPTER_8 } from "@/content/chapter-8";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import {
  CAL_COLS, CAL_YEAR, CHECKUP, FAMILY_HEARTS, SELF_HEART, THAI_MONTHS,
  bottlePose, bpAt, cellOf, circled, familyRoutes, lightPoint, lightProgress, monthAt, monthGrid, signProgress, signStrokes,
} from "@/lib/remember-scene";
import { stepProgress } from "@/lib/steps";

const STARTS = CHAPTER_8.steps.map((s) => s.at);
const STEP_BP = 0;
const STEP_CALENDAR = 1;
const STEP_SHELF = 2;
const STEP_FAMILY = 3;

/* ---- calendar geometry (scene units) ---- */
const CAL = { x: 64, y: 34, w: 272, h: 256, r: 18, headBottom: 92 };
const DAY_X0 = 98;
const DAY_PITCH_X = 34;
const DAY_Y0 = 118;
const DAY_PITCH_Y = 28;
const dayX = (col: number) => DAY_X0 + col * DAY_PITCH_X;
const dayY = (row: number) => DAY_Y0 + row * DAY_PITCH_Y;

/* ---- shelf ---- */
const SHELF_Y = 236;
const BOTTLE_X = 120;
const JAR_X = 282;
const SIGN_R = 52;
const SIGN_Y = SHELF_Y - 44;

const HEART_D = "M0,6.5 C-9,0.5 -8.5,-6 -4,-6 C-2,-6 0,-4.2 0,-3 C0,-4.2 2,-6 4,-6 C8.5,-6 9,0.5 0,6.5 Z";
const MONITOR_HEART_D = "M0,9 C-14,-1 -11,-12 -5,-12 C-2,-12 0,-9 0,-8 C0,-9 2,-12 5,-12 C11,-12 14,-1 0,9 Z";
const HEAD_SHORT_HAIR = "M-15.5,-46 C-17,-64 17,-64 15.5,-46 C10,-54 -10,-54 -15.5,-46 Z";
const ROUTES = familyRoutes();
const routeD = (r: (typeof ROUTES)[number]) => `M${r[0].x},${r[0].y} C${r[1].x},${r[1].y} ${r[2].x},${r[2].y} ${r[3].x},${r[3].y}`;

const transform = (x: number, y: number) => `translate(${x.toFixed(1)} ${y.toFixed(1)})`;

type PersonKind = "self" | "father" | "mother" | "child" | "elder";

/** A bust drawn around their heart (the origin), so the light can be aimed at (0, 0). */
function Person({ kind, x, y, scale = 1 }: { kind: PersonKind; x: number; y: number; scale?: number }) {
  return (
    <g className={kind === "self" ? "c8-p c8-p-self lit" : "c8-p c8-p-family"} transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle className="c8-ring" cx="0" cy="-14" r="48" />
      {kind === "mother" && <rect className="hair" x="-19" y="-64" width="38" height="52" rx="18" />}
      {kind === "child" && (
        <>
          <circle className="hair" cx="-12" cy="-58" r="6.5" />
          <circle className="hair" cx="12" cy="-58" r="6.5" />
        </>
      )}
      <path className="shirt" d="M-28,26 C-28,-8 -16,-26 0,-26 C16,-26 28,-8 28,26 Z" />
      <circle className="skin" cx="0" cy="-44" r="15" />
      {kind === "elder" ? (
        <>
          <path className="c8-white-hair" d="M-15.5,-44 C-18,-63 18,-63 15.5,-44 C12,-51 -12,-51 -15.5,-44 Z" />
          <circle className="c8-glass" cx="-6" cy="-43" r="4.6" />
          <circle className="c8-glass" cx="6" cy="-43" r="4.6" />
          <path className="c8-glass" d="M-1.4,-43 H1.4" />
          <circle className="feat" cx="-6" cy="-43" r="1.4" />
          <circle className="feat" cx="6" cy="-43" r="1.4" />
          <path className="c8-cane" d="M44,26 V-4 C44,-13 33,-13 33,-4" />
        </>
      ) : (
        <>
          <path className="hair" d={HEAD_SHORT_HAIR} />
          <circle className="feat" cx="-5" cy="-44" r="1.8" />
          <circle className="feat" cx="5" cy="-44" r="1.8" />
        </>
      )}
      <path className="feat-s" strokeWidth="1.7" d="M-5,-37.5 Q0,-34 5,-37.5" />
      <circle className="c8-halo" r="19" />
      <circle className="c8-disc" r="11" />
      <path className="c8-heart" d={HEART_D} />
    </g>
  );
}

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const one = <T extends Element>(sel: string) => pin.querySelector<T>(sel)!;
  const all = <T extends Element>(sel: string) => Array.from(pin.querySelectorAll<T>(sel));
  const sysEl = one<SVGTextElement>(".c8-sys");
  const diaEl = one<SVGTextElement>(".c8-dia");
  const monthEl = one<SVGTextElement>(".c8-cal-month");
  const dayEls = all<SVGTextElement>(".c8-day");
  const flap = one<SVGPathElement>(".c8-flap");
  const circle = one<SVGCircleElement>(".c8-circle");
  const bottle = one<SVGGElement>(".c8-bottle-in");
  const signRing = one<SVGCircleElement>(".c8-sign-ring");
  const signSlash = one<SVGPathElement>(".c8-sign-slash");
  const people = all<SVGGElement>(".c8-p-family");
  const trails = all<SVGPathElement>(".c8-trail");
  const sparks = all<SVGGElement>(".c8-spark");

  // last written values: write to the DOM only when something changed
  let bp = "";
  let month = -1;
  let ringOn: boolean | null = null;
  let bottleKey = "";
  let signKey = "";
  const lightKey = ["", "", "", ""];

  return {
    render(p, step) {
      // progress (0–1) through the step that owns each part of the scene; it rests at its end afterwards
      const t = (s: number) => (step < s ? 0 : step > s ? 1 : stepProgress(p, STARTS, s));

      // step 0: the numbers climb to the reading
      const { sys, dia } = bpAt(t(STEP_BP), reduce);
      if (`${sys}/${dia}` !== bp) {
        bp = `${sys}/${dia}`;
        sysEl.textContent = String(sys);
        diaEl.textContent = String(dia);
      }

      // step 1: the pages flip through the year, then the check-up day is circled
      const t1 = t(STEP_CALENDAR);
      const m = monthAt(t1, reduce);
      if (m !== month) {
        const first = month === -1;
        month = m;
        monthEl.textContent = THAI_MONTHS[m];
        monthGrid(CAL_YEAR, m).forEach((d, i) => (dayEls[i].textContent = d === null ? "" : String(d)));
        if (!first && !reduce && step === STEP_CALENDAR && typeof flap.animate === "function") {
          flap.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: 240, easing: "ease-in" });
        }
      }
      const on = circled(t1, reduce) && m === CHECKUP.month;
      if (on !== ringOn) {
        ringOn = on;
        circle.classList.toggle("on", on);
      }

      // step 2: the bottle comes down onto the shelf, then the "no" sign is drawn over the jar
      const t2 = t(STEP_SHELF);
      const { lift, tilt } = bottlePose(t2, reduce);
      const bKey = `${lift.toFixed(1)} ${tilt.toFixed(1)}`;
      if (bKey !== bottleKey) {
        bottleKey = bKey;
        bottle.setAttribute("transform", `translate(0 ${(-lift).toFixed(1)}) rotate(${tilt.toFixed(1)})`);
      }
      const strokes = signStrokes(signProgress(t2, reduce));
      const sKey = `${strokes.ring.toFixed(2)} ${strokes.slash.toFixed(2)}`;
      if (sKey !== signKey) {
        signKey = sKey;
        signRing.style.strokeDashoffset = String(1 - strokes.ring);
        signSlash.style.strokeDashoffset = String(1 - strokes.slash);
      }

      // step 3: light passes from the heart in the middle to each person around
      const t3 = t(STEP_FAMILY);
      people.forEach((person, i) => {
        const prog = Math.round(lightProgress(t3, i, reduce) * 200) / 200;
        const key = String(prog);
        if (key === lightKey[i]) return;
        lightKey[i] = key;
        const pt = lightPoint(ROUTES[i], prog);
        sparks[i].setAttribute("transform", transform(pt.x, pt.y));
        sparks[i].classList.toggle("on", prog > 0 && prog < 1);
        trails[i].style.strokeDashoffset = String(1 - prog);
        person.classList.toggle("lit", prog >= 1);
      });
    },
  };
}

export function RememberStage() {
  const cell = cellOf(CAL_YEAR, CHECKUP.month, CHECKUP.day);
  // Server render = the last state of each picture; the scroll script takes over and sets the real state for the step.
  const lastGrid = monthGrid(CAL_YEAR, CHECKUP.month);

  const scene = (
    <svg className="story-svg c8-scene" viewBox="0 0 400 320" aria-hidden="true">
      {/* step 0: blood-pressure monitor with its cuff */}
      <g className="c8-s c8-s0">
        <path className="c8-line c8-tube" d="M310,206 H336" />
        <rect className="c8-body" x="334" y="118" width="52" height="136" rx="12" />
        <path className="c8-line c8-fine" d="M344,150 H376 M344,186 H376 M344,222 H376" />
        <rect className="c8-body" x="30" y="36" width="280" height="250" rx="26" />
        <rect className="c8-screen" x="50" y="56" width="240" height="156" rx="14" />
        <text className="c8-bp-label" x="66" y="96">SYS</text>
        <text className="c8-bp-num c8-sys" x="224" y="122" textAnchor="end">{120}</text>
        <text className="c8-bp-unit" x="232" y="122">mmHg</text>
        <path className="c8-rule" d="M66,138 H274" />
        <text className="c8-bp-label" x="66" y="170">DIA</text>
        <text className="c8-bp-num c8-dia" x="224" y="196" textAnchor="end">{80}</text>
        <text className="c8-bp-unit" x="232" y="196">mmHg</text>
        <g transform="translate(264 78)">
          <path className="c8-bp-heart" d={MONITOR_HEART_D} />
        </g>
        <circle className="c8-btn" cx="170" cy="249" r="17" />
        <path className="c8-btn-icon" d="M165,241 L179,249 L165,257 Z" />
        <circle className="c8-line" cx="110" cy="249" r="9" />
        <circle className="c8-line" cx="230" cy="249" r="9" />
      </g>

      {/* step 1: calendar flipping through the year */}
      <g className="c8-s c8-s1">
        <rect className="c8-paper" x={CAL.x} y={CAL.y} width={CAL.w} height={CAL.h} rx={CAL.r} />
        <path className="c8-cal-head" d={`M${CAL.x},${CAL.y + CAL.r} a${CAL.r},${CAL.r} 0 0 1 ${CAL.r},-${CAL.r} H${CAL.x + CAL.w - CAL.r} a${CAL.r},${CAL.r} 0 0 1 ${CAL.r},${CAL.r} V${CAL.headBottom} H${CAL.x} Z`} />
        <text className="c8-cal-month" x="200" y="73" textAnchor="middle">{THAI_MONTHS[CHECKUP.month]}</text>
        {lastGrid.map((d, i) => (
          <text key={i} className="c8-day" x={dayX(i % CAL_COLS)} y={dayY(Math.floor(i / CAL_COLS)) + 5} textAnchor="middle">{d ?? ""}</text>
        ))}
        <circle
          className="c8-circle on"
          cx={dayX(cell.col)}
          cy={dayY(cell.row)}
          r="16"
          pathLength={1}
          transform={`rotate(-90 ${dayX(cell.col)} ${dayY(cell.row)})`}
        />
        <path
          className="c8-flap"
          d={`M${CAL.x},${CAL.headBottom} H${CAL.x + CAL.w} V${CAL.y + CAL.h - CAL.r} a${CAL.r},${CAL.r} 0 0 1 -${CAL.r},${CAL.r} H${CAL.x + CAL.r} a${CAL.r},${CAL.r} 0 0 1 -${CAL.r},-${CAL.r} Z`}
        />
        <rect className="c8-outline" x={CAL.x} y={CAL.y} width={CAL.w} height={CAL.h} rx={CAL.r} />
        <rect className="c8-ring-bind" x="112" y="20" width="12" height="28" rx="6" />
        <rect className="c8-ring-bind" x="276" y="20" width="12" height="28" rx="6" />
      </g>

      {/* step 2: medicine bottle back on the shelf; unverified herb jar crossed out */}
      <g className="c8-s c8-s2">
        <rect className="c8-body" x="24" y={SHELF_Y} width="352" height="14" rx="5" />
        <path className="c8-bracket" d={`M70,${SHELF_Y + 14} V${SHELF_Y + 40} L96,${SHELF_Y + 14} M330,${SHELF_Y + 14} V${SHELF_Y + 40} L304,${SHELF_Y + 14}`} />
        <g transform={`translate(${BOTTLE_X} ${SHELF_Y})`}>
          <rect className="c8-ghost" x="-30" y="-78" width="60" height="78" rx="10" />
          <g className="c8-bottle-in" transform="translate(0 0) rotate(0)">
            <rect className="c8-body" x="-30" y="-78" width="60" height="78" rx="10" />
            <rect className="c8-cap" x="-33" y="-98" width="66" height="22" rx="7" />
            <rect className="c8-label" x="-22" y="-62" width="44" height="42" rx="5" />
            <path className="c8-cross" d="M0,-54 V-30 M-12,-42 H12" />
          </g>
        </g>
        <g transform={`translate(${JAR_X} ${SHELF_Y})`}>
          <rect className="c8-body" x="-36" y="-66" width="72" height="66" rx="16" />
          <rect className="c8-lid" x="-30" y="-82" width="60" height="16" rx="6" />
          <path className="c8-leaf" d="M-22,-16 C-22,-42 -4,-48 -2,-48 C-2,-30 -10,-16 -22,-16 Z M-22,-16 L-10,-32" />
          <text className="c8-q" x="16" y="-18" textAnchor="middle">?</text>
        </g>
        <circle className="c8-sign-ring" cx={JAR_X} cy={SIGN_Y} r={SIGN_R} pathLength={1} />
        <path
          className="c8-sign-slash"
          pathLength={1}
          d={`M${JAR_X - SIGN_R * 0.71},${SIGN_Y - SIGN_R * 0.71} L${JAR_X + SIGN_R * 0.71},${SIGN_Y + SIGN_R * 0.71}`}
        />
      </g>

      {/* step 3: one heart, and the light it passes to the family */}
      <g className="c8-s c8-s3">
        {ROUTES.map((r, i) => (
          <path key={i} className="c8-trail" pathLength={1} d={routeD(r)} />
        ))}
        <Person kind="self" x={SELF_HEART.x} y={SELF_HEART.y} scale={1.3} />
        <Person kind="father" x={FAMILY_HEARTS[0].x} y={FAMILY_HEARTS[0].y} />
        <Person kind="mother" x={FAMILY_HEARTS[1].x} y={FAMILY_HEARTS[1].y} />
        <Person kind="child" x={FAMILY_HEARTS[2].x} y={FAMILY_HEARTS[2].y} scale={0.85} />
        <Person kind="elder" x={FAMILY_HEARTS[3].x} y={FAMILY_HEARTS[3].y} scale={0.95} />
        {ROUTES.map((r, i) => (
          <g key={i} className="c8-spark" transform={transform(r[0].x, r[0].y)}>
            <circle className="c8-spark-halo" r="14" />
            <circle className="c8-spark-core" r="7" />
          </g>
        ))}
      </g>
    </svg>
  );

  return <StoryStage id="pin8" steps={CHAPTER_8.steps} scene={scene} setup={setup} end="+=400%" />;
}
