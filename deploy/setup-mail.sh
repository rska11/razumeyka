#!/usr/bin/env bash
# Переключение почты школы на ящик Timeweb info@razumeyka-school.ru.
# Использование (можно передать несколько паролей-кандидатов — переберёт по очереди):
#   bash /var/www/razumeyka/deploy/setup-mail.sh 'пароль1' ['пароль2' ...]
# Скрипт СНАЧАЛА проверяет SMTP-авторизацию и меняет .env только если пароль подошёл.
set -euo pipefail

APP_DIR=/var/www/razumeyka
ENV="$APP_DIR/.env"
HOST=smtp.timeweb.ru
PORT=465
USER_ADDR=info@razumeyka-school.ru

[ $# -ge 1 ] || { echo "Использование: bash $0 'пароль' ['пароль2' ...]"; exit 1; }

cd "$APP_DIR"

GOOD=""
for PASS in "$@"; do
  echo "Проверяю пароль (${#PASS} символов)…"
  if MAIL_TEST_PASS="$PASS" node -e '
    const nodemailer = require("nodemailer");
    const t = nodemailer.createTransport({
      host: "smtp.timeweb.ru", port: 465, secure: true,
      auth: { user: "info@razumeyka-school.ru", pass: process.env.MAIL_TEST_PASS },
      connectionTimeout: 15000,
    });
    t.verify().then(() => { console.log("OK"); process.exit(0); })
      .catch((e) => { console.log("FAIL: " + e.message); process.exit(1); });
  '; then
    GOOD="$PASS"
    break
  fi
done

[ -n "$GOOD" ] || { echo "❌ Ни один пароль не подошёл — почта НЕ переключена (старые настройки целы)."; exit 1; }

# Пароль подошёл — переключаем .env
for K in MAIL_HOST MAIL_PORT MAIL_SECURE MAIL_USER MAIL_PASS MAIL_FROM; do
  sed -i "/^$K=/d" "$ENV"
done
{
  echo "MAIL_HOST=$HOST"
  echo "MAIL_PORT=$PORT"
  echo "MAIL_SECURE=true"
  echo "MAIL_USER=$USER_ADDR"
  echo "MAIL_PASS=$GOOD"
  echo "MAIL_FROM=\"Разумейка <$USER_ADDR>\""
} >> "$ENV"

pm2 restart razumeyka --update-env >/dev/null

# Контрольное письмо админу (адрес из ADMIN_EMAILS)
ADMIN=$(grep '^ADMIN_EMAILS=' "$ENV" | head -1 | cut -d= -f2- | tr -d '"' | cut -d, -f1)
if [ -n "$ADMIN" ]; then
  MAIL_TEST_PASS="$GOOD" MAIL_TEST_TO="$ADMIN" node -e '
    const nodemailer = require("nodemailer");
    const t = nodemailer.createTransport({
      host: "smtp.timeweb.ru", port: 465, secure: true,
      auth: { user: "info@razumeyka-school.ru", pass: process.env.MAIL_TEST_PASS },
    });
    t.sendMail({
      from: "Разумейка <info@razumeyka-school.ru>",
      to: process.env.MAIL_TEST_TO,
      subject: "Почта Разумейки переключена на Timeweb ✓",
      text: "Это контрольное письмо: ящик info@razumeyka-school.ru работает, отправка идёт через smtp.timeweb.ru.",
    }).then(() => console.log("Контрольное письмо отправлено на " + process.env.MAIL_TEST_TO))
      .catch((e) => console.log("Контрольное письмо не ушло: " + e.message));
  '
fi

echo "✅ ГОТОВО: почта переключена на $USER_ADDR ($HOST:$PORT), приложение перезапущено."
