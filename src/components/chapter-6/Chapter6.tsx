import { CHAPTER_6, PULSE_CHECK } from "@/content/chapter-6";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter6() {
  return (
    <section className="chapter" id="ch6" aria-labelledby="ch6-title">
      <ChapterHead chapter={CHAPTER_6} titleId="ch6-title" reverse />
      <StoryStage id="pin6" steps={CHAPTER_6.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
      <section className="chapter-extra" aria-labelledby="pulse-title">
        <h3 id="pulse-title">{PULSE_CHECK.title}</h3>
        <p>{PULSE_CHECK.how}</p>
        <p>{PULSE_CHECK.advice}</p>
      </section>
    </section>
  );
}
