// День 9 — авторский космос: каждый урок строится из своей формы и композиции.
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const drawings = {
  'preschool-m1-d09-01': ['Сияющая звёздочка', [
    `<path d="M101 38 L116 77 L158 79 L125 105 L136 147 L101 123 L66 147 L77 105 L44 79 L86 77 Z" ${S} stroke-width="5"/>`,
    `<path d="M101 25 V13 M101 171 V158 M31 93 H18 M184 93 H171" ${S} stroke-width="4"/>` ,
    `<path d="M50 43 L40 33 M152 43 L163 32 M49 145 L38 156 M153 145 L164 156" ${S} stroke-width="4"/>` ,
    '<circle cx="90" cy="94" r="3.5" fill="currentColor"/><circle cx="112" cy="94" r="3.5" fill="currentColor"/>',
    `<path d="M91 106 Q101 114 112 106 M50 174 Q101 164 153 174" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d09-02': ['Луна-серп', [
    `<path d="M120 39 Q77 50 67 93 Q62 135 98 157 Q129 174 155 149 Q121 151 104 124 Q85 92 101 63 Q108 49 120 39 Z" ${S} stroke-width="5"/>`,
    `<path d="M103 62 Q91 89 106 119 Q121 143 151 148" ${S} stroke-width="3"/>`,
    '<circle cx="92" cy="99" r="3.5" fill="currentColor"/><path d="M98 112 Q108 119 117 111" '+S+' stroke-width="3"/>',
    `<path d="M48 60 L52 72 L65 74 L55 82 L58 95 L48 88 L38 95 L41 82 L31 74 L44 72 Z M155 67 L159 77 L170 78 L162 85 L164 96 L155 90 L146 96 L148 85 L140 78 L151 77 Z" ${S} stroke-width="3"/>`,
    `<path d="M48 176 Q104 166 159 176" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d09-03': ['Планета с материками', [
    `<path d="M101 43 Q138 43 154 76 Q170 111 146 140 Q122 169 86 158 Q49 148 44 111 Q39 75 68 54 Q83 43 101 43 Z" ${S} stroke-width="5"/>`,
    `<path d="M76 57 Q88 66 85 82 Q72 90 61 82 M126 52 Q141 63 136 78 Q124 82 118 70 M56 112 Q73 106 80 121 Q77 139 65 142 M109 99 Q128 89 142 105 Q139 124 122 126 Q110 116 109 99 Z" ${S} stroke-width="4"/>` ,
    `<path d="M25 120 Q94 81 176 72 Q190 71 181 84 Q110 128 28 135 Q14 134 25 120 Z" ${S} stroke-width="4"/>` ,
    '<circle cx="83" cy="104" r="3" fill="currentColor"/><circle cx="111" cy="88" r="3" fill="currentColor"/>',
    `<path d="M46 174 Q102 166 158 174" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d09-04': ['Ракета взлетает', [
    `<path d="M101 30 Q136 66 122 130 H80 Q67 66 101 30 Z" ${S} stroke-width="5"/>`,
    `<circle cx="101" cy="78" r="14" ${S} stroke-width="4"/>` ,
    `<path d="M80 111 L57 143 H82 M122 111 L145 143 H120" ${S} stroke-width="5"/>`,
    `<path d="M90 130 Q101 174 112 130 Q101 145 90 130 Z" ${S} stroke-width="5"/>`,
    `<circle cx="48" cy="62" r="4" fill="currentColor"/><circle cx="158" cy="76" r="3" fill="currentColor"/><path d="M42 173 Q101 164 161 173" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d09-05': ['Иллюминатор ракеты', [
    `<circle cx="101" cy="98" r="57" ${S} stroke-width="6"/>`,
    `<circle cx="101" cy="98" r="42" ${S} stroke-width="5"/>`,
    `<path d="M65 111 Q101 86 137 107 Q131 136 101 140 Q73 137 65 111 Z" ${S} stroke-width="4"/>` ,
    `<circle cx="112" cy="111" r="10" ${S} stroke-width="4"/><path d="M78 76 L82 87 L94 88 L85 96 L88 108 L78 101 L68 108 L71 96 L62 88 L74 87 Z" ${S} stroke-width="3"/>`,
    `<circle cx="101" cy="31" r="4" fill="currentColor"/><circle cx="101" cy="165" r="4" fill="currentColor"/><circle cx="34" cy="98" r="4" fill="currentColor"/><circle cx="168" cy="98" r="4" fill="currentColor"/>`,
  ]],
  'preschool-m1-d09-06': ['Комета летит', [
    `<path d="M120 64 Q147 57 161 78 Q174 101 158 122 Q142 143 117 134 Q92 125 91 99 Q91 75 120 64 Z" ${S} stroke-width="5"/>`,
    `<path d="M96 83 Q63 59 28 61 Q59 76 85 101 M94 105 Q58 93 27 108 Q62 109 96 123 M112 132 Q78 141 49 159 Q84 149 126 139" ${S} stroke-width="6"/>`,
    `<path d="M121 78 Q132 91 145 82 M112 112 Q127 102 139 116" ${S} stroke-width="4"/>` ,
    '<circle cx="123" cy="100" r="4" fill="currentColor"/><circle cx="146" cy="104" r="3" fill="currentColor"/>',
    `<path d="M41 176 Q107 165 169 176" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d09-07': ['Сатурн с кольцом', [
    `<path d="M101 54 Q139 54 151 88 Q163 122 136 146 Q108 169 76 151 Q44 133 51 96 Q58 60 101 54 Z" ${S} stroke-width="5"/>`,
    `<path d="M56 76 Q80 90 142 116 M58 128 Q102 117 145 79" ${S} stroke-width="3"/>`,
    `<path d="M25 111 Q54 78 105 74 Q158 70 180 89 Q195 105 172 122 Q143 145 91 143 Q42 142 23 126 Q13 118 25 111 Z" ${S} stroke-width="5"/>`,
    `<path d="M64 64 Q82 50 104 54 M136 145 Q119 158 97 159" ${S} stroke-width="3"/>`,
    '<circle cx="43" cy="49" r="4" fill="currentColor"/><circle cx="164" cy="157" r="3" fill="currentColor"/>',
  ]],
  'preschool-m1-d09-08': ['Ракета среди звёзд', [
    `<path d="M132 30 Q165 63 153 121 H112 Q99 63 132 30 Z M112 106 L89 135 H115 M153 106 L176 135 H151" ${S} stroke-width="5"/>`,
    `<circle cx="132" cy="72" r="13" ${S} stroke-width="4"/><path d="M121 121 Q132 165 143 121" ${S} stroke-width="5"/>`,
    `<path d="M45 48 L50 61 L64 62 L53 71 L57 85 L45 77 L34 85 L37 71 L27 62 L41 61 Z M225 75 L230 87 L243 88 L233 96 L236 109 L225 102 L214 109 L217 96 L207 88 L221 87 Z" ${S} stroke-width="3"/>`,
    `<path d="M43 140 Q65 127 83 142 M197 145 Q219 130 239 144" ${S} stroke-width="4"/>` ,
    `<path d="M16 180 Q131 166 282 180" ${S} stroke-width="4"/><circle cx="264" cy="43" r="18" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d09-09': ['Домик на маленькой планете', [
    `<path d="M23 160 Q92 111 167 139 Q217 157 278 128" ${S} stroke-width="6"/>`,
    `<path d="M76 139 L113 104 L151 139 M86 139 H141 V174 H86 Z M108 174 V151 H124 V174" ${S} stroke-width="5"/>`,
    `<path d="M189 143 Q194 116 209 143 M199 134 Q185 119 177 131 M202 132 Q219 115 228 130" ${S} stroke-width="4"/>` ,
    `<path d="M211 55 Q240 54 250 80 Q259 106 239 123 Q217 139 193 125 Q169 111 175 84 Q181 58 211 55 Z M164 92 Q211 67 262 77" ${S} stroke-width="4"/>` ,
    `<circle cx="41" cy="45" r="4" fill="currentColor"/><circle cx="88" cy="65" r="3" fill="currentColor"/><path d="M264 37 L268 48 L280 49 L271 56 L274 68 L264 61 L254 68 L257 56 L248 49 L260 48 Z" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d09-10': ['Космическое путешествие', [
    `<path d="M16 177 Q95 161 158 175 Q222 189 286 168" ${S} stroke-width="5"/>`,
    `<path d="M85 42 Q116 72 106 126 H68 Q57 72 85 42 Z M68 112 L48 139 H71 M106 112 L127 139 H103 M75 126 Q85 163 96 126" ${S} stroke-width="5"/>`,
    `<path d="M202 59 Q231 58 242 84 Q252 111 230 128 Q207 144 183 129 Q159 114 165 87 Q171 62 202 59 Z M154 97 Q202 72 254 84" ${S} stroke-width="4"/>` ,
    `<path d="M131 54 L136 67 L150 68 L139 77 L143 91 L131 83 L120 91 L123 77 L113 68 L127 67 Z M267 42 L271 52 L282 53 L274 60 L276 71 L267 65 L258 71 L260 60 L252 53 L263 52 Z" ${S} stroke-width="3"/>`,
    `<path d="M129 144 Q151 128 172 143 M238 151 Q259 135 278 149" ${S} stroke-width="4"/><circle cx="42" cy="64" r="4" fill="currentColor"/>`,
  ]],
};

function preview(layers, palette, wide) {
  return `<path d="M0 0 H${wide ? 300 : 200} V${wide ? 210 : 200} H0 Z" fill="#eef2ff"/>` + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join('');
}

export const authoredPremiumDay09Lessons = {};
export function applyPremiumDay09Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const number = Number(slug.slice(-2));
    const wide = number >= 8;
    const palette = ['#6366f1', '#facc15', '#38bdf8', '#fb7185'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: `Сегодня ты нарисуешь «${title.toLowerCase()}». Сначала строим большую космическую форму, потом добавляем только её особенные детали и место полёта.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${['нарисуй главную космическую форму','добавь важную конструкцию','покажи движение или поверхность','добавь звёзды и характер','собери космическое пространство'][index]}.`, layer })),
      storyStageLabel: wide ? 'Космическая история' : 'Космос',
      storyPrompt: 'Раскрась космос и придумай, куда летит ракета или что можно найти на этой планете.',
      storyMissions: ['Раскрась главный объект', 'Добавь далёкую звезду', 'Назови место путешествия'],
      colorHint: 'Возьми тёмный сине-фиолетовый для космоса, жёлтый для света и 1–2 ярких цвета для ракеты или планеты.',
      finishIdea: 'Каждая работа читается по силуэту: звезда, луна, планета, ракета, комета или целая космическая сцена.',
      parentNote: 'Спросите, куда ведёт путешествие и что герой увидит дальше. Хвалите фантазию и различия между небесными объектами.',
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay09Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
