"use client";

import { useEffect, useRef, useState } from "react";
import { chapterProgress } from "@/lib/chapter-progress";

const CHAPTERS = 8;
const LABEL_MS = 2500;

/** What sits inside each chapter's circle. */
function Marker({ index }: { index: number }) {
  return <span className="progress-num">{index + 1}</span>;
}

/**
 * Chapter map pinned to the top of the viewport: one circle per chapter (1–8) joined by a line that
 * fills as the reader scrolls, and a short "บทที่ n จาก 8" label that shows for a moment whenever the
 * reader enters a new chapter. Each circle links to its chapter.
 */
export function ProgressBar() {
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [current, setCurrent] = useState(-1);
  const [titles, setTitles] = useState<string[]>([]);
  const [shown, setShown] = useState(false);
  const [away, setAway] = useState(true);

  useEffect(() => {
    const ids = [...Array.from({ length: CHAPTERS }, (_, i) => `ch${i + 1}`), "closing"];
    let bounds: number[] = [];
    let viewH = window.innerHeight;
    let last = -2;
    let timer: number | undefined;

    const measure = () => {
      viewH = window.innerHeight;
      const els = ids.map((id) => document.getElementById(id));
      if (els.some((el) => !el)) return;
      bounds = els.map((el) => el!.getBoundingClientRect().top + window.scrollY);
      setTitles(ids.slice(0, CHAPTERS).map((id) => document.getElementById(`${id}-title`)?.textContent ?? ""));
      update();
    };

    const update = () => {
      if (bounds.length === 0) return;
      const y = window.scrollY + viewH * 0.4;
      const { current: now, fills } = chapterProgress(y, bounds);
      fills.forEach((f, i) => {
        const el = fillRefs.current[i];
        if (el) el.style.transform = `scaleX(${f})`;
      });
      setAway(y < bounds[0]);
      if (now === last) return;
      const first = last === -2;
      last = now;
      setCurrent(now);
      window.clearTimeout(timer);
      const inChapters = now >= 0 && y < bounds[CHAPTERS];
      if (!inChapters || first) {
        setShown(false);
        return;
      }
      setShown(true);
      timer = window.setTimeout(() => setShown(false), LABEL_MS);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`progress${away ? " is-away" : ""}`}>
      <nav className="progress-map" aria-label="บทเรียน">
        <ol>
          {Array.from({ length: CHAPTERS }, (_, i) => {
            const state = i < current ? "done" : i === current ? "current" : "todo";
            return (
              <li key={i} className={`progress-step is-${state}`}>
                {i < CHAPTERS - 1 && (
                  <span className="progress-line" aria-hidden="true">
                    <span ref={(el) => { fillRefs.current[i] = el; }} />
                  </span>
                )}
                <a
                  href={`#ch${i + 1}`}
                  className="progress-dot"
                  aria-label={`บทที่ ${i + 1}${titles[i] ? `: ${titles[i]}` : ""}`}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <Marker index={i} />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
      {current >= 0 && (
        <p className={`progress-label${shown ? " is-shown" : ""}`} aria-hidden="true">
          <span className="progress-count">บทที่ {current + 1} จาก {CHAPTERS}</span> · {titles[current]}
        </p>
      )}
    </div>
  );
}
