import { CLOSING } from "@/content/closing";

export function Closing() {
  return (
    <section className="closing" id="closing" aria-labelledby="closing-title">
      <p className="ch-num">บทปิด</p>
      <h2 id="closing-title">{CLOSING.title}</h2>
      <section className="chapter-extra" aria-labelledby="summary-title">
        <h3 id="summary-title">{CLOSING.summaryTitle}</h3>
        <ol className="extra-list">
          {CLOSING.summary.map((line) => <li key={line}>{line}</li>)}
        </ol>
      </section>
      <section className="chapter-extra" aria-labelledby="review-quiz-title">
        <h3 id="review-quiz-title">{CLOSING.quizTitle}</h3>
        <ol className="extra-list">
          {CLOSING.quiz.map((q) => (
            <li key={q.question}>
              <p>{q.question}</p>
              <p>{q.choices.join(" / ")}</p>
            </li>
          ))}
        </ol>
      </section>
      <p className="closing-final">{CLOSING.final}</p>
    </section>
  );
}
