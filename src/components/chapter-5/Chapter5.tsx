import { CHAPTER_5, MYTHS } from "@/content/chapter-5";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter5() {
  return (
    <section className="chapter" id="ch5" aria-labelledby="ch5-title">
      <ChapterHead chapter={CHAPTER_5} titleId="ch5-title" />
      <StoryStage id="pin5" steps={CHAPTER_5.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
      <section className="chapter-extra" aria-labelledby="myths-title">
        <h3 id="myths-title">ความเชื่อผิด กับความจริง</h3>
        <ul className="extra-list">
          {MYTHS.map((m) => (
            <li key={m.myth}>
              <p><strong>ความเชื่อ:</strong> {m.myth}</p>
              <p><strong>ความจริง:</strong> {m.fact}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
