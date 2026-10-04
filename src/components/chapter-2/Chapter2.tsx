import { CHAPTER_2 } from "@/content/chapter-2";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { RiskStage } from "./RiskStage";
import { SelfCheck } from "./SelfCheck";

export function Chapter2() {
  return (
    <section className="chapter" id="ch2" aria-labelledby="ch2-title">
      <ChapterHead chapter={CHAPTER_2} titleId="ch2-title" reverse />
      <RiskStage />
      <SelfCheck />
    </section>
  );
}
