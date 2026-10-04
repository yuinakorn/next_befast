"use client";

import { CHAPTER_7 } from "@/content/chapter-7";
import { StoryStage } from "@/components/ui/StoryStage";
import { ShieldShape } from "@/components/ui/Shield";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { SHIELD_DISEASE_COUNT, SHIELD_PIECE_COUNT, setShieldLit } from "@/lib/shield";
import { DOCKED_SCALE, SHIELD_AT, iconPose, litPieces, slotInScene } from "@/lib/shield-assembly";
import { stepProgress } from "@/lib/steps";
import { HABIT_KINDS, HabitIcon } from "./HabitIcons";

const STARTS = CHAPTER_7.steps.map((s) => s.at);

const transformOf = (x: number, y: number, scale: number) => `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(3)})`;

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const shield = pin.querySelector<SVGGElement>(".c7-shield")!;
  const pieces = Array.from(shield.querySelectorAll<SVGElement>(".shield-piece"));
  const icons = Array.from(pin.querySelectorAll<SVGGElement>(".c7-icon"));

  // last written values: write to the DOM only when something changed
  const written: string[] = icons.map(() => "");
  let lit = -1;

  return {
    onStep(step) {
      // the slot the icon is heading for is outlined
      pieces.forEach((el, i) => el.classList.toggle("cur", i === SHIELD_DISEASE_COUNT + step));
    },
    render(p, step) {
      const t = stepProgress(p, STARTS, step);

      icons.forEach((el, i) => {
        const pose = iconPose(i, step, t, reduce);
        const key = `${pose.x.toFixed(1)} ${pose.y.toFixed(1)} ${pose.scale.toFixed(3)} ${pose.shown} ${pose.docked}`;
        if (key === written[i]) return;
        written[i] = key;
        el.setAttribute("transform", transformOf(pose.x, pose.y, pose.scale));
        el.classList.toggle("show", pose.shown);
        el.classList.toggle("docked", pose.docked);
      });

      const n = litPieces(step, t, reduce);
      if (n !== lit) {
        lit = n;
        setShieldLit(shield, n);
      }
    },
  };
}

export function ShieldStage() {
  // Server render = the finished shield, so the scene still tells the story if the scroll script never loads.
  // The script takes over as soon as it runs and sets the real state for the current step.
  const scene = (
    <svg className="story-svg c7-scene" viewBox="0 0 400 320" aria-hidden="true">
      <g className="c7-shield" transform={`translate(${SHIELD_AT.x} ${SHIELD_AT.y}) scale(${SHIELD_AT.scale})`}>
        <ShieldShape lit={SHIELD_PIECE_COUNT} />
      </g>
      {HABIT_KINDS.map((kind, i) => {
        const slot = slotInScene(i);
        return (
          <g key={kind} className="c7-icon show docked" data-kind={kind} transform={transformOf(slot.x, slot.y, DOCKED_SCALE)}>
            <circle className="c7-badge" r="30" />
            <HabitIcon kind={kind} />
          </g>
        );
      })}
    </svg>
  );

  return <StoryStage id="pin7" steps={CHAPTER_7.steps} scene={scene} setup={setup} />;
}
