#!/usr/bin/env bash
# Безопасное восстановление SQLite-базы школы из архива бэкапа.
# Запуск:
#   bash /var/www/razumeyka/deploy/restore-backup.sh /var/www/razumeyka-data/backups/prod-YYYY-MM-DD_HHMM.db.gz
set -euo pipefail

DATA_DIR="${DATA_DIR:-/var/www/razumeyka-data}"
DB="${DB:-$DATA_DIR/prod.db}"
BACKUP_DIR="${BACKUP_DIR:-$DATA_DIR/backups}"
PM2_APP="${PM2_APP:-razumeyka}"

if [ $# -lt 1 ] || [ -z "${1:-}" ]; then
  echo "Использование: bash $0 <путь-к-файлу-бэкапа.db.gz>" >&2
  echo "" >&2
  echo "Доступные бэкапы в $BACKUP_DIR:" >&2
  ls -lh "$BACKUP_DIR"/prod-*.db.gz 2>/dev/null || echo "  (нет файлов)" >&2
  exit 1
fi

BACKUP_FILE="$1"
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ [restore] файл бэкапа не найден: $BACKUP_FILE" >&2
  exit 1
fi

command -v sqlite3 >/dev/null 2>&1 || { echo "❌ [restore] sqlite3 не установлен" >&2; exit 1; }
command -v gzip >/dev/null 2>&1 || { echo "❌ [restore] gzip не установлен" >&2; exit 1; }

mkdir -p "$DATA_DIR" "$BACKUP_DIR"

# 1. Предварительная распаковка и проверка целостности архива ДО остановки приложения
TMP_RESTORE="$DATA_DIR/.restore-staging-$$.db"
trap 'rm -f "$TMP_RESTORE"' EXIT

echo "[restore] проверяю архив $BACKUP_FILE..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
  gzip -dc "$BACKUP_FILE" > "$TMP_RESTORE"
else
  cp "$BACKUP_FILE" "$TMP_RESTORE"
fi

INTEGRITY=$(sqlite3 "$TMP_RESTORE" "PRAGMA integrity_check;" 2>&1 || true)
if [ "$INTEGRITY" != "ok" ]; then
  echo "❌ [restore] архив повреждён (PRAGMA integrity_check: $INTEGRITY). Восстановление отменено." >&2
  exit 1
fi

USER_COUNT=$(sqlite3 "$TMP_RESTORE" 'SELECT COUNT(*) FROM "User";')
PAYMENT_COUNT=$(sqlite3 "$TMP_RESTORE" 'SELECT COUNT(*) FROM "Payment";')
ACCESS_COUNT=$(sqlite3 "$TMP_RESTORE" 'SELECT COUNT(*) FROM "Access";')

echo "------------------------------------------------------------"
echo "Готов к восстановлению БД:"
echo "  Источник:        $BACKUP_FILE"
echo "  Целевая БД:      $DB"
echo "  Строки в архиве: User=$USER_COUNT, Payment=$PAYMENT_COUNT, Access=$ACCESS_COUNT"
echo "------------------------------------------------------------"
read -r -p "Подтвердите перезапись рабочей БД (введите YES): " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Отменено пользователем."
  exit 1
fi

# 2. Останавливаем приложение в PM2, чтобы исключить запись в БД
echo "[restore] останавливаю pm2 ($PM2_APP)..."
pm2 stop "$PM2_APP"

# 3. Страховочная копия текущей рабочей БД перед заменой
SAFETY_STAMP=$(date +%F_%H%M%S)
SAFETY_OUT="$BACKUP_DIR/pre-restore-$SAFETY_STAMP.db"
if [ -f "$DB" ]; then
  echo "[restore] создаю страховочную копию текущей БД -> ${SAFETY_OUT}.gz"
  if sqlite3 "$DB" ".backup '$SAFETY_OUT'" 2>/dev/null; then
    gzip -f "$SAFETY_OUT"
  else
    cp -a "$DB" "$SAFETY_OUT"
    gzip -f "$SAFETY_OUT"
  fi
else
  echo "[restore] текущая БД $DB не найдена, пропускаю страховочную копию"
fi

# 4. Заменяем рабочую БД и удаляем старые WAL/SHM журналы
rm -f "${DB}-wal" "${DB}-shm"
mv -f "$TMP_RESTORE" "$DB"

# 5. Запускаем приложение обратно
echo "[restore] запускаю pm2 ($PM2_APP)..."
pm2 start "$PM2_APP" --update-env
pm2 save >/dev/null 2>&1 || true

echo "✅ [restore] БД успешно восстановлена из $BACKUP_FILE"
[ -f "${SAFETY_OUT}.gz" ] && echo "   Страховочная копия прежней БД: ${SAFETY_OUT}.gz"
pm2 list | grep "$PM2_APP" || true
