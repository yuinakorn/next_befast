import { RISK_NOTES } from "@/content/chapter-2";

/** Short "good to know" note between the pinned scene and the self check: less common risks, kept quiet. */
export function RiskNotes() {
  return (
    <section className="chapter-extra risk-notes" aria-labelledby="risk-notes-title">
      <h3 id="risk-notes-title">{RISK_NOTES.title}</h3>
      <ul>
        {RISK_NOTES.items.map((n) => (
          <li key={n.label}>
            <strong>{n.label}</strong> {n.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
