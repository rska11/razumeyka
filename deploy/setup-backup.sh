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
STAMP=$(date +%F_%H%M)
OUT="$BACKUP_DIR/prod-$STAMP.db"
[ -f "$DB" ] || { echo "[backup] нет базы $DB"; exit 1; }
sqlite3 "$DB" ".backup '$OUT'"
gzip -f "$OUT"
# Храним 14 дней
find "$BACKUP_DIR" -name 'prod-*.db.gz' -mtime +14 -delete
echo "[backup] ok: $OUT.gz"
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
