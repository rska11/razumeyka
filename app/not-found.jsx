import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mesh-bg min-h-screen px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl rounded-[30px] border border-white/80 bg-white/82 p-8 text-center shadow-color backdrop-blur-xl sm:p-12">
        <p className="section-kicker">404</p>
        <h1 className="section-title mt-6">Страница не найдена</h1>
        <p className="mt-5 text-lg font-medium leading-8 text-ink/66">
          Возможно, ссылка изменилась. На главной странице доступны все направления и актуальная запись.
        </p>
        <Link href="/" className="primary-btn mt-8">
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
