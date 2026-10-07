# ลิงก์แยกช่องทาง (UTM) และ QR code

ใช้ลิงก์ของแต่ละช่องทางเวลาเผยแพร่ เพื่อให้ Umami แยกได้ว่าผู้อ่านมาจากไหน และคนจากช่องทางไหนอ่านจบมากกว่า
ดูผลได้ที่ Umami › เว็บไซต์ › แท็บ UTM (หรือกรอง `utm_source` ในหน้า Overview / Reports)

ลิงก์ที่ผู้อ่านกดแชร์จากปุ่ม "ส่งต่อให้คนที่คุณรัก" จะเป็น `utm_source=share` เสมอ จึงแยกยอดจากการบอกต่อได้

| ช่องทาง | utm_source | utm_medium | ลิงก์ | QR |
|---|---|---|---|---|
| LINE OA / กลุ่ม LINE | `line` | `social` | https://walkrunbike12.chiangmaihealth.go.th/?utm_source=line&utm_medium=social&utm_campaign=wrb12 | [line-oa.png](qr/line-oa.png) |
| เพจ Facebook | `facebook` | `social` | https://walkrunbike12.chiangmaihealth.go.th/?utm_source=facebook&utm_medium=social&utm_campaign=wrb12 | [facebook.png](qr/facebook.png) |
| โปสเตอร์ และป้ายในโรงพยาบาล รพ.สต. | `poster` | `print` | https://walkrunbike12.chiangmaihealth.go.th/?utm_source=poster&utm_medium=print&utm_campaign=wrb12 | [poster.png](qr/poster.png) |
| แผ่นพับ | `leaflet` | `print` | https://walkrunbike12.chiangmaihealth.go.th/?utm_source=leaflet&utm_medium=print&utm_campaign=wrb12 | [leaflet.png](qr/leaflet.png) |
| บูธ และวันจัดงานเดิน วิ่ง ปั่น | `event` | `offline` | https://walkrunbike12.chiangmaihealth.go.th/?utm_source=event&utm_medium=offline&utm_campaign=wrb12 | [event.png](qr/event.png) |
| โรงเรียน และสถานศึกษา | `school` | `partner` | https://walkrunbike12.chiangmaihealth.go.th/?utm_source=school&utm_medium=partner&utm_campaign=wrb12 | [school.png](qr/school.png) |
| อสม. และเครือข่ายชุมชน | `osm` | `partner` | https://walkrunbike12.chiangmaihealth.go.th/?utm_source=osm&utm_medium=partner&utm_campaign=wrb12 | [osm.png](qr/osm.png) |

QR เป็น PNG 1024×1024 ระดับแก้ผิด M พิมพ์ได้ถึงขนาดประมาณ 8 ซม. ถ้าจะพิมพ์ใหญ่กว่านั้นหรือแยกตามโรงพยาบาล ให้สร้างลิงก์ใหม่ตามรูปแบบเดียวกัน
เช่น `utm_source=poster&utm_medium=print&utm_campaign=wrb12&utm_content=rp-sanpatong` (ใช้ตัวอักษรอังกฤษพิมพ์เล็กและ `-` เท่านั้น)

## Event ที่เว็บส่งเข้า Umami

| Event | ข้อมูลแนบ | เกิดเมื่อ |
|---|---|---|
| `reach-ch1` … `reach-ch8`, `reach-closing` | – | หัวบทเลื่อนถึงกลางจอ (ครั้งเดียวต่อการเข้าชม) |
| `befast-answer` | `signal` (S/A/F), `firstTry`, `wrong` (ตัวอักษรที่ตอบผิดก่อน) | ตอบข้อในแบบทดสอบบทที่ 4 ถูก |
| `befast-quiz-complete` | `firstTry`, `total` | ตอบแบบทดสอบบทที่ 4 ครบ |
| `quiz-start` | – | เริ่มตอบแบบทดสอบบทปิด |
| `quiz-complete` | `firstTry`, `total` | ตอบแบบทดสอบบทปิดครบ |
| `share` | `outcome` (shared / copied / dismissed / failed) | กดปุ่มแชร์ในบทที่ 8 |

ไม่มี event ใดเก็บข้อมูลที่ระบุตัวบุคคล และ Umami ไม่ใช้ cookie
