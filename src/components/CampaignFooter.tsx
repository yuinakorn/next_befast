import Image from "next/image";
import { OPENING } from "@/content/opening";
import { VisitorCount } from "./VisitorCount";

/** Sources and disclaimer, then the navy Walk Run Bike 12 band (as on the campaign posters). */
export function CampaignFooter() {
  return (
    <footer>
      <div className="site-footer">
        <p>
          <strong>แหล่งข้อมูล</strong> บทสัมภาษณ์ รศ.นพ.ยงชัย นิละนนท์ ประธานศูนย์โรคหลอดเลือดสมองศิริราช
          รายการบ่ายนี้มีคำตอบ ช่อง MCOT HD ออกอากาศ 14 สิงหาคม 2569 ตัวเลข “สมองแก่ลงราว 3.6 ปีต่อชั่วโมง”
          อ้างอิงงานวิจัย Saver JL (2006) Time is Brain—Quantified
          ความเสี่ยงตลอดชีวิต 1 ใน 4 อ้างอิง GBD 2016 Lifetime Risk of Stroke Collaborators (2018) N Engl J Med
          คำแนะนำเรื่องแอลกอฮอล์ อ้างอิง WHO (2023) No level of alcohol consumption is safe for our health, Lancet Public Health
        </p>
        <p>เนื้อหานี้เพื่อการเรียนรู้ ไม่ใช้แทนคำแนะนำของแพทย์ หากสงสัยว่ามีอาการ โทร 1669 ทันที</p>
      </div>
      <div className="campaign-band">
        <div className="campaign-band-inner">
          <Image
            src="/brand/wrb12-on-navy.webp"
            alt={OPENING.logoAlt}
            width={640}
            height={441}
            className="campaign-logo"
          />
          <div className="campaign-copy">
            <p>
              แสงนำใจไทยทั้งชาติ
              <br />
              เดิน วิ่ง ปั่น ป้องกันอัมพาต
              <br />
              ครั้งที่ 12 เฉลิมพระเกียรติ
            </p>
            <VisitorCount />
          </div>
        </div>
        <div className="campaign-partners">
          <Image
            src="/brand/partners.webp"
            alt="ตราหน่วยงานผู้ร่วมจัด เช่น คณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ศูนย์โรคหลอดเลือดสมองศิริราช มูลนิธิศิริราช มูลนิธิไทยคม กระทรวงสาธารณสุข กระทรวงการท่องเที่ยวและกีฬา กรมประชาสัมพันธ์ และสถาบันการแพทย์ฉุกเฉินแห่งชาติ"
            width={1965}
            height={390}
            sizes="(min-width: 861px) 812px, calc(100vw - 72px)"
            className="campaign-partners-logo"
          />
        </div>
      </div>
    </footer>
  );
}
