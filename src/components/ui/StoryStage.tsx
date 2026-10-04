"use client";

import { useRef, type ReactNode } from "react";
import type { Step } from "@/content/types";
import { usePinnedSteps, type PinnedScene } from "@/hooks/usePinnedSteps";
import { formatStepCounter } from "@/lib/steps";
import { Phrases } from "./Phrases";

type Props = {
  /** Pin id, e.g. "pin1". Also the hook for CSS scene states: #pin1[data-step="3"]. */
  id: string;
  steps: readonly Step[];
  scene?: ReactNode;
  setup?: (pin: HTMLElement, reduce: boolean) => PinnedScene;
  /** Extra content rendered inside step `index` (e.g. a toggle). */
  stepExtra?: (index: number) => ReactNode;
  showStepProgress?: boolean;
  end?: string;
};

const noScene = (): PinnedScene => ({});

/** Pinned chapter stage: scene on one side, one step of text at a time on the other. */
export function StoryStage({ id, steps, scene, setup = noScene, stepExtra, showStepProgress = false, end = "+=600%" }: Props) {
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
                {showStepProgress && (
                  <div className="story-step-progress">
                    <span className="sr-only">ขั้นที่ {i + 1} จาก {steps.length}</span>
                    <span className="story-step-count" aria-hidden="true">{formatStepCounter(i, steps.length)}</span>
                    <span className="story-step-dots" aria-hidden="true">
                      {steps.map((_, dot) => (
                        <i key={dot} className={dot === i ? "current" : dot < i ? "reached" : undefined} />
                      ))}
                    </span>
                  </div>
                )}
                <h3>{s.keepPhrases ? <Phrases text={s.title} /> : s.title}</h3>
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
