---
name: ทุกนาทีที่ช้า คือสมองที่สูญเสีย
description: สื่อการสอนโรคหลอดเลือดสมองแบบ scrollytelling ภาษาไทย ออกแบบให้มือถือและแท็บเล็ตก่อน
colors:
  paper: "#F3F7FC"
  surface: "#FFFFFF"
  ink: "#13235A"
  ink-2: "#4B5A7E"
  line: "#D6DFEC"
  red: "#D3222D"
  red-soft: "rgba(211,34,45,.08)"
  pink: "#EE7C86"
  pink-deep: "#D9545F"
  ash: "#A7AFC0"
  ash-deep: "#7F889D"
  go: "#13895B"
  cath: "#2C66D0"
  visual-bg: "#DDEAF8"
  skin: "#F2C6A0"
  skin-shade: "#DFA47E"
  hair: "#2E3247"
  feature: "#1E2440"
  paper-dark: "#0B1330"
  surface-dark: "#141E42"
  ink-dark: "#E9EEFF"
  ink-2-dark: "#A8B3D4"
  line-dark: "#28345F"
  red-dark: "#FF5560"
  pink-dark: "#F08690"
  ash-dark: "#5E6888"
  go-dark: "#2BC28A"
  cath-dark: "#5B91F2"
typography:
  display:
    fontFamily: "Anuphan, Noto Sans Thai, Leelawadee UI, Thonburi, system-ui, sans-serif"
    fontSize: "clamp(2.7rem, 9vw, 6.6rem)"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Anuphan, Noto Sans Thai, Leelawadee UI, Thonburi, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 6.4vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.28
  title:
    fontFamily: "Anuphan, Noto Sans Thai, Leelawadee UI, Thonburi, system-ui, sans-serif"
    fontSize: "clamp(1.55rem, 3.1vw, 2.45rem)"
    fontWeight: 700
    lineHeight: 1.28
  body:
    fontFamily: "Anuphan, Noto Sans Thai, Leelawadee UI, Thonburi, system-ui, sans-serif"
    fontSize: "clamp(17px, 1rem + .25vw, 20px)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Anuphan, Noto Sans Thai, Leelawadee UI, Thonburi, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.4
  eyebrow:
    fontFamily: "Chakra Petch, Anuphan, Noto Sans Thai, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
  numeral:
    fontFamily: "Chakra Petch, Anuphan, Noto Sans Thai, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.9rem)"
    fontWeight: 600
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
  numeral-hero:
    fontFamily: "Chakra Petch, Anuphan, Noto Sans Thai, system-ui, sans-serif"
    fontSize: "clamp(4rem, 15vw, 9rem)"
    fontWeight: 700
    lineHeight: 1
rounded:
  focus: "6px"
  track: "7px"
  control: "12px"
  media-sm: "24px"
  media-lg: "40px"
  leaf-sm: "52px 16px 52px 16px"
  leaf-lg: "88px 24px 88px 24px"
spacing:
  gap-xs: "10px"
  gap-sm: "14px"
  gap-md: "22px"
  gutter-stage: "clamp(16px, 5vw, 64px)"
  gutter-read: "clamp(20px, 6vw, 40px)"
  gutter-hero: "clamp(20px, 6vw, 80px)"
  section-top: "16vh"
components:
  progress-bar:
    backgroundColor: "{colors.red}"
    height: "4px"
  choice-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "54px"
  choice-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  choice-button-right:
    backgroundColor: "{colors.go}"
    textColor: "#FFFFFF"
  letter-tab:
    textColor: "{colors.ink-2}"
    typography: "{typography.display}"
  letter-tab-active:
    textColor: "{colors.red}"
  check-callout:
    backgroundColor: "{colors.red-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 14px"
  meter-value:
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
  meter-value-alarm:
    textColor: "{colors.red}"
  timeline-track:
    backgroundColor: "{colors.line}"
    rounded: "{rounded.track}"
    height: "14px"
  timeline-drug:
    backgroundColor: "{colors.go}"
  timeline-cath:
    backgroundColor: "{colors.cath}"
  chapter-visual:
    backgroundColor: "{colors.visual-bg}"
    rounded: "{rounded.leaf-lg}"
  chapter-visual-mobile:
    rounded: "{rounded.leaf-sm}"
---

# Design System: ทุกนาทีที่ช้า คือสมองที่สูญเสีย

## Overview

**Creative North Star: "The Calm Alarm" (สัญญาณเตือนที่ใจเย็น)**

หน้านี้พูดเรื่องเร่งด่วนด้วยน้ำเสียงใจเย็น พื้นเป็นกระดาษสีฟ้าอ่อน ตัวหนังสือสีกรมท่าเข้ม ทำให้อ่านแล้วรู้สึกเหมือนเอกสารการแพทย์ที่น่าเชื่อถือ ไม่ใช่โฆษณาที่ปลุกให้ตกใจ สีแดงมีหน้าที่เดียวคือบอกว่าเวลากำลังหมดหรือต้องลงมือทำ พอใช้น้อย คนอ่านก็จะไม่ชินกับมัน

ข้อมูลอยู่ในตัวภาพ เช่น นาฬิกาทราย ตัวนับเซลล์สมอง แถบเวลาการรักษา และตัวอักษร BEFAST ภาพเหล่านี้คือเนื้อหา ข้อความแต่ละขั้นสั้นพออ่านจบในหนึ่งจังหวะการเลื่อน ตัวเลขใช้ฟอนต์ Chakra Petch ที่ดูเป็นเครื่องวัด ส่วนข้อความภาษาไทยใช้ Anuphan ที่อ่านง่ายและเป็นมิตร

พื้นผิวแบนเหมือนกระดาษ ไม่มีเงาลอย แยกชั้นด้วยสีพื้น (paper / surface) และเส้นบาง (line) ภาพประกอบประจำบทใช้มุมโค้งแบบใบไม้ (โค้งมากสองมุม โค้งน้อยสองมุม) และสลับด้านกันระหว่างบท

**Key Characteristics:**
- พื้นกระดาษฟ้าอ่อน ตัวหนังสือกรมท่า มีสีแดงเป็นสีเตือนเพียงสีเดียว
- สีมีความหมายตายตัว: ชมพู = เซลล์สมองที่ยังทำงาน, เทา = ที่สูญเสียไป, เขียว = เวลาที่ยังเหลือ / คำตอบที่ถูก, ฟ้า = การใส่สายสวน
- ตัวเลขทุกตัวใช้ Chakra Petch แบบ tabular ข้อความไทยใช้ Anuphan
- เลื่อนแล้วภาพเปลี่ยนตาม (pinned + scrubbed) และมีทางแตะแทนการเลื่อนเสมอ
- แบนเหมือนกระดาษ ไม่มี drop shadow
- โหมดมืดเป็นสีกรมท่าเข้ม (ไม่ใช่สีดำ) สีทุกตัวมีคู่สำหรับโหมดมืด

## Colors

โทนหลักคือฟ้า-กรมท่าที่ดูสะอาดแบบโรงพยาบาล มีสีแดงเป็นสีเตือน และมีสีที่มีความหมายเฉพาะอีก 4 สีสำหรับข้อมูลทางการแพทย์

### Primary
- **Alarm Red / แดงสัญญาณ** (`red`): ใช้กับเลขบท (eyebrow) แถบความคืบหน้าด้านบน ตัวนับเซลล์สมองที่สูญเสีย ตัวอักษร BEFAST ที่กำลังเลือก ข้อความ "หมดเวลาให้ยา" เลข 1669 และ focus ring ในโหมดมืดเปลี่ยนเป็น `red-dark`
- **Alarm Wash / แดงจาง** (`red-soft`): พื้นหลังกล่อง "วิธีสังเกต" (check callout) ในการ์ด BEFAST ใช้เป็นพื้นหลังได้อย่างเดียว ห้ามใช้เป็นสีตัวอักษร

### Secondary
- **Treatment Green / เขียวเวลาที่เหลือ** (`go`): แถบเวลาให้ยาที่ยังเหลือ ข้อความ "เหลือ x ชม." และปุ่มคำตอบที่ถูกในแบบฝึก
- **Catheter Blue / ฟ้าสายสวน** (`cath`): แถบเวลาใส่สายสวนดึงลิ่มเลือดถึง 24 ชม. ภาพประกอบใช้สีนี้เป็นสีเสื้อด้วย

### Tertiary (สีข้อมูลในนาฬิกาทราย)
- **Living Cell Pink / ชมพูเซลล์ที่ยังทำงาน** (`pink`, `pink-deep`): ทรายด้านบนของนาฬิกาทรายและจุดในคำอธิบายสี `pink-deep` เป็นจุดเริ่มของสีไล่ในสายทรายที่กำลังร่วง
- **Lost Cell Ash / เทาเซลล์ที่สูญเสีย** (`ash`, `ash-deep`): ทรายด้านล่างและจุดในคำอธิบายสี ใช้แสดงข้อมูลอย่างเดียว ห้ามใช้เป็นสีตัวอักษร (คอนทราสต์บนพื้นแค่ประมาณ 2:1)

### Neutral
- **Clinic Paper / กระดาษคลินิก** (`paper`): พื้นหลังหลักของหน้า
- **Clean Sheet / แผ่นขาว** (`surface`): พื้นปุ่มคำตอบ และทุกอย่างที่ต้องดูเด่นขึ้นจากพื้นกระดาษ
- **Deep Navy Ink / กรมท่าเข้ม** (`ink`): หัวข้อ เนื้อหาหลัก เส้นขอบนาฬิกาทราย เส้นคั่นหนา 2px และกางเกงในภาพประกอบ
- **Muted Navy / กรมท่าหม่น** (`ink-2`): คำโปรย คำอธิบาย ป้ายกำกับ และตัวอักษร BEFAST ที่ยังไม่ได้เลือก (แบบตัวกลวง)
- **Hairline / เส้นบาง** (`line`): เส้นคั่นรายการ รางของแถบเวลา และขอบภาพ
- **Plate Blue / ฟ้าพื้นภาพ** (`visual-bg`): พื้นที่แสดงก่อนภาพประกอบโหลดเสร็จ (เป็นค่าตายตัว ยังไม่เปลี่ยนตามโหมดมืด)
- **Illustration set** (`skin`, `skin-shade`, `hair`, `feature`): สีตัวละครใน SVG ของบทที่ 4 ให้ใช้ผ่าน class `.skin` `.skin-d` `.hair` `.feat` เท่านั้น

### Dark Mode
token ทุกตัวมีค่าสำหรับโหมดมืด (`*-dark` ใน frontmatter สำหรับสีหลัก ที่เหลือดูใน `index.html`) และต้องประกาศครบทั้ง 2 ที่: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...} }` และ `:root[data-theme="dark"] {...}` พื้นโหมดมืดเป็นสีกรมท่าลึก (`paper-dark`) ห้ามใช้สีดำ

### Named Rules
**The One Alarm Rule.** ใช้สีแดงเฉพาะสิ่งที่เกี่ยวกับเวลา ความเร่งด่วน หรือสิ่งที่ต้องลงมือทำ ห้ามใช้ตกแต่ง ลองถามว่า "ถ้าเอาสีแดงออก คนอ่านจะพลาดเรื่องเร่งด่วนไหม" ถ้าไม่พลาด ก็ไม่ต้องใช้สีแดง

**The Fixed Meaning Rule.** ชมพู เทา เขียว และฟ้าสายสวน มีความหมายทางการแพทย์ตายตัว ห้ามเอาไปใช้ความหมายอื่นในบทอื่น ถ้าต้องการสีสำหรับข้อมูลใหม่ ให้เพิ่ม token ใหม่

**The Small Green Text Rule.** ตัวอักษรสีเขียว `go` บนพื้นสว่างมีคอนทราสต์แค่ 4.10:1 (บน paper) และ 4.41:1 (บน surface) ซึ่งไม่ผ่าน AA สำหรับตัวอักษรเล็ก ถ้าเป็นตัวอักษรเล็กกว่า 18.66px ตัวหนา ในโหมดสว่าง ให้ใช้เขียวเข้ม `#167F54` (4.65:1) แทน (ยังไม่ได้แก้ใน `index.html` ดูที่ `.tl-left`) ส่วนโหมดมืดผ่านแล้ว

## Typography

**Display / Body Font:** Anuphan (fallback: Noto Sans Thai, Leelawadee UI, Thonburi, system-ui)
**Numeral / Eyebrow Font:** Chakra Petch (fallback: Anuphan, Noto Sans Thai, system-ui)

**Character:** Anuphan เป็นฟอนต์ไทยแบบไม่มีหัวที่ยังอ่านง่าย ใช้ได้ทั้งหัวข้อตัวใหญ่และเนื้อหา Chakra Petch มีมุมเหลี่ยมเหมือนตัวเลขบนหน้าปัดเครื่องมือแพทย์ ทำให้ตัวเลขดูเป็นค่าที่วัดได้ ไม่ใช่ข้อความทั่วไป

### Hierarchy
- **Display** (700, `clamp(2.7rem, 9vw, 6.6rem)`, lh 1.22): หัวเรื่องใหญ่หน้าแรกเท่านั้น ขึ้นบรรทัดใหม่ด้วย `<br>` ตามจังหวะการอ่าน ห้ามปล่อยให้ตัดคำเอง
- **Headline** (700, `clamp(2.3rem, 6.4vw, 4.4rem)`, lh 1.28): ชื่อบท (h2)
- **Title** (700, `clamp(1.55rem, 3.1vw, 2.45rem)`, lh 1.28): หัวข้อแต่ละขั้นในฉาก บนมือถือ (≤860px) ลดเหลือ `clamp(1.3rem, 5.6vw, 1.7rem)` หัวข้อการ์ด BEFAST และหัวข้อแบบฝึกใหญ่กว่านี้เล็กน้อย (สูงสุด 3rem)
- **Body** (400, `clamp(17px, 1rem + .25vw, 20px)`, lh 1.65): เนื้อหา ความกว้างบรรทัด 30–36em ในฉากที่ pin บนมือถือลดเหลือ .95rem ได้ แต่ lh ต้องไม่ต่ำกว่า 1.55
- **Label** (400, 0.85rem, lh 1.4): ป้ายกำกับตัวนับ คำอธิบายสี และคำแนะนำ ใช้สี `ink-2` ห้ามเล็กกว่า 0.72rem (ขนาดเล็กสุดที่ใช้บนมือถือตอนนี้)
- **Eyebrow** (Chakra Petch 600, 1.1rem): "บทที่ 3" ใช้สี `red` และใช้ `ink-2` สำหรับ "บทถัดไป"
- **Numeral** (Chakra Petch 600, `clamp(1.9rem, 3.4vw, 2.9rem)`, lh 1.1, tabular-nums): ค่าในตัวนับ หน่วย (ชม., ปี) ใช้ Anuphan 0.9rem สี `ink-2`
- **Numeral Hero** (Chakra Petch 700, `clamp(4rem, 15vw, 9rem)`, lh 1): ใช้กับ 1669 เท่านั้น

### Named Rules
**The Numbers Wear Chakra Rule.** ตัวเลขที่เป็นค่าวัด เวลา หรือเบอร์โทร ใช้ Chakra Petch และ `font-variant-numeric: tabular-nums` เสมอ ห้ามใช้ Chakra Petch กับประโยคภาษาไทย

**The Thai Breathing Room Rule.** ข้อความไทยมีสระบนและวรรณยุกต์ซ้อนกัน จึงต้องการระยะบรรทัดมาก เนื้อหาใช้ line-height ≥ 1.55 หัวข้อ ≥ 1.22 ห้ามใส่ letter-spacing บวกกับข้อความไทย และห้ามใช้ `text-transform` กับข้อความไทย

## Layout

**ลำดับการออกแบบ: มือถือ → แท็บเล็ต → desktop** (กฎเต็มอยู่ใน AGENTS.md) CSS ปัจจุบันยังเขียนแบบ desktop-first (`max-width: 860px` และ `760px`) งานใหม่และตอนย้ายไป Next.js ให้กลับเป็น mobile-first ด้วย `min-width`

**คอนเทนเนอร์:** อ่านเนื้อหา 820–860px, หน้าแรก 1180px, ฉากและหัวบทที่มีภาพ 1280px ระยะขอบซ้ายขวาใช้ `clamp()` ตาม token `gutter-*` ไม่ต่ำกว่า 16px บนจอ 360px

**จังหวะแนวตั้ง:** แต่ละส่วนเว้นระยะด้วยหน่วย viewport (`16vh` ก่อนหัวบท, `8–12vh` ระหว่างส่วน) ให้แต่ละส่วนรู้สึกเป็นหนึ่งหน้า ฉากที่ pin สูง `100svh` (ห้ามใช้ `100vh` อย่างเดียว เพราะแถบที่อยู่บนมือถือจะทำให้เนื้อหาล้น)

**ฉากบทที่ 3 (stage3):**
- มือถือ: นาฬิกาทราย (`clamp(150px, 27svh, 250px)`) อยู่คู่กับตัวนับแบบซ้อนแนวตั้งที่แถวบน ข้อความขั้นตอนเต็มความกว้าง แถบเวลาอยู่ล่างสุด
- desktop: แบ่ง 2 คอลัมน์ 5:6 นาฬิกาทรายสูง `min(66vh, 560px)` อยู่ซ้าย ข้อความ ตัวนับ และแถบเวลาเรียงอยู่ขวา

**ฉากบทที่ 4 (stage4):**
- มือถือ: คอลัมน์เดียว เรียงตัวอักษร → ฉาก SVG (`clamp(150px, 27svh, 260px)`) → การ์ด → คำแนะนำ
- desktop: ตัวอักษรเต็มแถวบน ฉากและการ์ดอยู่คู่กัน 1:1

**แท็บเล็ต:** ตอนนี้แนวตั้ง (768–860px) ได้ layout มือถือ แนวนอน (≥861px) ได้ layout desktop งานใหม่ต้องปรับแท็บเล็ตแนวตั้งให้ใช้พื้นที่เต็ม เช่น ขยายนาฬิกาทรายและฉาก SVG และอาจวางการ์ดคู่กับฉาก ห้ามแค่ยืด layout มือถือ

**จอเตี้ย:** `@media (max-height: 640px) and (max-width: 860px)` ซ่อนคำแนะนำและลดระยะในการ์ด มือถือแนวนอนต้องทดสอบด้วย

**Safe area:** `:root` มี padding `env(safe-area-inset-*)` และ `viewport-fit=cover` แถบความคืบหน้าและฉากที่ pin ต้องเผื่อ inset ด้านบน

## Elevation & Depth

แบนเหมือนกระดาษ ไม่มี drop shadow แยกชั้นด้วยสีพื้น (`paper` → `surface`) เส้นบาง `line` และเส้นหนา 2px `ink` ที่ใช้เป็นเส้นหัวของกลุ่มข้อมูล (บนตัวนับและรายการแบบฝึก) ความลึกอย่างเดียวที่มีคือขอบสว่างด้านในของกรอบภาพ (`box-shadow: inset 0 0 0 1px rgba(255,255,255,.42)`) ที่ช่วยให้ภาพไม่จมไปกับพื้น

### Named Rules
**The Flat Paper Rule.** ห้ามใช้ shadow แบบยกลอย ถ้าต้องการให้อะไรเด่น ให้เปลี่ยนสีพื้นเป็น `surface` หรือใส่เส้น `line` แทน

## Shapes

- **ทรงใบไม้ (leaf):** ภาพประกอบประจำบทโค้งไม่เท่ากัน `88px 24px 88px 24px` (บทที่ 3) และกลับด้านเป็น `24px 88px 24px 88px` (บทที่ 4) บนมือถือลดเหลือ `52px 16px` ภาพ 1669 ใช้ `40px 12px` ขนาดเล็กกว่า
- **ภาพเต็มกว้าง:** ภาพเส้นทางการรักษาโค้ง 40px และลดเหลือ 24px บนมือถือ
- **ปุ่มและกล่อง:** 12px (ปุ่มคำตอบ, กล่องวิธีสังเกต)
- **แถบเวลา:** โค้งเต็ม 7px บนความสูง 14px
- **focus ring:** โค้ง 6px
- **เส้นใน SVG:** หัวเส้นและมุมโค้งมน (`stroke-linecap/linejoin: round`) ความหนาประมาณ 3–3.5 หน่วย ใช้ `vector-effect: non-scaling-stroke` กับเส้นที่ยืดตามจอ

## Components

### Buttons: ปุ่มเลือกคำตอบ (Choice)
ปุ่มสี่เหลี่ยมจัตุรัสที่ตอบสนองชัดเจน
- **Shape:** สี่เหลี่ยมจัตุรัส (`aspect-ratio: 1`) โค้ง 12px ขอบ 2px สี `ink` กว้างสูงสุด 54px ในตาราง 6 คอลัมน์ ช่องไฟ 10px
- **Default:** พื้น `surface` ตัวอักษร B/E/F/A/S/T หนา 700 ขนาด 1.35rem
- **Hover:** (ต้องอยู่ใน `@media (hover: hover)`) กลับสีเป็นพื้น `ink` ตัวอักษร `paper`
- **Right:** พื้นและขอบ `go` ตัวอักษรขาว
- **Wrong:** โปร่งใส .35 ขีดฆ่า และกดไม่ได้
- **Mobile:** บนจอ 360px แต่ละปุ่มต้องกว้างไม่น้อยกว่า 44px ถ้าไม่พอ ให้แบ่งเป็น 2 แถว × 3 คอลัมน์

### Navigation: แท็บตัวอักษร BEFAST
ตัวอักษรกลวงขนาดใหญ่ ใช้เป็นทั้งตัวบอกความคืบหน้าและปุ่มกระโดดไปแต่ละอาการ
- **Style:** Anuphan 700 `clamp(2.5rem, 8.5vw, 6.2rem)` ตัวโปร่งใส ขอบตัวอักษร 2px สี `ink-2` วางเต็มแถวเหนือเส้น 2px สี `line`
- **Done:** เติมสี `ink`
- **Active:** เติมสี `red` และมีขีดใต้หนา 6px สี `red` เลื่อนขยายออก (`scaleX` .35s)
- **A11y:** ทุกปุ่มมี `aria-label` เต็ม เช่น "B: Balance เดินเซ" และกดแล้วเลื่อนไปยังอาการนั้น

### Cards / Containers: การ์ดอาการ BEFAST
- **Structure:** ชื่ออังกฤษ (`red` 600 1.1rem) → หัวข้อไทย → คำอธิบาย (`ink-2` สูงสุด 30em) → กล่องวิธีสังเกต
- **Check callout:** พื้น `red-soft` โค้ง 12px padding 11px 14px ตัวอักษร `ink`
- **Transition:** การ์ดซ้อนกันใน grid cell เดียว แสดงด้วย opacity และเลื่อนขึ้น 14px ใน .4s ใช้ `visibility` เพื่อไม่ให้ screen reader อ่านการ์ดที่ซ่อนอยู่

### Meter: ตัวนับ
- ป้ายกำกับ (label, `ink-2`) → ค่า (numeral) → หน่วย (Anuphan 0.9rem `ink-2`)
- ตัวนับเซลล์สมองที่สูญเสียเป็นตัวหลัก ใช้สี `red` ใหญ่กว่าตัวอื่น (`clamp(2.3rem, 4.6vw, 3.9rem)`) และกินเต็มแถว
- desktop: เส้นหัว 2px `ink` จัดเป็น 2 คอลัมน์ / มือถือ: ซ้อนแนวตั้งข้างนาฬิกาทรายและไม่มีเส้นหัว

### Timeline: แถบเวลาการรักษา
- รางสูง 14px สี `line` โค้ง 7px ส่วนเวลาให้ยาสี `go` ส่วนที่เลยมาแล้วทับด้วย `ash` ตัวชี้ตำแหน่งเป็นแท่ง 4×18px สี `ink`
- แถวใส่สายสวน (`cath`) ค่อยๆ ปรากฏขึ้นเมื่อแกนเวลาย่อจาก 4.5 ชม. เป็น 24 ชม.
- ข้อความเวลาที่เหลือใช้ Chakra Petch และเปลี่ยนเป็น `red` "หมดเวลาให้ยา" เมื่อเกินเวลา

### Progress Bar
แถบ 4px สี `red` ติดอยู่บนสุดของจอ ยืดด้วย `transform: scaleX()` ตามการเลื่อน (ห้ามเปลี่ยน `width`) เผื่อ safe-area ด้านบน และซ่อนจาก screen reader

### Chapter Visual (Signature)
ภาพประกอบประจำบทอัตราส่วน 3:2 อยู่ในกรอบทรงใบไม้ มีพื้น `visual-bg` ระหว่างโหลด และมีขอบสว่างด้านใน บน desktop วางคู่กับข้อความหัวบท 4:7 (สลับซ้ายขวาระหว่างบท) บนมือถือข้อความอยู่บน ภาพอยู่ล่าง ทุกภาพต้องมี `width` / `height`, `loading="lazy"` และ `alt` ภาษาไทย

### Hourglass (Signature)
นาฬิกาทราย SVG viewBox 240×360 ขอบหนา 3.5 สี `ink` ทรายบนสี `pink` มีลายรอยหยักสมอง ทรายล่างสี `ash` มีลายจุด สายทรายไล่สีจาก `pink-deep` เป็น `ash-deep` ฝาบนล่างเปลี่ยนเป็น `red` เมื่อหมดเวลา ขนาดคุมด้วยความสูง (`svh`) ห้ามคุมด้วยความกว้าง

## Do's and Don'ts

### Do:
- **Do** เขียน CSS สำหรับจอ 360–430px ก่อน แล้วขยายด้วย `min-width` สำหรับแท็บเล็ต (768/1024) และ desktop (1280)
- **Do** ใช้ token จาก `:root` (`var(--ink)`, `var(--red)` ฯลฯ) ทุกครั้ง และเพิ่มค่าโหมดมืดทุกครั้งที่เพิ่ม token ใหม่
- **Do** ใช้ `svh` / `dvh` กับความสูงที่อิงจอ และ `clamp()` กับขนาดตัวอักษรและระยะ
- **Do** ใช้ Chakra Petch + `tabular-nums` กับตัวเลขที่เปลี่ยนค่าระหว่างเลื่อน เพื่อไม่ให้ตัวเลขกระโดด
- **Do** ใช้ `transform` และ `opacity` กับ transition/animation ของ CSS (ยกเว้นเอฟเฟกต์เบลอที่จำลองอาการ E) ถ้าต้องแก้ attribute ของ SVG ตามการเลื่อน (ทราย, path) ให้อัปเดตครั้งเดียวต่อเฟรมผ่าน ScrollTrigger และทุกอย่างต้องมีเวอร์ชัน reduced-motion
- **Do** ตรวจคอนทราสต์ทั้งโหมดสว่างและมืดทุกครั้งที่ใช้สีกับตัวอักษร

### Don't:
- **Don't** ใช้สีแดงตกแต่ง หรือใช้กับสิ่งที่ไม่เร่งด่วน (The One Alarm Rule)
- **Don't** เอาสีชมพู เทา เขียว และฟ้าสายสวนไปใช้ความหมายอื่น
- **Don't** ใช้ drop shadow, glassmorphism หรือ gradient ตกแต่ง (สีไล่มีที่เดียวคือสายทรายในนาฬิกาทราย)
- **Don't** ใช้ `ash` หรือ `red-soft` เป็นสีตัวอักษร
- **Don't** ใส่ letter-spacing หรือ `text-transform` กับข้อความไทย
- **Don't** ใช้ hover อย่างเดียวในการบอกว่ากดได้ หรือซ่อนข้อมูลไว้หลัง hover
- **Don't** ใช้ `100vh` อย่างเดียวกับฉากที่ pin บนมือถือ
- **Don't** ใช้ตัวอักษรเนื้อหาเล็กกว่า 17px หรือป้ายกำกับเล็กกว่า 0.72rem
