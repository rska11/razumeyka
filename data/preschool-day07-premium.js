// День 7 — авторские погодные рисунки без подстановки «облако = любая погода».
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const drawings = {
  'preschool-m1-d07-01': ['Пушистое облачко', [
    `<path d="M48 119 Q35 103 49 90 Q60 79 74 88 Q80 61 104 61 Q126 62 132 82 Q151 76 162 91 Q174 109 157 123 H57 Q51 123 48 119 Z" ${S} stroke-width="5"/>`,
    `<path d="M72 88 Q83 77 94 88 M126 83 Q136 91 137 103" ${S} stroke-width="3"/>`,
    '<circle cx="85" cy="106" r="3.5" fill="currentColor"/><circle cx="119" cy="106" r="3.5" fill="currentColor"/>',
    `<path d="M90 116 Q102 124 114 116" ${S} stroke-width="3"/>`,
    `<path d="M50 159 Q101 151 154 159" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-02': ['Три капли дождя', [
    `<path d="M63 55 Q43 82 45 102 Q47 121 63 126 Q80 121 81 102 Q82 82 63 55 Z" ${S} stroke-width="5"/>`,
    `<path d="M105 39 Q83 71 85 95 Q87 116 105 122 Q124 116 126 95 Q127 71 105 39 Z" ${S} stroke-width="5"/>`,
    `<path d="M146 67 Q129 91 131 109 Q133 126 146 130 Q161 126 162 109 Q164 91 146 67 Z" ${S} stroke-width="5"/>`,
    `<path d="M55 101 Q57 112 65 115 M97 94 Q99 107 108 111 M140 108 Q142 117 148 120" ${S} stroke-width="3"/>`,
    `<path d="M36 154 Q104 145 171 154" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-03': ['Лужица с кругами', [
    `<path d="M42 123 Q59 103 81 112 Q101 92 122 108 Q149 101 162 125 Q148 148 117 145 Q94 158 75 143 Q50 147 42 123 Z" ${S} stroke-width="5"/>`,
    `<ellipse cx="101" cy="127" rx="38" ry="12" ${S} stroke-width="4"/>` ,
    `<ellipse cx="101" cy="127" rx="20" ry="6" ${S} stroke-width="3"/>`,
    `<path d="M70 82 Q63 94 71 101 M113 69 Q103 86 114 96 M144 83 Q136 96 145 104" ${S} stroke-width="4"/>` ,
    `<path d="M35 158 Q102 151 168 158" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-04': ['Зонтик от дождя', [
    `<path d="M43 104 Q53 54 101 51 Q150 55 160 104 Q145 91 130 104 Q115 90 101 104 Q85 90 72 104 Q57 91 43 104 Z" ${S} stroke-width="5"/>`,
    `<path d="M101 52 V145" ${S} stroke-width="5"/>`,
    `<path d="M101 145 Q101 168 118 168 Q132 167 132 154" ${S} stroke-width="5"/>`,
    `<path d="M53 123 Q46 135 54 143 M145 121 Q137 135 146 143" ${S} stroke-width="4"/>` ,
    `<path d="M38 180 Q102 172 166 180" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-05': ['Тёплая радуга', [
    `<path d="M35 147 Q101 38 167 147" ${S} stroke-width="7"/>`,
    `<path d="M53 147 Q101 66 149 147" ${S} stroke-width="7"/>`,
    `<path d="M71 147 Q101 95 131 147" ${S} stroke-width="7"/>`,
    `<path d="M29 150 Q34 127 58 137 Q72 132 78 150 M124 150 Q130 131 148 137 Q168 128 174 150" ${S} stroke-width="4"/>` ,
    `<path d="M30 172 Q101 163 173 172" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-06': ['Солнышко после дождя', [
    `<path d="M83 85 Q82 57 105 52 Q132 54 134 83 Q132 111 108 116 Q84 112 83 85 Z" ${S} stroke-width="5"/>`,
    `<path d="M108 38 V22 M108 130 V147 M69 84 H52 M149 84 H166 M80 55 L67 42 M137 55 L150 42" ${S} stroke-width="5"/>`,
    '<circle cx="98" cy="81" r="3.5" fill="currentColor"/><circle cx="119" cy="81" r="3.5" fill="currentColor"/>',
    `<path d="M98 96 Q109 105 120 96 M45 133 Q58 116 76 130 Q89 118 99 133" ${S} stroke-width="3"/>`,
    `<path d="M38 166 Q102 155 169 166 M57 159 Q62 144 68 159 M143 159 Q149 143 154 159" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-07': ['Тучка с характером', [
    `<path d="M41 112 Q31 94 47 82 Q60 72 73 82 Q81 53 107 55 Q130 57 135 77 Q155 70 168 86 Q181 104 164 119 H52 Q45 119 41 112 Z" ${S} stroke-width="5"/>`,
    `<path d="M79 93 L91 88 M121 88 L134 93" ${S} stroke-width="4"/>`,
    '<circle cx="87" cy="102" r="4" fill="currentColor"/><circle cx="127" cy="102" r="4" fill="currentColor"/>',
    `<path d="M93 116 Q107 107 121 116 M65 130 Q57 143 66 151 M105 130 Q96 145 106 154 M145 130 Q137 143 146 151" ${S} stroke-width="3.5"/>`,
    `<path d="M35 172 Q104 163 174 172" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-08': ['Домик под дождём', [
    `<path d="M32 127 L76 88 L121 127 M43 127 H111 V176 H43 Z M68 176 V148 H86 V176" ${S} stroke-width="5"/>`,
    `<path d="M142 58 Q153 42 168 56 Q180 38 198 55 Q216 54 220 72 H143 Q132 69 142 58 Z" ${S} stroke-width="4"/>` ,
    `<path d="M152 85 L145 103 M177 85 L169 105 M204 85 L196 104" ${S} stroke-width="4"/>` ,
    `<path d="M190 176 V130 M190 145 Q172 131 166 148 M190 151 Q209 135 216 153" ${S} stroke-width="4"/>` ,
    `<path d="M20 181 Q110 171 231 181" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-09': ['Радуга над травой', [
    `<path d="M32 151 Q125 21 218 151 M53 151 Q125 51 197 151 M75 151 Q125 82 176 151" ${S} stroke-width="7"/>`,
    `<path d="M22 154 Q29 130 53 142 M196 142 Q220 130 229 154" ${S} stroke-width="4"/>` ,
    `<path d="M17 172 Q124 157 236 172" ${S} stroke-width="5"/>`,
    `<path d="M43 168 Q48 151 54 168 M93 165 Q99 145 105 165 M174 167 Q180 148 187 167 M215 168 Q220 151 226 168" ${S} stroke-width="4"/>` ,
    `<circle cx="267" cy="48" r="17" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d07-10': ['Прогулка после дождя', [
    `<path d="M16 177 Q77 163 139 174 Q211 189 286 169 M34 158 Q55 143 82 151 Q104 142 126 158 Q104 174 76 168 Q52 174 34 158 Z" ${S} stroke-width="5"/>`,
    `<path d="M80 82 Q144 25 208 82 Q191 68 176 82 Q160 67 144 82 Q128 67 112 82 Q97 69 80 82 Z M144 81 V143 Q144 157 156 157 Q166 157 166 147" ${S} stroke-width="5"/>`,
    `<circle cx="145" cy="103" r="13" ${S} stroke-width="4"/><path d="M127 121 Q145 111 163 121 L169 158 H121 Z M132 158 L130 177 H145 V158 M157 158 L160 177 H176 M128 125 L109 143 M162 126 L145 143" ${S} stroke-width="5"/><path d="M135 101 Q145 108 155 101" ${S} stroke-width="3"/><circle cx="140" cy="99" r="2.5" fill="currentColor"/><circle cx="151" cy="99" r="2.5" fill="currentColor"/>`,
    `<path d="M20 51 Q29 35 45 47 Q58 28 77 46 Q96 45 101 63 H21 Q10 60 20 51 Z M36 73 L30 88 M62 73 L56 91 M87 73 L81 87" ${S} stroke-width="4"/><circle cx="253" cy="43" r="17" ${S} stroke-width="4"/><path d="M253 17 V7 M253 79 V69 M227 43 H217 M279 43 H289 M235 25 L227 17 M271 25 L279 17" ${S} stroke-width="4"/><path d="M204 139 Q242 79 280 139 M215 139 Q242 96 269 139 M226 139 Q242 114 258 139" ${S} stroke-width="5"/>`,
    `<path d="M45 157 Q50 143 56 157 M99 165 Q105 148 111 166 M211 174 Q216 155 223 175 M266 171 Q272 151 279 170 M53 157 Q63 161 73 157 M62 148 L56 138 M62 148 L70 137 M103 151 Q112 141 121 151 M228 152 Q238 142 248 152" ${S} stroke-width="4"/><circle cx="103" cy="148" r="4" fill="currentColor"/><circle cx="228" cy="149" r="4" fill="currentColor"/>`,
  ]],
};

function preview(layers, palette, wide) {
  return `<path d="M0 0 H${wide ? 300 : 200} V${wide ? 210 : 200} H0 Z" fill="#eff6ff"/>` + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join('');
}

export const authoredPremiumDay07Lessons = {};
export function applyPremiumDay07Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const lessonNumber = Number(slug.slice(-2));
    const wide = lessonNumber >= 8;
    const finale = lessonNumber === 10;
    const palette = finale ? ['#38bdf8', '#f472b6', '#f59e0b', '#a78bfa', '#22c55e'] : ['#60a5fa', '#a78bfa', '#facc15', '#22c55e'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: finale ? 'Сегодня соберём целую историю: дождь уже заканчивается, ребёнок выходит на прогулку, а в небе появляются солнце и радуга.' : `Сегодня ты нарисуешь «${title.toLowerCase()}». Погода будет не значком, а маленькой картиной с воздухом, землёй и настроением.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${(finale ? ['нарисуй дорожку и большую лужу', 'раскрой над героем широкий зонтик', 'добавь ребёнка в плаще и сапожках', 'покажи, как дождь уходит и выходит солнце', 'оживи поляну травой, цветами и бликами'] : ['начни с главной погодной формы','добавь движение или вторую часть','покажи важную деталь','собери настроение картинки','добавь землю и свободное место'])[index]}.`, layer })),
      storyStageLabel: wide ? 'Погодная сцена' : 'Погода',
      storyPrompt: finale ? 'Раскрась прогулку после дождя. Покажи, где ещё прохладно и мокро, а где уже тепло от солнца. Придумай, куда идёт герой.' : 'Раскрась небо и погоду, затем придумай, тепло на картинке или прохладно и что случится дальше.',
      storyMissions: finale ? ['Раскрась плащ и зонтик', 'Сделай лужу блестящей', 'Добавь цель прогулки'] : ['Раскрась погодное явление', 'Покажи небо и землю', 'Назови настроение картинки'],
      colorHint: 'Используй 3–4 цвета: спокойный для неба, яркий для главного события и зелёный или тёплый для земли.',
      finishIdea: finale ? 'Получилась настоящая погодная история: дождь уходит, солнце возвращается, а герой смело шагает по мокрой дорожке.' : 'По рисунку видно не только погоду, но и место, движение и настроение.',
      parentNote: 'Спросите, какая погода получилась и что герой взял бы на прогулку. Хвалите наблюдательность и собственный выбор цвета.',
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay07Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
