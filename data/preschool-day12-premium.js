// День 12 — десять самостоятельных игрушек и сцен.
const S='fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const drawings={
'preschool-m1-d12-01':['Кубик с буквой',[`<path d="M55 68 L102 45 L148 68 V137 L102 162 L55 137 Z" ${S} stroke-width="5"/>`,`<path d="M55 68 L102 93 L148 68 M102 93 V162" ${S} stroke-width="4"/>` ,`<path d="M76 88 L91 80 L104 88 L91 96 Z" ${S} stroke-width="3"/>`,`<path d="M116 99 L132 91 V113 L116 121 Z" ${S} stroke-width="3"/>`,`<path d="M43 176 Q102 167 159 176" ${S} stroke-width="4"/>`]],
'preschool-m1-d12-02':['Барабан',[`<path d="M55 73 Q101 56 148 73 V139 Q101 158 55 139 Z" ${S} stroke-width="5"/>`,`<ellipse cx="101" cy="73" rx="47" ry="17" ${S} stroke-width="4"/><ellipse cx="101" cy="139" rx="47" ry="17" ${S} stroke-width="4"/>` ,`<path d="M62 82 L78 145 M91 78 L103 151 M120 78 L131 145 M145 82 L129 145" ${S} stroke-width="3"/>`,`<path d="M49 48 L89 92 M154 47 L115 91" ${S} stroke-width="5"/><circle cx="45" cy="44" r="6" ${S} stroke-width="4"/><circle cx="158" cy="43" r="6" ${S} stroke-width="4"/>` ,`<path d="M39 174 Q101 164 164 174" ${S} stroke-width="4"/>`]],
'preschool-m1-d12-03':['Воздушный змей',[`<path d="M101 35 L153 85 L101 137 L49 85 Z" ${S} stroke-width="5"/>`,`<path d="M101 35 V137 M49 85 H153" ${S} stroke-width="4"/>` ,`<path d="M101 137 Q79 155 104 170 Q126 181 112 194" ${S} stroke-width="3"/>`,`<path d="M91 148 L77 143 L81 158 Z M108 170 L123 164 L121 180 Z" ${S} stroke-width="4"/>` ,`<path d="M36 183 Q101 174 166 183" ${S} stroke-width="4"/>`]],
'preschool-m1-d12-04':['Мишка-игрушка',[`<circle cx="72" cy="68" r="16" ${S} stroke-width="4"/><circle cx="130" cy="68" r="16" ${S} stroke-width="4"/><path d="M70 87 Q72 54 101 50 Q132 54 133 87 Q129 116 102 121 Q74 116 70 87 Z" ${S} stroke-width="5"/>`,`<path d="M76 124 Q102 110 128 126 Q143 150 130 176 H72 Q59 149 76 124 Z" ${S} stroke-width="5"/>`,`<path d="M72 139 Q51 148 55 166 M131 139 Q151 148 147 166 M82 169 Q73 180 84 188 M121 169 Q130 180 119 188" ${S} stroke-width="7"/>`,`<circle cx="90" cy="87" r="4" fill="currentColor"/><circle cx="114" cy="87" r="4" fill="currentColor"/><ellipse cx="102" cy="101" rx="7" ry="5" fill="currentColor"/><path d="M94 109 Q102 116 110 109" ${S} stroke-width="3"/>`,`<path d="M36 191 H167" ${S} stroke-width="4"/>`]],
'preschool-m1-d12-05':['Кукла улыбается',[`<path d="M77 60 Q78 38 100 34 Q124 38 124 61 Q121 84 101 88 Q80 84 77 60 Z M79 51 Q91 32 112 39 Q122 43 124 54 M78 49 Q64 62 73 76 M123 50 Q137 62 128 77" ${S} stroke-width="5"/>`,`<path d="M84 93 Q101 84 118 94 L134 149 Q102 160 68 149 Z" ${S} stroke-width="5"/>`,`<path d="M83 105 Q63 115 58 135 M119 105 Q138 115 144 135 M86 151 Q82 166 82 179 M116 151 Q120 166 120 179" ${S} stroke-width="7"/>`,`<circle cx="92" cy="61" r="3" fill="currentColor"/><circle cx="111" cy="61" r="3" fill="currentColor"/><path d="M91 73 Q102 81 112 73" ${S} stroke-width="3"/>`,`<path d="M76 181 H94 M111 181 H130 M39 187 H164" ${S} stroke-width="4"/>`]],
'preschool-m1-d12-06':['Добрый робот',[
  `<rect x="55" y="40" width="92" height="59" rx="13" ${S} stroke-width="5"/><path d="M55 62 H45 V79 H55 M147 62 H157 V79 H147 M101 40 V24" ${S} stroke-width="4"/><circle cx="101" cy="20" r="6" ${S} stroke-width="4"/>`,
  `<path d="M70 106 Q101 96 132 106 L139 157 Q101 169 63 157 Z" ${S} stroke-width="5"/><path d="M87 116 L101 128 L115 116 L115 139 Q101 151 87 139 Z" ${S} stroke-width="4"/>`,
  `<path d="M67 119 Q48 124 42 143 Q39 154 49 158 Q58 159 61 148 L67 134 M135 120 Q151 117 160 102 Q167 91 175 98 Q182 105 174 114 L139 143" ${S} stroke-width="6"/><circle cx="46" cy="160" r="7" ${S} stroke-width="4"/><circle cx="178" cy="96" r="7" ${S} stroke-width="4"/>`,
  `<path d="M82 163 V181 M121 163 V181" ${S} stroke-width="7"/><path d="M66 183 Q81 174 96 183 V190 H66 Z M106 183 Q121 174 136 183 V190 H106 Z" ${S} stroke-width="4"/>`,
  `<circle cx="82" cy="68" r="7" ${S} stroke-width="4"/><circle cx="120" cy="68" r="7" ${S} stroke-width="4"/><circle cx="82" cy="68" r="2.5" fill="currentColor"/><circle cx="120" cy="68" r="2.5" fill="currentColor"/><path d="M83 84 Q101 95 120 84" ${S} stroke-width="4"/><circle cx="78" cy="143" r="4" fill="currentColor"/><circle cx="124" cy="143" r="4" fill="currentColor"/>`
]],
'preschool-m1-d12-07':['Игрушечный поезд',[`<path d="M34 112 H99 V153 H34 Z M105 96 H161 V153 H105 Z" ${S} stroke-width="5"/>`,`<path d="M120 96 V70 H149 L157 96 M161 126 H181 L171 151 H161" ${S} stroke-width="4"/>` ,`<path d="M47 123 H64 V139 H47 Z M73 123 H90 V139 H73 Z M119 108 H139 V128 H119 Z" ${S} stroke-width="3"/>`,`<circle cx="52" cy="158" r="10" ${S} stroke-width="4"/><circle cx="84" cy="158" r="10" ${S} stroke-width="4"/><circle cx="125" cy="158" r="11" ${S} stroke-width="4"/><circle cx="153" cy="158" r="11" ${S} stroke-width="4"/>` ,`<path d="M28 177 H183 M136 63 Q127 52 137 43 Q151 40 154 52" ${S} stroke-width="4"/>`]],
'preschool-m1-d12-08':['Большая коробка игрушек',[
  `<path d="M43 116 H257 L242 187 H58 Z" ${S} stroke-width="6"/><path d="M43 116 Q150 91 257 116 L246 91 Q150 70 54 91 Z" ${S} stroke-width="5"/>`,
  `<circle cx="92" cy="96" r="25" ${S} stroke-width="4"/><circle cx="73" cy="76" r="10" ${S} stroke-width="4"/><circle cx="111" cy="76" r="10" ${S} stroke-width="4"/><circle cx="84" cy="94" r="3" fill="currentColor"/><circle cx="100" cy="94" r="3" fill="currentColor"/><ellipse cx="92" cy="105" rx="6" ry="4" fill="currentColor"/>`,
  `<rect x="127" y="63" width="52" height="45" rx="8" ${S} stroke-width="4"/><path d="M153 63 V50" ${S} stroke-width="4"/><circle cx="153" cy="46" r="5" ${S} stroke-width="3"/><circle cx="141" cy="82" r="5" ${S} stroke-width="3"/><circle cx="165" cy="82" r="5" ${S} stroke-width="3"/><path d="M141 96 Q153 102 165 96" ${S} stroke-width="3"/>`,
  `<circle cx="213" cy="99" r="27" ${S} stroke-width="5"/><path d="M190 87 Q213 104 236 87 M201 76 Q195 99 204 122" ${S} stroke-width="3.5"/><path d="M192 126 L213 111 L234 126 V148 H192 Z" ${S} stroke-width="4"/>`,
  `<path d="M70 142 H105 V176 H70 Z M113 151 H142 V178 H113 Z M220 151 L235 133 L250 151 V178 H220 Z" ${S} stroke-width="4"/><path d="M64 188 Q150 179 247 188" ${S} stroke-width="4"/><path d="M75 155 L100 169 M119 159 H136 M227 159 H244" ${S} stroke-width="3"/>`
]],
'preschool-m1-d12-09':['Мишка ловит мяч',[
  `<path d="M76 119 Q105 104 134 121 Q148 146 135 177 H72 Q59 146 76 119 Z" ${S} stroke-width="6"/>`,
  `<circle cx="76" cy="68" r="15" ${S} stroke-width="4"/><circle cx="132" cy="68" r="15" ${S} stroke-width="4"/><path d="M73 88 Q75 55 104 51 Q135 55 136 88 Q132 116 105 121 Q77 116 73 88 Z" ${S} stroke-width="5"/>`,
  `<circle cx="93" cy="85" r="4" fill="currentColor"/><circle cx="117" cy="85" r="4" fill="currentColor"/><ellipse cx="105" cy="99" rx="7" ry="5" fill="currentColor"/><path d="M96 107 Q105 115 114 107" ${S} stroke-width="3"/>`,
  `<path d="M78 129 Q56 119 44 101 Q37 91 29 98 Q22 106 31 115 Q48 137 70 145 M133 130 Q153 116 166 99 Q174 89 182 97 Q189 105 180 115 Q161 137 139 147 M85 174 Q76 184 85 191 M124 174 Q134 184 124 191" ${S} stroke-width="7"/>`,
  `<circle cx="226" cy="82" r="31" ${S} stroke-width="5"/><path d="M201 67 Q226 87 251 67 M213 56 Q206 82 216 106" ${S} stroke-width="4"/><path d="M192 89 Q180 94 171 104 M196 69 Q181 66 170 70 M29 193 Q135 184 268 193" ${S} stroke-width="4"/>`
]],
'preschool-m1-d12-10':['Уютная комната игрушек',[
  `<path d="M14 180 H286 M18 28 H282 V180" ${S} stroke-width="5"/><rect x="34" y="45" width="76" height="72" rx="4" ${S} stroke-width="4"/><path d="M72 45 V117 M34 81 H110 M27 39 Q43 57 36 124 M117 39 Q101 57 108 124" ${S} stroke-width="4"/>`,
  `<ellipse cx="151" cy="165" rx="76" ry="25" ${S} stroke-width="5"/><ellipse cx="151" cy="165" rx="49" ry="14" ${S} stroke-width="3"/>`,
  `<path d="M206 112 H272 V170 H206 Z M201 112 Q239 88 277 112 L268 91 Q239 77 210 91 Z" ${S} stroke-width="5"/><path d="M220 135 H258 M239 124 V151" ${S} stroke-width="3"/>`,
  `<path d="M86 142 Q111 112 137 142 Q128 153 113 154 Q98 153 86 142 Z M93 137 Q82 120 91 112 Q103 117 110 133 M133 137 Q145 120 136 112 Q124 117 117 133 M101 153 V172 M127 153 V172 M78 174 Q112 164 148 174" ${S} stroke-width="5"/>`,
  `<rect x="213" y="69" width="40" height="34" rx="6" ${S} stroke-width="3.5"/><circle cx="224" cy="84" r="4" ${S} stroke-width="3"/><circle cx="242" cy="84" r="4" ${S} stroke-width="3"/><path d="M224 96 Q233 101 242 96 M233 69 V58" ${S} stroke-width="3"/><circle cx="233" cy="54" r="4" fill="currentColor"/><circle cx="55" cy="151" r="18" ${S} stroke-width="4"/><path d="M40 142 Q55 154 70 142 M160 146 H184 V170 H160 Z M166 152 L179 165" ${S} stroke-width="3.5"/>`
]]};
function preview(l,p,w){return `<path d="M0 0 H${w?300:200} V${w?210:200} H0 Z" fill="#fff7ed"/>`+l.map((x,i)=>paint(x,p[i%p.length])).join('')}
export const authoredPremiumDay12Lessons = {};

const authoredDetails = {
  'preschool-m1-d12-06': {
    intro: 'Сегодня соберём доброго робота из больших понятных форм. Он улыбается, машет рукой и носит на груди знак дружбы.',
    stepHints: ['собери голову с ушками и антенной', 'добавь корпус и знак дружбы', 'нарисуй руки — одну робот поднял для приветствия', 'поставь робота на крепкие ноги', 'оживи лицо улыбкой и добавь кнопки'],
    storyPrompt: 'Раскрась робота и придумай, кому он машет рукой и какое доброе дело умеет делать.',
    storyMissions: ['Выдели знак дружбы', 'Раскрась кнопки', 'Придумай полезную способность'],
  },
  'preschool-m1-d12-08': {
    intro: 'Откроем большую коробку, из которой выглядывают знакомые игрушки: мишка, робот, мяч, домик и кубики.',
    stepHints: ['нарисуй большую открытую коробку', 'посади в неё мягкого мишку', 'добавь робота с антенной', 'положи рядом круглый мяч и домик', 'заполни коробку крупными кубиками'],
    storyPrompt: 'Раскрась игрушки так, чтобы их легко было отличить друг от друга. Придумай, какую игрушку ребёнок возьмёт первой.',
    storyMissions: ['Найди мишку', 'Выдели робота', 'Добавь любимую игрушку'],
  },
  'preschool-m1-d12-09': {
    intro: 'Мишка не просто стоит рядом с мячом — он вытянул лапы и готовится поймать его. Покажем действие и движение.',
    stepHints: ['нарисуй большое туловище мишки', 'добавь голову и круглые ушки', 'оживи мордочку доброй улыбкой', 'вытяни лапы навстречу мячу', 'нарисуй летящий мяч и линии движения'],
    storyPrompt: 'Раскрась мишку и мяч. Придумай, кто бросил мяч и поймает ли его мишка.',
    storyMissions: ['Раскрась мяч ярко', 'Покажи направление полёта', 'Придумай партнёра для игры'],
  },
  'preschool-m1-d12-10': {
    intro: 'Соберём уютную игровую комнату, где у каждой вещи есть своё место: окно, ковёр, сундук и лошадка-качалка.',
    stepHints: ['наметь комнату и большое окно со шторами', 'постели в центре круглый ковёр', 'поставь у стены открытый сундук', 'добавь лошадку-качалку', 'расставь робота, мяч и кубик по местам'],
    storyPrompt: 'Раскрась комнату и придумай, кто только что закончил играть. Покажи, какие игрушки уже убраны, а какие ещё ждут своей очереди.',
    storyMissions: ['Выбери цвет ковра', 'Раскрась сундук', 'Добавь одну свою игрушку'],
  },
};

export function applyPremiumDay12Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const lessonNumber = Number(slug.slice(-2));
    const wide = lessonNumber >= 8;
    const details = authoredDetails[slug];
    const palette = details
      ? ['#60a5fa', '#f9a8d4', '#facc15', '#a78bfa', '#34d399']
      : ['#f9a8d4', '#93c5fd', '#bef264', '#facc15'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: details?.intro ?? `Сегодня ты нарисуешь «${title.toLowerCase()}». У каждой игрушки своя конструкция, характер и место в комнате.`,
      steps: layers.map((layer, index) => ({
        hint: `Шаг ${index + 1} — ${details?.stepHints[index] ?? 'добавь отдельную часть игрушки или комнаты'}.`,
        layer,
      })),
      storyStageLabel: slug === 'preschool-m1-d12-10' ? 'Игровая комната' : (wide ? 'Игрушечная история' : 'Игрушка'),
      ...(details ? {
        storyPrompt: details.storyPrompt,
        storyMissions: details.storyMissions,
        colorHint: 'Выбери 3–5 согласованных цветов: крупные формы сделай спокойными, а важные детали — яркими.',
        finishIdea: 'Игрушки хорошо различаются по силуэту, а вся композиция рассказывает понятную историю.',
      } : {}),
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay12Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
