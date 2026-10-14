import type { Step } from "./types.ts";

/** Closing copy (script › บทปิด: เริ่มดูแลหลอดเลือดของเรา ตั้งแต่วันนี้). */
export const CLOSING = {
  title: "เริ่มดูแลหลอดเลือดของเรา ตั้งแต่วันนี้",
  summaryTitle: "สรุปสามประโยค",
  summary: [
    "เห็นอาการ BEFAST แม้ข้อเดียว จำเวลา แล้วโทร 1669 ทันที",
    "ทุกนาทีมีค่า ยาละลายลิ่มเลือดให้ได้ภายใน 4.5 ชั่วโมง",
    "สโตรกป้องกันได้ถึง 90% ด้วยการควบคุม\u00a04\u00a0โรค +\u00a0ปรับ\u00a06\u00a0พฤติกรรม",
  ],
  quizTitle: "แบบทดสอบทบทวน 5 ข้อ",
  quiz: [
    {
      question: "เมื่อเกิดสโตรก เซลล์สมองตายนาทีละประมาณเท่าไหร่",
      choices: ["1.9 พันเซลล์", "1.9 ล้านเซลล์", "19 ล้านเซลล์"],
      answer: 1,
      explain: "นี่คือเหตุผลที่เราพูดว่าทุกนาทีที่ช้าคือสมองที่สูญเสีย",
    },
    {
      question: "ยาละลายลิ่มเลือดต้องให้ภายในกี่ชั่วโมงหลังเริ่มมีอาการ",
      choices: ["4.5 ชั่วโมง", "12 ชั่วโมง", "48 ชั่วโมง"],
      answer: 0,
      explain: "หรือ 270 นาที และต้องสแกนสมองก่อนให้ยา จึงยิ่งต้องรีบ",
    },
    {
      question: "ตัว F ใน BEFAST หมายถึงอะไร",
      choices: ["ไข้สูง", "หน้าเบี้ยว ยิ้มไม่เท่ากัน", "เหนื่อยง่าย"],
      answer: 1,
      explain: "ให้ยิ้มหรือยิงฟัน แล้วดูว่ามุมปากสองข้างเท่ากันไหม",
    },
    {
      question: "เห็นคนมีอาการสโตรก ควรทำอะไรเป็นอย่างแรก",
      choices: ["เจาะเลือดปลายนิ้ว", "ให้กินยาแอสไพริน", "โทร 1669 และจดเวลาเริ่มมีอาการ"],
      answer: 2,
      explain: "การเจาะเลือดและการให้ยาเองไม่ช่วย และอาจเป็นอันตราย",
    },
    {
      question: "ข้อใดไม่ใช่ 1 ใน 4 โรคที่ต้องควบคุมเพื่อป้องกันสโตรก",
      choices: ["เบาหวาน", "หัวใจเต้นผิดจังหวะ", "ไมเกรน", "ความดันโลหิตสูง"],
      answer: 2,
      explain: "4 โรคที่ต้องคุมคือ เบาหวาน ความดันโลหิตสูง ไขมันในเลือดสูง และหัวใจเต้นผิดจังหวะ",
    },
  ],
  final: "เริ่มดูแลหลอดเลือดของเรา ตั้งแต่วันนี้ เพื่อชีวิตที่มีคุณภาพ และอนาคตที่คุณเลือกเองได้",
} as const;

/** The summary as a pinned scene: one sentence per step, then the three pictures side by side. */
const RECAP_STEPS: Step[] = [
  { at: 0, title: CLOSING.summary[0] },
  { at: 0.26, title: CLOSING.summary[1] },
  { at: 0.52, title: CLOSING.summary[2] },
  { at: 0.78, title: "จำ 3 ข้อนี้ไว้ แล้วส่งต่อ", body: "บันทึกภาพสรุปเก็บไว้ในโทรศัพท์ หรือส่งให้คนที่คุณรักทางแชต" },
];

/** Copy for the recap scene (closing › สรุปสามประโยค) and the image it saves. */
export const RECAP = {
  steps: RECAP_STEPS,
  /** Under each picture once the three sit side by side (short: one 130-unit column of the scene). */
  labels: ["เห็นอาการ รีบโทร", "ภายใน 4.5 ชม.", "4 โรค + 6 พฤติกรรม"],
  /** Under the count inside the ring of the second picture. */
  minutes: "นาที",
  save: "บันทึกภาพสรุป",
  saving: "กำลังสร้างภาพ…",
  saved: "บันทึกภาพแล้ว ดูได้ในโฟลเดอร์ดาวน์โหลดหรือคลังภาพ",
  failed: "สร้างภาพไม่สำเร็จ ลองใหม่อีกครั้ง หรือแคปหน้าจอไว้แทน",
  /** Title of the saved image (the page title) and the text sent with it to the share sheet. */
  imageTitle: ["ทุกนาทีที่ช้า", "คือสมองที่สูญเสีย"],
  shareText: "จำ 3 ข้อนี้ไว้ เห็นอาการ BEFAST โทร 1669 ทันที",
  fileName: "stroke-befast-1669.png",
  /** Bottom of the saved image. Same wording as the page footer. */
  disclaimer: "เนื้อหานี้เพื่อการเรียนรู้ ไม่ใช้แทนคำแนะนำของแพทย์",
} as const;
