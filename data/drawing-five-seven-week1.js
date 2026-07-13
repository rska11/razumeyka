// Авторская первая неделя для ступени 5-7 лет.
// Цель: запустить продукт с честной прогрессией, без однотипной библиотеки шаблонов.

const PAPER = '<path d="M0 0 H200 V200 H0 Z" fill="#fffdf7"/>';
const WIDE_PAPER = '<path d="M0 0 H300 V210 H0 Z" fill="#fffdf7"/>';

function lesson({
  slug,
  title,
  chapter,
  theme,
  skill,
  kind = 'draw',
  order,
  level,
  cover,
  steps,
  color,
  viewBox = '0 0 200 200',
  canvas,
  storyPrompt,
  storyMissions,
  parentNote,
}) {
  return {
    slug,
    ageBand: '5-7',
    level,
    title,
    theme,
    chapter,
    skill,
    kind,
    order,
    free: true,
    cover,
    viewBox,
    coloredViewBox: viewBox,
    canvas,
    palette: color.palette,
    intro: `Сегодня рисуем «${title.toLowerCase()}». Не стараемся сделать идеально: нам важны смелая линия, понятная форма и своя маленькая история.`,
    steps,
    storyStageLabel: level === 1 ? '1 объект' : level === 2 ? 'Детали' : 'Сюжет',
    storyPrompt,
    storyMissions,
    colorHint: color.hint,
    finishIdea: color.finish,
    parentNote,
    coloredPreview: color.preview,
  };
}

function step(hint, layer) {
  return { hint, layer };
}

function bg(fill = '#fffdf7') {
  return `<path d="M0 0 H200 V200 H0 Z" fill="${fill}"/>`;
}

function wideBg(fill = '#fffdf7') {
  return `<path d="M0 0 H300 V210 H0 Z" fill="${fill}"/>`;
}

function animal(slug, title, order, emoji, palette, body, head, ears, face, detail, ground, colors) {
  const [main, second, accent] = palette;
  return lesson({
    slug,
    title,
    chapter: 'Неделя 1 · Живые зверята',
    theme: 'Животные',
    skill: order % 10 <= 3 ? 'крупная форма зверька' : order % 10 <= 7 ? 'характер через ушки, лапки и мордочку' : 'мини-сцена со зверьком',
    kind: order % 10 >= 8 ? 'combo' : 'fantasy',
    order,
    level: order % 10 <= 3 ? 1 : order % 10 <= 7 ? 2 : 3,
    cover: { emoji, theme: 'pink' },
    steps: [
      step(`Шаг 1 — нарисуй туловище: большую мягкую форму для «${title.toLowerCase()}».`, body),
      step('Шаг 2 — добавь голову рядом с туловищем, чтобы зверёк был живым, а не значком.', head),
      step('Шаг 3 — нарисуй узнаваемые ушки, хвостик или лапки.', ears),
      step('Шаг 4 — оживи мордочку: глазки, носик, щёчки или улыбку.', face),
      step('Шаг 5 — добавь одну особенную деталь, чтобы зверёк отличался от других.', detail),
      step('Шаг 6 — поставь зверька на землю, коврик или маленькую дорожку.', ground),
    ],
    storyPrompt: order % 10 <= 3
      ? 'Раскрась зверька и добавь рядом один знак места: травинку, коврик или мисочку.'
      : order % 10 <= 7
        ? 'Добавь зверьку предмет рядом: мячик, листик, миску или маленький цветок. Пусть появится характер.'
        : 'Собери маленькую сцену: где зверёк находится, что он делает и какое у него настроение?',
    storyMissions: ['Раскрась главного героя', 'Добавь место под лапками', 'Придумай имя зверьку'],
    parentNote: 'Похвалите ребёнка не за ровность, а за узнаваемый характер: ушки, мордочку, позу и маленькую деталь от себя.',
    color: {
      palette,
      hint: `Основу можно сделать ${colors.main}, деталь — ${colors.second}, а фон оставить лёгким.`,
      finish: 'Хороший результат для 5–7 лет: зверёк узнаётся, стоит на листе и не похож на схему из палочек.',
      preview: `${bg('#f8fafc')}${body.replaceAll('fill="none" stroke="currentColor"', `fill="${main}" stroke="#334155"`)}${head.replaceAll('fill="none" stroke="currentColor"', `fill="${second}" stroke="#334155"`)}${ears.replaceAll('fill="none" stroke="currentColor"', `fill="${second}" stroke="#334155"`)}${face.replaceAll('fill="currentColor"', 'fill="#1f2937"').replaceAll('stroke="currentColor"', 'stroke="#1f2937"')}${detail.replaceAll('fill="none" stroke="currentColor"', `fill="${accent}" stroke="#334155"`).replaceAll('fill="currentColor"', `fill="${accent}"`)}${ground.replaceAll('stroke="currentColor"', 'stroke="#22c55e"')}`,
    },
  });
}

function objectLesson(slug, title, chapter, theme, order, emoji, level, kind, steps, preview, palette, prompt) {
  return lesson({
    slug,
    title,
    chapter,
    theme,
    skill: level === 1 ? 'один понятный предмет' : level === 2 ? 'предмет с деталями и местом' : 'мини-сцена из нескольких объектов',
    kind,
    order,
    level,
    cover: { emoji, theme: level === 1 ? 'blue' : level === 2 ? 'green' : 'orange' },
    steps,
    storyPrompt: prompt,
    storyMissions: level === 1
      ? ['Раскрась главный предмет', 'Добавь тень или землю', 'Покажи работу родителю']
      : level === 2
        ? ['Раскрась главный предмет', 'Добавь вторую деталь', 'Придумай, где это находится']
        : ['Раскрась сцену', 'Добавь две детали настроения', 'Придумай название'],
    parentNote: 'Отметьте, что ребёнок сам собрал рисунок по частям: форма, детали, место. Для этого возраста это важнее академической ровности.',
    color: {
      palette,
      hint: 'Выбери 3–4 спокойных цвета: один главный, один для деталей и один для фона.',
      finish: level === 3 ? 'Это уже маленькая история на листе, а не отдельная иконка.' : 'Предмет должен читаться крупно и уверенно.',
      preview,
    },
  });
}

function wideLesson(slug, title, chapter, theme, order, emoji, steps, preview, palette, prompt) {
  return lesson({
    slug,
    title,
    chapter,
    theme,
    skill: 'широкая мини-сцена: передний план, фон и 2–3 детали',
    kind: 'combo',
    order,
    level: 3,
    cover: { emoji, theme: 'orange' },
    viewBox: '0 0 300 210',
    canvas: 'landscape',
    steps,
    storyPrompt: prompt,
    storyMissions: ['Раскрась главных героев', 'Добавь фон и землю', 'Придумай название работе'],
    parentNote: 'Похвалите композицию: ребёнок уже размещает несколько объектов на листе, оставляет воздух и делает историю понятной.',
    color: {
      palette,
      hint: 'Сначала раскрась крупные зоны: небо, землю, главного героя. Мелочи можно оставить лёгкими.',
      finish: 'Сцена должна быть понятной с первого взгляда: где происходит действие и кто главный.',
      preview,
    },
  });
}

const day1 = [
  animal('fw57-d01-01-cat', 'Котёнок на коврике', 101, '🐱', ['#fbbf24', '#fed7aa', '#fb7185'],
    '<ellipse cx="100" cy="118" rx="43" ry="30" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<circle cx="86" cy="82" r="27" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M68 64 L57 42 L83 55 M99 62 L113 43 L115 72 M132 122 Q155 108 157 132" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    '<circle cx="78" cy="79" r="4" fill="currentColor"/><circle cx="93" cy="79" r="4" fill="currentColor"/><path d="M82 91 Q87 96 93 91 M67 89 H52 M70 97 H54" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    '<circle cx="114" cy="109" r="5" fill="currentColor"/><circle cx="126" cy="125" r="4" fill="currentColor"/>',
    '<path d="M55 155 Q99 169 146 155" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    { main: 'рыжим', second: 'светлым', accent: 'розовым' }),
  animal('fw57-d01-02-puppy', 'Щенок с косточкой', 102, '🐶', ['#d6a36a', '#fde68a', '#93c5fd'],
    '<ellipse cx="102" cy="121" rx="46" ry="29" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<circle cx="82" cy="84" r="26" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M61 73 Q42 85 55 104 M101 73 Q123 84 110 104 M144 119 Q163 113 168 126" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<circle cx="75" cy="82" r="4" fill="currentColor"/><circle cx="91" cy="82" r="4" fill="currentColor"/><path d="M79 94 Q84 99 91 94" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M116 158 Q126 148 136 158 Q146 148 156 158 Q146 168 136 158 Q126 168 116 158 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
    '<path d="M50 160 Q98 172 150 160" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    { main: 'песочным', second: 'жёлтым', accent: 'голубым' }),
  animal('fw57-d01-03-owl', 'Совёнок на ветке', 103, '🦉', ['#a78bfa', '#fde68a', '#86efac'],
    '<ellipse cx="100" cy="108" rx="38" ry="46" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M69 82 Q100 50 131 82 Q126 142 100 155 Q74 142 69 82 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<path d="M80 73 L73 54 M120 73 L128 54 M72 118 Q55 107 64 91 M128 118 Q145 107 136 91" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<circle cx="88" cy="92" r="8" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="112" cy="92" r="8" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M96 107 L104 107 L100 116 Z" fill="currentColor"/>',
    '<path d="M88 132 Q100 139 112 132 M86 153 V165 M114 153 V165" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>',
    '<path d="M52 166 Q101 153 150 166" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    { main: 'фиолетовым', second: 'жёлтым', accent: 'зелёным' }),
  animal('fw57-d01-04-fox', 'Лисёнок с листиком', 104, '🦊', ['#fb923c', '#fed7aa', '#84cc16'],
    '<ellipse cx="104" cy="122" rx="45" ry="28" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M72 88 Q90 55 115 88 Q104 112 84 112 Q72 104 72 88 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<path d="M77 76 L67 49 L91 65 M108 76 L126 53 L119 84 M141 122 Q170 112 164 145 Q150 139 141 122" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="84" cy="86" r="3.5" fill="currentColor"/><circle cx="99" cy="86" r="3.5" fill="currentColor"/><path d="M89 99 Q94 104 100 99" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M55 136 Q70 122 84 136 M62 133 Q68 144 77 134" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    '<path d="M45 160 Q94 174 153 160" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    { main: 'оранжевым', second: 'светлым', accent: 'зелёным' }),
  animal('fw57-d01-05-bunny', 'Зайчик у морковки', 105, '🐰', ['#e5e7eb', '#f9a8d4', '#fb923c'],
    '<ellipse cx="102" cy="123" rx="39" ry="32" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<circle cx="88" cy="83" r="25" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M78 62 Q67 25 90 58 M96 62 Q112 27 106 66 M137 118 Q151 114 155 126" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<circle cx="81" cy="82" r="3.5" fill="currentColor"/><circle cx="96" cy="82" r="3.5" fill="currentColor"/><path d="M84 95 Q90 101 97 95" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M139 151 L164 139 L155 169 Z M158 139 Q166 130 174 136" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
    '<path d="M50 164 Q100 176 152 164" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    { main: 'серым или белым', second: 'розовым', accent: 'оранжевым' }),
  animal('fw57-d01-06-hedgehog', 'Ёжик с яблоком', 106, '🦔', ['#92400e', '#fbbf24', '#ef4444'],
    '<path d="M58 126 Q73 86 116 88 Q151 94 158 128 Q130 151 88 150 Q67 146 58 126 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<path d="M58 126 Q43 118 50 102 Q66 101 72 114" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M82 90 L76 72 M96 88 L92 68 M111 90 L116 70 M126 96 L137 79 M139 108 L154 96" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    '<circle cx="56" cy="111" r="3.5" fill="currentColor"/><path d="M47 120 Q55 126 63 121" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M105 78 Q94 63 82 75 Q75 89 91 97 Q103 93 105 78 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
    '<path d="M42 160 Q93 174 155 160" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    { main: 'коричневым', second: 'жёлтым', accent: 'красным' }),
  animal('fw57-d01-07-turtle', 'Черепашка у камешка', 107, '🐢', ['#84cc16', '#bbf7d0', '#94a3b8'],
    '<ellipse cx="100" cy="119" rx="43" ry="29" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<circle cx="143" cy="110" r="16" fill="none" stroke="currentColor" stroke-width="4"/>',
    '<path d="M68 134 Q54 148 43 136 M92 143 Q82 159 72 146 M118 143 Q130 160 139 146 M58 114 Q45 106 56 96" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<circle cx="148" cy="106" r="3.5" fill="currentColor"/><path d="M145 117 Q151 121 156 117" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M82 103 Q100 126 120 103 M76 121 H125" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>',
    '<path d="M42 162 Q99 176 157 162 M49 154 Q57 143 66 154" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    { main: 'зелёным', second: 'салатовым', accent: 'серым' }),
];

day1.push(
  wideLesson('fw57-d01-08-pet-yard', 'Двор для зверят', 'Неделя 1 · Живые зверята', 'Животные', 108, '🐾', [
    step('Шаг 1 — проведи линию земли и оставь место для двух зверят.', '<path d="M18 160 Q88 148 145 160 Q216 174 282 156" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — слева нарисуй котёнка крупными мягкими формами.', '<ellipse cx="74" cy="125" rx="33" ry="22" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="55" cy="99" r="19" fill="none" stroke="currentColor" stroke-width="4"/><path d="M43 85 L35 66 L57 78 M65 85 L78 68 L75 94" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 3 — справа нарисуй щенка, пусть он смотрит на котёнка.', '<ellipse cx="194" cy="126" rx="35" ry="22" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="171" cy="100" r="19" fill="none" stroke="currentColor" stroke-width="4"/><path d="M156 93 Q139 101 153 116 M186 92 Q205 103 190 116" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — добавь мордочки: глаза, носики и улыбки.', '<circle cx="50" cy="97" r="3" fill="currentColor"/><circle cx="61" cy="97" r="3" fill="currentColor"/><path d="M52 108 Q57 112 63 108" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><circle cx="166" cy="98" r="3" fill="currentColor"/><circle cx="177" cy="98" r="3" fill="currentColor"/><path d="M168 110 Q174 114 181 110" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>'),
    step('Шаг 5 — между ними положи мячик, чтобы появилась история.', '<circle cx="132" cy="145" r="13" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M122 137 Q132 146 142 137 M122 153 Q132 144 142 153" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'),
    step('Шаг 6 — добавь забор и травинки, но не прижимай их к зверятам.', '<path d="M235 150 V126 M250 151 V123 M266 151 V128 M230 138 H272" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M35 170 Q40 158 45 170 M106 170 Q111 158 116 170 M218 170 Q223 158 228 170" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${wideBg('#eff6ff')}<path d="M18 160 Q88 148 145 160 Q216 174 282 156 L300 210 H0 L0 176 Q8 166 18 160 Z" fill="#bbf7d0"/><ellipse cx="74" cy="125" rx="33" ry="22" fill="#fbbf24" stroke="#334155" stroke-width="3"/><circle cx="55" cy="99" r="19" fill="#fed7aa" stroke="#334155" stroke-width="3"/><path d="M43 85 L35 66 L57 78 M65 85 L78 68 L75 94" fill="none" stroke="#334155" stroke-width="3"/><ellipse cx="194" cy="126" rx="35" ry="22" fill="#d6a36a" stroke="#334155" stroke-width="3"/><circle cx="171" cy="100" r="19" fill="#fde68a" stroke="#334155" stroke-width="3"/><path d="M156 93 Q139 101 153 116 M186 92 Q205 103 190 116" fill="none" stroke="#334155" stroke-width="3"/><circle cx="50" cy="97" r="3" fill="#1f2937"/><circle cx="61" cy="97" r="3" fill="#1f2937"/><circle cx="166" cy="98" r="3" fill="#1f2937"/><circle cx="177" cy="98" r="3" fill="#1f2937"/><circle cx="132" cy="145" r="13" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M235 150 V126 M250 151 V123 M266 151 V128 M230 138 H272" fill="none" stroke="#a16207" stroke-width="3"/><path d="M35 170 Q40 158 45 170 M106 170 Q111 158 116 170 M218 170 Q223 158 228 170" fill="none" stroke="#16a34a" stroke-width="3"/>`, ['#fbbf24', '#d6a36a', '#93c5fd'], 'Собери двор: два зверька, мячик и место, где они играют.'),
  wideLesson('fw57-d01-09-animal-tea', 'Чаепитие зверят', 'Неделя 1 · Живые зверята', 'Животные', 109, '🫖', [
    step('Шаг 1 — нарисуй столик или коврик внизу листа.', '<path d="M74 154 Q148 132 224 154 Q204 181 96 181 Q82 171 74 154 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 2 — слева посади зайчика из овала и головы.', '<ellipse cx="92" cy="126" rx="25" ry="30" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="88" cy="90" r="18" fill="none" stroke="currentColor" stroke-width="4"/><path d="M80 76 Q68 45 89 72 M96 76 Q111 46 106 80" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 3 — справа посади ёжика с колючей спинкой.', '<path d="M174 125 Q185 91 217 99 Q241 108 239 135 Q213 154 185 147 Q174 140 174 125 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M195 101 L191 84 M207 101 L209 82 M220 106 L231 91" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 4 — добавь чайник и две чашки между героями.', '<path d="M130 128 Q151 113 170 128 Q166 148 135 148 Q129 138 130 128 Z" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M170 132 Q185 130 176 142 M133 133 Q122 126 119 136 M111 153 H126 M177 153 H192" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 5 — нарисуй глазки, улыбки и маленькие лапки.', '<circle cx="83" cy="89" r="2.8" fill="currentColor"/><circle cx="94" cy="89" r="2.8" fill="currentColor"/><path d="M84 100 Q90 104 96 100 M207 119 Q213 123 219 119" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><circle cx="208" cy="111" r="2.8" fill="currentColor"/>'),
    step('Шаг 6 — добавь над ковриком гирлянду или облачко настроения.', '<path d="M58 54 Q118 34 240 55" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="86" cy="48" r="4" fill="currentColor"/><circle cx="132" cy="41" r="4" fill="currentColor"/><circle cx="184" cy="43" r="4" fill="currentColor"/><circle cx="225" cy="51" r="4" fill="currentColor"/>'),
  ], `${wideBg('#fff7ed')}<path d="M74 154 Q148 132 224 154 Q204 181 96 181 Q82 171 74 154 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/><ellipse cx="92" cy="126" rx="25" ry="30" fill="#f8fafc" stroke="#334155" stroke-width="3"/><circle cx="88" cy="90" r="18" fill="#f8fafc" stroke="#334155" stroke-width="3"/><path d="M80 76 Q68 45 89 72 M96 76 Q111 46 106 80" fill="none" stroke="#334155" stroke-width="3"/><path d="M174 125 Q185 91 217 99 Q241 108 239 135 Q213 154 185 147 Q174 140 174 125 Z" fill="#d6a36a" stroke="#334155" stroke-width="3"/><path d="M195 101 L191 84 M207 101 L209 82 M220 106 L231 91" fill="none" stroke="#92400e" stroke-width="3"/><path d="M130 128 Q151 113 170 128 Q166 148 135 148 Q129 138 130 128 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M111 153 H126 M177 153 H192" fill="none" stroke="#f97316" stroke-width="3"/><path d="M58 54 Q118 34 240 55" fill="none" stroke="#a855f7" stroke-width="3"/><circle cx="86" cy="48" r="4" fill="#facc15"/><circle cx="132" cy="41" r="4" fill="#fb7185"/><circle cx="184" cy="43" r="4" fill="#22c55e"/><circle cx="225" cy="51" r="4" fill="#60a5fa"/>`, ['#fbcfe8', '#93c5fd', '#d6a36a'], 'Покажи, что зверята не просто стоят рядом, а пьют чай вместе.'),
  wideLesson('fw57-d01-10-animal-parade', 'Парад зверят', 'Неделя 1 · Живые зверята', 'Животные', 110, '🎪', [
    step('Шаг 1 — проведи дорожку парада широкой дугой.', '<path d="M16 160 Q80 140 145 158 Q220 178 284 154" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M36 178 Q104 160 168 176 Q220 190 270 174" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 2 — нарисуй первого героя: котёнка слева.', '<ellipse cx="70" cy="127" rx="28" ry="20" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="54" cy="101" r="17" fill="none" stroke="currentColor" stroke-width="4"/><path d="M43 89 L36 73 L56 82 M64 89 L76 75 L73 98" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/>'),
    step('Шаг 3 — в центре добавь зайчика с длинными ушами.', '<ellipse cx="145" cy="126" rx="27" ry="22" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="135" cy="98" r="17" fill="none" stroke="currentColor" stroke-width="4"/><path d="M128 85 Q119 57 137 82 M141 85 Q156 58 151 91" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>'),
    step('Шаг 4 — справа поставь черепашку: панцирь и голову.', '<ellipse cx="221" cy="127" rx="30" ry="20" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="249" cy="119" r="12" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M204 139 Q194 149 185 138 M229 142 Q239 152 247 139" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь глаза, улыбки и флажки над парадом.', '<circle cx="50" cy="99" r="2.8" fill="currentColor"/><circle cx="60" cy="99" r="2.8" fill="currentColor"/><circle cx="131" cy="97" r="2.8" fill="currentColor"/><circle cx="141" cy="97" r="2.8" fill="currentColor"/><circle cx="252" cy="116" r="2.8" fill="currentColor"/><path d="M92 67 V41 L117 51 L92 61 M181 70 V45 L205 55 L181 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
    step('Шаг 6 — заверши сцену конфетти и травинками, оставляя воздух.', '<circle cx="36" cy="59" r="3" fill="currentColor"/><circle cx="150" cy="45" r="3" fill="currentColor"/><circle cx="260" cy="70" r="3" fill="currentColor"/><path d="M26 170 Q31 158 36 170 M118 181 Q123 169 128 181 M260 166 Q265 154 270 166" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${wideBg('#eff6ff')}<path d="M16 160 Q80 140 145 158 Q220 178 284 154 L300 210 H0 L0 180 Q8 168 16 160 Z" fill="#bbf7d0"/><path d="M36 178 Q104 160 168 176 Q220 190 270 174" fill="none" stroke="#d97706" stroke-width="4"/><ellipse cx="70" cy="127" rx="28" ry="20" fill="#fbbf24" stroke="#334155" stroke-width="3"/><circle cx="54" cy="101" r="17" fill="#fed7aa" stroke="#334155" stroke-width="3"/><ellipse cx="145" cy="126" rx="27" ry="22" fill="#f8fafc" stroke="#334155" stroke-width="3"/><circle cx="135" cy="98" r="17" fill="#f8fafc" stroke="#334155" stroke-width="3"/><ellipse cx="221" cy="127" rx="30" ry="20" fill="#84cc16" stroke="#334155" stroke-width="3"/><circle cx="249" cy="119" r="12" fill="#bbf7d0" stroke="#334155" stroke-width="3"/><path d="M92 67 V41 L117 51 L92 61 M181 70 V45 L205 55 L181 64" fill="#facc15" stroke="#a16207" stroke-width="3"/><circle cx="36" cy="59" r="3" fill="#fb7185"/><circle cx="150" cy="45" r="3" fill="#a855f7"/><circle cx="260" cy="70" r="3" fill="#22c55e"/>`, ['#fbbf24', '#84cc16', '#fb7185'], 'Сделай финал дня: три разных зверька идут по дорожке, и каждый узнаётся по форме.')
);

const day2 = [
  objectLesson('fw57-d02-01-window', 'Окно с занавесками', 'Неделя 1 · Дом и уют', 'Первые формы', 201, '🪟', 1, 'draw', [
    step('Шаг 1 — нарисуй большое окно с чуть неровной рамой.', '<path d="M55 55 H145 V135 H55 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — раздели окно на четыре стекла.', '<path d="M100 55 V135 M55 95 H145" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — добавь мягкие занавески по бокам.', '<path d="M62 58 Q74 80 62 100 Q73 120 62 134 M138 58 Q126 80 138 100 Q127 120 138 134" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — поставь подоконник.', '<path d="M47 144 Q100 154 153 144" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — нарисуй маленький цветок в горшке.', '<path d="M90 147 H112 L108 168 H94 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path d="M101 147 Q92 132 84 123" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="83" cy="119" r="6" fill="none" stroke="currentColor" stroke-width="3"/>'),
  ], `${bg('#fff7ed')}<path d="M55 55 H145 V135 H55 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/><path d="M100 55 V135 M55 95 H145" fill="none" stroke="#2563eb" stroke-width="3"/><path d="M62 58 Q74 80 62 100 Q73 120 62 134 M138 58 Q126 80 138 100 Q127 120 138 134" fill="none" stroke="#db2777" stroke-width="4"/><path d="M47 144 Q100 154 153 144" fill="none" stroke="#92400e" stroke-width="4"/><path d="M90 147 H112 L108 168 H94 Z" fill="#fb923c" stroke="#9a3412" stroke-width="3"/><path d="M101 147 Q92 132 84 123" fill="none" stroke="#16a34a" stroke-width="3"/><circle cx="83" cy="119" r="6" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/>`, ['#93c5fd', '#f9a8d4', '#22c55e'], 'После урока добавь за окном облачко или солнышко.'),
  objectLesson('fw57-d02-02-lamp', 'Лампа на столе', 'Неделя 1 · Дом и уют', 'Первые формы', 202, '💡', 1, 'draw', [
    step('Шаг 1 — начни с абажура: широкая трапеция сверху.', '<path d="M72 70 H128 L142 112 H58 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь ножку лампы.', '<path d="M100 112 V154" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 3 — нарисуй круглую подставку.', '<ellipse cx="100" cy="162" rx="32" ry="9" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 4 — покажи свет: несколько коротких лучиков.', '<path d="M70 124 L52 139 M130 124 L148 139 M100 119 V139" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь край стола.', '<path d="M45 174 Q100 166 155 174" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
  ], `${bg('#fff7ed')}<path d="M72 70 H128 L142 112 H58 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="4"/><path d="M100 112 V154" fill="none" stroke="#92400e" stroke-width="5"/><ellipse cx="100" cy="162" rx="32" ry="9" fill="#fb923c" stroke="#9a3412" stroke-width="3"/><path d="M70 124 L52 139 M130 124 L148 139 M100 119 V139" fill="none" stroke="#facc15" stroke-width="3"/><path d="M45 174 Q100 166 155 174" fill="none" stroke="#d97706" stroke-width="4"/>`, ['#fde68a', '#fb923c', '#92400e'], 'Можно добавить рядом маленькую книжку или карандаш.'),
  objectLesson('fw57-d02-03-cup', 'Чашка с паром', 'Неделя 1 · Дом и уют', 'Первые формы', 203, '☕', 1, 'draw', [
    step('Шаг 1 — нарисуй большую чашку как мягкий прямоугольник.', '<path d="M70 91 H125 Q122 142 104 151 H82 Q72 138 70 91 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь ручку сбоку.', '<path d="M124 105 Q154 105 145 129 Q138 145 121 134" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — покажи верх чашки.', '<ellipse cx="98" cy="91" rx="29" ry="9" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 4 — нарисуй пар плавными линиями.', '<path d="M82 73 Q72 60 84 48 M101 72 Q92 59 105 45 M120 73 Q111 61 123 50" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>'),
    step('Шаг 5 — поставь чашку на блюдце.', '<ellipse cx="101" cy="160" rx="46" ry="9" fill="none" stroke="currentColor" stroke-width="4"/>'),
  ], `${bg('#f8fafc')}<path d="M70 91 H125 Q122 142 104 151 H82 Q72 138 70 91 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="4"/><path d="M124 105 Q154 105 145 129 Q138 145 121 134" fill="none" stroke="#2563eb" stroke-width="4"/><ellipse cx="98" cy="91" rx="29" ry="9" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><path d="M82 73 Q72 60 84 48 M101 72 Q92 59 105 45 M120 73 Q111 61 123 50" fill="none" stroke="#94a3b8" stroke-width="3"/><ellipse cx="101" cy="160" rx="46" ry="9" fill="#e0f2fe" stroke="#2563eb" stroke-width="3"/>`, ['#93c5fd', '#fed7aa', '#94a3b8'], 'Пусть пар будет неровный — так он выглядит живым.'),
];

day2.push(
  objectLesson('fw57-d02-04-door', 'Дверь с ковриком', 'Неделя 1 · Дом и уют', 'Первые формы', 204, '🚪', 2, 'draw', [
    step('Шаг 1 — нарисуй высокую дверь с округлым верхом.', '<path d="M68 158 V74 Q100 48 132 74 V158 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь окошко в двери.', '<path d="M88 83 Q100 76 112 83 V104 Q100 110 88 104 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 3 — нарисуй ручку и линию середины.', '<circle cx="119" cy="120" r="4" fill="currentColor"/><path d="M100 110 V158" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 4 — под дверью добавь ступеньку.', '<path d="M58 164 Q100 173 142 164" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — перед входом положи коврик.', '<path d="M72 174 Q100 166 129 174 Q119 186 82 186 Q76 182 72 174 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M68 158 V74 Q100 48 132 74 V158 Z" fill="#fb923c" stroke="#9a3412" stroke-width="4"/><path d="M88 83 Q100 76 112 83 V104 Q100 110 88 104 Z" fill="#bfdbfe" stroke="#2563eb" stroke-width="3"/><circle cx="119" cy="120" r="4" fill="#facc15"/><path d="M100 110 V158" fill="none" stroke="#92400e" stroke-width="3"/><path d="M58 164 Q100 173 142 164" fill="none" stroke="#a16207" stroke-width="4"/><path d="M72 174 Q100 166 129 174 Q119 186 82 186 Q76 182 72 174 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/>`, ['#fb923c', '#bfdbfe', '#86efac'], 'Добавь рядом камешек или травинку — дверь сразу станет частью дома.'),
  objectLesson('fw57-d02-05-chair', 'Стульчик с подушкой', 'Неделя 1 · Дом и уют', 'Первые формы', 205, '🪑', 2, 'draw', [
    step('Шаг 1 — нарисуй спинку стула.', '<path d="M70 62 H130 V112 H70 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь сиденье.', '<path d="M60 116 H140 L130 142 H70 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 3 — поставь четыре ножки, передние чуть длиннее.', '<path d="M72 142 L64 174 M128 142 L136 174 M85 142 L84 166 M115 142 L116 166" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 4 — на сиденье положи мягкую подушку.', '<path d="M74 113 Q100 105 126 113 Q119 129 82 129 Q77 123 74 113 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 5 — добавь маленький узор на спинку.', '<path d="M84 78 Q100 95 116 78 M83 96 H117" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${bg('#fff7ed')}<path d="M70 62 H130 V112 H70 Z" fill="#fed7aa" stroke="#92400e" stroke-width="4"/><path d="M60 116 H140 L130 142 H70 Z" fill="#d6a36a" stroke="#92400e" stroke-width="4"/><path d="M72 142 L64 174 M128 142 L136 174 M85 142 L84 166 M115 142 L116 166" fill="none" stroke="#92400e" stroke-width="4"/><path d="M74 113 Q100 105 126 113 Q119 129 82 129 Q77 123 74 113 Z" fill="#f9a8d4" stroke="#be185d" stroke-width="3"/><path d="M84 78 Q100 95 116 78 M83 96 H117" fill="none" stroke="#a855f7" stroke-width="3"/>`, ['#fed7aa', '#f9a8d4', '#a855f7'], 'Можно дорисовать рядом тапочек или книжку.'),
  objectLesson('fw57-d02-06-shelf', 'Полка с игрушками', 'Неделя 1 · Дом и уют', 'Первые формы', 206, '🧸', 2, 'draw', [
    step('Шаг 1 — нарисуй длинную полку.', '<path d="M45 130 H155" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — поставь слева мишку: голова, тело и ушки.', '<circle cx="76" cy="92" r="18" fill="none" stroke="currentColor" stroke-width="4"/><ellipse cx="76" cy="120" rx="22" ry="20" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="62" cy="78" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="90" cy="78" r="6" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 3 — справа нарисуй кубики без букв.', '<path d="M112 99 H137 V124 H112 Z M138 106 H158 V126 H138 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 4 — добавь мячик между игрушками.', '<circle cx="108" cy="126" r="11" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M100 120 Q108 127 116 120" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'),
    step('Шаг 5 — оживи мишку мордочкой и бантиком.', '<circle cx="70" cy="91" r="2.8" fill="currentColor"/><circle cx="82" cy="91" r="2.8" fill="currentColor"/><path d="M72 102 Q76 106 81 102 M70 112 L76 118 L82 112" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>'),
  ], `${bg('#f8fafc')}<path d="M45 130 H155" fill="none" stroke="#92400e" stroke-width="5"/><circle cx="76" cy="92" r="18" fill="#d6a36a" stroke="#334155" stroke-width="3"/><ellipse cx="76" cy="120" rx="22" ry="20" fill="#d6a36a" stroke="#334155" stroke-width="3"/><circle cx="62" cy="78" r="6" fill="#fed7aa" stroke="#334155" stroke-width="2.5"/><circle cx="90" cy="78" r="6" fill="#fed7aa" stroke="#334155" stroke-width="2.5"/><path d="M112 99 H137 V124 H112 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M138 106 H158 V126 H138 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="3"/><circle cx="108" cy="126" r="11" fill="#fb7185" stroke="#be123c" stroke-width="3"/><circle cx="70" cy="91" r="2.8" fill="#1f2937"/><circle cx="82" cy="91" r="2.8" fill="#1f2937"/><path d="M70 112 L76 118 L82 112" fill="none" stroke="#a855f7" stroke-width="3"/>`, ['#d6a36a', '#93c5fd', '#fb7185'], 'Важно: игрушки стоят отдельно, не сливаются в одну кучу.'),
  objectLesson('fw57-d02-07-plant-pot', 'Горшок с ростком', 'Неделя 1 · Дом и уют', 'Растения и цветы', 207, '🪴', 2, 'draw', [
    step('Шаг 1 — нарисуй горшок шире сверху.', '<path d="M73 112 H127 L119 164 H81 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь землю внутри горшка.', '<path d="M78 118 Q100 126 122 118" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 3 — проведи главный стебель.', '<path d="M100 115 Q96 90 104 65" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 4 — нарисуй два больших листа.', '<path d="M99 91 Q73 78 73 101 Q89 106 99 91 M103 81 Q130 66 132 91 Q115 96 103 81" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 5 — добавь маленькие точки на горшке.', '<circle cx="91" cy="138" r="3" fill="currentColor"/><circle cx="110" cy="149" r="3" fill="currentColor"/><circle cx="105" cy="129" r="2.5" fill="currentColor"/>'),
  ], `${bg('#f0fdf4')}<path d="M73 112 H127 L119 164 H81 Z" fill="#fb923c" stroke="#9a3412" stroke-width="4"/><path d="M78 118 Q100 126 122 118" fill="none" stroke="#92400e" stroke-width="3"/><path d="M100 115 Q96 90 104 65" fill="none" stroke="#16a34a" stroke-width="4"/><path d="M99 91 Q73 78 73 101 Q89 106 99 91 M103 81 Q130 66 132 91 Q115 96 103 81" fill="#86efac" stroke="#16a34a" stroke-width="3"/><circle cx="91" cy="138" r="3" fill="#fde047"/><circle cx="110" cy="149" r="3" fill="#fde047"/><circle cx="105" cy="129" r="2.5" fill="#fde047"/>`, ['#fb923c', '#86efac', '#fde047'], 'Пусть листья будут разными — это нормально и красиво.'),
  wideLesson('fw57-d02-08-breakfast', 'Завтрак на столе', 'Неделя 1 · Дом и уют', 'Первые формы', 208, '🍳', [
    step('Шаг 1 — нарисуй край стола широкой линией.', '<path d="M18 160 Q145 142 282 160" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — поставь большую тарелку слева.', '<ellipse cx="98" cy="125" rx="48" ry="24" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 3 — на тарелке нарисуй яичницу: белок и круглый желток.', '<path d="M68 124 Q74 103 96 111 Q111 96 128 113 Q139 129 119 139 Q94 150 75 138 Q64 135 68 124 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><circle cx="101" cy="124" r="11" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 4 — справа добавь чашку с ручкой.', '<path d="M178 105 H222 Q219 143 194 148 Q180 139 178 105 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M222 116 Q244 119 232 136 Q226 145 216 138" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 5 — добавь салфетку и маленький помидор.', '<path d="M134 144 L166 136 L174 157 L142 166 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><circle cx="147" cy="119" r="8" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 6 — покажи пар над чашкой и пару крошек на столе.', '<path d="M189 90 Q181 78 193 67 M208 90 Q199 78 211 68" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="58" cy="151" r="2.5" fill="currentColor"/><circle cx="245" cy="153" r="2.5" fill="currentColor"/>'),
  ], `${wideBg('#fff7ed')}<path d="M18 160 Q145 142 282 160 L300 210 H0 L0 176 Q8 166 18 160 Z" fill="#fed7aa"/><ellipse cx="98" cy="125" rx="48" ry="24" fill="#e0f2fe" stroke="#2563eb" stroke-width="3"/><path d="M68 124 Q74 103 96 111 Q111 96 128 113 Q139 129 119 139 Q94 150 75 138 Q64 135 68 124 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/><circle cx="101" cy="124" r="11" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/><path d="M178 105 H222 Q219 143 194 148 Q180 139 178 105 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M222 116 Q244 119 232 136 Q226 145 216 138" fill="none" stroke="#2563eb" stroke-width="3"/><path d="M134 144 L166 136 L174 157 L142 166 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/><circle cx="147" cy="119" r="8" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/><path d="M189 90 Q181 78 193 67 M208 90 Q199 78 211 68" fill="none" stroke="#94a3b8" stroke-width="3"/>`, ['#fed7aa', '#93c5fd', '#facc15'], 'Сделай понятный завтрак: тарелка, чашка, яичница и одна маленькая деталь.'),
  wideLesson('fw57-d02-09-reading-corner', 'Уголок для книжки', 'Неделя 1 · Дом и уют', 'Первые формы', 209, '📚', [
    step('Шаг 1 — нарисуй пол и стену двумя спокойными линиями.', '<path d="M0 154 Q150 146 300 154" fill="none" stroke="currentColor" stroke-width="4"/><path d="M78 154 V48 M78 48 Q155 58 235 48" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 2 — слева поставь кресло с мягкой спинкой.', '<path d="M45 119 Q52 77 95 83 Q132 90 127 131 L115 154 H61 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 3 — в кресло положи открытую книжку.', '<path d="M71 123 Q90 115 104 126 Q118 115 137 123 V144 Q119 137 104 146 Q88 137 71 144 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/>'),
    step('Шаг 4 — справа нарисуй маленький столик и лампу.', '<path d="M196 126 H242 M207 126 V161 M232 126 V161" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M202 92 H237 L246 116 H193 Z M220 116 V126" fill="none" stroke="currentColor" stroke-width="3.3" stroke-linejoin="round"/>'),
    step('Шаг 5 — добавь коврик и подушку.', '<ellipse cx="150" cy="173" rx="80" ry="14" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M62 96 Q83 86 101 98 Q95 116 68 112 Q59 106 62 96 Z" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 6 — на стене нарисуй маленькую звёздочку или картинку.', '<path d="M168 70 L174 84 L189 84 L177 93 L182 108 L168 99 L154 108 L159 93 L147 84 L162 84 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
  ], `${wideBg('#fff7ed')}<path d="M0 154 Q150 146 300 154 L300 210 H0 Z" fill="#fed7aa"/><path d="M45 119 Q52 77 95 83 Q132 90 127 131 L115 154 H61 Z" fill="#a7f3d0" stroke="#047857" stroke-width="3"/><path d="M71 123 Q90 115 104 126 Q118 115 137 123 V144 Q119 137 104 146 Q88 137 71 144 Z" fill="#fef3c7" stroke="#92400e" stroke-width="3"/><path d="M196 126 H242 M207 126 V161 M232 126 V161" fill="none" stroke="#92400e" stroke-width="3"/><path d="M202 92 H237 L246 116 H193 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="3"/><ellipse cx="150" cy="173" rx="80" ry="14" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/><path d="M62 96 Q83 86 101 98 Q95 116 68 112 Q59 106 62 96 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M168 70 L174 84 L189 84 L177 93 L182 108 L168 99 L154 108 L159 93 L147 84 L162 84 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>`, ['#a7f3d0', '#fde68a', '#fbcfe8'], 'Нарисуй уют: кресло, книжка, лампа и коврик.'),
  wideLesson('fw57-d02-10-cozy-room', 'Моя уютная комната', 'Неделя 1 · Дом и уют', 'Первые формы', 210, '🏠', [
    step('Шаг 1 — раздели лист на стену и пол.', '<path d="M0 150 Q150 142 300 150" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 2 — слева нарисуй кровать крупной формой.', '<path d="M35 111 H126 Q135 111 137 124 V158 H35 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M35 111 V87 Q65 78 91 93 V111" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 3 — добавь подушку и одеяло.', '<path d="M51 95 Q72 87 90 98 Q84 112 56 109 Q49 104 51 95 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M40 128 Q82 116 132 130" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — справа нарисуй окно.', '<path d="M191 55 H255 V115 H191 Z M223 55 V115 M191 85 H255" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 5 — в центре поставь коробку с игрушками.', '<path d="M132 138 H183 L176 170 H139 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><circle cx="148" cy="130" r="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M166 130 L181 117 L189 134 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
    step('Шаг 6 — добавь коврик, звёздочку и пару мелочей по местам.', '<ellipse cx="139" cy="181" rx="83" ry="14" fill="none" stroke="currentColor" stroke-width="3"/><path d="M164 61 L170 73 L183 74 L173 82 L176 95 L164 88 L152 95 L155 82 L145 74 L158 73 Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/>'),
  ], `${wideBg('#fff7ed')}<path d="M0 150 Q150 142 300 150 L300 210 H0 Z" fill="#fed7aa"/><path d="M35 111 H126 Q135 111 137 124 V158 H35 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/><path d="M35 111 V87 Q65 78 91 93 V111" fill="#d6a36a" stroke="#92400e" stroke-width="3"/><path d="M51 95 Q72 87 90 98 Q84 112 56 109 Q49 104 51 95 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M191 55 H255 V115 H191 Z M223 55 V115 M191 85 H255" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><path d="M132 138 H183 L176 170 H139 Z" fill="#a7f3d0" stroke="#047857" stroke-width="3"/><circle cx="148" cy="130" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/><path d="M166 130 L181 117 L189 134 Z" fill="#fb923c" stroke="#9a3412" stroke-width="2.5"/><ellipse cx="139" cy="181" rx="83" ry="14" fill="#ddd6fe" stroke="#7c3aed" stroke-width="3"/><path d="M164 61 L170 73 L183 74 L173 82 L176 95 L164 88 L152 95 L155 82 L145 74 L158 73 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>`, ['#fbcfe8', '#93c5fd', '#a7f3d0'], 'Финал дня: собери комнату из крупных понятных зон.')
);

function natureLesson(slug, title, order, emoji, steps, preview, level, prompt) {
  return objectLesson(slug, title, 'Неделя 1 · Сад и природа', 'Растения и цветы', order, emoji, level, level === 3 ? 'combo' : 'draw', steps, preview, ['#86efac', '#facc15', '#fb7185'], prompt);
}

const day3 = [
  natureLesson('fw57-d03-01-leaf', 'Листик с прожилками', 301, '🍃', [
    step('Шаг 1 — нарисуй один большой листик, не идеально ровный.', '<path d="M103 43 Q58 78 75 133 Q123 128 138 78 Q123 55 103 43 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — проведи главную прожилку.', '<path d="M103 45 Q100 89 77 132" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 3 — добавь боковые прожилки разной длины.', '<path d="M98 74 Q83 71 74 82 M96 91 Q115 88 127 98 M91 107 Q78 106 70 116" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 4 — нарисуй короткий черешок.', '<path d="M77 132 Q68 148 57 155" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь капельку рядом.', '<path d="M139 126 Q151 142 139 153 Q127 142 139 126 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M103 43 Q58 78 75 133 Q123 128 138 78 Q123 55 103 43 Z" fill="#86efac" stroke="#16a34a" stroke-width="4"/><path d="M103 45 Q100 89 77 132 M98 74 Q83 71 74 82 M96 91 Q115 88 127 98 M91 107 Q78 106 70 116" fill="none" stroke="#15803d" stroke-width="3"/><path d="M77 132 Q68 148 57 155" fill="none" stroke="#92400e" stroke-width="4"/><path d="M139 126 Q151 142 139 153 Q127 142 139 126 Z" fill="#bfdbfe" stroke="#2563eb" stroke-width="2.5"/>`, 1, 'Раскрась листик и добавь рядом одну капельку или муравья.'),
  natureLesson('fw57-d03-02-tulip', 'Тюльпан на стебле', 302, '🌷', [
    step('Шаг 1 — нарисуй чашечку цветка.', '<path d="M78 72 Q86 45 101 70 Q116 45 124 72 Q120 105 101 116 Q82 105 78 72 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — проведи стебель вниз.', '<path d="M101 116 V165" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 3 — добавь два листа.', '<path d="M101 139 Q73 119 67 148 Q88 151 101 139 M102 151 Q128 131 137 160 Q117 164 102 151" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 4 — поставь цветок на землю.', '<path d="M52 169 Q101 181 150 169" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь маленький бутон сбоку.', '<path d="M64 130 Q52 118 57 103 Q72 108 70 124" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M78 72 Q86 45 101 70 Q116 45 124 72 Q120 105 101 116 Q82 105 78 72 Z" fill="#fb7185" stroke="#be123c" stroke-width="4"/><path d="M101 116 V165" fill="none" stroke="#16a34a" stroke-width="5"/><path d="M101 139 Q73 119 67 148 Q88 151 101 139 M102 151 Q128 131 137 160 Q117 164 102 151" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M52 169 Q101 181 150 169" fill="none" stroke="#22c55e" stroke-width="4"/><path d="M64 130 Q52 118 57 103 Q72 108 70 124" fill="#f9a8d4" stroke="#be185d" stroke-width="3"/>`, 1, 'Цветок может быть любого цвета — главное, чтобы были стебель и листья.'),
  natureLesson('fw57-d03-03-mushroom', 'Грибок под листом', 303, '🍄', [
    step('Шаг 1 — нарисуй широкую шляпку гриба.', '<path d="M55 95 Q100 42 145 95 Q128 111 100 109 Q72 111 55 95 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь ножку.', '<path d="M82 109 Q80 140 72 160 H128 Q120 140 118 109" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 3 — поставь пятнышки на шляпку.', '<circle cx="84" cy="85" r="5" fill="currentColor"/><circle cx="106" cy="72" r="5" fill="currentColor"/><circle cx="123" cy="92" r="4" fill="currentColor"/>'),
    step('Шаг 4 — сверху добавь большой лист.', '<path d="M121 51 Q151 34 166 60 Q144 71 121 51 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 5 — внизу нарисуй травинки.', '<path d="M45 166 Q100 178 155 166 M55 166 Q60 154 65 166 M140 166 Q146 154 151 166" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M55 95 Q100 42 145 95 Q128 111 100 109 Q72 111 55 95 Z" fill="#fb7185" stroke="#be123c" stroke-width="4"/><path d="M82 109 Q80 140 72 160 H128 Q120 140 118 109" fill="#fed7aa" stroke="#92400e" stroke-width="4"/><circle cx="84" cy="85" r="5" fill="#fff7ed"/><circle cx="106" cy="72" r="5" fill="#fff7ed"/><circle cx="123" cy="92" r="4" fill="#fff7ed"/><path d="M121 51 Q151 34 166 60 Q144 71 121 51 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M45 166 Q100 178 155 166 M55 166 Q60 154 65 166 M140 166 Q146 154 151 166" fill="none" stroke="#16a34a" stroke-width="3"/>`, 1, 'Гриб должен стоять на земле, а не висеть в воздухе.'),
];

day3.push(
  natureLesson('fw57-d03-04-butterfly', 'Бабочка у цветка', 304, '🦋', [
    step('Шаг 1 — нарисуй тело бабочки вертикальной капелькой.', '<ellipse cx="100" cy="105" rx="9" ry="38" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 2 — добавь два верхних крыла.', '<path d="M92 84 Q55 48 50 88 Q61 121 94 103 M108 84 Q145 48 150 88 Q139 121 106 103" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 3 — нарисуй нижние крылышки поменьше.', '<path d="M93 112 Q61 121 70 150 Q91 148 99 126 M107 112 Q139 121 130 150 Q109 148 101 126" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 4 — добавь усики и узоры на крыльях.', '<path d="M96 69 Q83 54 75 63 M104 69 Q117 54 125 63" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="75" cy="91" r="4" fill="currentColor"/><circle cx="126" cy="91" r="4" fill="currentColor"/><circle cx="88" cy="134" r="3" fill="currentColor"/><circle cx="112" cy="134" r="3" fill="currentColor"/>'),
    step('Шаг 5 — рядом нарисуй простой цветок.', '<path d="M155 160 V127 M155 143 Q140 134 134 150 M155 136 Q170 126 176 144" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><circle cx="155" cy="120" r="7" fill="none" stroke="currentColor" stroke-width="3"/>'),
  ], `${bg('#f0fdf4')}<ellipse cx="100" cy="105" rx="9" ry="38" fill="#92400e" stroke="#334155" stroke-width="3"/><path d="M92 84 Q55 48 50 88 Q61 121 94 103 M108 84 Q145 48 150 88 Q139 121 106 103" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M93 112 Q61 121 70 150 Q91 148 99 126 M107 112 Q139 121 130 150 Q109 148 101 126" fill="#f9a8d4" stroke="#be185d" stroke-width="3"/><circle cx="75" cy="91" r="4" fill="#facc15"/><circle cx="126" cy="91" r="4" fill="#facc15"/><circle cx="88" cy="134" r="3" fill="#a855f7"/><circle cx="112" cy="134" r="3" fill="#a855f7"/><path d="M155 160 V127 M155 143 Q140 134 134 150 M155 136 Q170 126 176 144" fill="none" stroke="#16a34a" stroke-width="3"/><circle cx="155" cy="120" r="7" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/>`, 2, 'Добавь цветок не вплотную, чтобы бабочка “летела” рядом.'),
  natureLesson('fw57-d03-05-snail', 'Улитка на дорожке', 305, '🐌', [
    step('Шаг 1 — нарисуй тело улитки длинной мягкой формой.', '<path d="M55 130 Q92 112 131 130 Q121 149 70 148 Q57 143 55 130 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — сверху добавь большой домик-спираль.', '<circle cx="92" cy="103" r="29" fill="none" stroke="currentColor" stroke-width="4"/><path d="M92 103 Q102 94 111 103 Q111 117 94 119 Q76 115 78 96 Q84 80 103 83" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 3 — нарисуй голову и рожки.', '<path d="M129 128 Q153 112 164 132 M148 118 L152 98 M157 121 L166 105" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — добавь глазки на рожках.', '<circle cx="152" cy="98" r="2.8" fill="currentColor"/><circle cx="166" cy="105" r="2.8" fill="currentColor"/>'),
    step('Шаг 5 — проведи дорожку и маленькие камешки.', '<path d="M42 160 Q100 174 160 160" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="52" cy="151" r="3" fill="currentColor"/><circle cx="148" cy="151" r="3" fill="currentColor"/>'),
  ], `${bg('#f0fdf4')}<path d="M55 130 Q92 112 131 130 Q121 149 70 148 Q57 143 55 130 Z" fill="#fde68a" stroke="#92400e" stroke-width="4"/><circle cx="92" cy="103" r="29" fill="#fb923c" stroke="#9a3412" stroke-width="3"/><path d="M92 103 Q102 94 111 103 Q111 117 94 119 Q76 115 78 96 Q84 80 103 83" fill="none" stroke="#92400e" stroke-width="3"/><path d="M129 128 Q153 112 164 132 M148 118 L152 98 M157 121 L166 105" fill="none" stroke="#92400e" stroke-width="3"/><circle cx="152" cy="98" r="2.8" fill="#1f2937"/><circle cx="166" cy="105" r="2.8" fill="#1f2937"/><path d="M42 160 Q100 174 160 160" fill="none" stroke="#22c55e" stroke-width="4"/><circle cx="52" cy="151" r="3" fill="#94a3b8"/><circle cx="148" cy="151" r="3" fill="#94a3b8"/>`, 2, 'Улитка должна ползти по дорожке — добавь землю под ней.'),
  natureLesson('fw57-d03-06-birdhouse', 'Скворечник в саду', 306, '🐦', [
    step('Шаг 1 — нарисуй домик для птиц.', '<path d="M72 91 L100 62 L128 91 V137 H72 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь круглое отверстие и жердочку.', '<circle cx="100" cy="104" r="10" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M88 123 H112" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 3 — поставь домик на столбик.', '<path d="M95 137 V168 H105 V137" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 4 — рядом нарисуй маленькую птицу.', '<ellipse cx="146" cy="123" rx="16" ry="11" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="133" cy="116" r="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M125 116 L115 111 L125 107" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
    step('Шаг 5 — добавь цветы и землю.', '<path d="M42 171 Q100 181 158 171 M52 170 V150 M145 170 V151" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="52" cy="145" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="145" cy="146" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
  ], `${bg('#eff6ff')}<path d="M72 91 L100 62 L128 91 V137 H72 Z" fill="#a7f3d0" stroke="#047857" stroke-width="4"/><circle cx="100" cy="104" r="10" fill="#1f2937"/><path d="M88 123 H112" fill="none" stroke="#92400e" stroke-width="3"/><path d="M95 137 V168 H105 V137" fill="#92400e"/><ellipse cx="146" cy="123" rx="16" ry="11" fill="#fb7185" stroke="#be123c" stroke-width="3"/><circle cx="133" cy="116" r="8" fill="#fde68a" stroke="#ca8a04" stroke-width="2.5"/><path d="M125 116 L115 111 L125 107" fill="#fb923c" stroke="#9a3412" stroke-width="2.5"/><path d="M42 171 Q100 181 158 171 M52 170 V150 M145 170 V151" fill="none" stroke="#16a34a" stroke-width="3"/><circle cx="52" cy="145" r="5" fill="#f9a8d4" stroke="#be185d" stroke-width="2"/><circle cx="145" cy="146" r="5" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>`, 2, 'Птица не должна сливаться со скворечником — оставь между ними воздух.'),
  natureLesson('fw57-d03-07-apple-tree', 'Яблоня с корзинкой', 307, '🍎', [
    step('Шаг 1 — нарисуй ствол и две ветки.', '<path d="M90 165 V101 Q88 82 105 76 Q110 96 106 165 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M100 107 Q76 92 67 112 M104 103 Q131 87 142 107" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 2 — добавь одну большую живую крону.', '<path d="M58 83 Q61 54 91 57 Q108 35 132 56 Q163 55 169 85 Q186 108 160 126 Q141 151 110 137 Q80 151 62 126 Q37 107 58 83 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 3 — повесь яблоки в разных местах.', '<circle cx="83" cy="96" r="5" fill="currentColor"/><circle cx="121" cy="79" r="5" fill="currentColor"/><circle cx="145" cy="111" r="5" fill="currentColor"/>'),
    step('Шаг 4 — поставь корзинку рядом, не под дерево.', '<path d="M38 148 H72 Q69 170 43 170 Q37 160 38 148 Z M43 148 Q54 132 68 148" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 5 — добавь землю и пару травинок.', '<path d="M28 172 Q100 184 171 172 M34 171 Q39 159 44 171 M154 171 Q160 158 166 171" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M90 165 V101 Q88 82 105 76 Q110 96 106 165 Z" fill="#92400e" stroke="#78350f" stroke-width="3"/><path d="M100 107 Q76 92 67 112 M104 103 Q131 87 142 107" fill="none" stroke="#92400e" stroke-width="4"/><path d="M58 83 Q61 54 91 57 Q108 35 132 56 Q163 55 169 85 Q186 108 160 126 Q141 151 110 137 Q80 151 62 126 Q37 107 58 83 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><circle cx="83" cy="96" r="5" fill="#ef4444"/><circle cx="121" cy="79" r="5" fill="#ef4444"/><circle cx="145" cy="111" r="5" fill="#ef4444"/><path d="M38 148 H72 Q69 170 43 170 Q37 160 38 148 Z M43 148 Q54 132 68 148" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><path d="M28 172 Q100 184 171 172 M34 171 Q39 159 44 171 M154 171 Q160 158 166 171" fill="none" stroke="#16a34a" stroke-width="3"/>`, 2, 'Сделай дерево живым: крона одна, но неровная, яблоки разные.'),
  wideLesson('fw57-d03-08-garden-rain', 'Сад после дождя', 'Неделя 1 · Сад и природа', 'Растения и цветы', 308, '🌦️', [
    step('Шаг 1 — нарисуй землю и две лужицы.', '<path d="M18 164 Q92 150 152 164 Q220 178 282 158" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><ellipse cx="95" cy="174" rx="24" ry="7" fill="none" stroke="currentColor" stroke-width="3"/><ellipse cx="202" cy="169" rx="20" ry="6" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 2 — слева посади большой цветок.', '<path d="M78 160 V110 M78 134 Q55 126 50 147 M78 139 Q101 128 108 151" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="78" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M78 76 V92 M78 108 V124 M54 100 H70 M86 100 H102" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 3 — справа нарисуй грибок.', '<path d="M183 126 Q213 92 243 126 Q231 138 213 137 Q195 138 183 126 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M202 137 Q200 156 195 166 H226 Q221 156 220 137" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 4 — сверху добавь облачко, оно далеко от цветка.', '<path d="M125 55 Q133 43 146 53 Q157 38 171 53 Q184 55 186 68 H125 Q116 66 125 55 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 5 — покажи редкие капли дождя.', '<path d="M137 86 L133 99 M158 84 L154 98 M178 86 L174 99" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 6 — добавь улитку или камешек на дорожке.', '<path d="M132 158 Q148 148 164 158 Q158 168 139 168 Q132 164 132 158 Z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="146" cy="151" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
  ], `${wideBg('#eff6ff')}<path d="M18 164 Q92 150 152 164 Q220 178 282 158 L300 210 H0 L0 180 Q8 170 18 164 Z" fill="#bbf7d0"/><ellipse cx="95" cy="174" rx="24" ry="7" fill="#93c5fd" stroke="#2563eb" stroke-width="2.5"/><ellipse cx="202" cy="169" rx="20" ry="6" fill="#93c5fd" stroke="#2563eb" stroke-width="2.5"/><path d="M78 160 V110 M78 134 Q55 126 50 147 M78 139 Q101 128 108 151" fill="none" stroke="#16a34a" stroke-width="4"/><circle cx="78" cy="100" r="8" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/><path d="M78 76 V92 M78 108 V124 M54 100 H70 M86 100 H102" fill="none" stroke="#fb7185" stroke-width="3"/><path d="M183 126 Q213 92 243 126 Q231 138 213 137 Q195 138 183 126 Z" fill="#fb7185" stroke="#be123c" stroke-width="3"/><path d="M202 137 Q200 156 195 166 H226 Q221 156 220 137" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><path d="M125 55 Q133 43 146 53 Q157 38 171 53 Q184 55 186 68 H125 Q116 66 125 55 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="3"/><path d="M137 86 L133 99 M158 84 L154 98 M178 86 L174 99" fill="none" stroke="#2563eb" stroke-width="3"/><path d="M132 158 Q148 148 164 158 Q158 168 139 168 Q132 164 132 158 Z" fill="#fde68a" stroke="#92400e" stroke-width="2.5"/><circle cx="146" cy="151" r="7" fill="#fb923c" stroke="#9a3412" stroke-width="2"/>`, ['#bbf7d0', '#93c5fd', '#fb7185'], 'Сцена должна быть спокойной: цветок, гриб, лужицы и облако не налезают друг на друга.'),
  wideLesson('fw57-d03-09-garden-path', 'Дорожка в саду', 'Неделя 1 · Сад и природа', 'Растения и цветы', 309, '🌿', [
    step('Шаг 1 — проведи дорожку от низа листа к середине.', '<path d="M118 207 Q138 165 145 130 M178 207 Q168 166 158 130" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — слева нарисуй куст с ягодами.', '<path d="M45 137 Q30 111 56 103 Q66 79 88 99 Q112 99 110 124 Q98 151 70 145 Q55 154 45 137 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="65" cy="116" r="4" fill="currentColor"/><circle cx="85" cy="127" r="4" fill="currentColor"/>'),
    step('Шаг 3 — справа поставь дерево.', '<path d="M228 170 V117 H242 V170" fill="none" stroke="currentColor" stroke-width="4"/><path d="M203 95 Q207 67 233 72 Q247 49 270 73 Q291 77 289 105 Q275 129 247 124 Q225 139 209 119 Q190 117 203 95 Z" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 4 — добавь маленькие цветы вдоль дорожки.', '<path d="M95 171 V153 M205 171 V153" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="95" cy="148" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="205" cy="148" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
    step('Шаг 5 — вверху добавь солнце в свободном углу.', '<circle cx="52" cy="45" r="18" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M52 18 V8 M52 82 V72 M25 45 H14 M90 45 H79" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 6 — покажи камешки на дорожке.', '<circle cx="142" cy="162" r="3" fill="currentColor"/><circle cx="157" cy="181" r="3" fill="currentColor"/><circle cx="148" cy="145" r="2.5" fill="currentColor"/>'),
  ], `${wideBg('#eff6ff')}<path d="M0 164 Q80 148 150 162 Q220 176 300 156 L300 210 H0 Z" fill="#bbf7d0"/><path d="M118 207 Q138 165 145 130 M178 207 Q168 166 158 130" fill="none" stroke="#d97706" stroke-width="5"/><path d="M45 137 Q30 111 56 103 Q66 79 88 99 Q112 99 110 124 Q98 151 70 145 Q55 154 45 137 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><circle cx="65" cy="116" r="4" fill="#ef4444"/><circle cx="85" cy="127" r="4" fill="#ef4444"/><path d="M228 170 V117 H242 V170" fill="#92400e"/><path d="M203 95 Q207 67 233 72 Q247 49 270 73 Q291 77 289 105 Q275 129 247 124 Q225 139 209 119 Q190 117 203 95 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M95 171 V153 M205 171 V153" fill="none" stroke="#16a34a" stroke-width="3"/><circle cx="95" cy="148" r="5" fill="#f9a8d4"/><circle cx="205" cy="148" r="5" fill="#fde047"/><circle cx="52" cy="45" r="18" fill="#fde047" stroke="#f97316" stroke-width="3"/><path d="M52 18 V8 M52 82 V72 M25 45 H14 M90 45 H79" fill="none" stroke="#f97316" stroke-width="3"/><circle cx="142" cy="162" r="3" fill="#94a3b8"/><circle cx="157" cy="181" r="3" fill="#94a3b8"/><circle cx="148" cy="145" r="2.5" fill="#94a3b8"/>`, ['#bbf7d0', '#d97706', '#86efac'], 'Покажи путь: глаз должен идти по дорожке в глубину сада.'),
  wideLesson('fw57-d03-10-my-garden', 'Мой маленький сад', 'Неделя 1 · Сад и природа', 'Растения и цветы', 310, '🌳', [
    step('Шаг 1 — нарисуй широкую землю и место для сада.', '<path d="M14 166 Q80 150 148 163 Q220 178 286 158" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — слева поставь яблоню.', '<path d="M70 166 V111 H84 V166" fill="none" stroke="currentColor" stroke-width="4"/><path d="M43 92 Q45 66 69 70 Q82 48 103 69 Q126 68 130 94 Q116 121 91 116 Q68 132 51 112 Q35 111 43 92 Z" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 3 — справа нарисуй клумбу с тремя цветами.', '<path d="M184 165 V135 M214 166 V132 M244 164 V138" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="184" cy="129" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="214" cy="126" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="244" cy="132" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
    step('Шаг 4 — в центре добавь дорожку или лужайку.', '<path d="M113 166 Q132 189 153 208 M136 165 Q167 186 198 204" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь корзинку и яблоки.', '<path d="M103 145 H133 Q130 165 107 165 Q101 155 103 145 Z M108 145 Q118 132 130 145" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><circle cx="78" cy="93" r="4" fill="currentColor"/><circle cx="100" cy="80" r="4" fill="currentColor"/>'),
    step('Шаг 6 — заверши сад облаком и травинками.', '<path d="M184 55 Q193 43 206 53 Q217 39 230 53 Q242 56 244 68 H184 Q175 66 184 55 Z" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M34 177 Q39 164 44 177 M265 173 Q270 160 276 173" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${wideBg('#eff6ff')}<path d="M14 166 Q80 150 148 163 Q220 178 286 158 L300 210 H0 L0 181 Q6 171 14 166 Z" fill="#bbf7d0"/><path d="M70 166 V111 H84 V166" fill="#92400e"/><path d="M43 92 Q45 66 69 70 Q82 48 103 69 Q126 68 130 94 Q116 121 91 116 Q68 132 51 112 Q35 111 43 92 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M184 165 V135 M214 166 V132 M244 164 V138" fill="none" stroke="#16a34a" stroke-width="3"/><circle cx="184" cy="129" r="6" fill="#f9a8d4"/><circle cx="214" cy="126" r="6" fill="#fde047"/><circle cx="244" cy="132" r="6" fill="#93c5fd"/><path d="M113 166 Q132 189 153 208 M136 165 Q167 186 198 204" fill="none" stroke="#d97706" stroke-width="4"/><path d="M103 145 H133 Q130 165 107 165 Q101 155 103 145 Z M108 145 Q118 132 130 145" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><circle cx="78" cy="93" r="4" fill="#ef4444"/><circle cx="100" cy="80" r="4" fill="#ef4444"/><path d="M184 55 Q193 43 206 53 Q217 39 230 53 Q242 56 244 68 H184 Q175 66 184 55 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="3"/><path d="M34 177 Q39 164 44 177 M265 173 Q270 160 276 173" fill="none" stroke="#16a34a" stroke-width="3"/>`, ['#bbf7d0', '#86efac', '#ef4444'], 'Финал дня: дерево, цветы, дорожка и корзинка должны быть каждый на своём месте.')
);

function transport(slug, title, order, emoji, steps, preview, level, prompt) {
  return objectLesson(slug, title, 'Неделя 1 · Движение и транспорт', 'Транспорт', order, emoji, level, level === 3 ? 'combo' : 'draw', steps, preview, ['#93c5fd', '#fb923c', '#facc15'], prompt);
}

const day4 = [
  transport('fw57-d04-01-scooter', 'Самокат', 401, '🛴', [
    step('Шаг 1 — нарисуй длинную платформу.', '<path d="M62 133 H135 Q143 133 147 139" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — добавь два колеса.', '<circle cx="67" cy="147" r="10" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="139" cy="147" r="10" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 3 — проведи стойку и руль.', '<path d="M130 133 L115 72 M96 72 H135" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 4 — добавь линию дороги.', '<path d="M42 164 Q100 176 158 164" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — покажи движение маленькими штрихами.', '<path d="M45 124 H25 M52 113 H35" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${bg('#f8fafc')}<path d="M62 133 H135 Q143 133 147 139" fill="none" stroke="#fb923c" stroke-width="5"/><circle cx="67" cy="147" r="10" fill="#e0f2fe" stroke="#2563eb" stroke-width="3"/><circle cx="139" cy="147" r="10" fill="#e0f2fe" stroke="#2563eb" stroke-width="3"/><path d="M130 133 L115 72 M96 72 H135" fill="none" stroke="#334155" stroke-width="4"/><path d="M42 164 Q100 176 158 164" fill="none" stroke="#22c55e" stroke-width="4"/><path d="M45 124 H25 M52 113 H35" fill="none" stroke="#94a3b8" stroke-width="3"/>`, 1, 'Самокат должен стоять на дороге: добавь землю под колёсами.'),
  transport('fw57-d04-02-boat', 'Лодочка на пруду', 402, '⛵', [
    step('Шаг 1 — нарисуй корпус лодочки плавной дугой.', '<path d="M55 124 Q100 152 145 124" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — поставь мачту.', '<path d="M100 124 V62" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — добавь парус.', '<path d="M100 64 L134 116 H100 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 4 — нарисуй воду под лодкой.', '<path d="M40 154 Q65 142 90 154 Q116 166 142 154 Q154 149 166 154" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь маленький флажок.', '<path d="M100 62 L123 72 L100 82" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
  ], `${bg('#eff6ff')}<path d="M55 124 Q100 152 145 124" fill="none" stroke="#92400e" stroke-width="5"/><path d="M100 124 V62" fill="none" stroke="#92400e" stroke-width="4"/><path d="M100 64 L134 116 H100 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="3"/><path d="M40 154 Q65 142 90 154 Q116 166 142 154 Q154 149 166 154" fill="none" stroke="#2563eb" stroke-width="4"/><path d="M100 62 L123 72 L100 82" fill="#fb7185" stroke="#be123c" stroke-width="2.5"/>`, 1, 'Не делаем машину: это транспорт на воде, лодка стоит на волнах.'),
  transport('fw57-d04-03-balloon', 'Воздушный шар', 403, '🎈', [
    step('Шаг 1 — нарисуй большой шар сверху.', '<path d="M100 42 Q135 50 139 86 Q133 121 100 130 Q67 121 61 86 Q65 50 100 42 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь корзинку снизу.', '<path d="M82 150 H118 L113 174 H87 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 3 — соедини шар и корзинку верёвочками.', '<path d="M78 122 L88 150 M122 122 L112 150" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — нарисуй полосы на шаре.', '<path d="M100 43 Q86 84 100 130 M100 43 Q114 84 100 130 M66 82 H134" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь маленькие облака далеко от шара.', '<path d="M42 60 Q50 49 62 57 Q70 45 82 58 Q93 59 94 70 H42 Q34 68 42 60 Z M142 139 Q150 128 162 136 Q170 124 182 137 Q193 138 194 149 H142 Q134 147 142 139 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
  ], `${bg('#eff6ff')}<path d="M100 42 Q135 50 139 86 Q133 121 100 130 Q67 121 61 86 Q65 50 100 42 Z" fill="#fb7185" stroke="#be123c" stroke-width="4"/><path d="M82 150 H118 L113 174 H87 Z" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><path d="M78 122 L88 150 M122 122 L112 150" fill="none" stroke="#92400e" stroke-width="3"/><path d="M100 43 Q86 84 100 130 M100 43 Q114 84 100 130 M66 82 H134" fill="none" stroke="#facc15" stroke-width="3"/><path d="M42 60 Q50 49 62 57 Q70 45 82 58 Q93 59 94 70 H42 Q34 68 42 60 Z M142 139 Q150 128 162 136 Q170 124 182 137 Q193 138 194 149 H142 Q134 147 142 139 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>`, 1, 'Шар летит в небе: оставь ему много воздуха вокруг.'),
];

day4.push(
  transport('fw57-d04-04-bicycle', 'Велосипед с корзинкой', 404, '🚲', [
    step('Шаг 1 — нарисуй два больших колеса.', '<circle cx="67" cy="137" r="24" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="138" cy="137" r="24" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 2 — соедини колёса рамой.', '<path d="M67 137 L96 104 L116 137 L86 137 L96 104 L138 137" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'),
    step('Шаг 3 — добавь сиденье и руль.', '<path d="M96 104 V82 M84 82 H108 M138 137 L130 92 M130 92 H154" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — впереди поставь маленькую корзинку.', '<path d="M147 102 H169 L164 122 H151 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
    step('Шаг 5 — положи цветок в корзинку.', '<path d="M158 102 Q154 90 148 84 M158 102 Q164 90 171 84" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><circle cx="148" cy="80" r="4" fill="currentColor"/><circle cx="171" cy="80" r="4" fill="currentColor"/>'),
  ], `${bg('#f8fafc')}<circle cx="67" cy="137" r="24" fill="#e0f2fe" stroke="#2563eb" stroke-width="3"/><circle cx="138" cy="137" r="24" fill="#e0f2fe" stroke="#2563eb" stroke-width="3"/><path d="M67 137 L96 104 L116 137 L86 137 L96 104 L138 137" fill="none" stroke="#fb923c" stroke-width="3.5"/><path d="M96 104 V82 M84 82 H108 M138 137 L130 92 M130 92 H154" fill="none" stroke="#334155" stroke-width="3.5"/><path d="M147 102 H169 L164 122 H151 Z" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><path d="M158 102 Q154 90 148 84 M158 102 Q164 90 171 84" fill="none" stroke="#16a34a" stroke-width="2.7"/><circle cx="148" cy="80" r="4" fill="#fb7185"/><circle cx="171" cy="80" r="4" fill="#fde047"/>`, 2, 'Корзинка и цветок делают велосипед живым, но колёса остаются главными.'),
  transport('fw57-d04-05-kite', 'Воздушный змей', 405, '🪁', [
    step('Шаг 1 — нарисуй ромб змея.', '<path d="M100 48 L142 90 L100 132 L58 90 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — раздели ромб крестом.', '<path d="M100 48 V132 M58 90 H142" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 3 — добавь длинную нитку вниз.', '<path d="M100 132 Q86 150 103 164 Q121 179 98 190" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — на хвосте сделай бантики.', '<path d="M94 154 Q82 147 83 160 Q94 161 94 154 M101 164 Q113 157 113 170 Q102 171 101 164" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
    step('Шаг 5 — добавь ветер короткими линиями.', '<path d="M35 65 H66 M28 104 H54 M146 54 H172 M151 123 H183" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${bg('#eff6ff')}<path d="M100 48 L142 90 L100 132 L58 90 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="4"/><path d="M100 48 V132 M58 90 H142" fill="none" stroke="#fb923c" stroke-width="3"/><path d="M100 132 Q86 150 103 164 Q121 179 98 190" fill="none" stroke="#334155" stroke-width="3"/><path d="M94 154 Q82 147 83 160 Q94 161 94 154 M101 164 Q113 157 113 170 Q102 171 101 164" fill="#fb7185" stroke="#be123c" stroke-width="2.5"/><path d="M35 65 H66 M28 104 H54 M146 54 H172 M151 123 H183" fill="none" stroke="#60a5fa" stroke-width="3"/>`, 2, 'Ветер показывает движение, но не должен закрывать змея.'),
  transport('fw57-d04-06-tram-stop', 'Трамвайная остановка', 406, '🚋', [
    step('Шаг 1 — нарисуй корпус трамвая.', '<path d="M45 92 H155 Q164 92 164 126 V145 H36 V126 Q36 92 45 92 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь большие окна.', '<path d="M55 101 H82 V123 H55 Z M91 101 H118 V123 H91 Z M127 101 H151 V123 H127 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/>'),
    step('Шаг 3 — снизу нарисуй колёса.', '<circle cx="65" cy="148" r="8" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="135" cy="148" r="8" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 4 — сверху добавь дугу провода.', '<path d="M100 92 Q108 62 132 48 M72 48 H154" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>'),
    step('Шаг 5 — рядом поставь остановку-навес без текста.', '<path d="M24 145 V82 H35 V145 M18 82 H66" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M20 82 Q42 65 66 82" fill="none" stroke="currentColor" stroke-width="3.2"/>'),
  ], `${bg('#f8fafc')}<path d="M45 92 H155 Q164 92 164 126 V145 H36 V126 Q36 92 45 92 Z" fill="#fb923c" stroke="#9a3412" stroke-width="4"/><path d="M55 101 H82 V123 H55 Z M91 101 H118 V123 H91 Z M127 101 H151 V123 H127 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><circle cx="65" cy="148" r="8" fill="#334155"/><circle cx="135" cy="148" r="8" fill="#334155"/><path d="M100 92 Q108 62 132 48 M72 48 H154" fill="none" stroke="#475569" stroke-width="3"/><path d="M24 145 V82 H35 V145 M18 82 H66" fill="none" stroke="#64748b" stroke-width="3"/><path d="M20 82 Q42 65 66 82" fill="none" stroke="#64748b" stroke-width="3"/>`, 2, 'Не пишем слова на остановке — только форма и навес.'),
  transport('fw57-d04-07-pond-bridge', 'Мостик через пруд', 407, '🌉', [
    step('Шаг 1 — нарисуй пруд широкой овальной линией.', '<path d="M45 139 Q100 101 155 139 Q124 164 76 158 Q58 153 45 139 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 2 — через пруд проведи мостик.', '<path d="M45 126 Q100 100 155 126 M50 139 Q100 118 150 139" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — добавь перила мостика.', '<path d="M62 122 V108 M90 112 V96 M119 112 V96 M146 122 V108 M58 108 Q100 87 150 108" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 4 — нарисуй камешки по краю воды.', '<circle cx="55" cy="151" r="4" fill="currentColor"/><circle cx="145" cy="151" r="4" fill="currentColor"/><circle cx="101" cy="162" r="3" fill="currentColor"/>'),
    step('Шаг 5 — добавь камыши или траву.', '<path d="M35 140 Q39 121 43 140 M160 141 Q166 122 171 141 M167 126 L174 119" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M45 139 Q100 101 155 139 Q124 164 76 158 Q58 153 45 139 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M45 126 Q100 100 155 126 M50 139 Q100 118 150 139" fill="none" stroke="#92400e" stroke-width="4"/><path d="M62 122 V108 M90 112 V96 M119 112 V96 M146 122 V108 M58 108 Q100 87 150 108" fill="none" stroke="#92400e" stroke-width="3"/><circle cx="55" cy="151" r="4" fill="#94a3b8"/><circle cx="145" cy="151" r="4" fill="#94a3b8"/><circle cx="101" cy="162" r="3" fill="#94a3b8"/><path d="M35 140 Q39 121 43 140 M160 141 Q166 122 171 141 M167 126 L174 119" fill="none" stroke="#16a34a" stroke-width="3"/>`, 2, 'Это транспортный день без машины: мостик помогает перейти через воду.'),
  wideLesson('fw57-d04-08-boat-race', 'Лодочки на пруду', 'Неделя 1 · Движение и транспорт', 'Транспорт', 408, '⛵', [
    step('Шаг 1 — нарисуй широкую воду внизу листа.', '<path d="M0 145 Q65 130 126 145 Q190 160 300 139" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — слева нарисуй первую лодочку.', '<path d="M47 124 Q82 147 117 124" fill="none" stroke="currentColor" stroke-width="4"/><path d="M82 124 V72 L113 116 H82 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 3 — справа добавь вторую лодочку поменьше.', '<path d="M178 129 Q209 148 240 129" fill="none" stroke="currentColor" stroke-width="4"/><path d="M209 129 V83 L234 121 H209 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 4 — покажи волны вокруг лодочек.', '<path d="M34 158 Q58 148 82 158 Q106 168 130 158 M166 162 Q190 152 214 162 Q238 172 262 162" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 5 — сверху добавь облака и солнце в свободных местах.', '<circle cx="257" cy="48" r="18" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M257 20 V10 M257 86 V76 M231 48 H220 M292 48 H281" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M52 50 Q60 39 73 49 Q84 35 98 49 Q110 51 112 63 H52 Q43 61 52 50 Z" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 6 — добавь флажки на мачты.', '<path d="M82 72 L101 80 L82 88 M209 83 L226 91 L209 99" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/>'),
  ], `${wideBg('#eff6ff')}<path d="M0 145 Q65 130 126 145 Q190 160 300 139 L300 210 H0 Z" fill="#bfdbfe"/><path d="M47 124 Q82 147 117 124" fill="none" stroke="#92400e" stroke-width="4"/><path d="M82 124 V72 L113 116 H82 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="3"/><path d="M178 129 Q209 148 240 129" fill="none" stroke="#92400e" stroke-width="4"/><path d="M209 129 V83 L234 121 H209 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/><path d="M34 158 Q58 148 82 158 Q106 168 130 158 M166 162 Q190 152 214 162 Q238 172 262 162" fill="none" stroke="#2563eb" stroke-width="3"/><circle cx="257" cy="48" r="18" fill="#fde047" stroke="#f97316" stroke-width="3"/><path d="M52 50 Q60 39 73 49 Q84 35 98 49 Q110 51 112 63 H52 Q43 61 52 50 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/><path d="M82 72 L101 80 L82 88 M209 83 L226 91 L209 99" fill="#fb7185" stroke="#be123c" stroke-width="2.5"/>`, ['#bfdbfe', '#fde68a', '#fbcfe8'], 'Сделай две лодки разными по размеру, чтобы появилась глубина.'),
  wideLesson('fw57-d04-09-city-walk', 'Прогулка по городу', 'Неделя 1 · Движение и транспорт', 'Транспорт', 409, '🏙️', [
    step('Шаг 1 — нарисуй дорожку и тротуар.', '<path d="M0 158 Q88 147 150 158 Q220 170 300 152" fill="none" stroke="currentColor" stroke-width="5"/><path d="M117 158 Q133 184 150 208 M151 158 Q180 184 207 208" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 2 — слева поставь автобус далеко на дороге.', '<path d="M38 108 H119 Q127 108 128 130 V145 H34 V124 Q34 108 38 108 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M47 116 H68 V130 H47 Z M76 116 H98 V130 H76 Z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="54" cy="146" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="108" cy="146" r="6" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 3 — справа нарисуй остановку-навес.', '<path d="M226 146 V86 H239 V146 M210 86 H270 M213 86 Q240 65 270 86" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 4 — добавь дерево между ними, оставив зазор.', '<path d="M175 150 V111 H187 V150" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M151 98 Q154 76 176 78 Q187 58 205 79 Q223 80 225 101 Q211 120 188 114 Q167 128 154 112 Q142 111 151 98 Z" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 5 — покажи окна домов на дальнем фоне без текста.', '<path d="M15 91 V47 H52 V98 M273 120 V58 H296 V126" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 59 H33 M24 73 H33 M282 72 H290 M282 88 H290" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
    step('Шаг 6 — заверши сцену облаком и двумя шагами на дорожке.', '<path d="M131 47 Q139 36 152 46 Q163 32 176 46 Q189 48 190 60 H131 Q122 58 131 47 Z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="139" cy="172" r="3" fill="currentColor"/><circle cx="161" cy="183" r="3" fill="currentColor"/>'),
  ], `${wideBg('#eff6ff')}<path d="M0 158 Q88 147 150 158 Q220 170 300 152 L300 210 H0 Z" fill="#e5e7eb"/><path d="M117 158 Q133 184 150 208 M151 158 Q180 184 207 208" fill="none" stroke="#94a3b8" stroke-width="4"/><path d="M38 108 H119 Q127 108 128 130 V145 H34 V124 Q34 108 38 108 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/><path d="M47 116 H68 V130 H47 Z M76 116 H98 V130 H76 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/><circle cx="54" cy="146" r="6" fill="#334155"/><circle cx="108" cy="146" r="6" fill="#334155"/><path d="M226 146 V86 H239 V146 M210 86 H270 M213 86 Q240 65 270 86" fill="none" stroke="#64748b" stroke-width="3"/><path d="M175 150 V111 H187 V150" fill="#92400e"/><path d="M151 98 Q154 76 176 78 Q187 58 205 79 Q223 80 225 101 Q211 120 188 114 Q167 128 154 112 Q142 111 151 98 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M15 91 V47 H52 V98 M273 120 V58 H296 V126" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2.5"/><path d="M131 47 Q139 36 152 46 Q163 32 176 46 Q189 48 190 60 H131 Q122 58 131 47 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>`, ['#facc15', '#86efac', '#e5e7eb'], 'Городская сцена: транспорт есть, но не один и тот же автомобиль.'),
  wideLesson('fw57-d04-10-journey-map', 'Карта маленького путешествия', 'Неделя 1 · Движение и транспорт', 'Транспорт', 410, '🗺️', [
    step('Шаг 1 — нарисуй рамку карты с неровным краем.', '<path d="M35 35 Q150 20 265 35 Q278 105 265 176 Q150 194 35 176 Q22 105 35 35 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 2 — проведи дорожку-путь от дома к пруду.', '<path d="M62 147 Q102 116 132 130 Q172 149 221 84" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — слева поставь домик отправления.', '<path d="M53 124 L75 103 L97 124 V151 H53 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path d="M70 151 V133 H81 V151" fill="none" stroke="currentColor" stroke-width="2.7"/>'),
    step('Шаг 4 — справа нарисуй пруд и лодочку.', '<ellipse cx="226" cy="73" rx="29" ry="16" fill="none" stroke="currentColor" stroke-width="3"/><path d="M210 72 Q226 84 242 72" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M226 72 V52 L240 68 H226 Z" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
    step('Шаг 5 — добавь мостик и дерево по пути.', '<path d="M132 130 Q145 114 158 130 M134 137 Q146 125 156 137" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M160 110 V88 H169 V110" fill="none" stroke="currentColor" stroke-width="2.8"/><circle cx="165" cy="77" r="15" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 6 — отметь путь точками, но без букв и надписей.', '<circle cx="91" cy="128" r="3" fill="currentColor"/><circle cx="126" cy="129" r="3" fill="currentColor"/><circle cx="174" cy="121" r="3" fill="currentColor"/><circle cx="203" cy="94" r="3" fill="currentColor"/>'),
  ], `${wideBg('#fff7ed')}<path d="M35 35 Q150 20 265 35 Q278 105 265 176 Q150 194 35 176 Q22 105 35 35 Z" fill="#fef3c7" stroke="#92400e" stroke-width="3"/><path d="M62 147 Q102 116 132 130 Q172 149 221 84" fill="none" stroke="#d97706" stroke-width="4"/><path d="M53 124 L75 103 L97 124 V151 H53 Z" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><path d="M70 151 V133 H81 V151" fill="#f59e0b" stroke="#92400e" stroke-width="2.5"/><ellipse cx="226" cy="73" rx="29" ry="16" fill="#bfdbfe" stroke="#2563eb" stroke-width="2.5"/><path d="M210 72 Q226 84 242 72" fill="none" stroke="#92400e" stroke-width="2.8"/><path d="M226 72 V52 L240 68 H226 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="2.5"/><path d="M132 130 Q145 114 158 130 M134 137 Q146 125 156 137" fill="none" stroke="#92400e" stroke-width="2.8"/><path d="M160 110 V88 H169 V110" fill="#92400e"/><circle cx="165" cy="77" r="15" fill="#86efac" stroke="#16a34a" stroke-width="2.5"/><circle cx="91" cy="128" r="3" fill="#ef4444"/><circle cx="126" cy="129" r="3" fill="#ef4444"/><circle cx="174" cy="121" r="3" fill="#ef4444"/><circle cx="203" cy="94" r="3" fill="#ef4444"/>`, ['#fef3c7', '#d97706', '#bfdbfe'], 'Финал дня: не транспорт сам по себе, а маршрут маленького путешествия.')
);

function story(slug, title, order, emoji, steps, preview, level, prompt) {
  return objectLesson(slug, title, 'Неделя 1 · Первая история', 'Композиция', order, emoji, level, level === 3 ? 'combo' : 'draw', steps, preview, ['#93c5fd', '#f9a8d4', '#86efac'], prompt);
}

const day5 = [
  story('fw57-d05-01-bench', 'Скамейка в парке', 501, '🪑', [
    step('Шаг 1 — нарисуй сиденье скамейки.', '<path d="M55 113 H145" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — добавь спинку из двух линий.', '<path d="M60 86 H140 M60 100 H140" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — поставь ножки.', '<path d="M70 113 V150 M130 113 V150 M55 150 H145" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 4 — рядом добавь листик.', '<path d="M151 132 Q171 120 180 139 Q162 145 151 132 Z" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M151 132 Q165 135 180 139" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
    step('Шаг 5 — покажи землю под скамейкой.', '<path d="M42 162 Q100 174 158 162" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M55 113 H145 M60 86 H140 M60 100 H140" fill="none" stroke="#92400e" stroke-width="4"/><path d="M70 113 V150 M130 113 V150 M55 150 H145" fill="none" stroke="#92400e" stroke-width="4"/><path d="M151 132 Q171 120 180 139 Q162 145 151 132 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M151 132 Q165 135 180 139" fill="none" stroke="#16a34a" stroke-width="2.5"/><path d="M42 162 Q100 174 158 162" fill="none" stroke="#22c55e" stroke-width="4"/>`, 1, 'Скамейка — первый предмет будущей истории в парке.'),
  story('fw57-d05-02-balloon-child', 'Ребёнок с шариком', 502, '🎈', [
    step('Шаг 1 — нарисуй голову с волосами.', '<circle cx="100" cy="70" r="21" fill="none" stroke="currentColor" stroke-width="4"/><path d="M80 66 Q99 45 120 66" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
    step('Шаг 2 — добавь мягкую кофту, не палочку.', '<path d="M78 94 Q100 83 122 94 L132 142 Q100 154 68 142 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 3 — нарисуй руки: одна держит нитку.', '<path d="M79 104 Q61 113 58 132 M122 103 Q140 92 150 76" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 4 — добавь шарик над рукой.', '<path d="M155 37 Q178 44 176 68 Q168 91 147 80 Q132 65 143 45 Q148 39 155 37 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M150 76 Q151 91 143 105" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 5 — дорисуй лицо, ноги и землю.', '<circle cx="92" cy="69" r="3" fill="currentColor"/><circle cx="108" cy="69" r="3" fill="currentColor"/><path d="M93 81 Q100 87 108 81 M87 146 L78 170 M113 146 L124 170 M55 174 Q100 186 145 174" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'),
  ], `${bg('#eff6ff')}<circle cx="100" cy="70" r="21" fill="#fde68a" stroke="#92400e" stroke-width="3"/><path d="M80 66 Q99 45 120 66" fill="none" stroke="#92400e" stroke-width="3"/><path d="M78 94 Q100 83 122 94 L132 142 Q100 154 68 142 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M79 104 Q61 113 58 132 M122 103 Q140 92 150 76" fill="none" stroke="#92400e" stroke-width="4"/><path d="M155 37 Q178 44 176 68 Q168 91 147 80 Q132 65 143 45 Q148 39 155 37 Z" fill="#fb7185" stroke="#be123c" stroke-width="3"/><path d="M150 76 Q151 91 143 105" fill="none" stroke="#334155" stroke-width="3"/><circle cx="92" cy="69" r="3" fill="#1f2937"/><circle cx="108" cy="69" r="3" fill="#1f2937"/><path d="M93 81 Q100 87 108 81 M87 146 L78 170 M113 146 L124 170 M55 174 Q100 186 145 174" fill="none" stroke="#92400e" stroke-width="3"/>`, 1, 'Главное — человек не палочка: есть одежда, рука и действие.'),
  story('fw57-d05-03-duck-pond', 'Утка на пруду', 503, '🦆', [
    step('Шаг 1 — нарисуй воду широкой дугой.', '<path d="M42 143 Q70 128 98 143 Q127 158 156 143" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — добавь тело утки.', '<ellipse cx="101" cy="113" rx="35" ry="21" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 3 — нарисуй голову и клюв.', '<circle cx="75" cy="96" r="16" fill="none" stroke="currentColor" stroke-width="4"/><path d="M59 97 L42 90 L58 84" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 4 — добавь крыло и глаз.', '<path d="M96 106 Q119 95 130 113 Q112 124 96 106" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="72" cy="92" r="3" fill="currentColor"/>'),
    step('Шаг 5 — рядом нарисуй камыш.', '<path d="M153 144 Q160 122 166 144 M163 127 L176 118" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ], `${bg('#eff6ff')}<path d="M42 143 Q70 128 98 143 Q127 158 156 143" fill="none" stroke="#2563eb" stroke-width="5"/><ellipse cx="101" cy="113" rx="35" ry="21" fill="#fde68a" stroke="#92400e" stroke-width="3"/><circle cx="75" cy="96" r="16" fill="#fde68a" stroke="#92400e" stroke-width="3"/><path d="M59 97 L42 90 L58 84" fill="#fb923c" stroke="#9a3412" stroke-width="3"/><path d="M96 106 Q119 95 130 113 Q112 124 96 106" fill="#facc15" stroke="#ca8a04" stroke-width="3"/><circle cx="72" cy="92" r="3" fill="#1f2937"/><path d="M153 144 Q160 122 166 144 M163 127 L176 118" fill="none" stroke="#16a34a" stroke-width="3"/>`, 1, 'Утка должна быть на воде, не над водой.'),
];

day5.push(
  story('fw57-d05-04-icecream-cart', 'Тележка с мороженым', 504, '🍦', [
    step('Шаг 1 — нарисуй короб тележки.', '<path d="M55 104 H141 V143 H55 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь колёса.', '<circle cx="75" cy="151" r="9" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="125" cy="151" r="9" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 3 — сверху поставь зонтик.', '<path d="M98 104 V62 M52 79 Q98 39 144 79 Q125 92 99 79 Q74 92 52 79 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
    step('Шаг 4 — нарисуй два рожка мороженого без надписей.', '<path d="M70 118 L83 139 L96 118 Z M109 118 L122 139 L135 118 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><circle cx="83" cy="112" r="7" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="122" cy="112" r="7" fill="none" stroke="currentColor" stroke-width="3"/>'),
    step('Шаг 5 — добавь дорожку под тележкой.', '<path d="M42 167 Q100 179 158 167" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
  ], `${bg('#fff7ed')}<path d="M55 104 H141 V143 H55 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="4"/><circle cx="75" cy="151" r="9" fill="#334155"/><circle cx="125" cy="151" r="9" fill="#334155"/><path d="M98 104 V62" fill="none" stroke="#92400e" stroke-width="4"/><path d="M52 79 Q98 39 144 79 Q125 92 99 79 Q74 92 52 79 Z" fill="#f9a8d4" stroke="#be185d" stroke-width="3"/><path d="M70 118 L83 139 L96 118 Z M109 118 L122 139 L135 118 Z" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><circle cx="83" cy="112" r="7" fill="#fde047"/><circle cx="122" cy="112" r="7" fill="#fb7185"/><path d="M42 167 Q100 179 158 167" fill="none" stroke="#22c55e" stroke-width="4"/>`, 2, 'Не добавляй текст на тележку — рисунок должен читаться по форме.'),
  story('fw57-d05-05-picnic-basket', 'Корзинка для пикника', 505, '🧺', [
    step('Шаг 1 — нарисуй корзинку.', '<path d="M62 110 H138 Q134 160 72 160 Q66 139 62 110 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>'),
    step('Шаг 2 — добавь ручку.', '<path d="M73 110 Q100 70 127 110" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — положи яблоко и хлеб.', '<circle cx="88" cy="103" r="10" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M108 101 Q126 89 137 107 Q126 118 109 113 Q104 108 108 101 Z" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 4 — добавь плетение корзинки.', '<path d="M70 125 H132 M73 142 H128 M84 111 V158 M105 111 V160 M124 112 V154" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>'),
    step('Шаг 5 — постели коврик под корзинкой.', '<path d="M43 169 Q100 151 157 169 Q139 185 62 185 Q50 179 43 169 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
  ], `${bg('#f0fdf4')}<path d="M62 110 H138 Q134 160 72 160 Q66 139 62 110 Z" fill="#fed7aa" stroke="#92400e" stroke-width="4"/><path d="M73 110 Q100 70 127 110" fill="none" stroke="#92400e" stroke-width="4"/><circle cx="88" cy="103" r="10" fill="#ef4444" stroke="#991b1b" stroke-width="3"/><path d="M108 101 Q126 89 137 107 Q126 118 109 113 Q104 108 108 101 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="3"/><path d="M70 125 H132 M73 142 H128 M84 111 V158 M105 111 V160 M124 112 V154" fill="none" stroke="#92400e" stroke-width="2.5"/><path d="M43 169 Q100 151 157 169 Q139 185 62 185 Q50 179 43 169 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/>`, 2, 'Корзинка — часть будущей прогулки: добавь коврик или траву.'),
  story('fw57-d05-06-playground', 'Качели во дворе', 506, '🛝', [
    step('Шаг 1 — нарисуй две стойки качелей.', '<path d="M58 160 L92 65 L126 160 M142 160 L108 65 L74 160" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 2 — сверху добавь перекладину.', '<path d="M86 65 H114" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — опусти две верёвки.', '<path d="M94 69 V125 M110 69 V125" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    step('Шаг 4 — нарисуй сиденье.', '<path d="M84 127 H120" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь землю и маленький мяч сбоку.', '<path d="M42 166 Q100 178 158 166" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="147" r="9" fill="none" stroke="currentColor" stroke-width="3"/>'),
  ], `${bg('#f8fafc')}<path d="M58 160 L92 65 L126 160 M142 160 L108 65 L74 160" fill="none" stroke="#92400e" stroke-width="4"/><path d="M86 65 H114" fill="none" stroke="#92400e" stroke-width="4"/><path d="M94 69 V125 M110 69 V125" fill="none" stroke="#64748b" stroke-width="3"/><path d="M84 127 H120" fill="none" stroke="#fb923c" stroke-width="5"/><path d="M42 166 Q100 178 158 166" fill="none" stroke="#22c55e" stroke-width="4"/><circle cx="150" cy="147" r="9" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/>`, 2, 'Покажи, что качели стоят на земле, а не висят в пустоте.'),
  story('fw57-d05-07-park-tree', 'Дерево с лавочкой', 507, '🌳', [
    step('Шаг 1 — нарисуй дерево справа: ствол и крону.', '<path d="M130 164 V104 H145 V164" fill="none" stroke="currentColor" stroke-width="4"/><path d="M104 84 Q108 58 133 62 Q145 41 166 63 Q188 65 190 91 Q177 116 151 111 Q128 126 111 108 Q94 108 104 84 Z" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 2 — слева поставь лавочку.', '<path d="M42 124 H102 M47 102 H97 M50 124 V152 M94 124 V152" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 3 — добавь яблочко или листик на дерево.', '<circle cx="151" cy="87" r="5" fill="currentColor"/><circle cx="130" cy="96" r="4" fill="currentColor"/>'),
    step('Шаг 4 — под лавочкой нарисуй дорожку.', '<path d="M30 164 Q82 176 135 164" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    step('Шаг 5 — добавь облачко в свободном углу.', '<path d="M37 58 Q45 47 58 57 Q69 43 82 57 Q94 59 96 70 H37 Q28 68 37 58 Z" fill="none" stroke="currentColor" stroke-width="3"/>'),
  ], `${bg('#eff6ff')}<path d="M130 164 V104 H145 V164" fill="#92400e"/><path d="M104 84 Q108 58 133 62 Q145 41 166 63 Q188 65 190 91 Q177 116 151 111 Q128 126 111 108 Q94 108 104 84 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M42 124 H102 M47 102 H97 M50 124 V152 M94 124 V152" fill="none" stroke="#92400e" stroke-width="4"/><circle cx="151" cy="87" r="5" fill="#ef4444"/><circle cx="130" cy="96" r="4" fill="#ef4444"/><path d="M30 164 Q82 176 135 164" fill="none" stroke="#d97706" stroke-width="4"/><path d="M37 58 Q45 47 58 57 Q69 43 82 57 Q94 59 96 70 H37 Q28 68 37 58 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>`, 2, 'Дерево и лавочка стоят отдельно, между ними есть воздух.'),
  wideLesson('fw57-d05-08-park-picnic', 'Пикник в парке', 'Неделя 1 · Первая история', 'Композиция', 508, '🧺', [
    step('Шаг 1 — нарисуй лужайку и коврик.', '<path d="M15 160 Q88 145 150 160 Q220 175 285 156" fill="none" stroke="currentColor" stroke-width="5"/><path d="M95 137 Q150 116 205 137 Q190 166 112 166 Q101 154 95 137 Z" fill="none" stroke="currentColor" stroke-width="4"/>'),
    step('Шаг 2 — поставь корзинку на коврик.', '<path d="M132 119 H168 Q165 143 137 143 Q132 132 132 119 Z M138 119 Q150 104 164 119" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/>'),
    step('Шаг 3 — слева добавь ребёнка, сидящего рядом.', '<circle cx="73" cy="102" r="13" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M60 118 Q75 108 91 118 L96 143 Q73 151 53 143 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 4 — справа нарисуй маленькую собаку.', '<ellipse cx="226" cy="139" rx="24" ry="14" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="209" cy="125" r="11" fill="none" stroke="currentColor" stroke-width="3"/><path d="M199 119 Q187 124 198 134" fill="none" stroke="currentColor" stroke-width="2.8"/>'),
    step('Шаг 5 — добавь яблоки и чашку на коврике.', '<circle cx="143" cy="132" r="5" fill="currentColor"/><circle cx="158" cy="132" r="5" fill="currentColor"/><path d="M176 129 H190 Q188 141 179 143 Q176 138 176 129 Z" fill="none" stroke="currentColor" stroke-width="2.8"/>'),
    step('Шаг 6 — заверши парк деревом и облаком вдалеке.', '<path d="M252 156 V118 H263 V156" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="258" cy="104" r="22" fill="none" stroke="currentColor" stroke-width="3"/><path d="M121 55 Q130 43 143 53 Q154 39 168 53 Q180 55 182 67 H121 Q112 65 121 55 Z" fill="none" stroke="currentColor" stroke-width="3"/>'),
  ], `${wideBg('#eff6ff')}<path d="M15 160 Q88 145 150 160 Q220 175 285 156 L300 210 H0 L0 180 Q7 168 15 160 Z" fill="#bbf7d0"/><path d="M95 137 Q150 116 205 137 Q190 166 112 166 Q101 154 95 137 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/><path d="M132 119 H168 Q165 143 137 143 Q132 132 132 119 Z M138 119 Q150 104 164 119" fill="#fed7aa" stroke="#92400e" stroke-width="3"/><circle cx="73" cy="102" r="13" fill="#fde68a" stroke="#92400e" stroke-width="3"/><path d="M60 118 Q75 108 91 118 L96 143 Q73 151 53 143 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><ellipse cx="226" cy="139" rx="24" ry="14" fill="#d6a36a" stroke="#334155" stroke-width="3"/><circle cx="209" cy="125" r="11" fill="#fde68a" stroke="#334155" stroke-width="3"/><circle cx="143" cy="132" r="5" fill="#ef4444"/><circle cx="158" cy="132" r="5" fill="#ef4444"/><path d="M176 129 H190 Q188 141 179 143 Q176 138 176 129 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="2.5"/><path d="M252 156 V118 H263 V156" fill="#92400e"/><circle cx="258" cy="104" r="22" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M121 55 Q130 43 143 53 Q154 39 168 53 Q180 55 182 67 H121 Q112 65 121 55 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>`, ['#bbf7d0', '#fbcfe8', '#93c5fd'], 'Собери сцену: ребёнок, собака, корзинка и парк.'),
  wideLesson('fw57-d05-09-park-evening', 'Вечерняя прогулка', 'Неделя 1 · Первая история', 'Композиция', 509, '🌙', [
    step('Шаг 1 — нарисуй дорожку, уходящую вдаль.', '<path d="M101 207 Q118 164 135 132 M185 207 Q170 164 154 132" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — слева поставь фонарь.', '<path d="M67 163 V82 M55 82 H80 M61 68 H75 L81 82 H55 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 3 — справа нарисуй дерево.', '<path d="M220 166 V118 H233 V166" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M194 101 Q198 77 221 80 Q232 61 251 81 Q272 84 274 107 Q260 126 237 121 Q216 135 200 118 Q184 117 194 101 Z" fill="none" stroke="currentColor" stroke-width="3.5"/>'),
    step('Шаг 4 — в центре добавь маленького героя в куртке.', '<circle cx="145" cy="118" r="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M132 131 Q145 123 158 131 L163 158 Q145 166 127 158 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/>'),
    step('Шаг 5 — сверху нарисуй месяц и несколько звёзд.', '<path d="M91 48 Q112 56 95 76 Q78 66 91 48 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M184 51 L188 60 L198 61 L190 67 L193 77 L184 71 L176 77 L179 67 L171 61 L181 60 Z" fill="none" stroke="currentColor" stroke-width="2.5"/>'),
    step('Шаг 6 — добавь свет от фонаря и пару листьев на дорожке.', '<path d="M68 86 Q47 116 57 152 M68 86 Q92 116 82 152" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="135" cy="170" r="3" fill="currentColor"/><circle cx="158" cy="185" r="3" fill="currentColor"/>'),
  ], `${wideBg('#eef2ff')}<path d="M0 160 Q80 146 150 160 Q220 174 300 154 L300 210 H0 Z" fill="#bbf7d0"/><path d="M101 207 Q118 164 135 132 M185 207 Q170 164 154 132" fill="none" stroke="#d97706" stroke-width="5"/><path d="M67 163 V82 M55 82 H80 M61 68 H75 L81 82 H55 Z" fill="none" stroke="#334155" stroke-width="3"/><path d="M61 68 H75 L81 82 H55 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="2.5"/><path d="M220 166 V118 H233 V166" fill="#92400e"/><path d="M194 101 Q198 77 221 80 Q232 61 251 81 Q272 84 274 107 Q260 126 237 121 Q216 135 200 118 Q184 117 194 101 Z" fill="#86efac" stroke="#16a34a" stroke-width="3"/><circle cx="145" cy="118" r="10" fill="#fde68a" stroke="#92400e" stroke-width="2.5"/><path d="M132 131 Q145 123 158 131 L163 158 Q145 166 127 158 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><path d="M91 48 Q112 56 95 76 Q78 66 91 48 Z" fill="#fde68a" stroke="#ca8a04" stroke-width="2.5"/><path d="M184 51 L188 60 L198 61 L190 67 L193 77 L184 71 L176 77 L179 67 L171 61 L181 60 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/><path d="M68 86 Q47 116 57 152 M68 86 Q92 116 82 152" fill="none" stroke="#fde68a" stroke-width="2.8"/><circle cx="135" cy="170" r="3" fill="#fb923c"/><circle cx="158" cy="185" r="3" fill="#fb923c"/>`, ['#eef2ff', '#fde68a', '#93c5fd'], 'Это уже настроение: вечер, фонарь, герой и дорожка.'),
  wideLesson('fw57-d05-10-week-picture', 'Моя работа недели', 'Неделя 1 · Первая история', 'Композиция', 510, '🖼️', [
    step('Шаг 1 — нарисуй широкую землю и место для главного героя.', '<path d="M15 164 Q88 149 150 164 Q222 178 286 156" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'),
    step('Шаг 2 — выбери героя: нарисуй ребёнка в центре.', '<circle cx="150" cy="95" r="15" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M132 113 Q150 102 168 113 L174 150 Q150 161 126 150 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'),
    step('Шаг 3 — слева добавь зверька из первого дня.', '<ellipse cx="76" cy="139" rx="25" ry="15" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="58" cy="122" r="12" fill="none" stroke="currentColor" stroke-width="3"/><path d="M49 113 L42 100 L60 108 M67 113 L77 101 L75 119" fill="none" stroke="currentColor" stroke-width="2.8"/>'),
    step('Шаг 4 — справа добавь дерево или цветок из садового дня.', '<path d="M228 160 V120 H238 V160" fill="none" stroke="currentColor" stroke-width="3.2"/><circle cx="233" cy="105" r="24" fill="none" stroke="currentColor" stroke-width="3.2"/>'),
    step('Шаг 5 — сверху добавь шарик или воздушного змея из дня движения.', '<path d="M188 45 Q207 51 205 72 Q199 91 181 82 Q169 68 178 51 Q182 46 188 45 Z" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M184 82 Q177 104 166 119" fill="none" stroke="currentColor" stroke-width="2.8"/>'),
    step('Шаг 6 — заверши работу: облако, дорожка и маленькая личная деталь.', '<path d="M55 52 Q63 41 76 51 Q87 37 100 51 Q112 53 114 65 H55 Q46 63 55 52 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M134 164 Q151 187 169 208 M157 164 Q186 185 214 205" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="112" cy="151" r="4" fill="currentColor"/>'),
  ], `${wideBg('#eff6ff')}<path d="M15 164 Q88 149 150 164 Q222 178 286 156 L300 210 H0 L0 180 Q7 170 15 164 Z" fill="#bbf7d0"/><circle cx="150" cy="95" r="15" fill="#fde68a" stroke="#92400e" stroke-width="3"/><path d="M132 113 Q150 102 168 113 L174 150 Q150 161 126 150 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/><ellipse cx="76" cy="139" rx="25" ry="15" fill="#fbbf24" stroke="#334155" stroke-width="3"/><circle cx="58" cy="122" r="12" fill="#fed7aa" stroke="#334155" stroke-width="2.5"/><path d="M228 160 V120 H238 V160" fill="#92400e"/><circle cx="233" cy="105" r="24" fill="#86efac" stroke="#16a34a" stroke-width="3"/><path d="M188 45 Q207 51 205 72 Q199 91 181 82 Q169 68 178 51 Q182 46 188 45 Z" fill="#fb7185" stroke="#be123c" stroke-width="3"/><path d="M184 82 Q177 104 166 119" fill="none" stroke="#334155" stroke-width="2.8"/><path d="M55 52 Q63 41 76 51 Q87 37 100 51 Q112 53 114 65 H55 Q46 63 55 52 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/><path d="M134 164 Q151 187 169 208 M157 164 Q186 185 214 205" fill="none" stroke="#d97706" stroke-width="3.5"/><circle cx="112" cy="151" r="4" fill="#facc15"/>`, ['#bbf7d0', '#93c5fd', '#fb7185'], 'Финал недели: ребёнок выбирает любимые элементы и собирает свою первую законченную работу.')
);

export const fiveSevenWeek1Lessons = [...day1, ...day2, ...day3, ...day4, ...day5];

export const fiveSevenWeek1Guides = {
  'Неделя 1 · Живые зверята': {
    why: 'Начинаем с живых персонажей: ребёнок учится собирать зверька из крупных форм, но каждый герой отличается ушами, позой и деталью.',
    hand: 'Вторая рука пока только помогает: можно поставить точку, травинку или пятнышко. Главная цель — не ровность, а смелость.',
    parent: 'Спрашивайте: “Как зовут зверька?” Так рисунок становится личной работой, а не копией с экрана.',
  },
  'Неделя 1 · Дом и уют': {
    why: 'После зверят переходим к предметам дома: ребёнок видит, как простая форма превращается в понятный объект с местом.',
    hand: 'Мелкую деталь — точку, узор, лучик света — можно доверить второй руке.',
    parent: 'Хвалите за то, что предмет стоит на листе и читается: у окна есть подоконник, у чашки блюдце, у комнаты пол.',
  },
  'Неделя 1 · Сад и природа': {
    why: 'Природа учит неровной живой линии: листья, крона, трава и облака не обязаны быть симметричными.',
    hand: 'Вторая рука хорошо подходит для травинок, капель, ягод и маленьких листьев.',
    parent: 'Отмечайте наблюдательность: “Ты сделал лист с прожилками”, “Гриб стоит на земле”, “Облако не закрывает цветок”.',
  },
  'Неделя 1 · Движение и транспорт': {
    why: 'Добавляем движение без повторов: самокат, лодка, шар, мост, трамвай и карта путешествия дают разные формы и разные ситуации.',
    hand: 'Короткие штрихи ветра, волны и точки маршрута можно добавить второй рукой.',
    parent: 'Смотрите не на точность техники, а на действие: едет, плывёт, летит, ведёт по маршруту.',
  },
  'Неделя 1 · Первая история': {
    why: 'В конце недели ребёнок собирает несколько объектов в сцену: герой, место, настроение и личная деталь.',
    hand: 'Вторая рука может добавить листочки, звёзды, свет фонаря или маленький знак автора.',
    parent: 'Это первый заметный итог недели. Попросите ребёнка рассказать, что происходит на рисунке, и сфотографируйте работу для галереи.',
  },
};

export function applyFiveSevenWeek1(drawingLessons, drawingChapterGuides) {
  for (const [chapter, guide] of Object.entries(fiveSevenWeek1Guides)) {
    drawingChapterGuides[chapter] = guide;
  }

  drawingLessons.splice(
    0,
    drawingLessons.length,
    ...drawingLessons.filter((lessonItem) => lessonItem.ageBand !== '5-7'),
    ...fiveSevenWeek1Lessons
  );
}
