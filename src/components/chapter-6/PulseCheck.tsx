"use client";

import { useEffect, useRef, useState } from "react";
import { PULSE_CHECK } from "@/content/chapter-6";
import { remainingMs, ringTarget, secondsLeft } from "@/lib/countdown";

type Phase = "idle" | "running" | "done";

const TOTAL = PULSE_CHECK.seconds;
/** Spoken once when the timer runs out (UI string, not script copy). */
const DONE_NOTICE = `ครบ ${TOTAL} วินาที`;
/** Re-check the clock this often; the number only re-renders when the whole second changes. */
const POLL_MS = 200;

/**
 * "ลองจับชีพจรตัวเอง": a 30-second countdown for counting the pulse. The time is computed from a
 * timestamp (performance.now) so a throttled tab or a slow frame never drifts it. Nothing is
 * stored or sent. The advice is plain text under the instructions, always visible. Only the end of the
 * countdown is announced (aria-live); the ticking number is a `role="timer"`, which screen readers do
 * not announce on every change.
 */
export function PulseCheck() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState<number>(TOTAL);
  const startedAt = useRef(0);

  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const remaining = remainingMs(startedAt.current, performance.now(), TOTAL * 1000);
      setLeft(secondsLeft(remaining));
      if (remaining <= 0) setPhase("done");
    };
    const id = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(id);
  }, [phase]);

  const start = () => {
    startedAt.current = performance.now();
    setLeft(TOTAL);
    setPhase("running");
  };
  const reset = () => {
    setLeft(TOTAL);
    setPhase("idle");
  };

  const running = phase === "running";
  const label = running ? "หยุดจับเวลา" : phase === "done" ? "จับเวลาอีกครั้ง" : PULSE_CHECK.start;

  return (
    <section className="chapter-extra c6-pulse" aria-labelledby="pulse-title">
      <div className="c6-pulse-copy">
        <h3 id="pulse-title">{PULSE_CHECK.title}</h3>
        <p>{PULSE_CHECK.how}</p>
        <p className="c6-advice">{PULSE_CHECK.advice}</p>
      </div>
      <div className="c6-pulse-card">
        <div className="c6-ring" role="timer" aria-label="เวลาที่เหลือ">
          <svg className="c6-ring-svg" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="c6-ring-track" cx="60" cy="60" r="54" />
            <circle
              className="c6-ring-arc"
              cx="60"
              cy="60"
              r="54"
              pathLength={1}
              style={{ strokeDashoffset: 1 - ringTarget(running, left, TOTAL) }}
            />
          </svg>
          <div className="c6-ring-body">
            {phase === "done" ? (
              <>
                <svg className="c6-ring-done" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5,12.5 L10,17.5 L19,7" />
                </svg>
                <span className="sr-only">0 วินาที</span>
              </>
            ) : (
              <>
                <span className="c6-ring-num">{left}</span>
                <span className="c6-ring-unit">วินาที</span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          className={running ? "c6-pulse-btn c6-pulse-btn--stop" : "c6-pulse-btn"}
          onClick={running ? reset : start}
        >
          {label}
        </button>
        <p className="sr-only" aria-live="polite">{phase === "done" ? DONE_NOTICE : ""}</p>
      </div>
    </section>
  );
}
