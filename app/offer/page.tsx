import Link from "next/link";

export const metadata = {
  title: "Публичная оферта — Разумейка",
  robots: { index: false },
};

// Типовой шаблон. Замени [...] на свои реквизиты и при возможности дай юристу на проверку.
const OPERATOR = "Онлайн-школа «Разумейка» (razumeyka-school.ru)";
const OPERATOR_DETAILS = "[ИП/самозанятый, ФИО, ИНН, контакты]";
const CONTACT_EMAIL = "info@razumeyka-school.ru";
const UPDATED = "25 июня 2026 г.";

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-base leading-7 text-ink/72">{children}</p>;
}
function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 font-display text-xl font-extrabold text-ink">{children}</h2>;
}

export default function OfferPage() {
  return (
    <main className="mesh-bg min-h-screen px-5 py-14 sm:px-8">
      <article className="mx-auto max-w-3xl rounded-[28px] border border-white/80 bg-white/85 p-7 shadow-color backdrop-blur-xl sm:p-10">
        <Link href="/" className="text-sm font-extrabold text-ink/52 transition hover:text-ink">← На главную</Link>
        <h1 className="section-title mt-4">Публичная оферта</h1>
        <P>Дата обновления: {UPDATED}. Исполнитель: {OPERATOR}, {OPERATOR_DETAILS}.</P>

        <H>1. Предмет</H>
        <P>
          Настоящая оферта является официальным предложением Исполнителя заключить договор на оказание
          образовательных услуг (онлайн-занятия по выбранным направлениям) на изложенных ниже условиях.
          Оплата услуг означает полное и безоговорочное принятие условий оферты (акцепт).
        </P>

        <H>2. Услуги и стоимость</H>
        <P>
          Перечень направлений, форматов (групповой/индивидуальный), тарифов и стоимость указаны на Сайте в
          форме записи. Стоимость, действующая на момент оплаты, является окончательной для оплаченного периода.
        </P>

        <H>3. Порядок оплаты</H>
        <P>
          Оплата производится онлайн через платёжный сервис (ЮKassa/ЮMoney). После оплаты Исполнитель связывается
          с Заказчиком и предоставляет доступ к занятиям. Чек об оплате формируется в соответствии с законодательством.
        </P>

        <H>4. Оказание услуг</H>
        <P>
          Занятия проводятся онлайн по согласованному расписанию. Исполнитель вправе заменять преподавателя и
          переносить занятия с уведомлением Заказчика. Пропущенные по вине Заказчика занятия возврату/переносу,
          как правило, не подлежат (если иное не согласовано).
        </P>

        <H>5. Возврат</H>
        <P>
          Заказчик вправе отказаться от услуг и потребовать возврат денежных средств за неоказанные занятия
          пропорционально, направив обращение на {CONTACT_EMAIL}. Возврат осуществляется в сроки, установленные
          законодательством РФ.
        </P>

        <H>6. Персональные данные</H>
        <P>
          Обработка персональных данных осуществляется в соответствии с{" "}
          <Link href="/privacy" className="font-extrabold text-brand-blue underline">Политикой конфиденциальности</Link>.
        </P>

        <H>7. Контакты</H>
        <P>{CONTACT_EMAIL}</P>
      </article>
    </main>
  );
}
