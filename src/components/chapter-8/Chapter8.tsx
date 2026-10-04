import { CHAPTER_8 } from "@/content/chapter-8";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { RememberStage } from "./RememberStage";
import { ShareButton } from "./ShareButton";

export function Chapter8() {
  return (
    <section className="chapter" id="ch8" aria-labelledby="ch8-title">
      <ChapterHead chapter={CHAPTER_8} titleId="ch8-title" reverse />
      <RememberStage />
      <ShareButton />
    </section>
  );
}
