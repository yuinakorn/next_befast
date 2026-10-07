import Image from "next/image";
import { CLOSING } from "@/content/closing";
import { Phrases } from "@/components/ui/Phrases";
import { ClosingPlate } from "./ClosingPlate";
import { ClosingQuiz } from "./ClosingQuiz";

/** Not pinned: summary, review quiz, navy closing plate, then the post-lesson survey. */
export function Closing() {
  return (
    <section className="closing" id="closing" aria-labelledby="closing-title">
      <header className="closing-block closing-head">
        <p className="ch-num">บทปิด</p>
        <h2 id="closing-title">
          <Phrases text={CLOSING.title} />
        </h2>
      </header>
      <section className="closing-block closing-summary" aria-labelledby="summary-title">
        <h3 id="summary-title">{CLOSING.summaryTitle}</h3>
        <ol className="closing-cards">
          {CLOSING.summary.map((line) => (
            <li key={line}>
              <p>{line}</p>
            </li>
          ))}
        </ol>
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
          <a
            className="closing-survey-link"
            href="https://limesurvey.tpak.or.th/index.php?r=survey/index&sid=821358&lang=th"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="เปิดแบบประเมินการเข้าร่วมกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง ออกกําลังเป็นนิสัยห่างไกลสโตรค ในแท็บใหม่"
          >
            <Image
              src="/qr/stroke-learning-survey.jpg"
              alt="คิวอาร์โค้ดสำหรับแบบประเมินกิจกรรมให้ความรู้เกี่ยวกับโรคหลอดเลือดสมอง ออกกําลังเป็นนิสัยห่างไกลสโตรค"
              width={1148}
              height={1148}
              sizes="(max-width: 699px) 68vw, 280px"
            />
            <span>
              เปิดลิงก์กิจกรรม
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M14 5h5v5M19 5l-8 8M19 13v6H5V5h6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </section>
    </section>
  );
}
