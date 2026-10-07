#!/usr/bin/env bash
# Nightly dump of the production Umami database, keeping the last 14 days.
# Details: docs/analytics.md (Backup). Install on the server with cron:
#   30 2 * * * /var/Docker/js/next_befast/umami-backup.sh >> /home/cmpho/backups/next-befast-umami/backup.log 2>&1
# Restore: docker exec -i next-befast-umami-db pg_restore -U umami -d umami --clean --if-exists < FILE.dump
set -euo pipefail
DIR=${BACKUP_DIR:-/home/cmpho/backups/next-befast-umami}
KEEP_DAYS=${KEEP_DAYS:-14}
mkdir -p "$DIR"
chmod 700 "$DIR"
umask 077
FILE="$DIR/umami-$(date +%Y%m%d-%H%M).dump"
docker exec next-befast-umami-db pg_dump -U umami -d umami -Fc > "$FILE.part"
mv "$FILE.part" "$FILE"
find "$DIR" -name 'umami-*.dump' -mtime +"$KEEP_DAYS" -delete
echo "$(date -Is) ok $FILE $(du -h "$FILE" | cut -f1)"
