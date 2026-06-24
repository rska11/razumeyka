import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

// читаем .env вручную
const envText = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
const env = {};
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}

const cfg = {
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT || 465),
  secure: String(env.MAIL_SECURE).toLowerCase() === "true",
  user: env.MAIL_USER,
  from: env.MAIL_FROM,
};
console.log("config:", { host: cfg.host, port: cfg.port, secure: cfg.secure, user: cfg.user });

const transport = nodemailer.createTransport({
  host: cfg.host,
  port: cfg.port,
  secure: cfg.secure,
  auth: { user: cfg.user, pass: env.MAIL_PASS },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

async function tryVerify() {
  for (let i = 1; i <= 4; i++) {
    try {
      await transport.verify();
      console.log(`VERIFY OK (попытка ${i}) — соединение и авторизация прошли`);
      return true;
    } catch (e) {
      console.log(`VERIFY FAIL (попытка ${i}):`, e.code || "", "-", e.message);
    }
  }
  return false;
}

const ok = await tryVerify();
if (ok) {
  const to = process.argv[2] || "kagirovu@gmail.com";
  try {
    const info = await transport.sendMail({
      from: cfg.from,
      to,
      subject: "Тест почты Разумейки",
      text: "Это тестовое письмо для проверки SMTP. Если вы его видите — почта работает.",
    });
    console.log("SEND OK ->", to, "| messageId:", info.messageId, "| response:", info.response);
  } catch (e) {
    console.log("SEND FAIL:", e.code || "", "-", e.message);
  }
}
process.exit(0);
