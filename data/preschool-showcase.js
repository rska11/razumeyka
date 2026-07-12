const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
const layers = [
  `<path d="M15 188 H285 M18 25 H282 V188" ${S} stroke-width="5"/><path d="M24 36 Q150 8 276 36 M43 31 L54 49 L65 27 M98 23 L109 42 L120 20 M151 18 L162 38 L173 19 M207 22 L218 42 L229 25 M254 30 L265 48 L276 35" ${S} stroke-width="3.5"/>`,
  `<rect x="28" y="60" width="70" height="76" rx="7" ${S} stroke-width="5"/><path d="M39 124 L57 103 L75 122 M70 89 Q80 75 90 89" ${S} stroke-width="3"/><rect x="111" y="43" width="82" height="92" rx="7" ${S} stroke-width="6"/><path d="M124 119 Q151 76 179 119 M139 119 Q151 99 164 119" ${S} stroke-width="3.5"/><circle cx="231" cy="96" r="36" ${S} stroke-width="5"/><path d="M216 105 Q231 79 246 105 Q238 121 231 120 Q224 120 216 105 Z" ${S} stroke-width="3"/>`,
  `<circle cx="151" cy="153" r="18" ${S} stroke-width="4"/><path d="M134 174 Q151 165 169 175 L177 205 H126 Z" ${S} stroke-width="5"/><path d="M136 181 Q118 188 109 201 M168 181 Q186 188 194 201" ${S} stroke-width="5"/><path d="M131 139 Q137 116 156 120 Q174 126 171 151" ${S} stroke-width="4"/><circle cx="145" cy="152" r="2.5" fill="currentColor"/><circle cx="157" cy="152" r="2.5" fill="currentColor"/><path d="M145 161 Q151 166 158 161" ${S} stroke-width="2.5"/>`,
  `<path d="M199 201 L215 139 L267 139 L280 201 M221 151 H264 V188 H221 Z" ${S} stroke-width="5"/><path d="M230 178 L243 161 L255 178 M213 197 H285" ${S} stroke-width="3.5"/><path d="M178 177 L235 112" ${S} stroke-width="5"/><path d="M232 108 L245 97 L242 115 Z" ${S} stroke-width="3"/>`,
  `<path d="M43 201 Q49 181 57 201 M84 201 Q91 181 99 201 M249 202 Q256 182 264 202" ${S} stroke-width="3.5"/><circle cx="48" cy="166" r="5" fill="currentColor"/><circle cx="265" cy="165" r="5" fill="currentColor"/><path d="M70 156 Q79 144 88 156 V176 M244 50 Q253 38 262 50 V70" ${S} stroke-width="3.5"/>`,
  `<path d="M22 148 H105 M201 148 H280" ${S} stroke-width="4"/><path d="M35 148 L47 136 L59 148 M70 148 L82 136 L94 148 M213 148 L225 136 L237 148 M248 148 L260 136 L272 148" ${S} stroke-width="3"/>`,
  `<path d="M150 27 L158 45 L178 47 L163 60 L168 80 L150 69 L132 80 L137 60 L122 47 L142 45 Z" ${S} stroke-width="4"/><path d="M24 207 H282" ${S} stroke-width="3"/>`,
];
function paint(svg, color) { return svg.replaceAll('currentColor', color).replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".3"').replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".26"'); }
const palette = ['#a78bfa','#60a5fa','#fb7185','#facc15','#22c55e','#f97316','#fde68a'];
export const showcaseFinalLesson = {
  title: 'Я открываю свою выставку', skill: 'итоговая авторская презентация: галерея, художник, мольберт и рассказ о своей работе', cover: { emoji: '🎨', theme: 'purple' },
  viewBox: '0 0 300 210', coloredViewBox: '0 0 300 210', canvas: 'landscape', palette,
  intro: 'Сегодня не нужно снова рисовать домик или повторять старую тему. Ты открываешь собственную выставку: оформляешь галерею, становишься рядом как художник и показываешь гостям главную работу на мольберте.',
  steps: layers.map((layer, index) => ({ hint: ['Шаг 1 — подготовь стену галереи и праздничную гирлянду.','Шаг 2 — повесь три разные работы в разных рамах.','Шаг 3 — нарисуй себя в центре как автора выставки.','Шаг 4 — поставь рядом мольберт с главной картиной и кистью.','Шаг 5 — добавь цветы, свет и музыкальные ноты для праздника.','Шаг 6 — обозначь место для гостей и маленькие флажки.','Шаг 7 — зажги над художником золотую звезду финала.'][index], layer })),
  storyStageLabel: 'Открытие выставки', storyPrompt: 'Раскрась галерею, выбери главную картину и представь её гостям: назови работу и расскажи, что тебе особенно понравилось рисовать за весь курс.',
  storyMissions: ['Выбери главную картину','Раскрась художника и галерею','Расскажи о своей работе'], colorHint: 'Стену оставь спокойной, рамы сделай разными, одежду художника выдели любимым цветом, а золотую звезду сохрани самым ярким акцентом.',
  finishIdea: 'Финал показывает настоящий результат: ребёнок не копирует очередной объект, а оформляет работы, выбирает главную и выступает как автор.',
  parentNote: 'Устройте короткое открытие выставки дома. Пусть ребёнок выберет 2–3 работы, даст им названия и услышит конкретную похвалу за прогресс, смелость и собственные решения.',
  coloredPreview: '<path d="M0 0 H300 V210 H0 Z" fill="#fffaf0"/>' + layers.map((layer, index) => paint(layer, palette[index])).join(''),
};
