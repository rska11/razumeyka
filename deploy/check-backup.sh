#!/usr/bin/env bash
# Проверка свежести и целостности последнего бэкапа SQLite-базы школы.
# Запуск:
#   bash /var/www/razumeyka/deploy/check-backup.sh [путь_к_файлу.db.gz]
# Код возврата: 0 — бэкап свежий (<36ч) и целый, ≠0 — ошибка.
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/www/razumeyka-data/backups}"
MAX_AGE_HOURS="${MAX_AGE_HOURS:-36}"
MAX_AGE_SEC=$(( MAX_AGE_HOURS * 3600 ))

command -v sqlite3 >/dev/null 2>&1 || { echo "❌ [check-backup] sqlite3 не установлен" >&2; exit 1; }
command -v gzip >/dev/null 2>&1 || { echo "❌ [check-backup] gzip не установлен" >&2; exit 1; }

if [ $# -ge 1 ]; then
  TARGET="$1"
else
  if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ [check-backup] каталог бэкапов не найден: $BACKUP_DIR" >&2
    exit 1
  fi
  TARGET=$(find "$BACKUP_DIR" -maxdepth 1 -type f -name 'prod-*.db.gz' -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2- || true)
  if [ -z "$TARGET" ]; then
    # Fallback для систем без GNU find -printf
    TARGET=$(ls -1t "$BACKUP_DIR"/prod-*.db.gz 2>/dev/null | head -1 || true)
  fi
fi

if [ -z "${TARGET:-}" ] || [ ! -f "$TARGET" ]; then
  echo "❌ [check-backup] файлы бэкапов не найдены в $BACKUP_DIR" >&2
  exit 1
fi

NOW=$(date +%s)
MTIME=$(stat -c %Y "$TARGET" 2>/dev/null || stat -f %m "$TARGET")
AGE_SEC=$(( NOW - MTIME ))
AGE_HOURS=$(( AGE_SEC / 3600 ))
AGE_MINS=$(( (AGE_SEC % 3600) / 60 ))
FILE_SIZE=$(du -h "$TARGET" | cut -f1)

if [ "$AGE_SEC" -ge "$MAX_AGE_SEC" ]; then
  echo "❌ [check-backup] бэкап устарел: $TARGET (возраст ${AGE_HOURS}ч ${AGE_MINS}м, порог <${MAX_AGE_HOURS}ч)" >&2
  exit 1
fi

TMP_DB=$(mktemp /tmp/razumeyka-check-XXXXXX.db)
trap 'rm -f "$TMP_DB"' EXIT

if [[ "$TARGET" == *.gz ]]; then
  gzip -dc "$TARGET" > "$TMP_DB"
else
  cp "$TARGET" "$TMP_DB"
fi

if [ ! -s "$TMP_DB" ]; then
  echo "❌ [check-backup] распакованный файл БД пуст: $TARGET" >&2
  exit 1
fi

INTEGRITY=$(sqlite3 "$TMP_DB" "PRAGMA integrity_check;" 2>&1 || true)
if [ "$INTEGRITY" != "ok" ]; then
  echo "❌ [check-backup] PRAGMA integrity_check не пройден для $TARGET: $INTEGRITY" >&2
  exit 1
fi

USER_COUNT=$(sqlite3 "$TMP_DB" 'SELECT COUNT(*) FROM "User";')
PAYMENT_COUNT=$(sqlite3 "$TMP_DB" 'SELECT COUNT(*) FROM "Payment";')
ACCESS_COUNT=$(sqlite3 "$TMP_DB" 'SELECT COUNT(*) FROM "Access";')

echo "✅ [check-backup] ОК"
echo "   Файл:            $TARGET ($FILE_SIZE)"
echo "   Возраст:         ${AGE_HOURS}ч ${AGE_MINS}м (норма <${MAX_AGE_HOURS}ч)"
echo "   integrity_check: $INTEGRITY"
echo "   Строки таблиц:   User=$USER_COUNT, Payment=$PAYMENT_COUNT, Access=$ACCESS_COUNT"
