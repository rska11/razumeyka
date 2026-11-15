# Знайтон (`school-next`)

Веб-платформа детской онлайн-школы **«Знайтон»** ([znayton.ru](https://znayton.ru)): интерактивные self-study курсы и тренажёры (подготовка к школе, правополушарное рисование, ментальная арифметика, тренажёр таблицы умножения), обучающие мини-игры, личный кабинет родителя и ученика, блог, приём оплат через ЮKassa и автоматическая пробивка чеков НПД («Мой налог»).

---

## Технологический стек

- **Фреймворк:** Next.js 15 (App Router), React 19, TypeScript
- **Стили:** Tailwind CSS 3, PostCSS
- **База данных:** SQLite + Prisma ORM 6 (`/var/www/razumeyka-data/prod.db` на продакшне)
- **Авторизация:** NextAuth v4 (одноразовый email-код + Яндекс ID, фиксация согласия 152-ФЗ)
- **Платежи и чеки:** ЮKassa API (`lib/yookassa.ts`) + интеграция с «Мой налог» НПД (`lib/receipts.ts`)
- **Почта:** Nodemailer SMTP (`lib/mailer.ts`)
- **Продакшн-окружение:** Ubuntu VPS, PM2 (`ecosystem.config.cjs`, порт `3001`), Nginx + Let's Encrypt

---

## Структура папок

```text
school-next/
├── .github/workflows/   # GitHub Actions CI (lint, typecheck, тесты, тестовая сборка)
├── app/                 # Маршруты Next.js App Router (лендинги, курсы, игры, блог, кабинет, админка, API)
├── components/          # UI-компоненты, игровые движки (canvas/интерактив), плееры уроков, формы
├── data/                # Контент курсов, миссии тренажёров, уроки рисования/ментальной арифметики, статьи блога, FAQ
├── lib/                 # Серверная логика: Prisma, NextAuth, доступы/подписки, ЮKassa, чеки НПД, почта, напоминания, SEO
├── prisma/              # Схема базы данных Prisma (schema.prisma, SQLite)
├── public/              # Статические ассеты (аудио озвучки курсов, иллюстрации, иконки)
├── scripts/             # Автотесты игр и курсов (test-*.mjs), генераторы аудио SpeechKit, скрипты ежедневного блога
├── deploy/              # Продакшн-скрипты: server-setup.sh, update.sh, setup-backup.sh, check-backup.sh, restore-backup.sh, setup-cron.sh
└── docs/                # Документация проекта, включая регламент ежедневного блога (docs/DAILY-BLOG.md)
```

---

## Локальный запуск

1. Установите зависимости (с учётом `.npmrc` и React 19):
   ```bash
   npm install --legacy-peer-deps
   ```
2. Создайте файл `.env` в корне `school-next` (список переменных приведён ниже). Минимально для локальной разработки достаточно `DATABASE_URL` и `NEXTAUTH_SECRET`.
3. Сгенерируйте клиент Prisma и создайте локальную SQLite-базу:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Запустите сервер разработки:
   ```bash
   npm run dev
   ```
   Сайт откроется по адресу [http://localhost:3000](http://localhost:3000).

---

## Переменные окружения (`.env`)

Ниже перечислены все имена переменных окружения, используемые в коде (без секретных значений):

### База данных и основные настройки сайта
- `DATABASE_URL` — путь к SQLite-базе (локально: `file:./dev.db`, на сервере: `file:/var/www/razumeyka-data/prod.db`)
- `NEXT_PUBLIC_SITE_URL` — канонический URL сайта (по умолчанию `https://znayton.ru`)
- `NEXT_DIST_DIR` — директория сборки Next.js (используется в `deploy/update.sh` со значением `.next-pending` для бесшовного деплоя)
- `SITE_MOVE` — технический флаг переезда домена (`1` отключает canonical в `lib/seo.ts`)

### Авторизация и доступ
- `NEXTAUTH_URL` — базовый URL для NextAuth (`http://localhost:3000` локально, `https://znayton.ru` на проде)
- `NEXTAUTH_SECRET` — секрет подписи JWT-сессий NextAuth
- `YANDEX_CLIENT_ID` — Client ID OAuth-приложения Яндекс ID
- `YANDEX_CLIENT_SECRET` — Client Secret OAuth-приложения Яндекс ID
- `ADMIN_EMAILS` — список email администраторов через запятую (доступ к `/admin`)

### Почта (SMTP)
- `MAIL_HOST` — SMTP-сервер (например, `smtp.timeweb.ru`)
- `MAIL_PORT` — порт SMTP (по умолчанию `465`)
- `MAIL_SECURE` — использование TLS (`true` / `false`)
- `MAIL_USER` — логин почтового ящика
- `MAIL_PASS` — пароль почтового ящика
- `MAIL_FROM` — заголовок отправителя (например, `"Знайтон <znayton@genpic.ai>"`)

### Онлайн-оплата (ЮKassa)
- `YOOKASSA_SHOP_ID` — идентификатор магазина ЮKassa
- `YOOKASSA_SECRET_KEY` — секретный ключ магазина ЮKassa
- `YOOKASSA_TEST_MODE` — признак тестового режима (`true` / `false`)
- `YOOKASSA_RECEIPT` — передавать ли фискальный чек в ЮKassa (`true` / `false`)
- `YOOKASSA_VAT_CODE` — код ставки НДС для чека ЮKassa (по умолчанию `1`)

### Авто-чеки самозанятого («Мой налог» НПД) и реквизиты
- `NPD_RECEIPTS_ENABLED` — включение автоматической выдачи чеков НПД после оплаты (`1` — включено)
- `NPD_INN` — ИНН налогоплательщика НПД (личного кабинета «Мой налог»)
- `NPD_PASSWORD` — пароль от личного кабинета «Мой налог»
- `NPD_DEVICE_ID` — идентификатор устройства для API ФНС (по умолчанию `razumeyka-server-001`)
- `OPERATOR_NAME` — ФИО оператора/самозанятого (подставляется на страницы `/offer` и `/privacy`)
- `OPERATOR_INN` — ИНН оператора для публичной оферты и политики конфиденциальности

### Cron, бэкапы и внешние интеграции
- `CRON_SECRET` — Bearer-токен для защиты крон-эндпоинта `/api/cron/reminders`
- `BACKUP_RCLONE_REMOTE` — (опционально) целевой remote в `rclone` (например, `ydisk:razumeyka-backups`) для автоматической отправки ночных бэкапов в облако
- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `ANTHROPIC_API_BASE`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_RELAY_TOKEN` — (опционально) настройки AI-эндпоинта `/api/quiz`
- `YANDEX_API_KEY`, `YANDEX_FOLDER_ID`, `YANDEX_TTS_LANG`, `YANDEX_TTS_VOICE`, `YANDEX_TTS_SPEED`, `YANDEX_TTS_EMOTION`, `SPEECHKIT_ENDPOINT`, `SPEECHKIT_HOST` — (опционально) переменные для локальных скриптов генерации озвучки (`scripts/generate-*-audio.mjs`)
- `YANDEX_WEBMASTER_TOKEN` — хранится отдельно в `.env.blog` для скрипта переобхода Яндекс.Вебмастера (`scripts/yandex-recrawl.mjs`)

---

## Проверки и автотесты

Перед публикацией запустите единую команду проверки:

```bash
npm run check
```

Она последовательно выполняет:
- `npm run lint` — проверка кода ESLint
- `npm run typecheck` — проверка типов TypeScript (`tsc --noEmit`)
- `npm test` — все автотесты курсов, игр и согласий:
  - `npm run test:games` — движки обучающих игр (мост, светлячки, домик, академия, ментальный счёт)
  - `npm run test:school-prep` — программа и ассеты курса «Подготовка к школе» (недели 1–5)
  - `npm run test:multiplication` — маршруты и механики тренажёра таблицы умножения
  - `npm run test:consent` — логика баннера и cookie согласия на обработку данных

На каждый `push` и `pull_request` в ветку `main` автоматически запускается GitHub Actions workflow `.github/workflows/ci.yml` (Node 20, `npm ci --legacy-peer-deps`, `prisma generate`, `lint`, `tsc --noEmit`, `test:*`, `npm run build` с временной SQLite БД).

---

## Публикация и деплой на сервер

Репозиторий разработки хранится в ветке `nextjs-migration`, а папка `school-next` публикуется через `git subtree` в корень ветки `main` репозитория `https://github.com/rska11/razumeyka.git`.

1. **Локально (PowerShell из папки `school-next`):**
   ```powershell
   ..\publish-site.ps1 "краткое сообщение коммита"
   ```
   Скрипт `F:\school-landing\publish-site.ps1` сам выполняет `git add`, `git commit`, `git subtree split` в ветку `razumeyka-export` и `git push ... main --force`.

2. **На продакшн-сервере:**
   ```bash
   bash /var/www/razumeyka/deploy/update.sh
   ```
   Скрипт `deploy/update.sh` подтягивает свежий `origin/main`, выполняет `npm install --legacy-peer-deps`, `npx prisma db push`, собирает проект в `.next-pending` (пока сайт продолжает работать на текущей `.next`), проверяет наличие `.next-pending/BUILD_ID`, атомарно подменяет `.next` и делает `pm2 reload razumeyka --update-env` без простоя.

---

## Ежедневный блог

Автоматический выпуск ежедневных статей блога и отправка URL на переобход в Яндекс.Вебмастер описаны в документации:
- [docs/DAILY-BLOG.md](docs/DAILY-BLOG.md) — расписание задач Windows Task Scheduler (`Znayton-Daily-Blog` и `Znayton-Blog-Recrawl`), работа `scripts/run-daily-blog.ps1` и настройка `scripts/yandex-recrawl.mjs`.

---

## Бэкапы и восстановление базы данных

Рабочая SQLite-база на сервере находится в `/var/www/razumeyka-data/prod.db`, архивы бэкапов — в `/var/www/razumeyka-data/backups/`.

### 1. Настройка ночного бэкапа (`deploy/setup-backup.sh`)
Устанавливает скрипт `/usr/local/bin/razumeyka-backup.sh` и задачу в `crontab` (ежедневно в `03:30`, хранение локальных архивов `prod-YYYY-MM-DD_HHMM.db.gz` — 14 дней, консистентное снятие копии через `sqlite3 .backup` с учётом WAL):
```bash
bash /var/www/razumeyka/deploy/setup-backup.sh
```
**Офсайт-копия (опционально):** если в `/var/www/razumeyka/.env` задана переменная `BACKUP_RCLONE_REMOTE` (например, `BACKUP_RCLONE_REMOTE=ydisk:razumeyka-backups`) и установлен `rclone`, скрипт бэкапа после создания локального `.db.gz` автоматически копирует его в облачное хранилище командой `rclone copy`. Если переменная не задана, работает только локальный бэкап.

### 2. Проверка свежести и целостности бэкапа (`deploy/check-backup.sh`)
Проверяет, что последний бэкап младше 36 часов, распаковывает его во временный файл, выполняет `PRAGMA integrity_check` и выводит количество записей в таблицах `User`, `Payment`, `Access` (возвращает ненулевой код выхода при любой проблеме):
```bash
bash /var/www/razumeyka/deploy/check-backup.sh
```
Можно также передать путь к конкретному файлу архива первым аргументом.

### 3. Безопасное восстановление (`deploy/restore-backup.sh`)
Для восстановления БД из архива укажите явный путь к файлу бэкапа:
```bash
bash /var/www/razumeyka/deploy/restore-backup.sh /var/www/razumeyka-data/backups/prod-YYYY-MM-DD_HHMM.db.gz
```
Скрипт:
1. Сначала распаковывает архив во временный файл и проверяет `PRAGMA integrity_check` (если архив повреждён — ничего не останавливает и не перезаписывает).
2. Выводит сводку по таблицам в архиве и запрашивает явное подтверждение (`YES`).
3. Останавливает приложение (`pm2 stop razumeyka`).
4. Делает страховочную копию текущей `prod.db` в `/var/www/razumeyka-data/backups/pre-restore-YYYY-MM-DD_HHMMSS.db.gz`.
5. Очищает старые `-wal`/`-shm` журналы, атомарно заменяет `prod.db` и запускает приложение (`pm2 start razumeyka --update-env`).
