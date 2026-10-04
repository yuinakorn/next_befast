import { ChapterVisual } from "@/components/ui/ChapterVisual";
import { BefastStage } from "./BefastStage";
import { Quiz } from "./Quiz";

export function Chapter4() {
  return (
    <section className="chapter" id="ch4" aria-labelledby="ch4-title">
      <header className="ch-head ch-head--visual ch-head--reverse">
        <div className="ch-copy">
          <p className="ch-num">บทที่ 4</p>
          <h2 id="ch4-title">จับสัญญาณให้ทันด้วย BEFAST</h2>
          <p className="lead">
            อาการของสโตรกมักเกิดขึ้นทันที และเจอเพียงข้อเดียวก็ต้องรีบไปโรงพยาบาล
            ระหว่างเลื่อนผ่านบทนี้ คุณจะได้ลองสัมผัสอาการบางอย่างด้วยตัวเอง
          </p>
        </div>
        <ChapterVisual
          src="/illustrations/chapter-4-recognize-signs.webp"
          alt="ครอบครัวสังเกตสัญญาณเตือนโรคหลอดเลือดสมอง"
          variant="chapter-visual--signs"
          sizes="(min-width: 861px) 64vw, 100vw"
        />
      </header>

      <BefastStage />
      <Quiz />
    </section>
  );
}
