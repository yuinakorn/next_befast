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

## บทที่ 5–8 (ยังไม่มีภาพ)

ใช้ข้อกำหนดร่วมด้านบน แล้ววางไฟล์และเพิ่ม `image` ใน `src/content/chapter-<n>.ts`

- **บทที่ 5 เจออาการแล้ว ทำอย่างไร** → `chapter-5-what-to-do.webp`: a Thai family at home in the evening, one person calling for help on a phone while another notes the time on a wall clock, an older relative resting on their side on a sofa; calm, decisive mood.
- **บทที่ 6 ข่าวดี ป้องกันได้ 90%** → `chapter-6-prevent-90.webp`: a soft glowing shield protecting a stylised brain and blood vessels, gentle teal and blue washes replacing red, hopeful morning light.
- **บทที่ 7 6 พฤติกรรม สร้างโล่ของคุณ** → `chapter-7-six-habits.webp`: people of different ages walking, running and cycling in a green Thai park, a plate of vegetables and fruit on a picnic cloth, no cigarettes or alcohol in sight.
- **บทที่ 8 สิ่งสำคัญที่อย่าลืม** → `chapter-8-dont-forget.webp`: a grandparent checking blood pressure at home with a grandchild, a calendar with a circled check-up date, warm light passing between family members.
