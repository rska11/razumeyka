#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# server-setup.sh — установка/обновление сайта Разумейки на Timeweb VPS
# рядом с genpic. Идемпотентно: можно запускать повторно (будет деплой-обновление).
#
# Запуск (на сервере, root):
#   cd /var/www && git clone https://github.com/rska11/razumeyka.git \
#     && bash razumeyka/deploy/server-setup.sh
# Повторный деплой:
#   bash /var/www/razumeyka/deploy/server-setup.sh
# ---------------------------------------------------------------------------
set -euo pipefail

APP_DIR=/var/www/razumeyka
DATA_DIR=/var/www/razumeyka-data
DOMAIN=razumeyka-school.ru
PORT=3001
PM2_APP=razumeyka
REPO=https://github.com/rska11/razumeyka.git
GENPIC_ENV=/var/www/magicpic/.env.local
LE_EMAIL=admin@genpic.ai

echo "==================================================="
echo "  Разумейка — настройка сервера ($DOMAIN, порт $PORT)"
echo "==================================================="

# 0. Проверки окружения
command -v node  >/dev/null || { echo "ОШИБКА: Node не установлен"; exit 1; }
command -v git   >/dev/null || { echo "ОШИБКА: git не установлен"; exit 1; }
command -v nginx >/dev/null || { echo "ОШИБКА: nginx не установлен"; exit 1; }
command -v pm2   >/dev/null || { echo "[setup] ставлю pm2 глобально..."; npm i -g pm2; }
echo "[setup] Node $(node -v), npm $(npm -v)"

mkdir -p "$DATA_DIR"

# 1. Код: клон или обновление
if [ -d "$APP_DIR/.git" ]; then
  echo "[git] обновляю код в $APP_DIR"
  cd "$APP_DIR"
  git fetch origin main
  git reset --hard origin/main
else
  echo "[git] клонирую репозиторий в $APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 2. .env (создаётся один раз; почта переиспуется из genpic — тот же admin@genpic.ai)
if [ ! -f "$APP_DIR/.env" ]; then
  echo "[env] создаю .env"
  SECRET=$(openssl rand -base64 32)
  get() { grep -E "^$1=" "$GENPIC_ENV" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' || true; }
  MH=$(get MAIL_HOST); MP=$(get MAIL_PORT); MS=$(get MAIL_SECURE); MU=$(get MAIL_USER); MPW=$(get MAIL_PASS)
  cat > "$APP_DIR/.env" <<EOF
DATABASE_URL="file:$DATA_DIR/prod.db"
NEXTAUTH_URL=https://$DOMAIN
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NEXTAUTH_SECRET="$SECRET"
MAIL_HOST=${MH:-smtp.zoho.com}
MAIL_PORT=${MP:-465}
MAIL_SECURE=${MS:-true}
MAIL_USER=${MU:-admin@genpic.ai}
MAIL_PASS=${MPW:-}
MAIL_FROM="Разумейка <noreply@$DOMAIN>"
EOF
  if [ -n "${MPW:-}" ]; then echo "[env] почта взята из genpic (${MU:-admin@genpic.ai}) — письма заработают"; else
    echo "[env] ВНИМАНИЕ: не нашёл MAIL_PASS в $GENPIC_ENV — впиши пароль в $APP_DIR/.env вручную"; fi
else
  echo "[env] .env уже существует — оставляю как есть"
fi

# 3. Зависимости, БД, сборка
echo "[build] npm ci..."
npm ci --legacy-peer-deps
echo "[build] prisma generate + db push (создаст $DATA_DIR/prod.db)..."
npx prisma generate
npx prisma db push --skip-generate
echo "[build] next build..."
npm run build

# 4. PM2
echo "[pm2] запуск/перезапуск процесса $PM2_APP"
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 reload "$PM2_APP" --update-env
else
  pm2 start ecosystem.config.cjs --update-env
fi
pm2 save

# 5. nginx vhost (HTTP; SSL добавит certbot)
NGINX_CONF=/etc/nginx/sites-available/razumeyka.conf
if [ ! -f "$NGINX_CONF" ]; then
  echo "[nginx] создаю vhost"
  cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        add_header Cache-Control "no-store" always;
    }
}
EOF
  ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/razumeyka.conf
else
  echo "[nginx] vhost уже есть"
fi
nginx -t && systemctl reload nginx

# 6. SSL (Let's Encrypt)
if command -v certbot >/dev/null; then
  echo "[ssl] выпускаю сертификат для $DOMAIN"
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$LE_EMAIL" --redirect || \
    echo "[ssl] certbot не смог сразу — проверь DNS/80 порт и запусти: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
else
  echo "[ssl] certbot не установлен. Поставь: apt install -y certbot python3-certbot-nginx — затем перезапусти скрипт"
fi

echo "==================================================="
echo "  ГОТОВО. Проверь: https://$DOMAIN"
echo "==================================================="
pm2 status
