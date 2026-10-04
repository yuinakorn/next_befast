import { CHAPTER_8 } from "@/content/chapter-8";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter8() {
  return (
    <section className="chapter" id="ch8" aria-labelledby="ch8-title">
      <ChapterHead chapter={CHAPTER_8} titleId="ch8-title" reverse />
      <StoryStage id="pin8" steps={CHAPTER_8.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
    </section>
  );
}
