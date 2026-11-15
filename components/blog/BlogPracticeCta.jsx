import Link from 'next/link';
import { TrackedLink } from '@/components/analytics/TrackedLink.jsx';
import { Icon } from '@/components/Icon.jsx';

export const COURSES_CATALOG = {
  risovanie: {
    id: 'risovanie',
    title: 'Правополушарное рисование',
    href: '/risovanie',
    ages: '5–12 лет',
    badge: 'Первые уроки бесплатно',
    emoji: '🎨',
    description:
      'Пошаговые видео-уроки без страха чистого листа: ребёнок рисует сам в своём темпе, и первая картина получается уже на старте.',
    ctaLabel: 'Открыть бесплатные уроки',
  },
  'mentalnaya-arifmetika': {
    id: 'mentalnaya-arifmetika',
    title: 'Ментальная арифметика',
    href: '/mentalnaya-arifmetika',
    ages: '4–10 лет',
    badge: 'Первые уроки бесплатно',
    emoji: '🧮',
    description:
      'Интерактивный абакус и короткие уроки-игры: развиваем быстрый устный счёт, концентрацию внимания и рабочую память.',
    ctaLabel: 'Попробовать бесплатные уроки',
  },
  'podgotovka-k-shkole': {
    id: 'podgotovka-k-shkole',
    title: 'Подготовка к школе',
    href: '/podgotovka-k-shkole',
    ages: '5–7 лет',
    badge: 'Первые уроки бесплатно',
    emoji: '🎒',
    description:
      'Речь, чтение, счёт, логика и подготовка руки к письму в спокойных игровых занятиях по 15–20 минут.',
    ctaLabel: 'Начать бесплатные уроки',
  },
  'trenazher-umnozheniya': {
    id: 'trenazher-umnozheniya',
    title: 'Тренажёр таблицы умножения',
    href: '/trenazher-umnozheniya',
    ages: '7–11 лет',
    badge: 'Первые уровни бесплатно',
    emoji: '✖️',
    description:
      'Понятные приёмы умножения и деления по шагам — без скучной зубрёжки, с умной тренировкой в браузере.',
    ctaLabel: 'Попробовать тренажёр бесплатно',
  },
};

export const GAMES_CATALOG = {
  academy: {
    id: 'academy',
    title: 'Порталы Знайтона',
    href: '/igry?game=academy',
    ages: '5–7 лет',
    badge: 'Бесплатная игра · без регистрации',
    emoji: '🧭',
    description:
      'Пройди Механическую академию: числовой ряд, сравнение, состав числа, закономерности и зрительное внимание.',
    ctaLabel: 'Играть в «Порталы Знайтона»',
  },
  bridge: {
    id: 'bridge',
    title: 'Мост через реку',
    href: '/igry?game=bridge',
    ages: '5–7 лет',
    badge: 'Бесплатная игра · без регистрации',
    emoji: '🦊',
    description:
      'Веди лисёнка по камням через реку: тренируем прямой и обратный счёт и быстрый счёт двойками.',
    ctaLabel: 'Играть в «Мост через реку»',
  },
  'mental-quest': {
    id: 'mental-quest',
    title: 'Звёздный абакус',
    href: '/igry?game=mental-quest',
    ages: '4–10 лет',
    badge: 'Бесплатная игра · без регистрации',
    emoji: '🚀',
    description:
      'Космические числовые миссии на образ числа, устный счёт, зрительную память и быстрое переключение внимания.',
    ctaLabel: 'Играть в «Звёздный абакус»',
  },
  'field-of-vision': {
    id: 'field-of-vision',
    title: 'Поле зрения: быстрые слова',
    href: '/igry?game=field-of-vision',
    ages: '6–12 лет',
    badge: 'Бесплатный тренажёр · без регистрации',
    emoji: '👁️',
    description:
      'Слова мелькают на долю секунды на адаптивной скорости — ребёнок учится схватывать слово целиком без чтения по слогам.',
    ctaLabel: 'Запустить «Поле зрения»',
  },
  'word-pyramid': {
    id: 'word-pyramid',
    title: 'Пирамида чтения',
    href: '/igry?game=word-pyramid',
    ages: '7–13 лет',
    badge: 'Бесплатный тренажёр · без регистрации',
    emoji: '🔺',
    description:
      'Клиновидная таблица слогов и слов для расширения бокового зрения и уверенного чтения без возвратов по строке.',
    ctaLabel: 'Запустить «Пирамиду чтения»',
  },
};

// Явная карта slug статьи → { course, game }
export const BLOG_SLUG_CTA_MAP = {
  'razvitie-slovarya-detey': { course: 'podgotovka-k-shkole', game: 'field-of-vision' },
  'risovanie-s-natury': { course: 'risovanie', game: 'academy' },
  'razvitie-svyaznoy-rechi-u-detey': { course: 'podgotovka-k-shkole', game: 'field-of-vision' },
  'kalligrafiya-dlya-detey': { course: 'podgotovka-k-shkole', game: 'academy' },
  'risovanie-po-tochkam': { course: 'risovanie', game: 'bridge' },
  'logicheskoe-razvitie-rebenka': { course: 'mentalnaya-arifmetika', game: 'academy' },
  'razvitie-pamyati-u-detey': { course: 'mentalnaya-arifmetika', game: 'mental-quest' },
  'razvitie-voobrazheniya-u-detey': { course: 'risovanie', game: 'academy' },
  'umnozhenie-na-2-3-4-5': { course: 'trenazher-umnozheniya', game: 'bridge' },
  'razvitie-melkoy-motoriki-ruki-rebenka': { course: 'risovanie', game: 'academy' },
  'razvivayushchie-igry-dlya-podgotovki-k-shkole': { course: 'podgotovka-k-shkole', game: 'academy' },
  'kak-podgotovit-rebenka-k-shkole-doma': { course: 'podgotovka-k-shkole', game: 'bridge' },
  'razvitie-vnimaniya-u-detey': { course: 'mentalnaya-arifmetika', game: 'field-of-vision' },
  'netraditsionnye-tehniki-risovaniya': { course: 'risovanie', game: 'academy' },
  'uprazhneniya-akterskoe-masterstvo': { course: 'podgotovka-k-shkole', game: 'field-of-vision' },
  'uprazhneniya-dlya-skorochteniya': { course: 'podgotovka-k-shkole', game: 'word-pyramid' },
  'podgotovka-k-shkole-chto-dolzhen-umet': { course: 'podgotovka-k-shkole', game: 'academy' },
  'kak-nauchit-rebenka-chitat': { course: 'podgotovka-k-shkole', game: 'field-of-vision' },
  'chto-takoe-mentalnaya-arifmetika': { course: 'mentalnaya-arifmetika', game: 'mental-quest' },
  'razvitie-rebenka-s-chego-nachat': { course: 'podgotovka-k-shkole', game: 'academy' },
};

// Карта по категории статьи
export const CATEGORY_CTA_MAP = {
  Рисование: { course: 'risovanie', game: 'academy' },
  Творчество: { course: 'risovanie', game: 'academy' },
  Воображение: { course: 'risovanie', game: 'academy' },
  Математика: { course: 'trenazher-umnozheniya', game: 'bridge' },
  'Ментальная арифметика': { course: 'mentalnaya-arifmetika', game: 'mental-quest' },
  Память: { course: 'mentalnaya-arifmetika', game: 'mental-quest' },
  Внимание: { course: 'mentalnaya-arifmetika', game: 'field-of-vision' },
  Логика: { course: 'mentalnaya-arifmetika', game: 'academy' },
  Чтение: { course: 'podgotovka-k-shkole', game: 'field-of-vision' },
  Скорочтение: { course: 'podgotovka-k-shkole', game: 'word-pyramid' },
  Речь: { course: 'podgotovka-k-shkole', game: 'field-of-vision' },
  'Речь и уверенность': { course: 'podgotovka-k-shkole', game: 'field-of-vision' },
  Письмо: { course: 'podgotovka-k-shkole', game: 'academy' },
  'Мелкая моторика': { course: 'risovanie', game: 'academy' },
  'Подготовка к школе': { course: 'podgotovka-k-shkole', game: 'academy' },
};

/**
 * Автоматический подбор курса и бесплатной игры для любой (в т.ч. новой автоблоговой) статьи.
 */
export function resolveBlogPracticeCta(post, category = '') {
  const slug = String(post?.slug || '').trim();
  if (slug && BLOG_SLUG_CTA_MAP[slug]) {
    const mapped = BLOG_SLUG_CTA_MAP[slug];
    return {
      course: COURSES_CATALOG[mapped.course] || COURSES_CATALOG['podgotovka-k-shkole'],
      game: GAMES_CATALOG[mapped.game] || GAMES_CATALOG.academy,
    };
  }

  const haystack = [
    slug,
    post?.title,
    post?.description,
    post?.excerpt,
    category,
    ...(post?.relatedSlugs || []),
    post?.cta?.href,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // 1. Ключевые слова по теме (работает для новых статей автоблога без ручной правки карты)
  if (/умнож|таблиц[аы]\s+умнож|umnozh|trenazher-umnozheniya/.test(haystack)) {
    return {
      course: COURSES_CATALOG['trenazher-umnozheniya'],
      game: GAMES_CATALOG.bridge,
    };
  }

  if (/скорочт|быстр\w+\s+чтен|поле\s+зрен|пирамид\w+\s+слов|шульте|skorocht|speed-reading/.test(haystack)) {
    return {
      course: COURSES_CATALOG['podgotovka-k-shkole'],
      game: GAMES_CATALOG['word-pyramid'],
    };
  }

  if (/чтени|читат|слог|букв|азбук|словар|речь|речи|пересказ|chitat|chteni|slovar|rech/.test(haystack)) {
    return {
      course: COURSES_CATALOG['podgotovka-k-shkole'],
      game: GAMES_CATALOG['field-of-vision'],
    };
  }

  if (/рисован|рисунок|рисуем|краск|акварел|карандаш|натюрморт|творчест|воображен|risovan|right-brain-drawing/.test(haystack)) {
    return {
      course: COURSES_CATALOG.risovanie,
      game: GAMES_CATALOG.academy,
    };
  }

  if (/счёт|счет|арифмет|ментальн|абакус|математ|логик|памят|вниман|schet|arifmet|mental|matemat|logik|pamyat|vniman/.test(haystack)) {
    const gameKey = /вниман|vniman/.test(haystack)
      ? 'field-of-vision'
      : /логик|logik/.test(haystack)
        ? 'academy'
        : 'mental-quest';
    return {
      course: COURSES_CATALOG['mentalnaya-arifmetika'],
      game: GAMES_CATALOG[gameKey],
    };
  }

  if (/каллиграф|письм|почерк|моторик|школ|дошкол|первокласс|kalligraf|motorik|shkol/.test(haystack)) {
    return {
      course: COURSES_CATALOG['podgotovka-k-shkole'],
      game: GAMES_CATALOG.academy,
    };
  }

  // 2. Fallback по категории
  if (category && CATEGORY_CTA_MAP[category]) {
    const byCat = CATEGORY_CTA_MAP[category];
    return {
      course: COURSES_CATALOG[byCat.course] || COURSES_CATALOG['podgotovka-k-shkole'],
      game: GAMES_CATALOG[byCat.game] || GAMES_CATALOG.academy,
    };
  }

  // 3. Дефолтный fallback
  return {
    course: COURSES_CATALOG['podgotovka-k-shkole'],
    game: GAMES_CATALOG.academy,
  };
}

export function BlogPracticeCta({ post, category }) {
  const { course, game } = resolveBlogPracticeCta(post, category);
  const postSlug = post?.slug || 'unknown';

  return (
    <section
      aria-labelledby="blog-practice-cta-heading"
      className="mt-14 overflow-hidden rounded-[30px] border border-brand-blue/16 bg-gradient-to-br from-[#0A1933] via-[#11264D] to-[#1D1B4B] p-6 text-white shadow-luxe sm:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-cyan">
          <Icon name="spark" className="h-3.5 w-3.5" />
          Попробуйте на практике
        </span>
        <span className="text-xs font-bold text-white/60">
          Бесплатно в браузере · без привязки карты
        </span>
      </div>

      <h2
        id="blog-practice-cta-heading"
        className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-3xl"
      >
        Перейдите от статьи к живой тренировке с ребёнком
      </h2>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/74 sm:text-base">
        Мы подобрали по теме статьи бесплатную онлайн-игру из «Игрового зала» и курс с открытыми первыми уроками.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Карточка бесплатной игры */}
        <div className="flex flex-col justify-between rounded-[22px] border border-white/14 bg-white/[0.07] p-5 backdrop-blur-xl sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-brand-orange/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#FFD166]">
                {game.badge}
              </span>
              <span className="text-xs font-bold text-white/55">{game.ages}</span>
            </div>
            <div className="mt-4 flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/12 text-2xl">
                {game.emoji}
              </span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/50">
                  Бесплатная мини-игра
                </p>
                <h3 className="font-display text-xl font-extrabold text-white">{game.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-white/75">{game.description}</p>
          </div>

          <TrackedLink
            href={game.href}
            goal="blog_cta_game"
            params={{ slug: postSlug, game: game.id, href: game.href }}
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#FFD166] px-5 py-3 text-sm font-black text-[#0A1933] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffe08c]"
          >
            <span>▶</span>
            <span>{game.ctaLabel}</span>
          </TrackedLink>
        </div>

        {/* Карточка подходящего курса */}
        <div className="flex flex-col justify-between rounded-[22px] border border-white/14 bg-white/[0.07] p-5 backdrop-blur-xl sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-brand-green/22 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#83F4D8]">
                {course.badge}
              </span>
              <span className="text-xs font-bold text-white/55">{course.ages}</span>
            </div>
            <div className="mt-4 flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/12 text-2xl">
                {course.emoji}
              </span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/50">
                  Интерактивный курс
                </p>
                <h3 className="font-display text-xl font-extrabold text-white">{course.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-white/75">{course.description}</p>
          </div>

          <TrackedLink
            href={course.href}
            goal="blog_cta_course"
            params={{ slug: postSlug, course: course.id, href: course.href }}
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-brand-blue shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-cyan/15 hover:text-white"
          >
            <span>{course.ctaLabel}</span>
            <Icon name="arrow" className="h-4 w-4" />
          </TrackedLink>
        </div>
      </div>

      {/* Упоминание пакета «Все направления» */}
      <div className="mt-5 flex flex-col justify-between gap-3 rounded-[18px] border border-white/12 bg-white/[0.05] px-5 py-3.5 text-xs font-semibold text-white/78 sm:flex-row sm:items-center sm:text-sm">
        <span>
          Хотите открыть сразу рисование, ментальную арифметику, подготовку к школе и тренажёр умножения?
        </span>
        <Link
          href="/tarify#vse-napravleniya"
          className="shrink-0 font-extrabold text-[#FFD166] underline decoration-[#FFD166]/50 underline-offset-4 transition hover:text-white"
        >
          Пакет «Все направления» →
        </Link>
      </div>
    </section>
  );
}
