// Российская ли почта (для соответствия закону об авторизации, 26.06.2026).
// Разрешаем домены РФ-провайдеров и российские зоны (.ru/.su/.рф).
const RU_PROVIDERS = new Set([
  "yandex.com", // Яндекс (нероссийская зона, но российский сервис)
  "ya.ru",
]);

export function isRussianEmail(email: string | null | undefined): boolean {
  const e = String(email ?? "").trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at < 1) return false;
  const domain = e.slice(at + 1);
  if (!domain) return false;
  if (RU_PROVIDERS.has(domain)) return true;
  // .ru, .su и .рф (punycode xn--p1ai)
  return /\.(ru|su|xn--p1ai)$/.test(domain);
}
