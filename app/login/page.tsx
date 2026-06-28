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
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/email-code/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep("code");
        setNotice(`Код отправлен на ${email}. Проверьте почту.`);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === "RATE_LIMITED"
            ? "Код уже отправлен. Подождите минуту перед повторной отправкой."
            : data.error === "INVALID_EMAIL"
              ? "Введите корректный email."
              : data.error === "FOREIGN_EMAIL"
                ? "Вход только с российской почты (Яндекс, Mail.ru и др.) — требование закона РФ."
                : data.error === "AUTH_DISABLED"
                  ? "Вход временно закрыт — сайт в разработке."
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
                className="field-input"
              />
              <p className="mt-1.5 text-xs font-medium text-ink/46">
                Только российская почта (Яндекс, Mail.ru и др.) — требование закона РФ.
              </p>
            </div>
            <label className="flex items-start gap-2.5 text-xs font-medium leading-5 text-ink/60">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-blue" />
              <span>
                Я соглашаюсь на обработку персональных данных и принимаю{" "}
                <a href="/privacy" target="_blank" rel="noopener" className="font-extrabold text-brand-blue underline">Политику конфиденциальности</a>.
              </span>
            </label>
            <button type="submit" disabled={loading || !consent} className="primary-btn w-full disabled:opacity-50">
              {loading ? "Отправляем…" : "Получить код"}
            </button>
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
                className="field-input text-center text-2xl font-extrabold tracking-[0.5em]"
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
