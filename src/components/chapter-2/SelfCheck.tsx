"use client";

import { useState } from "react";
import { SELF_CHECK } from "@/content/chapter-2";

/** "Which applies to you?" — no score, nothing stored or sent; selections live in this component only. */
export function SelfCheck() {
  const [picked, setPicked] = useState<readonly string[]>([]);
  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  // option order, not tap order, so the advice reads the same as the list above it
  const chosen = SELF_CHECK.options.filter((o) => picked.includes(o.id));

  return (
    <section className="self-check" aria-labelledby="self-check-title">
      <h3 id="self-check-title">{SELF_CHECK.title}</h3>
      <p className="self-check-hint">{SELF_CHECK.hint}</p>
      <div className="self-check-options">
        {SELF_CHECK.options.map((o) => (
          <button key={o.id} type="button" aria-pressed={picked.includes(o.id)} onClick={() => toggle(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      <div className="self-check-result" aria-live="polite">
        {chosen.length > 0 && (
          <>
            <p className="self-check-answer">{SELF_CHECK.answer}</p>
            <ul className="self-check-next">
              {chosen.map((o) => (
                <li key={o.id}>{o.next}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
