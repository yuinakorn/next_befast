#!/usr/bin/env bash
# Create the Umami reports for the stroke site (funnel + goals).
# Run on the server from the deploy directory: ./umami-reports.sh  (reads .env)
set -euo pipefail
source .env
B=${UMAMI_LOCAL_URL:-http://localhost:3012}
T=$(curl -sf -X POST "$B/api/auth/login" -H "Content-Type: application/json" \
  -d "{\"username\":\"$UMAMI_USERNAME\",\"password\":\"$UMAMI_PASSWORD\"}" | sed -E 's/.*"token":"([^"]+)".*/\1/')
START=2026-10-07T00:00:00.000Z
END=2027-12-31T23:59:59.000Z

report() {
  curl -sf -X POST "$B/api/reports" -H "Authorization: Bearer $T" -H "Content-Type: application/json" -d "$1" \
    | grep -oE '"(id|name)":"[^"]+"' | head -2 | paste -sd' ' -
}

ev() { printf '{"type":"event","value":"%s"}' "$1"; }

report "{\"websiteId\":\"$UMAMI_WEBSITE_ID\",\"type\":\"funnel\",\"name\":\"อ่านถึงบทไหน\",
  \"description\":\"ผู้อ่านไปถึงแต่ละบทกี่คน และหลุดตรงไหน (ภายใน 1 ชั่วโมง)\",
  \"parameters\":{\"startDate\":\"$START\",\"endDate\":\"$END\",\"window\":60,\"steps\":[
    {\"type\":\"path\",\"value\":\"/\"},$(ev reach-ch1),$(ev reach-ch2),$(ev reach-ch4),
    $(ev reach-ch6),$(ev reach-ch8),$(ev reach-closing),$(ev quiz-complete)]}}"

report "{\"websiteId\":\"$UMAMI_WEBSITE_ID\",\"type\":\"goal\",\"name\":\"อ่านจบถึงบทปิด\",
  \"parameters\":{\"startDate\":\"$START\",\"endDate\":\"$END\",\"type\":\"event\",\"value\":\"reach-closing\"}}"

report "{\"websiteId\":\"$UMAMI_WEBSITE_ID\",\"type\":\"goal\",\"name\":\"ทำแบบทดสอบครบ\",
  \"parameters\":{\"startDate\":\"$START\",\"endDate\":\"$END\",\"type\":\"event\",\"value\":\"quiz-complete\"}}"

report "{\"websiteId\":\"$UMAMI_WEBSITE_ID\",\"type\":\"journey\",\"name\":\"เส้นทางการอ่าน\",
  \"parameters\":{\"startDate\":\"$START\",\"endDate\":\"$END\",\"steps\":5,\"startStep\":\"/\"}}"
