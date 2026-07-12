// День 10 — десять самостоятельных праздничных работ.
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const drawings = {
  'preschool-m1-d10-01': ['Воздушный шарик', [
    `<path d="M101 39 Q137 39 143 77 Q148 112 119 132 Q109 139 101 149 Q93 139 82 132 Q53 112 59 77 Q65 39 101 39 Z" ${S} stroke-width="5"/>`,
    `<path d="M94 148 L101 157 L108 148 Z" ${S} stroke-width="4"/>` ,
    `<path d="M101 157 Q86 171 100 185" ${S} stroke-width="3"/>`,
    '<circle cx="88" cy="78" r="4" fill="currentColor"/><circle cx="114" cy="78" r="4" fill="currentColor"/>',
    `<path d="M88 96 Q101 108 115 96 M48 188 Q101 179 154 188" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d10-02': ['Свечка горит', [
    `<path d="M76 82 H126 V159 Q101 169 76 159 Z" ${S} stroke-width="5"/>`,
    `<path d="M76 105 Q88 96 101 105 Q113 114 126 104" ${S} stroke-width="4"/>` ,
    `<path d="M101 81 V64" ${S} stroke-width="4"/>` ,
    `<path d="M101 65 Q82 47 101 25 Q122 47 101 65 Z" ${S} stroke-width="5"/>`,
    `<path d="M56 166 Q101 181 146 166 M45 183 H157" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d10-03': ['Конфетка в фантике', [
    `<path d="M68 75 Q101 57 134 75 V130 Q101 149 68 130 Z" ${S} stroke-width="5"/>`,
    `<path d="M68 81 L42 62 L49 91 L38 111 L68 123" ${S} stroke-width="4"/>` ,
    `<path d="M134 81 L160 62 L153 91 L164 111 L134 123" ${S} stroke-width="4"/>` ,
    `<path d="M79 77 Q101 101 123 77 M79 129 Q101 105 123 129" ${S} stroke-width="3"/>`,
    `<path d="M45 162 Q101 153 158 162" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d10-04': ['Подарок с большим бантом', [
    `<path d="M52 91 H151 V163 H52 Z" ${S} stroke-width="5"/>`,
    `<path d="M48 82 H155 V108 H48 Z" ${S} stroke-width="5"/>`,
    `<path d="M102 82 V163" ${S} stroke-width="4"/>` ,
    `<path d="M102 82 Q76 45 58 66 Q74 84 102 82 M102 82 Q128 45 146 66 Q130 84 102 82" ${S} stroke-width="5"/>`,
    `<path d="M42 174 Q102 165 162 174" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d10-05': ['Праздничный колпачок', [
    `<path d="M101 35 L52 145 H151 Z" ${S} stroke-width="5"/>`,
    `<path d="M62 122 Q101 140 141 122" ${S} stroke-width="4"/>` ,
    `<circle cx="101" cy="31" r="10" ${S} stroke-width="4"/>` ,
    `<circle cx="86" cy="91" r="5" ${S} stroke-width="4"/><circle cx="119" cy="105" r="5" ${S} stroke-width="4"/><path d="M96 59 L102 72 L116 73 L105 82 L109 96 L96 88 L84 96 L88 82 L77 73 L91 72 Z" ${S} stroke-width="3"/>`,
    `<path d="M43 160 Q101 151 159 160" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d10-06': ['Кекс со свечкой', [
    `<path d="M61 104 Q64 77 85 78 Q101 59 117 78 Q139 77 142 104 Q132 119 102 119 Q72 119 61 104 Z" ${S} stroke-width="5"/>`,
    `<path d="M69 117 H135 L127 169 H78 Z" ${S} stroke-width="5"/>`,
    `<path d="M87 121 L91 165 M111 121 L109 166" ${S} stroke-width="3"/>`,
    `<path d="M101 78 V53 M101 54 Q88 42 101 27 Q115 43 101 54 Z" ${S} stroke-width="4"/>` ,
    `<circle cx="84" cy="98" r="4" fill="currentColor"/><circle cx="119" cy="98" r="4" fill="currentColor"/><path d="M48 177 Q101 169 154 177" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d10-07': ['Гирлянда', [
    `<path d="M24 62 Q101 119 178 62" ${S} stroke-width="5"/>`,
    `<path d="M43 74 L51 105 L68 86 Z M75 92 L89 122 L101 99 Z" ${S} stroke-width="4"/>` ,
    `<path d="M111 99 L124 122 L138 91 Z M145 81 L161 105 L168 72 Z" ${S} stroke-width="4"/>` ,
    `<circle cx="51" cy="105" r="4" fill="currentColor"/><circle cx="89" cy="122" r="4" fill="currentColor"/><circle cx="124" cy="122" r="4" fill="currentColor"/><circle cx="161" cy="105" r="4" fill="currentColor"/>`,
    `<path d="M38 158 Q102 149 166 158 M56 153 Q62 137 68 153 M140 153 Q146 137 152 153" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d10-08': ['Подарок и шарик', [
    `<path d="M39 120 H118 V176 H39 Z M34 108 H123 V130 H34 Z M79 108 V176" ${S} stroke-width="5"/>`,
    `<path d="M79 108 Q58 78 42 96 Q56 111 79 108 M79 108 Q101 78 117 96 Q102 111 79 108" ${S} stroke-width="4"/>` ,
    `<path d="M188 44 Q220 43 226 76 Q231 108 205 125 Q197 132 190 141 Q183 132 174 125 Q149 108 154 76 Q159 45 188 44 Z" ${S} stroke-width="5"/>`,
    `<path d="M190 140 Q176 156 190 178" ${S} stroke-width="3"/>`,
    `<path d="M18 183 Q117 172 237 183" ${S} stroke-width="4"/><circle cx="264" cy="47" r="17" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d10-09': ['Открытка семье', [
    `<path d="M38 42 H225 V174 H38 Z" ${S} stroke-width="5"/>`,
    `<path d="M131 42 V174" ${S} stroke-width="4"/>` ,
    `<path d="M83 91 Q68 72 53 85 Q51 105 83 126 Q115 105 113 85 Q98 72 83 91 Z" ${S} stroke-width="4"/>` ,
    `<path d="M157 82 Q158 62 176 59 Q196 62 196 83 Q193 102 177 106 Q159 102 157 82 Z M158 111 Q177 102 196 112 Q207 135 202 160 H151 Q147 135 158 111 Z" ${S} stroke-width="4"/>` ,
    `<circle cx="171" cy="82" r="3" fill="currentColor"/><circle cx="184" cy="82" r="3" fill="currentColor"/><path d="M170 93 Q177 99 185 93 M24 184 H240" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d10-10': ['Праздничный стол', [
    `<path d="M24 119 H277 M42 119 V184 M260 119 V184" ${S} stroke-width="6"/>`,
    `<path d="M101 83 Q105 61 123 62 Q137 47 151 62 Q170 61 174 83 Q165 97 137 97 Q110 97 101 83 Z M108 96 H168 L162 119 H115 Z" ${S} stroke-width="4"/>` ,
    `<path d="M137 62 V40 M137 41 Q126 30 137 18 Q150 31 137 41 Z" ${S} stroke-width="4"/>` ,
    `<path d="M55 87 H87 V118 H55 Z M190 84 H232 V118 H190 Z M211 84 V118 M187 95 H235" ${S} stroke-width="4"/>` ,
    `<path d="M23 184 Q141 171 281 184 M35 57 Q56 41 76 56 M204 53 Q227 36 248 52" ${S} stroke-width="4"/><circle cx="267" cy="37" r="4" fill="currentColor"/>`,
  ]],
};

function preview(layers, palette, wide) {
  return `<path d="M0 0 H${wide ? 300 : 200} V${wide ? 210 : 200} H0 Z" fill="#fff7ed"/>` + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join('');
}

export const authoredPremiumDay10Lessons = {};
export function applyPremiumDay10Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const number = Number(slug.slice(-2));
    const wide = number >= 8;
    const palette = ['#fb7185', '#a855f7', '#facc15', '#60a5fa'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: `Сегодня ты нарисуешь «${title.toLowerCase()}». Праздничная работа будет яркой, но в ней останется воздух между предметами.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${['нарисуй главную праздничную форму','добавь конструкцию и объём','покажи особенную деталь','добавь украшение или второй предмет','поставь работу в праздничное место'][index]}.`, layer })),
      storyStageLabel: wide ? 'Праздничная сцена' : 'Праздник',
      storyPrompt: 'Раскрась работу, выбери, для кого этот праздник, и добавь одну свою маленькую деталь.',
      storyMissions: ['Раскрась главный предмет', 'Добавь украшение', 'Назови, кого поздравляют'],
      colorHint: 'Используй розовый, фиолетовый, жёлтый и один спокойный цвет. Не обязательно раскрашивать всё одинаково ярко.',
      finishIdea: 'Праздничный предмет или сцена узнаётся по форме, деталям и свободной композиции.',
      parentNote: 'Спросите, кого ребёнок поздравляет и что лежит на праздничном столе. Похвалите выбор цветов и историю.',
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay10Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
