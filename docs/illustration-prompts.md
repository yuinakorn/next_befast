# Prompt ภาพหัวบท

ภาพหัวบทบทที่ 3–4 (`public/illustrations/chapter-3-*.webp`, `chapter-4-*.webp`) เป็นภาพสีน้ำโทนฟ้าอ่อน ใช้ prompt ด้านล่างสร้างภาพของบทที่ 1–2 ให้เข้าชุดกัน

**ข้อกำหนดร่วม:** 1536×1024 (3:2), บันทึกเป็น `.webp` คุณภาพ ~85, ไม่มีตัวหนังสือ ตัวเลข หรือโลโก้ในภาพ, เว้นพื้นที่ว่างรอบขอบเพราะภาพถูกครอปเป็นทรงใบไม้ (มุมโค้ง 88px)

## บทที่ 1: สโตรกคืออะไร → `public/illustrations/chapter-1-what-is-stroke.webp`

```
Soft watercolor editorial illustration on pale blue-white paper (#F3F7FC) with layered light-blue
washes. A human brain seen from the side, painted as a calm night-time city map: districts with
tiny warm pink window lights, blood vessels drawn as red roads flowing up from the neck into each
district. One district on the left has gone dark grey, its lights out. Accent colours: deep navy
#13235A, alarm red #D3222D, soft pink #EE7C86, ash grey #A7AFC0. Calm, clinical, hopeful mood,
clean composition, generous empty space around the edges. No text, no letters, no numbers, no logos.
```

## บทที่ 2: ใกล้ตัวกว่าที่คิด → `public/illustrations/chapter-2-closer-than-you-think.webp`

```
Soft watercolor editorial illustration on pale blue-white paper (#F3F7FC) with layered light-blue
washes. A Thai city street in the early evening with people of different ages walking together:
a teenager, a young office worker, a middle-aged parent and an elderly person. One young adult is
subtly outlined in alarm red #D3222D. Faint everyday motifs float in the background: a fast-food
tray, a thin curl of cigarette smoke, light PM2.5 haze over buildings, a phone glowing late at night.
Accent colours: deep navy #13235A, alarm red #D3222D, soft pink #EE7C86. Warm but alert mood,
generous empty space around the edges. No text, no letters, no numbers, no logos.
```

## ใส่ภาพเข้าเว็บ

1. วางไฟล์ไว้ตาม path ด้านบน
2. เพิ่ม `image: "/illustrations/<ชื่อไฟล์>.webp"` ใน `CHAPTER_1` หรือ `CHAPTER_2` (`src/content/chapter-1.ts`, `chapter-2.ts`)
3. รัน `pnpm build` แล้วตรวจหัวบทบนจอ 360px และ 1280px

## บทที่ 5–8

ภาพชุดนี้ใช้สไตล์สีน้ำเชิงบรรณาธิการบนกระดาษฟ้าอมขาว มีเส้นหมึกกรมท่า สีแดงเฉพาะจุดเร่งด่วน และพื้นที่ปลอดภัยรอบภาพสำหรับ crop แบบ 3:2 โดยไม่มีข้อความ ตัวอักษร ตัวเลข โลโก้ หรือลายน้ำ ภาพบทที่ 1–4 ใช้เป็น style reference เท่านั้น ไม่ใช้เป็นต้นแบบองค์ประกอบ

- **บทที่ 5 เจออาการแล้ว ทำอย่างไร** → `chapter-5-what-to-do.webp`: ครอบครัวไทยช่วยผู้สูงอายุให้นอนตะแคงอย่างปลอดภัย โทรขอความช่วยเหลือ และจำเวลาเริ่มอาการ โดยมีเส้นสีแดงเชื่อมโทรศัพท์ นาฬิกา และรถพยาบาลเป็นเส้นทางฉุกเฉินเดียวกัน
- **บทที่ 6 ข่าวดี ป้องกันได้ 90%** → `chapter-6-prevent-90.webp`: โล่สีน้ำสีเขียวอมฟ้าปกป้องสมองและหลอดเลือดจากภัย 4 ทิศ ได้แก่ น้ำตาล ความดัน ไขมันอุดตัน และหัวใจเต้นผิดจังหวะ
- **บทที่ 7 6 พฤติกรรม สร้างโล่ของคุณ** → `chapter-7-six-habits.webp`: การคุมน้ำหนัก ไม่สูบบุหรี่ ไม่ดื่มสุรา พักผ่อน กินผักผลไม้ และออกกำลังกาย เชื่อมด้วยริบบิ้นหกสายที่รวมเป็นโล่ปกป้องสมอง
- **บทที่ 8 สิ่งสำคัญที่อย่าลืม** → `chapter-8-dont-forget.webp`: ครอบครัวหลายวัยเชื่อมกันด้วยเส้นแสงรูปวงคุ้มครอง ผ่านการวัดความดัน ตรวจสุขภาพ ใช้ยาตามแพทย์สั่ง และส่งต่อความรู้เรื่องสัญญาณเตือน
