"use client";

import { useId, useState } from "react";
import { MYTHS } from "@/content/chapter-5";

/**
 * Myth / fact flip cards. Each card is a toggle button: its name stays the myth, `aria-pressed`
 * says whether it is flipped, and the fact is announced through a polite live region (and
 * exposed as the button's description while flipped). Nothing is stored or sent.
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
                  <span className="myth-face myth-front">
                    <span className="myth-copy" id={frontId}>
                      <span className="myth-label">ความเชื่อ:</span>{" "}
                      <span className="myth-text">{m.myth}</span>
                    </span>
                    <svg className="myth-flip" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20,12 A8,8 0 1 1 15.5,4.9 M15.5,2 V5.5 H19" />
                    </svg>
                  </span>
                  <span className="myth-face myth-back" aria-hidden="true">
                    <span className="myth-copy" id={backId}>
                      <span className="myth-label">ความจริง:</span>{" "}
                      <span className="myth-text">{m.fact}</span>
                    </span>
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
