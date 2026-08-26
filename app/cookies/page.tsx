import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieSettingsButton.jsx";

export const metadata = {
  title: "Использование cookie",
  description:
    "Какие cookie использует Знайтон: обязательные для входа и прогресса уроков, аналитические — только с вашего согласия.",
  robots: { index: false },
};

const CONTACT_EMAIL = "info@znayton.ru";
const UPDATED = "26 августа 2026 г.";

type Row = { name: string; purpose: string; life: string };

const REQUIRED: Row[] = [
  {
    name: "next-auth.session-token (на https — __Secure-next-auth.session-token)",
    purpose: "Сессия входа в личный кабинет: держит вас авторизованным между страницами.",
    life: "до 30 дней",
  },
  {
    name: "next-auth.csrf-token, next-auth.callback-url",
    purpose: "Защита формы входа от подделки запросов и возврат на нужную страницу после входа.",
    life: "сессия браузера",
  },
  {
    name: "znayton_cookie_consent",
    purpose: "Ваше решение по cookie (согласие на аналитику или отказ) и дата решения.",
    life: "1 год",
  },
  {
    name: "rzm_pd_consent",
    purpose: "Отметка, что при входе вы подтвердили согласие на обработку персональных данных.",
    life: "30 минут",
  },
];

const ANALYTICS: Row[] = [
  { name: "_ym_uid", purpose: "Анонимный идентификатор посетителя Яндекс.Метрики.", life: "1 год" },
  { name: "_ym_d", purpose: "Дата первого визита на сайт.", life: "1 год" },
  { name: "_ym_isad", purpose: "Признак наличия блокировщика рекламы.", life: "2 дня" },
  { name: "_ym_visorc", purpose: "Работа Вебвизора (запись действий на странице, без содержимого полей с данными).", life: "30 минут" },
  { name: "yandexuid, yabs-sid и др. (домен yandex.ru)", purpose: "Служебные cookie самого сервиса Яндекс.Метрика.", life: "по правилам Яндекса" },
];

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-base leading-7 text-ink/72">{children}</p>;
}
function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 font-display text-xl font-extrabold text-ink">{children}</h2>;
}

function Table({ rows }: { rows: Row[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs font-extrabold uppercase tracking-[0.12em] text-ink/45">
            <th className="py-2 pr-4">Cookie</th>
            <th className="py-2 pr-4">Зачем</th>
            <th className="py-2">Срок</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-ink/6 align-top">
              <td className="py-3 pr-4 font-bold text-ink/80">{row.name}</td>
              <td className="py-3 pr-4 leading-6 text-ink/68">{row.purpose}</td>
              <td className="py-3 whitespace-nowrap text-ink/60">{row.life}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <main className="mesh-bg min-h-screen px-5 py-14 sm:px-8">
      <article className="mx-auto max-w-3xl rounded-[28px] border border-white/80 bg-white/85 p-7 shadow-color backdrop-blur-xl sm:p-10">
        <Link href="/" className="text-sm font-extrabold text-ink/52 transition hover:text-ink">← На главную</Link>
        <h1 className="section-title mt-4">Использование cookie</h1>
        <P>Дата обновления: {UPDATED}</P>
        <P>
          Cookie — небольшие файлы, которые сайт сохраняет в вашем браузере. Мы делим их на две группы:
          обязательные (без них сайт не работает) и аналитические (подключаются только с вашего согласия).
        </P>

        <H>1. Обязательные cookie</H>
        <P>
          Обеспечивают вход в личный кабинет, безопасность форм и сохранение вашего решения по cookie.
          Они не используются для рекламы и не передаются третьим лицам для их собственных целей.
        </P>
        <Table rows={REQUIRED} />

        <H>2. Аналитические cookie — только с согласия</H>
        <P>
          До того как вы нажмёте «Принять все», счётчик Яндекс.Метрики на сайт не загружается и аналитические
          cookie не ставятся. Если вы дали согласие, мы используем «Яндекс.Метрику» (ООО «ЯНДЕКС», Россия),
          включая технологию Вебвизор, чтобы видеть, какие страницы и уроки полезны, и где дети и родители
          застревают. Поля, куда вводятся персональные данные (имя, телефон, e-mail, код входа), помечены
          так, что Вебвизор их содержимое не записывает.
        </P>
        <Table rows={ANALYTICS} />

        <H>3. Что хранится не в cookie</H>
        <P>
          Прогресс уроков и локальные настройки интерфейса сохраняются в памяти браузера (localStorage) на
          вашем устройстве. Это не cookie, они не отправляются на сторонние сервисы; очистка данных сайта в
          браузере их удаляет.
        </P>

        <H>4. Как изменить или отозвать согласие</H>
        <P>
          Нажмите кнопку ниже — плашка откроется снова, и вы сможете выбрать другой вариант. При отказе мы
          удаляем аналитические cookie нашего домена и перестаём загружать счётчик. Также вы можете удалить
          или запретить cookie в настройках браузера — но тогда вход в личный кабинет работать не будет.
        </P>
        <div className="mt-5">
          <CookieSettingsButton className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-night px-6 text-sm font-extrabold text-porcelain transition hover:bg-ink">
            Изменить настройки cookie
          </CookieSettingsButton>
        </div>

        <H>5. Контакты</H>
        <P>
          Вопросы по обработке данных и cookie: {CONTACT_EMAIL}. Подробнее о том, какие данные мы собираем
          и на каком основании, — в{" "}
          <Link href="/privacy" className="font-extrabold text-brand-blue underline decoration-brand-blue/30 underline-offset-2">
            политике конфиденциальности
          </Link>
          .
        </P>
      </article>
    </main>
  );
}
