"use client";

import { useRef, type ReactNode } from "react";
import type { Step } from "@/content/types";
import { usePinnedSteps, type PinnedScene } from "@/hooks/usePinnedSteps";

type Props = {
  /** Pin id, e.g. "pin1". Also the hook for CSS scene states: #pin1[data-step="3"]. */
  id: string;
  steps: readonly Step[];
  scene?: ReactNode;
  setup?: (pin: HTMLElement, reduce: boolean) => PinnedScene;
  /** Extra content rendered inside step `index` (e.g. a toggle). */
  stepExtra?: (index: number) => ReactNode;
  end?: string;
};

const noScene = (): PinnedScene => ({});

/** Pinned chapter stage: scene on one side, one step of text at a time on the other. */
export function StoryStage({ id, steps, scene, setup = noScene, stepExtra, end = "+=600%" }: Props) {
  const pinRef = useRef<HTMLElement>(null);
  usePinnedSteps(pinRef, { starts: steps.map((s) => s.at), end, setup });

  return (
    // wrapper keeps ScrollTrigger's pin-spacer out of React-managed siblings
    <div>
      <section className="pin" id={id} ref={pinRef} data-step="0">
        <div className="stage story-stage">
          <div className="story-scene">{scene}</div>
          <div className="steps">
            {steps.map((s, i) => (
              <article key={s.at} className={i === 0 ? "step on" : "step"}>
                <h3>{s.title}</h3>
                {s.body && <p>{s.body}</p>}
                {stepExtra?.(i)}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
