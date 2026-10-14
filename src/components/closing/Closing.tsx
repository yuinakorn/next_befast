import { CLOSING } from "@/content/closing";
import { Phrases } from "@/components/ui/Phrases";
import { SurveyQr } from "@/components/ui/SurveyQr";
import { ClosingPlate } from "./ClosingPlate";
import { ClosingQuiz } from "./ClosingQuiz";
import { RecapStage } from "./RecapStage";

/** Summary as a pinned recap scene, then (not pinned) review quiz, navy closing plate and the post-lesson survey. */
export function Closing() {
  return (
    <section className="closing" id="closing" aria-labelledby="closing-title">
      <header className="closing-block closing-head">
        <p className="ch-num">บทปิด</p>
        <h2 id="closing-title">
          <Phrases text={CLOSING.title} />
        </h2>
      </header>
      <section className="closing-summary" aria-labelledby="summary-title">
        <h3 id="summary-title" className="closing-block">{CLOSING.summaryTitle}</h3>
        <RecapStage />
      </section>
      <ClosingQuiz />
      <ClosingPlate />
      <section className="closing-survey" aria-labelledby="closing-survey-title">
        <div className="closing-survey-inner">
          <h3 id="closing-survey-title">
            แบบประเมินการเข้าร่วมกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง
            “ออกกําลังเป็นนิสัยห่างไกลสโตรค”
          </h3>
          <p>
            สแกนคิวอาร์โค้ด
            หรือแตะที่ภาพเพื่อตอบแบบประเมินการเข้าร่วมกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง
            “ออกกําลังเป็นนิสัยห่างไกลสโตรค”
          </p>
          <SurveyQr
            className="closing-survey-link"
            href="https://limesurvey.tpak.or.th/index.php?r=survey/index&sid=821358&lang=th"
            label="เปิดแบบประเมินการเข้าร่วมกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง ออกกําลังเป็นนิสัยห่างไกลสโตรค ในแท็บใหม่"
            src="/qr/stroke-learning-survey.jpg"
            alt="คิวอาร์โค้ดสำหรับแบบประเมินกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง ออกกําลังเป็นนิสัยห่างไกลสโตรค"
          />
        </div>
      </section>
    </section>
  );
}
