// День 5 — явные авторские зверята. У каждого свой силуэт, поза и предмет истории.
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}

const drawings = {
  'preschool-m1-d05-01': ['Мордочка котика', [
    `<path d="M59 82 L52 43 L84 62 Q101 54 118 62 L149 43 L142 83 Q139 128 101 139 Q63 128 59 82 Z" ${S} stroke-width="5"/>`,
    `<path d="M68 65 L58 51 L82 63 M134 65 L144 51 L120 63" ${S} stroke-width="4"/>`,
    '<circle cx="84" cy="91" r="4" fill="currentColor"/><circle cx="118" cy="91" r="4" fill="currentColor"/>',
    `<path d="M94 104 Q101 98 108 104 Q101 113 94 104 Z M101 112 Q91 122 82 113 M101 112 Q112 122 121 113" ${S} stroke-width="3"/>`,
    `<path d="M78 105 H48 M80 114 L51 126 M124 105 H154 M122 114 L151 126 M48 158 Q101 149 154 158" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d05-02': ['Ушки зайчика', [
    `<path d="M75 82 Q60 35 77 20 Q100 39 95 79 M108 79 Q105 34 126 22 Q143 43 126 84" ${S} stroke-width="6"/>`,
    `<path d="M69 99 Q71 72 101 66 Q132 72 133 99 Q128 129 102 135 Q74 129 69 99 Z" ${S} stroke-width="5"/>`,
    '<circle cx="89" cy="97" r="4" fill="currentColor"/><circle cx="115" cy="97" r="4" fill="currentColor"/>',
    `<path d="M96 109 Q102 104 108 109 Q102 117 96 109 Z M102 117 Q93 125 87 118 M102 117 Q110 125 117 118" ${S} stroke-width="3"/>`,
    `<path d="M55 158 Q102 145 151 158 M66 154 Q72 141 77 154 M132 154 Q138 140 143 154" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d05-03': ['Птичка шагает', [
    `<path d="M65 105 Q64 74 94 66 Q129 66 142 98 Q145 130 112 143 Q78 141 65 105 Z" ${S} stroke-width="5"/>`,
    `<path d="M74 82 Q60 64 48 77 L69 91 M142 100 L164 89 L148 112" ${S} stroke-width="4"/>` ,
    `<path d="M91 105 Q113 82 129 105 Q113 126 91 119 Z" ${S} stroke-width="4"/>` ,
    '<circle cx="82" cy="88" r="4" fill="currentColor"/><path d="M65 95 L45 103 L66 112 Z" '+S+' stroke-width="4"/>',
    `<path d="M94 140 L88 161 M116 140 L123 161 M78 163 H96 M115 163 H133 M42 171 Q102 164 161 171" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d05-04': ['Щенок сидит', [
    `<path d="M73 73 Q76 49 102 47 Q129 50 132 74 Q132 105 102 112 Q72 104 73 73 Z M76 59 Q52 48 56 82 Q62 99 76 92 M129 59 Q153 48 149 82 Q143 99 129 92" ${S} stroke-width="5"/>`,
    `<path d="M80 116 Q102 106 124 118 Q139 142 130 171 H74 Q65 142 80 116 Z" ${S} stroke-width="5"/>`,
    `<path d="M82 146 V174 M121 146 V174 M72 174 H92 M112 174 H132 M130 135 Q151 125 158 143" ${S} stroke-width="6"/>`,
    '<circle cx="91" cy="79" r="4" fill="currentColor"/><circle cx="114" cy="79" r="4" fill="currentColor"/><ellipse cx="103" cy="94" rx="7" ry="5" fill="currentColor"/>',
    `<path d="M96 103 Q103 111 111 103 M43 183 Q102 176 163 183" ${S} stroke-width="3.5"/>`,
  ]],
  'preschool-m1-d05-05': ['Котёнок с клубком', [
    `<path d="M72 77 L66 49 L89 62 Q102 56 115 62 L139 49 L132 80 Q128 106 103 111 Q77 107 72 77 Z" ${S} stroke-width="5"/>`,
    `<path d="M80 115 Q103 106 124 119 Q135 140 126 164 Q103 176 80 164 Q68 141 80 115 Z" ${S} stroke-width="5"/>`,
    `<path d="M82 144 Q69 157 75 171 M121 144 Q134 157 128 171 M129 136 Q157 125 158 148 Q155 163 141 166" ${S} stroke-width="6"/>`,
    '<circle cx="91" cy="83" r="3.5" fill="currentColor"/><circle cx="114" cy="83" r="3.5" fill="currentColor"/><path d="M97 94 Q103 89 109 94 Q103 102 97 94 Z" fill="currentColor"/>',
    `<circle cx="48" cy="157" r="19" ${S} stroke-width="4"/><path d="M35 145 Q48 158 61 170 M39 171 Q51 158 58 144 M65 157 Q78 153 82 145 M34 182 H164" ${S} stroke-width="3"/>`,
  ]],
  'preschool-m1-d05-06': ['Лисёнок', [
    `<path d="M69 81 L62 39 L91 58 Q104 51 118 58 L145 39 L137 83 Q129 111 103 116 Q76 111 69 81 Z" ${S} stroke-width="5"/>`,
    `<path d="M78 120 Q103 108 128 123 Q139 147 126 170 Q102 180 76 168 Q64 144 78 120 Z" ${S} stroke-width="5"/>`,
    `<path d="M132 134 Q174 114 179 141 Q178 168 145 175 Q155 158 132 151 M81 153 V176 M121 153 V176" ${S} stroke-width="7"/>`,
    '<circle cx="91" cy="84" r="4" fill="currentColor"/><circle cx="117" cy="84" r="4" fill="currentColor"/><path d="M94 95 L104 107 L115 95 Q104 120 94 95 Z" '+S+' stroke-width="4"/>',
    `<path d="M39 184 Q105 176 179 184 M50 179 Q46 164 41 177" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d05-07': ['Кудрявая овечка', [
    `<path d="M73 76 Q65 62 79 55 Q81 40 98 47 Q110 36 120 50 Q138 50 133 67 Q146 80 131 92 Q127 111 104 113 Q81 112 75 96 Q61 88 73 76 Z" ${S} stroke-width="5"/>`,
    `<path d="M68 125 Q62 107 80 104 Q91 92 105 103 Q121 93 130 108 Q149 110 141 130 Q153 144 137 156 Q138 175 117 172 Q104 184 90 171 Q70 177 69 158 Q53 145 68 125 Z" ${S} stroke-width="5"/>`,
    `<path d="M81 161 V180 M125 161 V180 M71 181 H91 M115 181 H135" ${S} stroke-width="6"/>`,
    '<circle cx="93" cy="80" r="4" fill="currentColor"/><circle cx="115" cy="80" r="4" fill="currentColor"/><path d="M97 94 Q104 101 112 94" '+S+' stroke-width="4"/>',
    `<path d="M39 186 Q104 178 169 186" ${S} stroke-width="4"/>` ,
  ]],
  'preschool-m1-d05-08': ['Зайчик и морковка', [
    `<path d="M58 92 Q48 53 62 38 Q82 51 78 88 M88 88 Q88 49 105 38 Q123 57 105 94 M51 108 Q54 84 79 80 Q105 84 108 108 Q104 132 80 137 Q55 132 51 108 Z" ${S} stroke-width="5"/>`,
    `<path d="M58 139 Q80 129 100 143 Q111 164 101 185 H55 Q45 162 58 139 Z" ${S} stroke-width="5"/>`,
    `<path d="M98 153 Q121 142 135 154 M63 165 Q50 177 57 190 M92 166 Q104 178 96 190" ${S} stroke-width="6"/>`,
    `<path d="M136 151 Q151 130 165 151 Q155 181 143 189 Q137 170 136 151 Z M149 137 Q141 126 135 133 M151 137 Q158 124 164 132" ${S} stroke-width="4"/>` ,
    '<circle cx="69" cy="106" r="3.5" fill="currentColor"/><circle cx="90" cy="106" r="3.5" fill="currentColor"/><path d="M73 118 Q80 124 88 118 M24 194 Q126 181 278 193 M222 190 V128 M222 145 Q199 128 193 147 M222 153 Q246 132 254 155" '+S+' stroke-width="4"/>',
  ]],
  'preschool-m1-d05-09': ['Птичка на ветке', [
    `<path d="M80 105 Q80 76 108 69 Q139 72 145 101 Q142 129 115 138 Q87 136 80 105 Z" ${S} stroke-width="5"/>`,
    `<path d="M88 84 Q73 67 62 80 L82 93 M145 99 L165 87 L151 111" ${S} stroke-width="4"/>` ,
    `<path d="M105 104 Q125 84 138 105 Q124 123 105 118 Z" ${S} stroke-width="4"/>` ,
    '<circle cx="96" cy="91" r="3.5" fill="currentColor"/><path d="M81 96 L62 103 L82 111 Z" '+S+' stroke-width="4"/>',
    `<path d="M30 155 Q112 143 204 156 M68 153 Q59 174 48 183 M134 153 Q143 172 156 181 M204 156 Q225 139 244 155 M247 51 Q258 38 270 51" ${S} stroke-width="5"/>`,
  ]],
  'preschool-m1-d05-10': ['Друзья на полянке', [
    `<path d="M13 164 Q75 148 139 163 Q206 179 287 157" ${S} stroke-width="5"/>`,
    `<path d="M54 104 L49 77 L68 88 L87 76 L84 105 Q80 129 67 132 Q52 127 54 104 Z M52 132 Q68 124 84 135 Q91 151 83 165 H52 Q44 148 52 132 Z" ${S} stroke-width="4"/>` ,
    `<path d="M126 95 Q118 62 130 51 Q147 65 144 92 M151 94 Q151 60 166 52 Q180 70 165 99 M121 111 Q124 91 145 88 Q168 92 169 113 Q165 134 145 138 Q124 134 121 111 Z" ${S} stroke-width="4"/>` ,
    `<path d="M210 113 Q212 88 236 83 Q263 87 268 112 Q263 137 239 141 Q215 137 210 113 Z M215 96 Q195 86 199 115 M264 96 Q283 86 280 115 M219 142 Q239 132 259 145 Q267 160 261 172 H216 Q207 158 219 142 Z" ${S} stroke-width="4"/>` ,
    `<circle cx="61" cy="106" r="3" fill="currentColor"/><circle cx="75" cy="106" r="3" fill="currentColor"/><circle cx="137" cy="111" r="3" fill="currentColor"/><circle cx="153" cy="111" r="3" fill="currentColor"/><circle cx="229" cy="111" r="3" fill="currentColor"/><circle cx="249" cy="111" r="3" fill="currentColor"/><circle cx="270" cy="46" r="17" ${S} stroke-width="4"/>` ,
  ]],
};

function preview(layers, palette, wide) {
  return `<path d="M0 0 H${wide ? 300 : 200} V${wide ? 210 : 200} H0 Z" fill="#fff7ed"/>` + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join('');
}

export const authoredPremiumDay05Lessons = {};
export function applyPremiumDay05Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const lessonNumber = Number(slug.slice(-2));
    const wide = lessonNumber >= 8;
    const palette = ['#fb923c', '#f9a8d4', '#84cc16', '#60a5fa'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: `Сегодня ты нарисуешь «${title.toLowerCase()}». Смотри на особенные ушки, лапки, хвост и выражение мордочки — по ним герой становится узнаваемым.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${['начни с узнаваемого силуэта','добавь тело или важную форму','нарисуй лапки, крыло или хвост','оживи мордочку и предмет истории','поставь героя в своё место'][index]}.`, layer })),
      storyStageLabel: wide ? 'Друзья' : 'Живой зверёк',
      storyPrompt: 'Раскрась героя, придумай ему имя и добавь одну деталь, которая расскажет, что он делает.',
      storyMissions: ['Раскрась героя', 'Назови особенную деталь', 'Придумай имя или маленькое событие'],
      colorHint: 'Выбери тёплый цвет шерсти или перьев, отдельный цвет для предмета и спокойный цвет для места вокруг.',
      finishIdea: 'Герой узнаётся по силуэту и характерным деталям, а не по подписи.',
      parentNote: 'Спросите, чем этот герой отличается от остальных зверят. Похвалите выразительную мордочку, позу и придуманную историю.',
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay05Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
