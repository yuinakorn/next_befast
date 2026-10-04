import { ChapterVisual } from "@/components/ui/ChapterVisual";
import { BrainClock } from "./BrainClock";

export function Chapter3() {
  return (
    <section className="chapter" id="ch3" aria-labelledby="ch3-title">
      <header className="ch-head ch-head--visual">
        <div className="ch-copy">
          <p className="ch-num">บทที่ 3</p>
          <h2 id="ch3-title">นาฬิกาสมอง</h2>
          <p className="lead">
            เมื่อเกิดสโตรก เวลาไม่ได้เป็นแค่ตัวเลขบนนาฬิกา แต่คือเนื้อสมองที่ค่อยๆ หายไป
            นาฬิกาทรายด้านล่างจะเดินตามการเลื่อนของคุณ
          </p>
        </div>
        <ChapterVisual
          src="/illustrations/chapter-3-time-is-brain.webp"
          alt="ภาพสมองกับนาฬิกาทราย"
          variant="chapter-visual--time"
          sizes="(min-width: 861px) 64vw, 100vw"
        />
      </header>

      <BrainClock />

      <ChapterVisual
        src="/illustrations/chapter-3-treatment-window.webp"
        alt="เส้นทางการรักษาโรคหลอดเลือดสมอง"
        variant="chapter-visual--treatment"
        sizes="(min-width: 1280px) 1180px, 100vw"
      >
        <figcaption>
          <strong className="visual-title">ทุกนาทีมีผลต่อทางเลือกในการรักษา</strong>
          <span className="visual-copy">
            แพทย์ต้องประเมินและสแกนสมองก่อนเลือกวิธีรักษา ยิ่งถึงโรงพยาบาลเร็ว ยิ่งมีเวลาพอ
          </span>
        </figcaption>
      </ChapterVisual>
    </section>
  );
}
