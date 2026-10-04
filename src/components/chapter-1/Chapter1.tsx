import { CHAPTER_1 } from "@/content/chapter-1";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter1() {
  return (
    <section className="chapter" id="ch1" aria-labelledby="ch1-title">
      <ChapterHead chapter={CHAPTER_1} titleId="ch1-title" />
      <StoryStage id="pin1" steps={CHAPTER_1.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
    </section>
  );
}
