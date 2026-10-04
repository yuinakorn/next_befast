import { CHAPTER_2 } from "@/content/chapter-2";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter2() {
  return (
    <section className="chapter" id="ch2" aria-labelledby="ch2-title">
      <ChapterHead chapter={CHAPTER_2} titleId="ch2-title" reverse />
      <StoryStage id="pin2" steps={CHAPTER_2.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
    </section>
  );
}
