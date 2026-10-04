import { CLOSING } from "@/content/closing";
import { Phrases } from "@/components/ui/Phrases";
import { ClosingPlate } from "./ClosingPlate";
import { ClosingQuiz } from "./ClosingQuiz";

/** Not pinned: the three-line summary, the review quiz, then the navy plate that hands over to the footer. */
export function Closing() {
  return (
    <section className="closing" id="closing" aria-labelledby="closing-title">
      <header className="closing-block closing-head">
        <p className="ch-num">บทปิด</p>
        <h2 id="closing-title">
          <Phrases text={CLOSING.title} />
        </h2>
      </header>
      <section className="closing-block closing-summary" aria-labelledby="summary-title">
        <h3 id="summary-title">{CLOSING.summaryTitle}</h3>
        <ol className="closing-cards">
          {CLOSING.summary.map((line) => (
            <li key={line}>
              <p>{line}</p>
            </li>
          ))}
        </ol>
      </section>
      <ClosingQuiz />
      <ClosingPlate />
    </section>
  );
}
