"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="mesh-bg min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/cabinet";

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentAttention, setConsentAttention] = useState(false);

  // Ошибка next-auth после редиректа (например, Яндекс отклонён signIn-callback'ом)
  const authError = params.get("error");
  const [error, setError] = useState<string | null>(
    authError === "AccessDenied"
      ? "Не удалось войти через Яндекс: нет согласия на обработку данных или аккаунт заблокирован."
      : authError
        ? "Не удалось войти. Попробуйте ещё раз."
        : null,
  );

  function signInYandex() {
    if (!requireConsent()) return;
    // Согласие на обработку ПД передаём серверу короткоживущей cookie:
    // signIn-callback не пустит вход через Яндекс без неё, jwt-callback зафиксирует дату в БД.
    document.cookie = "rzm_pd_consent=1; path=/; max-age=1800; SameSite=Lax";
    signIn("yandex", { callbackUrl });
  }

  function requireConsent() {
    if (consent) return true;
    setConsentAttention(true);
    setError("Сначала поставьте галочку согласия на обработку персональных данных.");
    window.requestAnimationFrame(() => document.getElementById("pd-consent")?.focus());
    return false;
  }

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    setNotice(null);
    if (!requireConsent()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/email-code/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      if (res.ok) {
        setStep("code");
        setNotice(`Код отправлен на ${email}. Проверьте почту.`);
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error === "RATE_LIMITED") {
          setStep("code");
          setNotice(`Код уже отправлен на ${email}. Введите его ниже.`);
          return;
        }
        setError(
          data.error === "INVALID_EMAIL"
              ? "Введите корректный email."
              : data.error === "FOREIGN_EMAIL"
                ? "Вход только с российской почты (Яндекс, Mail.ru и др.) — требование закона РФ."
                : data.error === "AUTH_DISABLED"
                  ? "Вход временно закрыт — сайт в разработке."
                  : data.error === "CONSENT_REQUIRED"
                    ? "Отметьте согласие на обработку персональных данных, чтобы продолжить."
                    : "Не удалось отправить код. Попробуйте ещё раз.",
        );
      }
    } catch {
      setError("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  async function submitCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("email-code", {
        email,
        code,
        consent: consent ? "true" : "",
        redirect: false,
      });
      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError("Неверный или просроченный код. Проверьте и попробуйте снова.");
      }
    } catch {
      setError("Не удалось войти. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-md rounded-[28px] border border-white/80 bg-white/85 p-7 shadow-color backdrop-blur-xl sm:p-9">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-ink/52 transition hover:text-ink">
          ← На главную
        </Link>

        <h1 className="section-title mt-5 text-[1.9rem] sm:text-[2.1rem]">Вход для родителей</h1>
        <p className="mt-3 text-base font-medium leading-7 text-ink/64">
          {step === "email"
            ? "Введите email — пришлём одноразовый код для входа в личный кабинет."
            : `Введите 6-значный код, отправленный на ${email}.`}
        </p>

        {notice && (
          <div className="mt-5 rounded-[14px] border border-brand-green/24 bg-brand-green/8 px-4 py-3 text-sm font-bold text-forest-700">
            {notice}
          </div>
        )}
        {error && (
          <div className="mt-5 rounded-[14px] border border-brand-red/24 bg-brand-red/8 px-4 py-3 text-sm font-bold text-brand-red">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={requestCode} className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">Email (российская почта)</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@yandex.ru"
                className="ym-disable-keys field-input"
              />
              <p className="mt-1.5 text-xs font-medium text-ink/46">
                Только российская почта (Яндекс, Mail.ru и др.) — требование закона РФ.
              </p>
            </div>
            <div
              className={"rounded-[18px] border-2 p-4 transition " + (
                consent
                  ? "border-brand-green/35 bg-brand-green/[0.07]"
                  : consentAttention
                    ? "border-brand-red/45 bg-brand-red/[0.07] shadow-card"
                    : "border-brand-blue/18 bg-brand-blue/[0.045]"
              )}
            >
              <label htmlFor="pd-consent" className="flex cursor-pointer items-start gap-3.5">
                <input
                  id="pd-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setConsentAttention(false);
                    if (e.target.checked) setError(null);
                  }}
                  className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-brand-blue"
                />
                <span>
                  <span className="block text-sm font-extrabold text-ink">Обязательное согласие для входа</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-ink/62">
                    Я даю согласие на обработку персональных данных для регистрации и работы личного кабинета.
                  </span>
                </span>
              </label>
              <p className="mt-3 border-t border-ink/7 pt-3 pl-9 text-xs font-medium leading-5 text-ink/48">
                Как мы обрабатываем и защищаем данные, описано в{" "}
                <a href="/privacy" target="_blank" rel="noopener" className="font-extrabold text-brand-blue underline">Политике конфиденциальности</a>.
              </p>
            </div>
            <button type="submit" disabled={loading} className="primary-btn w-full disabled:opacity-50">
              {loading ? "Отправляем…" : "Получить код"}
            </button>
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/36">
              <span className="h-px flex-1 bg-ink/10" /> или <span className="h-px flex-1 bg-ink/10" />
            </div>
            <button
              type="button"
              onClick={signInYandex}
              disabled={loading}
              className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#fc3f1d] px-5 py-3 text-base font-extrabold text-white shadow-button transition hover:-translate-y-0.5 hover:brightness-95 disabled:opacity-50"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black text-[#fc3f1d]">Я</span>
              Войти через Яндекс
            </button>
            <p className={"text-center text-xs font-semibold leading-5 " + (consent ? "text-ink/42" : "text-brand-red")}>
              {consent ? "Для входа через Яндекс email вводить не нужно." : "Перед входом через Яндекс поставьте обязательную галочку выше ↑"}
            </p>
          </form>
        ) : (
          <form onSubmit={submitCode} className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">Код из письма</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="______"
                className="ym-disable-keys field-input text-center text-2xl font-extrabold tracking-[0.5em]"
              />
            </div>
            <button type="submit" disabled={loading || code.length < 6} className="primary-btn w-full disabled:opacity-50">
              {loading ? "Входим…" : "Войти"}
            </button>
            <div className="flex items-center justify-between text-sm font-bold">
              <button type="button" onClick={() => { setStep("email"); setCode(""); setError(null); }} className="text-ink/52 transition hover:text-ink">
                ← Изменить email
              </button>
              <button type="button" onClick={() => requestCode()} disabled={loading} className="text-brand-blue transition hover:text-brand-blue/70 disabled:opacity-50">
                Отправить заново
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
