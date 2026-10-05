"use client";

import { useId, useState } from "react";
import { MYTHS } from "@/content/chapter-5";

function FlipCardIcon() {
  return (
    <span className="myth-flip" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M12 4.5a7.5 7.5 0 1 0 6.82 4.4.75.75 0 0 1 1.36-.63A9 9 0 1 1 12 3Z" />
        <path d="M12 6.7V.8a.4.4 0 0 1 .66-.31l3.54 2.95a.4.4 0 0 1 0 .62l-3.54 2.95A.4.4 0 0 1 12 6.7Z" />
      </svg>
    </span>
  );
}

/**
 * Myth / fact flip cards. Each card is a toggle button: its name stays the myth, `aria-pressed`
 * says whether it is flipped, and the fact is announced through a polite live region (and
 * exposed as the button's description while flipped). Only the face that is showing is exposed
 * (`aria-hidden` swaps with the flip); the name and description still resolve through
 * `aria-labelledby` / `aria-describedby` even when their face is hidden. Nothing is stored or sent.
 */
export function MythCards() {
  const uid = useId();
  const [flipped, setFlipped] = useState<readonly boolean[]>(() => MYTHS.map(() => false));
  const [announce, setAnnounce] = useState("");

  const toggle = (i: number) => {
    const on = !flipped[i];
    setFlipped((prev) => prev.map((v, j) => (j === i ? on : v)));
    setAnnounce(on ? `ความจริง: ${MYTHS[i].fact}` : "");
  };

  return (
    <section className="chapter-extra myths" aria-labelledby="myths-title">
      <h3 id="myths-title">ความเชื่อผิด กับความจริง</h3>
      <p className="myths-hint">แตะการ์ดเพื่อดูความจริง</p>
      <ul className="myth-grid">
        {MYTHS.map((m, i) => {
          const on = flipped[i];
          const frontId = `${uid}-front-${i}`;
          const backId = `${uid}-back-${i}`;
          return (
            <li key={m.myth}>
              <button
                type="button"
                className="myth-card"
                aria-pressed={on}
                aria-labelledby={frontId}
                aria-describedby={on ? backId : undefined}
                onClick={() => toggle(i)}
              >
                <span className="myth-inner">
                  <span className="myth-face myth-front" aria-hidden={on}>
                    <span className="myth-copy" id={frontId}>
                      <span className="myth-label">ความเชื่อผิด:</span>{" "}
                      <span className="myth-text">{m.myth}</span>
                    </span>
                    <FlipCardIcon />
                  </span>
                  <span className="myth-face myth-back" aria-hidden={!on}>
                    <span className="myth-copy" id={backId}>
                      <span className="myth-label">ความจริง:</span>{" "}
                      <span className="myth-text">{m.fact}</span>
                    </span>
                    <FlipCardIcon />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </section>
  );
}
