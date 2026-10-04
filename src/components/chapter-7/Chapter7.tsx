import { CHAPTER_7, SHIELD_CHECKLIST } from "@/content/chapter-7";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter7() {
  return (
    <section className="chapter" id="ch7" aria-labelledby="ch7-title">
      <ChapterHead chapter={CHAPTER_7} titleId="ch7-title" />
      <StoryStage id="pin7" steps={CHAPTER_7.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
      <section className="chapter-extra" aria-labelledby="shield-title">
        <h3 id="shield-title">{SHIELD_CHECKLIST.title}</h3>
        <ul className="extra-list">
          {SHIELD_CHECKLIST.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>{SHIELD_CHECKLIST.complete}</p>
      </section>
    </section>
  );
}
