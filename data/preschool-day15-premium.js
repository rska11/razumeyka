// День 15 — десять явных сказочных рисунков.
const S='fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const d={
'preschool-m1-d15-01':['Корона',[`<path d="M48 73 L72 104 L101 55 L130 104 L155 73 L144 145 H58 Z" ${S} stroke-width="5"/>`,`<path d="M59 124 Q101 137 144 124" ${S} stroke-width="4"/>` ,`<circle cx="48" cy="70" r="6" ${S} stroke-width="4"/><circle cx="101" cy="51" r="7" ${S} stroke-width="4"/><circle cx="155" cy="70" r="6" ${S} stroke-width="4"/>` ,`<path d="M79 111 L87 121 L96 110 M107 110 L116 121 L124 111" ${S} stroke-width="3"/>`,`<path d="M43 161 Q101 151 159 161" ${S} stroke-width="4"/>`]],
'preschool-m1-d15-02':['Волшебная палочка',[`<path d="M67 159 L137 79" ${S} stroke-width="9"/>`,`<path d="M145 37 L153 60 L178 61 L158 76 L165 100 L145 86 L125 100 L132 76 L112 61 L137 60 Z" ${S} stroke-width="5"/>`,`<path d="M53 65 L57 76 L69 77 L60 84 L63 96 L53 89 L43 96 L46 84 L37 77 L49 76 Z" ${S} stroke-width="3"/>`,`<circle cx="84" cy="51" r="4" fill="currentColor"/><circle cx="175" cy="124" r="5" ${S} stroke-width="4"/>` ,`<path d="M38 177 Q102 167 165 177" ${S} stroke-width="4"/>`]],
'preschool-m1-d15-03':['Башенка',[`<path d="M72 74 H132 V165 H72 Z" ${S} stroke-width="5"/>`,`<path d="M63 75 L80 45 L92 61 L103 39 L116 61 L126 45 L142 75 Z" ${S} stroke-width="4"/>` ,`<path d="M91 165 V132 Q102 118 113 132 V165" ${S} stroke-width="4"/>` ,`<path d="M82 91 H94 V108 H82 Z M111 91 H123 V108 H111 Z" ${S} stroke-width="3"/>`,`<path d="M45 173 Q102 164 159 173 M134 169 Q141 151 148 169" ${S} stroke-width="4"/>`]],
'preschool-m1-d15-04':['Замок',[`<path d="M40 86 H79 V163 H40 Z M123 86 H162 V163 H123 Z M78 105 H124 V163 H78 Z" ${S} stroke-width="5"/>`,`<path d="M36 86 V65 H47 V76 H58 V65 H69 V76 H82 V86 M119 86 V65 H130 V76 H141 V65 H152 V76 H165 V86" ${S} stroke-width="4"/>` ,`<path d="M91 163 V133 Q101 119 112 133 V163" ${S} stroke-width="4"/>` ,`<path d="M49 105 H65 V122 H49 Z M137 105 H153 V122 H137 Z M91 112 H112 V127 H91 Z" ${S} stroke-width="3"/>`,`<path d="M31 173 Q101 163 172 173" ${S} stroke-width="4"/>`]],
'preschool-m1-d15-05':['Добрый дракончик',[
  `<path d="M73 126 Q50 103 35 107 Q40 121 52 129 Q38 131 35 145 Q54 151 75 142 Z M129 126 Q152 103 168 107 Q163 121 151 129 Q165 131 168 145 Q149 151 128 142 Z" ${S} stroke-width="5"/><path d="M54 117 Q61 124 69 133 M149 117 Q142 124 134 133" ${S} stroke-width="3"/>`,
  `<path d="M76 113 Q101 101 126 114 Q142 137 133 168 Q102 184 70 168 Q61 137 76 113 Z" ${S} stroke-width="5"/><path d="M89 124 Q102 116 115 124 Q126 145 119 166 Q102 174 84 165 Q78 145 89 124 Z" ${S} stroke-width="3.5"/>`,
  `<path d="M60 74 Q62 45 101 42 Q141 45 143 75 Q140 106 102 113 Q64 107 60 74 Z" ${S} stroke-width="5"/><path d="M70 51 L62 29 L83 45 M132 51 L141 29 L120 45" ${S} stroke-width="4"/><ellipse cx="102" cy="91" rx="25" ry="16" ${S} stroke-width="4"/>`,
  `<circle cx="84" cy="69" r="7" ${S} stroke-width="4"/><circle cx="120" cy="69" r="7" ${S} stroke-width="4"/><circle cx="84" cy="69" r="2.5" fill="currentColor"/><circle cx="120" cy="69" r="2.5" fill="currentColor"/><circle cx="93" cy="91" r="2.5" fill="currentColor"/><circle cx="111" cy="91" r="2.5" fill="currentColor"/><path d="M91 101 Q102 110 113 101" ${S} stroke-width="3.5"/>`,
  `<path d="M77 137 Q61 145 62 158 M127 137 Q143 145 142 158 M77 166 Q62 174 68 188 H91 Q94 177 86 169 M119 168 Q111 178 115 188 H139 Q144 176 128 167 M132 158 Q161 151 170 166 Q177 180 161 185 Q151 188 148 178" ${S} stroke-width="6"/><path d="M44 190 Q103 183 162 190" ${S} stroke-width="4"/>`
]],
'preschool-m1-d15-06':['Фея с волшебной палочкой',[
  `<path d="M79 102 Q51 70 37 88 Q31 108 72 121 Q42 116 41 137 Q53 153 82 127 Z M124 102 Q151 70 166 88 Q172 108 131 121 Q161 116 162 137 Q150 153 121 127 Z" ${S} stroke-width="4.5"/><path d="M52 92 Q65 104 77 116 M151 92 Q138 104 126 116" ${S} stroke-width="3"/>`,
  `<path d="M77 62 Q78 36 101 32 Q126 36 127 63 Q124 87 102 91 Q80 87 77 62 Z" ${S} stroke-width="5"/><path d="M78 55 Q84 31 106 34 Q128 38 127 60 M79 52 Q65 64 75 82 M126 52 Q139 64 129 82" ${S} stroke-width="4"/><path d="M80 38 Q91 20 101 37 Q112 20 123 39" ${S} stroke-width="3.5"/>`,
  `<path d="M87 95 Q102 87 117 96 L123 119 L140 154 Q121 166 102 154 Q83 166 64 154 L81 119 Z" ${S} stroke-width="5"/><path d="M82 119 Q102 129 122 119 M82 147 Q92 136 102 153 Q112 136 123 147" ${S} stroke-width="3.5"/>`,
  `<path d="M83 106 Q65 113 58 130 M119 106 Q137 100 148 84 M89 157 Q84 171 83 183 M115 157 Q120 171 121 183" ${S} stroke-width="6"/><path d="M148 84 L165 60" ${S} stroke-width="4"/><path d="M171 43 L176 54 L188 55 L179 63 L182 75 L171 68 L161 75 L164 63 L155 55 L167 54 Z" ${S} stroke-width="3.5"/><path d="M75 185 H91 M113 185 H130" ${S} stroke-width="4"/>`,
  `<circle cx="92" cy="62" r="3" fill="currentColor"/><circle cx="112" cy="62" r="3" fill="currentColor"/><path d="M91 74 Q102 82 113 74" ${S} stroke-width="3"/><circle cx="68" cy="54" r="4" ${S} stroke-width="3"/><circle cx="148" cy="42" r="3" fill="currentColor"/><path d="M45 63 L49 72 L58 73 L51 79 L53 88 L45 83 L37 88 L39 79 L32 73 L41 72 Z M39 190 Q102 182 165 190" ${S} stroke-width="3"/>`
]],
'preschool-m1-d15-07':['Волшебный гриб',[`<path d="M45 95 Q101 30 158 95 Q139 115 102 113 Q64 115 45 95 Z" ${S} stroke-width="5"/>`,`<path d="M77 113 Q74 143 64 171 H140 Q130 143 127 113" ${S} stroke-width="5"/>`,`<path d="M89 171 V140 Q102 126 115 140 V171" ${S} stroke-width="4"/>` ,`<path d="M70 83 L76 94 L89 95 L79 103 L82 116 L70 109 L59 116 L62 103 L52 95 L65 94 Z M127 66 L131 76 L142 77 L134 84 L136 95 L127 89 L118 95 L120 84 L112 77 L123 76 Z" ${S} stroke-width="3"/>`,`<path d="M39 180 Q102 170 165 180" ${S} stroke-width="4"/>`]],
'preschool-m1-d15-08':['Замок и дорожка',[`<path d="M21 122 H65 V170 H21 Z M91 102 H143 V170 H91 Z M170 122 H214 V170 H170 Z" ${S} stroke-width="5"/>`,`<path d="M17 122 V101 H29 V112 H41 V101 H53 V112 H69 V122 M87 102 V79 H101 V91 H116 V79 H130 V91 H147 V102 M166 122 V101 H178 V112 H190 V101 H202 V112 H218 V122" ${S} stroke-width="4"/>` ,`<path d="M108 170 V140 Q117 128 126 140 V170" ${S} stroke-width="4"/>` ,`<path d="M105 170 Q117 189 130 207 M137 170 Q158 189 181 207" ${S} stroke-width="5"/>`,`<circle cx="265" cy="44" r="17" ${S} stroke-width="4"/><path d="M15 177 Q120 166 235 177" ${S} stroke-width="4"/>`]],
'preschool-m1-d15-09':['Герой у башни',[`<path d="M25 90 H91 V177 H25 Z M18 90 L34 62 L46 78 L58 55 L70 78 L82 62 L98 90 Z M50 177 V148 Q59 136 68 148 V177" ${S} stroke-width="5"/>`,`<path d="M153 76 Q154 54 174 51 Q195 54 196 77 Q193 97 175 101 Q156 97 153 76 Z M155 67 Q167 49 187 57 Q194 61 196 70" ${S} stroke-width="4"/>` ,`<path d="M158 105 Q175 97 192 106 Q202 129 198 156 Q176 165 151 156 Q148 129 158 105 Z" ${S} stroke-width="5"/>`,`<path d="M158 117 Q139 128 134 146 M192 117 Q210 126 217 144 M164 158 Q160 172 160 183 M188 158 Q193 172 193 183" ${S} stroke-width="7"/>`,`<circle cx="168" cy="77" r="3" fill="currentColor"/><circle cx="182" cy="77" r="3" fill="currentColor"/><path d="M168 89 Q175 95 183 89 M15 187 H240" ${S} stroke-width="3"/><circle cx="267" cy="43" r="16" ${S} stroke-width="4"/>`]],
'preschool-m1-d15-10':['Фея дарит звезду дракончику',[
  `<path d="M109 118 V61 H132 V43 H145 V61 H161 V35 H176 V61 H199 V118 Z" ${S} stroke-width="5"/><path d="M104 61 H137 M156 61 H204 M132 43 V31 M176 35 V24 M145 118 V91 Q154 79 163 91 V118 M118 75 H129 V89 H118 Z M180 75 H191 V89 H180 Z" ${S} stroke-width="3.5"/><path d="M145 118 Q126 148 117 190 M163 118 Q184 149 195 190" ${S} stroke-width="5"/>`,
  `<path d="M56 112 Q35 87 27 104 Q26 123 55 130 Q34 130 37 148 Q49 158 63 141 Z M81 111 Q101 87 110 104 Q110 123 82 130 Q103 130 100 148 Q88 158 75 141 Z" ${S} stroke-width="3.5"/><circle cx="69" cy="89" r="17" ${S} stroke-width="4"/><path d="M54 86 Q57 68 70 71 Q85 71 86 88 M58 110 Q69 101 80 110 L91 157 Q70 168 47 157 Z M56 157 L52 180 M81 157 L85 180" ${S} stroke-width="5"/><circle cx="64" cy="88" r="2.5" fill="currentColor"/><circle cx="74" cy="88" r="2.5" fill="currentColor"/><path d="M64 97 Q69 101 75 97" ${S} stroke-width="2.5"/>`,
  `<path d="M219 123 Q202 105 191 112 Q194 128 213 135 M260 123 Q277 105 287 112 Q284 128 266 135" ${S} stroke-width="4"/><path d="M217 126 Q240 114 263 128 Q275 148 266 174 Q241 186 214 173 Q205 148 217 126 Z" ${S} stroke-width="5"/><path d="M209 104 Q211 80 240 77 Q270 80 272 105 Q268 127 241 132 Q214 127 209 104 Z M215 88 L209 70 L226 82 M265 88 L272 70 L255 82" ${S} stroke-width="4"/><circle cx="230" cy="101" r="3" fill="currentColor"/><circle cx="252" cy="101" r="3" fill="currentColor"/><path d="M231 116 Q241 123 252 115 M218 171 Q208 179 214 188 M260 171 Q271 179 265 188" ${S} stroke-width="3.5"/>`,
  `<path d="M88 126 L132 111" ${S} stroke-width="4"/><path d="M151 91 L158 107 L176 109 L162 120 L166 138 L151 128 L136 138 L140 120 L126 109 L144 107 Z" ${S} stroke-width="4.5"/><path d="M111 111 Q125 99 137 101 M177 105 Q194 101 207 111" ${S} stroke-width="3"/><circle cx="116" cy="98" r="4" ${S} stroke-width="3"/><circle cx="189" cy="94" r="4" ${S} stroke-width="3"/>`,
  `<path d="M14 190 Q79 174 145 187 Q214 199 288 181 M22 181 Q27 164 33 181 M101 184 Q107 166 113 185 M204 187 Q210 169 217 187 M279 179 Q284 163 289 178" ${S} stroke-width="4"/><path d="M33 166 Q42 156 51 166 M98 166 Q106 156 115 166 M278 162 Q270 151 262 162" ${S} stroke-width="3"/><circle cx="33" cy="164" r="4" fill="currentColor"/><circle cx="279" cy="160" r="4" fill="currentColor"/>`
]]};
function preview(l,p,w){return `<path d="M0 0 H${w?300:200} V${w?210:200} H0 Z" fill="#fff7ed"/>`+l.map((x,i)=>paint(x,p[i%p.length])).join('')}
export const authoredPremiumDay15Lessons = {};

const characterDetails = {
  'preschool-m1-d15-05': {
    palette: ['#a78bfa', '#86efac', '#4ade80', '#facc15', '#fb7185'],
    intro: 'Сегодня нарисуем маленького доброго дракона. Он сидит на лапках, раскрывает крылья и улыбается — совсем не страшный, а дружелюбный.',
    stepHints: ['раскрой два перепончатых крылышка', 'добавь круглое туловище и светлый животик', 'нарисуй большую голову, рожки и мордочку', 'оживи дракончика глазами и улыбкой', 'добавь лапки и закрути длинный хвост'],
    stageLabel: 'Мой дракон',
    storyPrompt: 'Раскрась дракончика и придумай, какое доброе волшебство он умеет делать и с кем хочет подружиться.',
    storyMissions: ['Раскрась крылья', 'Выдели светлый животик', 'Придумай доброе волшебство'],
    colorHint: 'Туловище сделай зелёным, крылья — сиреневыми, животик — светлым, а рожки и детали выдели ярким цветом.',
    finishIdea: 'Дракончик сразу узнаётся по крыльям, рожкам и хвосту, но круглые формы и улыбка делают его добрым.',
    parentNote: 'Спросите ребёнка, почему дракон получился добрым. Обратите внимание на улыбку, большие глаза и округлые формы персонажа.',
  },
  'preschool-m1-d15-06': {
    palette: ['#93c5fd', '#f9a8d4', '#c084fc', '#facc15', '#fde68a'],
    intro: 'Сегодня нарисуем настоящую маленькую фею: у неё лёгкие крылья, платье-цветок и звёздная палочка, которая зажигает добрые искры.',
    stepHints: ['раскрой за спиной четыре лёгких крыла', 'нарисуй голову, причёску и маленькую корону', 'добавь платье в форме цветка', 'нарисуй руки, ножки и звёздную палочку', 'оживи лицо улыбкой и добавь волшебные искры'],
    stageLabel: 'Моя фея',
    storyPrompt: 'Раскрась фею и придумай, какое доброе желание исполнит её звёздная палочка.',
    storyMissions: ['Сделай крылья лёгкими', 'Укрась платье', 'Придумай доброе желание'],
    colorHint: 'Крылья сделай небесно-голубыми, платье — сиреневым или розовым, а палочку и искры — золотистыми.',
    finishIdea: 'Фея сразу узнаётся по четырём крыльям, цветочному платью и поднятой волшебной палочке.',
    parentNote: 'Спросите ребёнка, какое доброе желание исполнит фея. Поддержите собственный выбор цветов и украшений для платья.',
  },
};

characterDetails['preschool-m1-d15-10'] = {
  palette: ['#94a3b8', '#f9a8d4', '#86efac', '#facc15', '#34d399'],
  intro: 'Сегодня соберём настоящую сказочную историю: у замка маленькая фея протягивает сияющую звезду доброму дракончику.',
  stepHints: ['построй замок и проведи к нему дорожку', 'нарисуй слева маленькую фею с крыльями', 'посади справа доброго дракончика', 'зажги между героями большую волшебную звезду', 'добавь поляну, траву и сказочные цветы'],
  stageLabel: 'Финал сказки',
  storyPrompt: 'Раскрась финальную сцену и придумай, зачем фея принесла звезду дракончику и какое желание они загадают вместе.',
  storyMissions: ['Раздели героев цветом', 'Сделай звезду самой яркой', 'Придумай общее желание'],
  colorHint: 'Замок оставь спокойным, фею и дракончика раскрась разными цветами, а золотую звезду сделай главным светлым акцентом.',
  finishIdea: 'Получилась цельная сказка: герои смотрят друг на друга, звезда связывает их действие, а замок показывает место события.',
  parentNote: 'Попросите ребёнка рассказать, что происходит между героями. Хвалите понятный сюжет и самостоятельный выбор окончания сказки.',
};

export function applyPremiumDay15Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(d)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const lessonNumber = Number(slug.slice(-2));
    const wide = lessonNumber >= 8;
    const details = characterDetails[slug];
    const palette = details?.palette ?? ['#a855f7', '#fb7185', '#facc15', '#60a5fa'];
    const genericHints = ['добавь отдельную часть сказочной работы', 'добавь отдельную часть сказочной работы', 'добавь отдельную часть сказочной работы', 'добавь отдельную часть сказочной работы', 'добавь отдельную часть сказочной работы'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: details?.intro ?? `Сегодня ты нарисуешь «${title.toLowerCase()}». Сказка узнаётся по герою, волшебной детали и месту действия.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${(details?.stepHints ?? genericHints)[index]}.`, layer })),
      storyStageLabel: details?.stageLabel ?? (wide ? 'Сказочная сцена' : 'Сказка'),
      ...(details ? {
        storyPrompt: details.storyPrompt,
        storyMissions: details.storyMissions,
        colorHint: details.colorHint,
        finishIdea: details.finishIdea,
        parentNote: details.parentNote,
      } : {}),
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay15Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
