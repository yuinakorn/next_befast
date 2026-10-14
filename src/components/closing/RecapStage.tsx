"use client";

import { RECAP } from "@/content/closing";
import { ShieldShape } from "@/components/ui/Shield";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { pickOther } from "@/lib/pick";
import {
  BEFAST,
  POSTER_STEP,
  PREVENTABLE,
  RECAP_ITEMS,
  WINDOW_MINUTES,
  befastBuild,
  itemState,
  numberRuns,
  posterPose,
  ringBuild,
  shieldBuild,
  trayPose,
  type Pose,
} from "@/lib/recap-scene";
import { SHIELD_PIECE_COUNT, setShieldLit } from "@/lib/shield";
import { stepProgress } from "@/lib/steps";
import { RecapSave } from "./RecapSave";

const STARTS = RECAP.steps.map((s) => s.at);
/** Tile that turns red on the server render; the script picks a different one on every visit to step 1. */
const FIRST_HIT = 0;
const LABEL_Y = 250;

const transformOf = ({ x, y, scale }: Pose) => `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(3)})`;
const tileAt = (k: number) => `translate(${-40 + 40 * (k % 3)} ${-56 + 40 * Math.floor(k / 3)})`;
const TICKS = Array.from({ length: WINDOW_MINUTES / 30 }, (_, k) => (k / (WINDOW_MINUTES / 30)) * 360);

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const $ = <T extends Element>(sel: string) => pin.querySelector<T>(sel)!;
  const items = Array.from(pin.querySelectorAll<SVGGElement>(".recap-item"));
  const trays = Array.from(pin.querySelectorAll<SVGRectElement>(".recap-slot"));
  const tiles = Array.from(pin.querySelectorAll<SVGGElement>(".recap-tile"));
  const arrow = $<SVGPathElement>(".recap-arrow");
  const clock = $<SVGGElement>(".recap-clock");
  const call = $<SVGGElement>(".recap-call");
  const arc = $<SVGCircleElement>(".recap-ring-arc");
  const minutes = $<SVGTextElement>(".recap-ring-num");
  const shield = $<SVGGElement>(".recap-shield");
  const percent = $<SVGTSpanElement>(".recap-pct-num");

  // last written values: write to the DOM only when something changed
  const written = { items: items.map(() => ""), befast: "", ring: "", shield: "" };
  let hit = FIRST_HIT;

  return {
    onStep(step, prev) {
      // "แม้ข้อเดียว": a different letter lights up each time the reader arrives at the first sentence
      if (step === 0 && prev !== 0) {
        hit = pickOther(hit, BEFAST.length);
        written.befast = "";
      }
      trays.forEach((el, i) => el.classList.toggle("filled", step > i));
    },
    render(p, step) {
      const t = stepProgress(p, STARTS, step);
      const states = items.map((_, i) => itemState(i, step, t, reduce));

      states.forEach((s, i) => {
        const key = `${transformOf(s)} ${s.shown}`;
        if (key === written.items[i]) return;
        written.items[i] = key;
        items[i].setAttribute("transform", transformOf(s));
        items[i].classList.toggle("shown", s.shown);
      });

      const b = befastBuild(states[0].build);
      const bKey = `${b.tiles} ${b.hit} ${b.arrow.toFixed(3)} ${b.clock} ${b.call}`;
      if (bKey !== written.befast) {
        written.befast = bKey;
        tiles.forEach((el, k) => {
          el.classList.toggle("in", k < b.tiles);
          el.classList.toggle("hit", b.hit && k === hit);
        });
        arrow.style.strokeDashoffset = String(1 - b.arrow);
        clock.classList.toggle("in", b.clock);
        call.classList.toggle("in", b.call);
      }

      const r = ringBuild(states[1].build);
      const rKey = `${r.arc.toFixed(3)} ${r.minutes}`;
      if (rKey !== written.ring) {
        written.ring = rKey;
        arc.style.strokeDashoffset = String(100 - r.arc * 100);
        minutes.textContent = String(r.minutes);
      }

      const s = shieldBuild(states[2].build);
      const sKey = `${s.pieces} ${s.percent}`;
      if (sKey !== written.shield) {
        written.shield = sKey;
        setShieldLit(shield, s.pieces);
        percent.textContent = String(s.percent);
      }
    },
  };
}

/** Text whose numbers wear the numeral font (DESIGN.md › The Numbers Wear Chakra Rule). */
function Numerals({ text }: { text: string }) {
  return numberRuns(text).map((run, i) => (run.num ? <tspan key={i} className="recap-num">{run.text}</tspan> : run.text));
}

/**
 * Closing summary as a pinned scene. Each sentence builds its picture in the middle (BEFAST → 1669,
 * the 270-minute ring, the 90% shield), which then shrinks into a tray along the bottom; on the last
 * step the three line up as one board, and the reader can save that board as an image.
 * Server render = the finished board, so the scene still tells the story if the scroll script never loads.
 */
export function RecapStage() {
  const scene = (
    <svg className="story-svg recap-scene" viewBox="0 0 400 320" aria-hidden="true">
      <g className="recap-tray">
        {Array.from({ length: RECAP_ITEMS }, (_, i) => {
          const { x, y } = trayPose(i);
          return <rect key={i} className="recap-slot filled" x={x - 28} y={y - 34} width="56" height="68" rx="10" />;
        })}
      </g>

      <g className="recap-item shown" data-i="0" transform={transformOf(posterPose(0))}>
        {BEFAST.map((letter, k) => (
          <g key={letter} className={k === FIRST_HIT ? "recap-tile in hit" : "recap-tile in"} transform={tileAt(k)}>
            <g className="recap-pop">
              <rect x="-16" y="-16" width="32" height="32" rx="7" />
              <text y="7" textAnchor="middle">{letter}</text>
            </g>
          </g>
        ))}
        <path className="recap-arrow" pathLength={1} d="M0,10 V30 M-6,24 L0,31 L6,24" />
        <g className="recap-clock in" transform="translate(-38 52)">
          <g className="recap-pop">
            <circle r="14" />
            <path d="M0,0 V-9 M0,0 L6,3" />
          </g>
        </g>
        <g className="recap-call in" transform="translate(20 52)">
          <g className="recap-pop">
            <rect x="-38" y="-15" width="76" height="30" rx="15" />
            <text y="7" textAnchor="middle">1669</text>
          </g>
        </g>
      </g>

      <g className="recap-item shown" data-i="1" transform={transformOf(posterPose(1))}>
        <circle className="recap-ring-track" r="50" />
        <circle className="recap-ring-arc" r="50" pathLength={100} transform="rotate(-90)" />
        {TICKS.map((a) => (
          <path key={a} className="recap-ring-tick" d="M0,-34 V-39" transform={`rotate(${a})`} />
        ))}
        <text className="recap-ring-num" y="6" textAnchor="middle">{WINDOW_MINUTES}</text>
        <text className="recap-ring-unit" y="24" textAnchor="middle">{RECAP.minutes}</text>
      </g>

      <g className="recap-item shown" data-i="2" transform={transformOf(posterPose(2))}>
        <g className="recap-shield" transform="translate(-50 -78) scale(.5)">
          <ShieldShape lit={SHIELD_PIECE_COUNT} />
        </g>
        <text className="recap-pct" y="72" textAnchor="middle">
          <tspan className="recap-pct-num">{PREVENTABLE}</tspan>%
        </text>
      </g>

      <g className="recap-labels">
        {RECAP.labels.map((label, i) => (
          <text key={label} className="recap-label" x={posterPose(i).x} y={LABEL_Y} textAnchor="middle">
            <Numerals text={label} />
          </text>
        ))}
      </g>
    </svg>
  );

  return (
    <StoryStage
      id="pinRecap"
      steps={RECAP.steps}
      scene={scene}
      setup={setup}
      showStepProgress
      end="+=420%"
      stepExtra={(i) => (i === POSTER_STEP ? <RecapSave /> : null)}
    />
  );
}
