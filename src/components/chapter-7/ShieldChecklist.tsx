"use client";

import { useState } from "react";
import { SHIELD_CHECKLIST } from "@/content/chapter-7";
import { Shield } from "@/components/ui/Shield";
import { checklistStatus, toggleIndex } from "@/lib/shield-assembly";

const MESSAGES = { encourage: SHIELD_CHECKLIST.encourage, complete: SHIELD_CHECKLIST.complete } as const;

/**
 * "วันนี้คุณทำได้กี่ข้อ": item i lights shield piece i (4 diseases first, then 6 behaviours).
 * No score, no blame, nothing stored or sent: the ticks live in this component only.
 */
export function ShieldChecklist() {
  const [ticked, setTicked] = useState<readonly number[]>([]);
  const count = ticked.length;
  const total = SHIELD_CHECKLIST.items.length;

  return (
    <section className="chapter-extra c7-check" aria-labelledby="shield-title">
      <div className="c7-check-copy">
        <h3 id="shield-title">{SHIELD_CHECKLIST.title}</h3>
        <p>{SHIELD_CHECKLIST.hint}</p>
      </div>

      <div className="c7-board">
        <div className="c7-board-shield">
          <Shield lit={ticked} />
        </div>
        <div className="c7-board-text">
          <p className="c7-count">
            <span className="sr-only">ทำได้ {count} จาก {total} ข้อ</span>
            <span aria-hidden="true">
              <span className="c7-count-num">{count}</span>
              <span className="c7-count-total">/{total}</span>
            </span>
          </p>
          <p className="c7-msg" aria-live="polite">{MESSAGES[checklistStatus(count, total)]}</p>
        </div>
      </div>

      <ul className="c7-list">
        {SHIELD_CHECKLIST.items.map((item, i) => (
          <li key={item}>
            <label className="c7-item">
              <input
                type="checkbox"
                className="c7-box"
                checked={ticked.includes(i)}
                onChange={() => setTicked((prev) => toggleIndex(prev, i))}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
