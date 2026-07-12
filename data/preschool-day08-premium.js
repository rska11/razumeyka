// День 8 — десять явных портретов и героев. Ни одного тела-палки.
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const drawings = {
  'preschool-m1-d08-01': ['Весёлое лицо', [
    `<path d="M55 93 Q54 48 99 39 Q145 47 147 93 Q143 141 101 151 Q59 141 55 93 Z" ${S} stroke-width="5"/>`,
    `<path d="M58 75 Q74 39 104 42 Q132 43 145 76 Q126 60 105 64 Q80 59 58 75" ${S} stroke-width="5"/>`,
    '<circle cx="82" cy="91" r="4" fill="currentColor"/><circle cx="120" cy="91" r="4" fill="currentColor"/><circle cx="68" cy="113" r="5" fill="currentColor"/><circle cx="134" cy="113" r="5" fill="currentColor"/>',
    `<path d="M78 112 Q101 139 125 112 Q118 143 101 146 Q84 142 78 112 Z" ${S} stroke-width="4"/>` ,
    `<path d="M49 169 Q101 158 153 169" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d08-02': ['Грустное лицо', [
    `<path d="M56 92 Q57 48 101 40 Q145 48 146 92 Q142 139 101 150 Q60 139 56 92 Z" ${S} stroke-width="5"/>`,
    `<path d="M60 70 Q78 39 103 43 Q132 43 143 72 M61 69 Q76 74 87 62 M142 70 Q126 75 115 62" ${S} stroke-width="4"/>`,
    '<circle cx="83" cy="91" r="4" fill="currentColor"/><circle cx="119" cy="91" r="4" fill="currentColor"/>',
    `<path d="M82 128 Q101 109 121 128" ${S} stroke-width="4"/><path d="M126 99 Q137 113 126 124 Q115 114 126 99 Z" ${S} stroke-width="3"/>`,
    `<path d="M49 168 Q101 158 153 168" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d08-03': ['Большая улыбка', [
    `<path d="M54 92 Q54 46 100 37 Q147 46 148 92 Q144 143 101 154 Q57 143 54 92 Z" ${S} stroke-width="5"/>`,
    `<path d="M56 72 Q68 43 96 40 Q127 36 145 68 Q130 55 112 58 Q84 49 56 72" ${S} stroke-width="5"/>`,
    `<path d="M74 91 Q83 82 92 91 M111 91 Q120 82 129 91" ${S} stroke-width="4"/>` ,
    `<path d="M72 111 Q101 149 132 110 Q127 153 102 157 Q78 152 72 111 Z M82 122 Q101 130 122 121" ${S} stroke-width="4"/>` ,
    '<circle cx="66" cy="113" r="5" fill="currentColor"/><circle cx="137" cy="113" r="5" fill="currentColor"/>',
  ]],
  'preschool-m1-d08-04': ['Малыш машет рукой', [
    `<path d="M77 60 Q78 38 100 34 Q124 38 124 61 Q121 83 101 87 Q80 83 77 60 Z M78 52 Q91 32 112 39 Q122 43 124 54 Q108 47 96 51 Q86 54 78 52" ${S} stroke-width="4.5"/>`,
    `<path d="M82 91 Q101 82 120 92 Q130 113 126 140 Q102 149 76 140 Q73 113 82 91 Z" ${S} stroke-width="5"/>`,
    `<path d="M81 103 Q64 113 58 130 Q63 138 71 132 L85 118 M119 103 Q137 91 142 69 Q150 66 155 73 Q153 101 126 119" ${S} stroke-width="7"/><path d="M144 68 L140 54 M150 67 L151 52 M156 71 L163 59" ${S} stroke-width="3"/>`,
    `<path d="M88 142 Q83 157 82 174 M113 143 Q118 157 120 174 M76 176 H94 M112 176 H130" ${S} stroke-width="7"/>`,
    '<circle cx="92" cy="61" r="3" fill="currentColor"/><circle cx="111" cy="61" r="3" fill="currentColor"/><path d="M92 73 Q102 80 112 72 M43 184 H160" '+S+' stroke-width="4"/>',
  ]],
  'preschool-m1-d08-05': ['Девочка с шариком', [
    `<path d="M76 59 Q76 37 98 34 Q122 37 123 60 Q120 82 100 86 Q79 82 76 59 Z M78 50 Q88 32 108 37 Q122 41 124 55 M78 46 Q65 57 73 72 M121 46 Q135 57 127 73" ${S} stroke-width="4.5"/>`,
    `<path d="M84 90 Q100 83 116 91 L132 145 Q101 158 69 145 Z" ${S} stroke-width="5"/>`,
    `<path d="M83 103 Q64 112 59 132 M117 103 Q135 112 145 125" ${S} stroke-width="7"/><circle cx="58" cy="134" r="5" ${S} stroke-width="3"/>`,
    `<path d="M88 149 Q84 162 83 176 M113 149 Q118 162 119 176 M77 178 H94 M111 178 H129" ${S} stroke-width="7"/>`,
    `<circle cx="159" cy="85" r="20" ${S} stroke-width="4"/><path d="M145 125 Q159 106 159 105" ${S} stroke-width="3"/><circle cx="92" cy="60" r="3" fill="currentColor"/><circle cx="110" cy="60" r="3" fill="currentColor"/><path d="M91 72 Q101 79 111 72 M43 184 H178" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d08-06': ['Мальчик с цветком', [
    `<path d="M78 60 Q79 38 100 34 Q123 38 123 61 Q120 83 101 87 Q81 83 78 60 Z M80 51 Q94 32 116 43 Q122 47 123 55 Q105 47 80 51" ${S} stroke-width="4.5"/>`,
    `<path d="M81 92 Q100 83 120 93 Q129 115 126 141 Q102 150 77 141 Q73 115 81 92 Z" ${S} stroke-width="5"/>`,
    `<path d="M82 104 Q64 115 59 133 M119 104 Q136 113 144 129" ${S} stroke-width="7"/><circle cx="59" cy="135" r="5" ${S} stroke-width="3"/>`,
    `<path d="M88 143 Q83 159 82 175 M113 143 Q119 158 120 175 M76 177 H94 M112 177 H130" ${S} stroke-width="7"/>`,
    `<path d="M146 129 V165 M146 148 Q133 139 130 151 M146 146 Q159 137 164 150" ${S} stroke-width="4"/><circle cx="146" cy="122" r="8" ${S} stroke-width="4"/><circle cx="92" cy="61" r="3" fill="currentColor"/><circle cx="111" cy="61" r="3" fill="currentColor"/><path d="M92 73 Q102 80 112 72 M40 183 H171" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d08-07': ['Семья рядом', [
    `<path d="M50 72 Q51 51 69 48 Q89 51 89 72 Q86 91 70 94 Q53 91 50 72 Z M111 67 Q112 43 133 40 Q155 44 155 68 Q152 89 134 93 Q114 89 111 67 Z" ${S} stroke-width="4"/>` ,
    `<path d="M55 98 Q70 91 85 99 Q94 119 91 148 H48 Q45 120 55 98 Z M117 97 Q134 89 151 98 Q162 120 158 149 H108 Q105 120 117 97 Z" ${S} stroke-width="5"/>`,
    `<path d="M50 109 Q35 119 32 136 M88 109 Q99 120 108 126 M115 110 Q106 120 104 130 M154 109 Q169 119 173 135" ${S} stroke-width="6"/>`,
    `<path d="M60 149 V174 M80 149 V174 M121 150 V174 M148 150 V174" ${S} stroke-width="7"/>`,
    `<circle cx="64" cy="70" r="3" fill="currentColor"/><circle cx="77" cy="70" r="3" fill="currentColor"/><circle cx="127" cy="67" r="3" fill="currentColor"/><circle cx="141" cy="67" r="3" fill="currentColor"/><path d="M63 81 Q70 87 78 81 M126 79 Q134 85 142 79 M26 181 H179" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d08-08': ['Человек у домика', [
    `<path d="M22 126 L66 87 L111 126 M34 126 H101 V177 H34 Z M58 177 V149 H77 V177" ${S} stroke-width="5"/>`,
    `<path d="M151 74 Q152 54 170 51 Q190 54 190 75 Q187 94 171 98 Q153 94 151 74 Z M153 66 Q163 49 182 56 Q188 59 190 68" ${S} stroke-width="4"/>` ,
    `<path d="M155 102 Q171 95 187 103 Q197 124 193 151 Q172 159 149 151 Q146 125 155 102 Z" ${S} stroke-width="5"/>`,
    `<path d="M154 113 Q137 124 131 141 M188 113 Q204 122 211 139 M161 153 Q157 165 157 179 M183 153 Q188 165 188 179" ${S} stroke-width="7"/>`,
    `<path d="M15 183 Q119 171 236 183" ${S} stroke-width="4"/><circle cx="165" cy="75" r="3" fill="currentColor"/><circle cx="178" cy="75" r="3" fill="currentColor"/><path d="M165 86 Q172 91 179 85" ${S} stroke-width="3"/><circle cx="264" cy="45" r="17" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d08-09': ['Друг и подарок', [
    `<path d="M62 72 Q63 50 82 47 Q103 50 103 72 Q100 92 83 96 Q64 92 62 72 Z M164 72 Q165 50 184 47 Q205 50 205 72 Q202 92 185 96 Q166 92 164 72 Z" ${S} stroke-width="4"/>` ,
    `<path d="M66 101 Q83 94 99 102 Q110 125 105 154 H59 Q55 125 66 101 Z M168 101 Q185 94 201 102 Q212 125 207 154 H161 Q157 125 168 101 Z" ${S} stroke-width="5"/>`,
    `<path d="M65 113 Q50 124 45 141 M100 113 Q116 122 129 132 M168 113 Q151 123 137 132 M202 113 Q217 123 222 141" ${S} stroke-width="6"/>`,
    `<path d="M115 129 H153 V160 H115 Z M134 129 V160 M111 139 H157 M134 129 Q119 110 110 125 Q120 134 134 129 M134 129 Q149 110 158 125 Q148 134 134 129" ${S} stroke-width="4"/>` ,
    `<path d="M71 155 V180 M94 155 V180 M173 155 V180 M196 155 V180 M30 184 H236" ${S} stroke-width="6"/><circle cx="77" cy="72" r="3" fill="currentColor"/><circle cx="89" cy="72" r="3" fill="currentColor"/><circle cx="179" cy="72" r="3" fill="currentColor"/><circle cx="191" cy="72" r="3" fill="currentColor"/>`,
  ]],
  'preschool-m1-d08-10': ['Мой первый герой', [
    `<path d="M15 171 Q76 156 137 170 Q203 183 286 161" ${S} stroke-width="5"/>`,
    `<path d="M117 65 Q118 39 141 35 Q166 39 166 66 Q163 90 142 95 Q120 90 117 65 Z M119 56 Q132 34 154 40 Q164 44 166 58 Q148 48 136 52 Q127 55 119 56" ${S} stroke-width="5"/>`,
    `<path d="M123 100 Q142 91 161 101 Q174 126 169 157 Q145 167 116 157 Q112 126 123 100 Z" ${S} stroke-width="6"/>`,
    `<path d="M122 112 Q99 124 91 144 M162 112 Q184 122 193 142 M129 159 Q124 174 123 187 M157 159 Q164 174 165 187" ${S} stroke-width="8"/>`,
    `<circle cx="135" cy="67" r="3.5" fill="currentColor"/><circle cx="151" cy="67" r="3.5" fill="currentColor"/><path d="M134 80 Q143 87 152 79 M42 165 V123 M42 139 Q26 124 21 141 M42 145 Q59 127 66 147 M237 157 Q244 137 252 157" ${S} stroke-width="3"/><circle cx="264" cy="45" r="18" ${S} stroke-width="4"/>` ,
  ]],
};

function preview(layers, palette, wide) {
  return `<path d="M0 0 H${wide ? 300 : 200} V${wide ? 210 : 200} H0 Z" fill="#fff7ed"/>` + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join('');
}

export const authoredPremiumDay08Lessons = {};
export function applyPremiumDay08Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const number = Number(slug.slice(-2));
    const wide = number >= 8;
    const palette = ['#f9a8d4', '#60a5fa', '#facc15', '#22c55e'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: `Сегодня ты нарисуешь «${title.toLowerCase()}». У героя будут лицо, причёска, одежда, мягкие руки и ноги и понятное действие.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${['начни с живой формы головы или места','добавь причёску, одежду или второго героя','нарисуй мягкие руки и действие','поставь героя на ноги и добавь предмет','оживи лицо и собери сцену'][index]}.`, layer })),
      storyStageLabel: wide ? 'История героя' : 'Мой герой',
      storyPrompt: 'Раскрась одежду и лицо, выбери настроение героя и расскажи, что он делает прямо сейчас.',
      storyMissions: ['Раскрась одежду', 'Покажи настроение', 'Назови действие героя'],
      colorHint: 'Выбери тёплый цвет кожи, один главный цвет одежды и 1–2 спокойных цвета для предмета и места.',
      finishIdea: 'Герой узнаётся по лицу, одежде, позе и действию — это живой персонаж, а не схема.',
      parentNote: 'Спросите, как зовут героя и почему у него такое настроение. Похвалите позу, выражение лица и самостоятельный выбор одежды.',
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay08Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
