import { CLOSING } from "@/content/closing";
import { Phrases } from "@/components/ui/Phrases";
import { SurveyQr } from "@/components/ui/SurveyQr";
import { ClosingPlate } from "./ClosingPlate";
import { ClosingQuiz } from "./ClosingQuiz";
import { ClosingSurveyJourney } from "./ClosingSurveyJourney";
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
          <div className="closing-survey-story">
            <ClosingSurveyJourney />
            <h3 id="closing-survey-title">
              <span>เรียนรู้แล้ว</span>
              <span className="closing-survey-title-accent">ก้าวต่ออีกนิด</span>
            </h3>
            <p className="closing-survey-prompt">ช่วยบอกเราว่า กิจกรรมนี้เป็นอย่างไร</p>
            <p className="closing-survey-name">
              แบบประเมินการเข้าร่วมกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง
              <span>“ออกกําลังเป็นนิสัยห่างไกลสโตรค”</span>
            </p>
          </div>
          <SurveyQr
            className="closing-survey-link"
            href="https://limesurvey.tpak.or.th/index.php?r=survey/index&sid=821358&lang=th"
            label="เปิดแบบประเมินการเข้าร่วมกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง ออกกําลังเป็นนิสัยห่างไกลสโตรค ในแท็บใหม่"
            src="/qr/stroke-learning-survey.jpg"
            alt="คิวอาร์โค้ดสำหรับแบบประเมินกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง ออกกําลังเป็นนิสัยห่างไกลสโตรค"
            showLockedAction
          />
        </div>
      </section>
    </section>
  );
}
