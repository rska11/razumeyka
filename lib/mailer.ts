import nodemailer from "nodemailer";

/**
 * Почта Разумейки. Через обобщённый SMTP (env MAIL_*), что позволяет
 * использовать фирменный ящик Zoho для razumeyka-school.ru:
 *   MAIL_HOST=smtp.zoho.eu  MAIL_PORT=465  MAIL_SECURE=true
 *   MAIL_USER=noreply@razumeyka-school.ru  MAIL_PASS=<app-пароль Zoho>
 *   MAIL_FROM="Разумейка <noreply@razumeyka-school.ru>"
 *
 * Если SMTP не настроен (нет MAIL_USER/MAIL_PASS) — код входа печатается
 * в консоль сервера. Это удобно для разработки без реальной почты.
 */

function env(value?: string | null) {
  const t = value?.trim();
  return t ? t : undefined;
}

export function isMailConfigured() {
  return Boolean(env(process.env.MAIL_HOST) && env(process.env.MAIL_USER) && env(process.env.MAIL_PASS));
}

function getFrom() {
  return env(process.env.MAIL_FROM) ?? "Разумейка <noreply@razumeyka-school.ru>";
}

function createTransport() {
  return nodemailer.createTransport({
    host: env(process.env.MAIL_HOST),
    port: Number.parseInt(env(process.env.MAIL_PORT) ?? "465", 10),
    secure: (env(process.env.MAIL_SECURE) ?? "true").toLowerCase() === "true",
    auth: {
      user: env(process.env.MAIL_USER),
      pass: env(process.env.MAIL_PASS),
    },
  });
}

export async function sendLoginCodeEmail(to: string, code: string): Promise<void> {
  // Dev-фоллбэк: без настроенного SMTP пишем код в консоль.
  if (!isMailConfigured()) {
    console.info(`\n[Разумейка] Код входа для ${to}: ${code} (действует 10 минут)\n`);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: getFrom(),
    to,
    subject: `${code} — код для входа в Разумейку`,
    text:
      `Ваш код для входа в личный кабинет Разумейки: ${code}\n\n` +
      `Код действует 10 минут. Если вы не запрашивали вход — просто игнорируйте это письмо.`,
    html: buildCodeEmail(code),
  });
}

function buildCodeEmail(code: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5fbff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Manrope,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5fbff">
<tr><td align="center" style="padding:48px 16px">
<table width="100%" style="max-width:480px" cellpadding="0" cellspacing="0">
<tr><td style="padding-bottom:28px">
  <span style="font-size:22px;font-weight:800;color:#0b1f3a;letter-spacing:-0.5px">Разумейка</span>
  <span style="font-size:13px;color:#64748b;margin-left:10px">онлайн-школа развития детей</span>
</td></tr>
<tr><td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px 32px 28px;box-shadow:0 18px 54px rgba(59,130,246,0.10)">
  <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#0b1f3a">Код для входа в личный кабинет</p>
  <p style="margin:0 0 24px;font-size:13px;color:#64748b;line-height:1.5">Введите этот код на странице входа. Код одноразовый.</p>
  <div style="background:#f5fbff;border:2px solid #3b82f6;border-radius:12px;padding:26px 24px;text-align:center;margin-bottom:24px">
    <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#0b1f3a;font-variant-numeric:tabular-nums">${code}</span>
  </div>
  <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7">
    Код действует <strong style="color:#64748b">10 минут</strong>.<br>
    Если вы не запрашивали вход — просто проигнорируйте это письмо.
  </p>
</td></tr>
<tr><td style="padding-top:24px;text-align:center">
  <p style="margin:0;font-size:12px;color:#94a3b8">Разумейка · razumeyka-school.ru</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
