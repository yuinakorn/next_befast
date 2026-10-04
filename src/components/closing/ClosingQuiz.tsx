"use client";

import { useState } from "react";
import { CLOSING } from "@/content/closing";
import { choiceStatus, choose, freshQuiz, solvedCount, type ChoiceStatus } from "@/lib/closing-quiz";

/** Shown under a question after a wrong choice (the page copy has no wording for it). */
const TRY_AGAIN = "ยังไม่ใช่ ลองเลือกใหม่อีกครั้ง";

function Mark({ status }: { status: ChoiceStatus }) {
  return (
    <span className="cq-mark" aria-hidden="true">
      {status === "right" && (
        <svg viewBox="0 0 24 24"><path d="M5,12.5 L10,17.5 L19,7" /></svg>
      )}
      {status === "wrong" && (
        <svg viewBox="0 0 24 24"><path d="M7,7 L17,17 M17,7 L7,17" /></svg>
      )}
    </span>
  );
}

/**
 * Five-question review. A wrong choice is marked and the reader tries again; the right one is marked and
 * explained. Choices stay focusable (aria-disabled, not disabled) so keyboard focus never drops.
 * No judgement, nothing stored or sent: the state lives in this component only.
 */
export function ClosingQuiz() {
  const [state, setState] = useState(() => freshQuiz(CLOSING.quiz.length));
  const solved = solvedCount(state);

  function pick(qi: number, ci: number) {
    setState((prev) => prev.map((s, i) => (i === qi ? choose(s, ci, CLOSING.quiz[qi].answer) : s)));
  }

  return (
    <section className="closing-block closing-quiz" aria-labelledby="review-quiz-title">
      <h3 id="review-quiz-title">{CLOSING.quizTitle}</h3>
      <ol className="cq-list">
        {CLOSING.quiz.map((q, qi) => {
          const s = state[qi];
          const tried = s.wrong.length > 0;
          return (
            <li key={q.question} className={s.solved ? "cq-item solved" : "cq-item"}>
              <p className="cq-q" id={`cq-q-${qi}`}>{q.question}</p>
              <div className="cq-choices" role="group" aria-labelledby={`cq-q-${qi}`}>
                {q.choices.map((choice, ci) => {
                  const status = choiceStatus(s, ci, q.answer);
                  return (
                    <button
                      key={choice}
                      type="button"
                      className={`cq-choice ${status}`}
                      aria-disabled={status === "open" ? undefined : true}
                      aria-describedby={`cq-fb-${qi}`}
                      onClick={() => pick(qi, ci)}
                    >
                      <Mark status={status} />
                      <span>{choice}</span>
                    </button>
                  );
                })}
              </div>
              <p className="cq-feedback" id={`cq-fb-${qi}`} aria-live="polite">
                {s.solved ? (
                  <>
                    <strong>ถูกต้อง</strong> {q.explain}
                  </>
                ) : tried ? (
                  TRY_AGAIN
                ) : null}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="cq-score">
        ตอบถูก <span className="cq-score-num">{solved}</span> จาก <span className="cq-score-num">{CLOSING.quiz.length}</span>
      </p>
    </section>
  );
}
