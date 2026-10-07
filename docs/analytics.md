# สถิติผู้เข้าชม (Umami)

เว็บใช้ [Umami](https://umami.is) (ติดตั้งเอง) นับผู้เข้าชมและพฤติกรรมการอ่าน ไม่ใช้ cookie และไม่เก็บข้อมูลที่ระบุตัวบุคคล จึงไม่ต้องมีแบนเนอร์ขอความยินยอม

- ลิงก์แยกช่องทาง (UTM) และ QR code: [utm-links.md](utm-links.md)

## ภาพรวม

```
ผู้อ่าน ──► walkrunbike12.chiangmaihealth.go.th (Cloudflare ► Nginx Proxy Manager ► next-befast:3000)
             ├─ /stats/script.js, /stats/api/send ──► umami:3000   (ส่งต่อโดย rewrites ใน next.config.ts)
             └─ /api/visitors  ──► อ่านยอดจาก Umami ผ่าน network ภายใน (แคช 5 นาที)

ทีมงาน ──► umami.chiangmaihealth.go.th (Cloudflare Access ► NPM ► next-befast-umami:3000)  = dashboard
```

| ส่วน | ไฟล์ |
|---|---|
| container ของ prod (เว็บ, Umami, Postgres) | `docker-compose.yml` (บน server อยู่ที่ `/var/Docker/js/next_befast/`) |
| Umami สำหรับ dev ในเครื่อง | `docker-compose.dev.yml` |
| ส่งต่อ tracker ผ่านโดเมนเว็บ | `next.config.ts` (เปิดเฉพาะ `script.js` กับ `api/send` ไม่เปิด API อื่นของ Umami) |
| website id และโดเมนที่นับ | `src/lib/analytics.ts` |
| ใส่ tracker ในหน้า | `src/app/layout.tsx` (`next/script` แบบ `afterInteractive`) |
| ส่ง event | `src/lib/track.ts`, `src/components/ReachTracker.tsx`, `Quiz.tsx` (บท 4), `ClosingQuiz.tsx`, `ShareButton.tsx` |
| ตัวนับใน footer | `src/app/api/visitors/route.ts`, `src/components/VisitorCount.tsx` |
| สร้างรายงานใน Umami | `scripts/umami-reports.sh` |
| backup ฐานข้อมูล | `scripts/umami-backup.sh` |

## Dashboard

| ที่ | ลิงก์ | เข้าสู่ระบบ |
|---|---|---|
| prod | https://umami.chiangmaihealth.go.th (ต้องผ่าน Cloudflare Access ก่อน) | `admin` / รหัสในบรรทัด `UMAMI_PASSWORD` ของ `.env` บน server |
| ในเครื่อง | http://localhost:3012 | `admin` / `umami` |

ถ้า Cloudflare มีปัญหา เปิด dashboard ของ prod ผ่าน SSH tunnel ได้: `ssh -N -L 3013:localhost:3012 heart-prod` แล้วเปิด http://localhost:3013

### รายงานที่สร้างไว้ (Reports)

| รายงาน | ชนิด | ใช้ดู |
|---|---|---|
| อ่านถึงบทไหน | Funnel | เปิดหน้า › บท 1 › 2 › 4 › 6 › 8 › บทปิด › ทำแบบทดสอบครบ (Umami รับได้ไม่เกิน 8 ขั้น บท 3, 5, 7 ดูในแท็บ Events) |
| อ่านจบถึงบทปิด | Goal | % ผู้เข้าชมที่ถึง `reach-closing` |
| ทำแบบทดสอบครบ | Goal | % ผู้เข้าชมที่ถึง `quiz-complete` |
| เส้นทางการอ่าน | Journey | ลำดับที่ผู้อ่านไปจริง |

สร้างใหม่ (เช่นหลังล้างข้อมูลทั้งหมด):

```bash
# prod
scp scripts/umami-reports.sh heart-prod:/var/Docker/js/next_befast/
ssh heart-prod 'cd /var/Docker/js/next_befast && ./umami-reports.sh'
# ในเครื่อง
ENV_FILE=.env.local scripts/umami-reports.sh
```

## Event ที่เว็บส่ง

| Event | ข้อมูลแนบ | เกิดเมื่อ |
|---|---|---|
| (pageview) | – | เปิดหน้า |
| `reach-ch1` … `reach-ch8`, `reach-closing` | – | หัวบทเลื่อนถึงกลางจอ ครั้งเดียวต่อการเข้าชม |
| `befast-answer` | `signal` (S/A/F), `firstTry`, `wrong` (ตัวอักษรที่ตอบผิดก่อน คั่นด้วย `,` หรือ `-`) | ตอบข้อในแบบทดสอบบทที่ 4 ถูก |
| `befast-quiz-complete` | `firstTry`, `total` | ตอบแบบทดสอบบทที่ 4 ครบ |
| `quiz-start` | – | เริ่มตอบแบบทดสอบบทปิด |
| `quiz-complete` | `firstTry`, `total` | ตอบแบบทดสอบบทปิดครบ |
| `share` | `outcome` (`shared` / `copied` / `dismissed` / `failed`) | กดปุ่มแชร์ในบทที่ 8 |

- ลิงก์ที่ผู้อ่านแชร์ต่อจะเป็น `?utm_source=share` เสมอ (ตัด UTM เดิมและ `#hash` ออก) จึงแยกยอดจากการบอกต่อได้
- ถ้า tracker โหลดไม่ได้ (adblock, เน็ตหลุด) `track()` จะลองใหม่ 10 วินาทีแล้วทิ้ง event เงียบๆ หน้าเว็บไม่ได้รับผลกระทบ
- tracker นับเฉพาะโดเมน `walkrunbike12.chiangmaihealth.go.th` (`data-domains`) การเปิดผ่าน IP:port หรือ preview จะไม่ถูกนับ
- Umami ไม่นับ bot รวมถึง headless Chrome ถ้าจะทดสอบด้วย Puppeteer ให้ตั้ง user agent เป็นเบราว์เซอร์ปกติ
- เพิ่ม event ใหม่: เรียก `track("ชื่อ", { ... })` จาก `src/lib/track.ts` ในคอมโพเนนต์ฝั่ง client ห้ามส่งข้อมูลที่ระบุตัวบุคคลหรือข้อความที่ผู้ใช้พิมพ์ แล้วเพิ่มแถวในตารางนี้

## ตัวนับผู้เข้าชมใน footer

- `VisitorCount` เรียก `/api/visitors` หลังหน้าโหลด และแสดง "ร่วมเรียนรู้แล้ว N คน" ในแถบกรมท่า ถ้าไม่ได้ตัวเลขหรือยอดเป็น 0 จะไม่แสดงอะไร หน้าเว็บยังเป็นหน้า static
- `/api/visitors` login เข้า Umami ด้วย `UMAMI_USERNAME` / `UMAMI_PASSWORD` แล้วอ่าน `visitors` ตั้งแต่เริ่มเก็บข้อมูล เก็บผลไว้ในหน่วยความจำ 5 นาที และส่ง `Cache-Control: max-age=60`
- ถ้าเปลี่ยนรหัส admin ใน Umami ต้องแก้ `UMAMI_PASSWORD` ใน `.env` บน server ให้ตรง แล้วรัน `docker compose up -d next-befast` ไม่อย่างนั้นตัวนับจะหายไป

## ค่าตั้ง (environment)

**prod** อยู่ใน `/var/Docker/js/next_befast/.env` บน server (สิทธิ์ 600 ไม่อยู่ใน git และไม่อยู่ใน image)

| ตัวแปร | ใช้ที่ |
|---|---|
| `UMAMI_DB_PASSWORD` | Postgres ของ Umami |
| `UMAMI_APP_SECRET` | Umami |
| `UMAMI_USERNAME`, `UMAMI_PASSWORD` | `/api/visitors` ใช้ login |
| `UMAMI_WEBSITE_ID` | `/api/visitors` |

website id ของ prod (`985a5d0d-…`) เป็นค่าเริ่มต้นใน `src/lib/analytics.ts` อยู่แล้ว เพราะต้องฝังลงหน้าเว็บตอน build และไม่ใช่ความลับ

**ในเครื่อง** อยู่ใน `.env.local` (คัดลอกจาก `.env.example`):

```bash
UMAMI_URL=http://localhost:3012
UMAMI_USERNAME=admin
UMAMI_PASSWORD=umami
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id ของเว็บใน Umami ในเครื่อง>
NEXT_PUBLIC_UMAMI_DOMAIN=localhost
```

## Dev ในเครื่อง

1. เปิด OrbStack (หรือ Docker) แล้วรัน `pnpm umami:dev`
2. ครั้งแรก: เข้า http://localhost:3012 สร้าง website โดเมน `localhost` แล้วใส่ id ใน `.env.local` และรัน `ENV_FILE=.env.local scripts/umami-reports.sh` ถ้าต้องการรายงาน
3. `pnpm dev` (ถ้าเปิดค้างไว้ก่อนแก้ `.env.local` ต้องปิดแล้วเปิดใหม่ เพราะ rewrites อ่านค่าตอนเริ่ม)

หยุด: `docker compose -p next-befast-dev -f docker-compose.dev.yml stop` ข้อมูลในเครื่องแยกจาก prod ทั้งหมด

## Backup และกู้คืน

`scripts/umami-backup.sh` dump ฐานข้อมูลเป็นไฟล์ `pg_dump -Fc` ไว้ที่ `/home/cmpho/backups/next-befast-umami/` (สิทธิ์ 700) เก็บย้อนหลัง 14 วัน

ติดตั้งครั้งแรก:

```bash
scp scripts/umami-backup.sh heart-prod:/var/Docker/js/next_befast/
ssh heart-prod '/var/Docker/js/next_befast/umami-backup.sh'   # ทดสอบ ควรขึ้น "ok ...dump"
ssh heart-prod '(crontab -l 2>/dev/null; echo "30 2 * * * /var/Docker/js/next_befast/umami-backup.sh >> /home/cmpho/backups/next-befast-umami/backup.log 2>&1") | crontab -'
```

ตรวจผล: `ssh heart-prod 'tail /home/cmpho/backups/next-befast-umami/backup.log'`

กู้คืน (เขียนทับข้อมูลปัจจุบัน):

```bash
ssh heart-prod 'docker exec -i next-befast-umami-db pg_restore -U umami -d umami --clean --if-exists \
  < /home/cmpho/backups/next-befast-umami/umami-YYYYMMDD-HHMM.dump'
```

backup อยู่บน server เครื่องเดียวกับฐานข้อมูล ถ้าเครื่องเสียทั้งเครื่องจะหายไปด้วย ถ้าต้องการปลอดภัยกว่านี้ให้คัดลอกออกไปเก็บที่อื่นเป็นระยะ

## ล้างยอด (reset)

- **ล้างเฉพาะข้อมูลการเข้าชม** (บัญชี, website id และรายงานยังอยู่): Umami › Settings › Websites › เลือกเว็บ › Data › Reset
- **ล้างทั้งหมด** (`docker volume rm next_befast_umami-db-data`): ทุกอย่างหายถาวร รวมบัญชี admin และ website id ต้องสร้าง website ใหม่ แก้ id ใน `.env` และ `src/lib/analytics.ts` แล้ว deploy ใหม่ ไม่แนะนำ

ยอดบนหน้าเว็บอาจยังเป็นค่าเดิมได้นานสุด 5 นาทีหลัง reset

## ความปลอดภัย

- dashboard บังด้วย Cloudflare Access ทั้งโดเมน ไม่ต้องยกเว้น path ใด เพราะเว็บหลักคุยกับ Umami ผ่าน network ภายใน
- Umami บน server เปิด port ไว้เฉพาะ `127.0.0.1:3012` และอยู่ใน network `nginx_proxy_manager_default` เพื่อให้ NPM เรียก `next-befast-umami:3000` ได้
- โดเมนเว็บหลักส่งต่อไป Umami เฉพาะ `/stats/script.js` และ `/stats/api/send` ส่วน `/stats/api/auth/login` และ path อื่นได้ 404
- รหัส admin เป็นค่าสุ่ม เปลี่ยนจากค่าเริ่มต้น `umami` ตั้งแต่ติดตั้ง

## แก้ปัญหา

| อาการ | สาเหตุ / ทางแก้ |
|---|---|
| ตัวนับใน footer หายไป | `curl https://walkrunbike12.chiangmaihealth.go.th/api/visitors` ได้ `null` ให้ตรวจว่า Umami รันอยู่ (`docker ps`) และรหัสใน `.env` ตรงกับใน Umami |
| `/stats/script.js` ได้ 500 ในเครื่อง | Umami ในเครื่องไม่ได้รัน หรือ `pnpm dev` เปิดก่อนมี `.env.local` |
| dashboard ไม่มีข้อมูล | ตั้งช่วงเวลามุมขวาบนเป็น Today หรือ Last 24 hours, ทดสอบด้วย headless browser จะไม่ถูกนับ |
| NPM เปิด dashboard ไม่ได้ | Forward ต้องเป็น `next-befast-umami` port `3000` ไม่ใช่ IP ของ server |
