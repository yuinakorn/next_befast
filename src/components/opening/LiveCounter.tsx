"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { OPENING } from "@/content/opening";
import { cellsLost, formatCount } from "@/lib/live-counter";

const noopSubscribe = () => () => {};

/** "Cells lost since you opened this page". Server / no-JS render shows the per-second rate instead. */
export function LiveCounter() {
  // false on the server and during hydration, true once running in the browser
  const live = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!live || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const every = reduce ? 1000 : 100; // at most 10 DOM writes per second
    let raf = 0;
    let last = -Infinity;
    const tick = (now: number) => {
      // rAF time shares performance.now()'s origin: milliseconds since the page started loading
      if (now - last >= every) {
        last = now;
        el.textContent = formatCount(cellsLost(now));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  if (!live) return <p className="counter">{OPENING.counterStatic}</p>;
  return (
    <p className="counter">
      <span aria-hidden="true">{OPENING.counterBefore}</span>
      <span className="counter-num" ref={numRef} aria-hidden="true">0</span>
      <span aria-hidden="true">{OPENING.counterAfter}</span>
      <span className="sr-only">{OPENING.counterStatic}</span>
    </p>
  );
}
