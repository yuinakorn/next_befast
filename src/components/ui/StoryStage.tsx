"use client";

import { useRef, type ReactNode } from "react";
import type { Step } from "@/content/types";
import { usePinnedSteps, type PinnedScene } from "@/hooks/usePinnedSteps";
import { formatStepCounter } from "@/lib/steps";
import { Phrases } from "./Phrases";
import { ScrollCue } from "./ScrollCue";

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

/**
 * Pinned chapter stage: scene on one side, one step of text at a time on the other.
 *
 * Screen readers: only the active step is shown (`.anim .step { visibility: hidden }`), and a hidden step
 * is also gone from the accessibility tree, so a screen-reader reader would only ever meet the step the
 * scroll happens to be on. So the text of EVERY step is also rendered once, in order, as an `.sr-only`
 * list (same `title` and `body` strings; `keepPhrases` only adds visual `.phrase` spans, never text).
 * The visual copies of that text are `aria-hidden`, so nothing is read twice. Interactive step extras
 * (chapter 1's ตัน/แตก toggle) are NOT duplicated and NOT hidden: they render once, inside their visual
 * step, and keep their keyboard and screen-reader access while that step is on. A step with no extra has
 * nothing left to expose, so its whole article is `aria-hidden`. The visual layout is untouched: the list
 * is clipped to 1px, and it is not a `.step`, so the pin hook never toggles it.
 */
export function StoryStage({ id, steps, scene, setup = noScene, stepExtra, showStepProgress = false, end = "+=600%" }: Props) {
  const pinRef = useRef<HTMLElement>(null);
  usePinnedSteps(pinRef, { starts: steps.map((s) => s.at), end, setup });

  return (
    // wrapper keeps ScrollTrigger's pin-spacer out of React-managed siblings
    <div>
      <section className="pin" id={id} ref={pinRef} data-step="0">
        <div className="stage stage--with-scroll-cue story-stage">
          <div className="story-scene">{scene}</div>
          <div className="steps">
            <ol className="sr-only">
              {steps.map((s, i) => (
                <li key={s.at}>
                  {showStepProgress && <span>ขั้นที่ {i + 1} จาก {steps.length}</span>}
                  <h3>{s.title}</h3>
                  {s.body && <p>{s.body}</p>}
                </li>
              ))}
            </ol>
            {steps.map((s, i) => {
              const extra = stepExtra?.(i);
              return (
                <article key={s.at} className={i === 0 ? "step on" : "step"} aria-hidden={extra ? undefined : true}>
                  {showStepProgress && (
                    <div className="story-step-progress" aria-hidden="true">
                      <span className="story-step-count">{formatStepCounter(i, steps.length)}</span>
                      <span className="story-step-dots">
                        {steps.map((_, dot) => (
                          <i key={dot} className={dot === i ? "current" : dot < i ? "reached" : undefined} />
                        ))}
                      </span>
                    </div>
                  )}
                  <h3 aria-hidden="true">{s.keepPhrases ? <Phrases text={s.title} /> : s.title}</h3>
                  {s.body && <p aria-hidden="true">{s.body}</p>}
                  {extra}
                </article>
              );
            })}
          </div>
        </div>
        <ScrollCue />
      </section>
    </div>
  );
}
