#!/usr/bin/env bash
# Ночной бэкап SQLite-базы школы. Идемпотентно, запуск один раз:
#   bash /var/www/razumeyka/deploy/setup-backup.sh
# Бэкапы: /var/www/razumeyka-data/backups/prod-YYYY-MM-DD_HHMM.db.gz (храним 14 дней).
set -euo pipefail

DATA_DIR=/var/www/razumeyka-data
DB="$DATA_DIR/prod.db"
BACKUP_DIR="$DATA_DIR/backups"
SCRIPT=/usr/local/bin/razumeyka-backup.sh

# 1. sqlite3 нужен для целостного бэкапа работающей базы (.backup учитывает WAL)
command -v sqlite3 >/dev/null 2>&1 || { apt-get update -qq && apt-get install -y -qq sqlite3; }

mkdir -p "$BACKUP_DIR"

# 2. Скрипт бэкапа
cat > "$SCRIPT" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
DB=/var/www/razumeyka-data/prod.db
BACKUP_DIR=/var/www/razumeyka-data/backups
ENV_FILE=/var/www/razumeyka/.env
STAMP=$(date +%F_%H%M)
OUT="$BACKUP_DIR/prod-$STAMP.db"
[ -f "$DB" ] || { echo "[backup] нет базы $DB"; exit 1; }
sqlite3 "$DB" ".backup '$OUT'"
gzip -f "$OUT"
# Храним 14 дней
find "$BACKUP_DIR" -name 'prod-*.db.gz' -mtime +14 -delete
echo "[backup] ok: $OUT.gz"

# Опциональная офсайт-копия через rclone (если задан BACKUP_RCLONE_REMOTE в окружении или в .env)
RCLONE_REMOTE="${BACKUP_RCLONE_REMOTE:-}"
if [ -z "$RCLONE_REMOTE" ] && [ -f "$ENV_FILE" ]; then
  RCLONE_REMOTE=$(grep -E '^BACKUP_RCLONE_REMOTE=' "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//" || true)
fi
if [ -n "$RCLONE_REMOTE" ]; then
  if command -v rclone >/dev/null 2>&1; then
    rclone copy "$OUT.gz" "$RCLONE_REMOTE"
    echo "[backup] offsite ok: $OUT.gz -> $RCLONE_REMOTE"
  else
    echo "[backup] WARN: BACKUP_RCLONE_REMOTE задан ($RCLONE_REMOTE), но rclone не установлен" >&2
  fi
fi
EOF
chmod +x "$SCRIPT"

# 3. Crontab: каждую ночь в 03:30 (лог последнего запуска — в /var/log/razumeyka-backup.log)
LINE="30 3 * * * $SCRIPT > /var/log/razumeyka-backup.log 2>&1"
( crontab -l 2>/dev/null | grep -v 'razumeyka-backup' ; echo "$LINE" ) | crontab -

# 4. Первый бэкап сразу — проверяем, что всё работает
"$SCRIPT"

echo "✅ ГОТОВО: ночной бэкап включён (03:30, храним 14 дней)."
echo "   Список бэкапов: ls -lh $BACKUP_DIR"
echo "   Лог последнего: cat /var/log/razumeyka-backup.log"
