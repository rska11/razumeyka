// День 17 — музыкальный праздник: десять авторских инструментов и сцен без повторения морской темы.
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}

const musicLessons = {
  'preschool-m1-d17-01': {
    title: 'Пара маракасов',
    palette: ['#fb7185', '#38bdf8', '#facc15', '#a78bfa', '#22c55e'],
    intro: 'Начнём музыкальный день с двух маракасов. Они похожи по форме, но каждый можно украсить своим узором.',
    stepHints: ['нарисуй круглую головку первого маракаса', 'добавь длинную удобную ручку', 'нарисуй второй маракас в другую сторону', 'укрась оба инструмента разными полосками', 'добавь крупные ноты и покажи ритм'],
    storyPrompt: 'Раскрась маракасы по-разному и придумай короткий ритм: тихо — громко — тихо.',
    storyMissions: ['Раздели маракасы цветом', 'Укрась ручки', 'Придумай ритм'],
    layers: [
      `<path d="M79 55 Q105 48 116 70 Q125 94 104 109 Q83 123 64 106 Q47 89 58 69 Q65 58 79 55 Z" ${S} stroke-width="5"/>`,
      `<path d="M87 109 L117 174 Q120 185 110 189 Q100 192 96 181 L72 114" ${S} stroke-width="7"/>`,
      `<path d="M209 55 Q183 48 172 70 Q163 94 184 109 Q205 123 224 106 Q241 89 230 69 Q223 58 209 55 Z M201 109 L171 174 Q168 185 178 189 Q188 192 192 181 L216 114" ${S} stroke-width="5"/>`,
      `<path d="M58 80 Q87 91 115 78 M65 101 Q88 108 108 97 M173 78 Q201 91 230 80 M180 98 Q201 108 223 101" ${S} stroke-width="3"/>`,
      `<path d="M39 44 Q48 32 57 44 V65 M142 54 Q151 42 160 54 V75 M250 40 Q259 28 268 40 V62 M25 194 Q143 183 277 194" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-02': {
    title: 'Звонкий бубен',
    palette: ['#f59e0b', '#facc15', '#60a5fa', '#fb7185', '#22c55e'],
    intro: 'Бубен узнаётся по большой круглой раме и маленьким звенящим тарелочкам по краю.',
    stepHints: ['нарисуй большой круглый бубен', 'добавь внутреннюю круглую мембрану', 'размести по краю четыре пары бубенчиков', 'привяжи снизу две праздничные ленты', 'добавь ноты вокруг звонкого инструмента'],
    storyPrompt: 'Раскрась бубен и придумай, под какую песню он будет звенеть.',
    storyMissions: ['Выдели круглую раму', 'Раскрась бубенчики', 'Добавь свой узор'],
    layers: [
      `<circle cx="150" cy="101" r="67" ${S} stroke-width="7"/>`,
      `<circle cx="150" cy="101" r="48" ${S} stroke-width="4"/><circle cx="150" cy="101" r="8" ${S} stroke-width="3"/>`,
      `<circle cx="150" cy="34" r="8" ${S} stroke-width="3"/><circle cx="150" cy="168" r="8" ${S} stroke-width="3"/><circle cx="83" cy="101" r="8" ${S} stroke-width="3"/><circle cx="217" cy="101" r="8" ${S} stroke-width="3"/><circle cx="103" cy="54" r="7" ${S} stroke-width="3"/><circle cx="197" cy="54" r="7" ${S} stroke-width="3"/><circle cx="103" cy="148" r="7" ${S} stroke-width="3"/><circle cx="197" cy="148" r="7" ${S} stroke-width="3"/>`,
      `<path d="M132 164 Q121 186 128 201 M168 164 Q181 185 174 201" ${S} stroke-width="5"/>`,
      `<path d="M38 63 Q47 51 56 63 V84 M244 55 Q253 43 262 55 V77 M35 189 Q150 179 270 189" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-03': {
    title: 'Радужный ксилофон',
    palette: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6'],
    intro: 'Ксилофон строится из цветных пластинок: слева длинные, справа короткие. По ним играют двумя палочками.',
    stepHints: ['наметь две опоры ксилофона', 'положи сверху пять пластинок разной длины', 'добавь круглые крепления на пластинках', 'положи рядом две палочки', 'добавь весёлые ноты над инструментом'],
    storyPrompt: 'Раскрась пластинки по порядку и придумай, какая звучит низко, а какая высоко.',
    storyMissions: ['Сделай пластинки разными', 'Раскрась палочки', 'Найди самую короткую'],
    layers: [
      `<path d="M47 157 L68 75 M237 157 L220 75 M45 158 H239" ${S} stroke-width="7"/>`,
      `<rect x="65" y="67" width="157" height="18" rx="7" ${S} stroke-width="4"/><rect x="72" y="88" width="143" height="18" rx="7" ${S} stroke-width="4"/><rect x="80" y="109" width="127" height="18" rx="7" ${S} stroke-width="4"/><rect x="88" y="130" width="111" height="18" rx="7" ${S} stroke-width="4"/><rect x="97" y="151" width="93" height="18" rx="7" ${S} stroke-width="4"/>`,
      `<circle cx="82" cy="76" r="3" fill="currentColor"/><circle cx="205" cy="76" r="3" fill="currentColor"/><circle cx="88" cy="97" r="3" fill="currentColor"/><circle cx="199" cy="97" r="3" fill="currentColor"/><circle cx="96" cy="118" r="3" fill="currentColor"/><circle cx="191" cy="118" r="3" fill="currentColor"/>`,
      `<path d="M37 55 L112 113 M245 48 L174 111" ${S} stroke-width="5"/><circle cx="33" cy="51" r="7" ${S} stroke-width="4"/><circle cx="250" cy="44" r="7" ${S} stroke-width="4"/>`,
      `<path d="M113 40 Q122 28 131 40 V58 M161 34 Q170 22 179 34 V52 M28 188 Q145 177 274 188" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-04': {
    title: 'Золотая труба',
    palette: ['#facc15', '#f59e0b', '#fb7185', '#60a5fa', '#a78bfa'],
    intro: 'У трубы есть длинная трубка, три кнопки и большой раскрытый раструб, откуда вылетает звук.',
    stepHints: ['нарисуй длинную трубку трубы', 'раскрой справа большой раструб', 'добавь три клапана-кнопки', 'нарисуй ручку и маленький мундштук', 'покажи громкий звук нотами'],
    storyPrompt: 'Раскрась трубу золотым цветом и придумай, она играет марш или весёлую песню.',
    storyMissions: ['Выдели раструб', 'Найди три кнопки', 'Добавь громкую ноту'],
    layers: [
      `<path d="M58 103 H208 M58 122 H208 Q223 122 232 112 Q223 102 208 102" ${S} stroke-width="6"/>`,
      `<path d="M208 84 L267 61 V163 L208 140 Z" ${S} stroke-width="6"/><ellipse cx="267" cy="112" rx="12" ry="51" ${S} stroke-width="4"/>`,
      `<path d="M104 102 V75 H120 V103 M135 102 V68 H151 V103 M166 102 V77 H182 V103" ${S} stroke-width="4"/><circle cx="112" cy="70" r="5" ${S} stroke-width="3"/><circle cx="143" cy="63" r="5" ${S} stroke-width="3"/><circle cx="174" cy="72" r="5" ${S} stroke-width="3"/>`,
      `<path d="M58 96 H38 V129 H58 M121 123 Q130 153 157 145 Q174 140 180 122" ${S} stroke-width="5"/>`,
      `<path d="M28 57 Q37 45 46 57 V79 M71 43 Q80 31 89 43 V65 M245 35 Q254 23 263 35 V55 M24 182 Q143 172 278 182" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-05': {
    title: 'Гитара с узором',
    palette: ['#d97706', '#f59e0b', '#facc15', '#fb7185', '#60a5fa'],
    intro: 'У гитары большая фигурная дека, круглая розетка, длинный гриф и шесть струн.',
    stepHints: ['нарисуй фигурный корпус гитары', 'добавь круглое отверстие в центре', 'вытяни длинный гриф и головку', 'проведи струны и добавь колки', 'укрась корпус крупным узором'],
    storyPrompt: 'Раскрась гитару и придумай песню, которую на ней сыграют.',
    storyMissions: ['Выдели корпус', 'Проведи струны', 'Добавь личный узор'],
    layers: [
      `<path d="M91 91 Q58 69 43 96 Q30 123 57 140 Q39 166 65 187 Q94 207 116 178 Q137 205 165 187 Q191 166 173 140 Q199 123 186 96 Q171 69 138 91 Q119 72 91 91 Z" ${S} stroke-width="6"/>`,
      `<circle cx="115" cy="134" r="23" ${S} stroke-width="5"/><circle cx="115" cy="134" r="12" ${S} stroke-width="3"/>`,
      `<path d="M128 111 L202 35 L222 54 L146 128 Z" ${S} stroke-width="6"/><path d="M202 35 L218 20 L239 42 L222 54 Z" ${S} stroke-width="4"/>`,
      `<path d="M108 177 L218 31 M115 181 L225 37 M122 180 L231 43 M208 27 L202 18 M219 38 L229 29 M228 47 L240 42" ${S} stroke-width="2.5"/>`,
      `<path d="M69 109 Q85 98 98 109 M71 159 Q88 170 101 159 M148 102 Q163 91 176 104 M147 167 Q162 177 175 165 M28 198 H273" ${S} stroke-width="3.5"/>`,
    ],
  },
  'preschool-m1-d17-06': {
    title: 'Маленькое пианино',
    palette: ['#a78bfa', '#f9a8d4', '#f8fafc', '#334155', '#facc15'],
    intro: 'Пианино похоже на красивый шкафчик с рядом белых и чёрных клавиш и маленьким стульчиком.',
    stepHints: ['поставь прямоугольный корпус пианино', 'добавь ряд больших белых клавиш', 'расставь короткие чёрные клавиши', 'нарисуй ножки и круглый стульчик', 'поставь сверху ноты и добавь музыку'],
    storyPrompt: 'Раскрась пианино и придумай, какая мелодия звучит — тихая или бодрая.',
    storyMissions: ['Отдели клавиши', 'Укрась корпус', 'Выбери настроение музыки'],
    layers: [
      `<rect x="53" y="45" width="194" height="119" rx="8" ${S} stroke-width="6"/><path d="M67 45 V28 H233 V45" ${S} stroke-width="5"/>`,
      `<path d="M68 98 H232 V139 H68 Z M91 98 V139 M114 98 V139 M137 98 V139 M160 98 V139 M183 98 V139 M206 98 V139" ${S} stroke-width="3.5"/>`,
      `<path d="M84 98 V121 H98 V98 M107 98 V121 H121 V98 M153 98 V121 H167 V98 M176 98 V121 H190 V98 M199 98 V121 H213 V98" ${S} stroke-width="4"/>`,
      `<path d="M73 164 V188 M227 164 V188" ${S} stroke-width="7"/><ellipse cx="150" cy="177" rx="32" ry="10" ${S} stroke-width="4"/><path d="M132 183 L128 199 M168 183 L172 199" ${S} stroke-width="5"/>`,
      `<path d="M119 77 Q128 65 137 77 V94 M161 68 Q170 56 179 68 V88 M27 199 Q148 190 275 199" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-07': {
    title: 'Девочка играет на гитаре',
    palette: ['#f9a8d4', '#60a5fa', '#d97706', '#facc15', '#22c55e'],
    intro: 'Теперь инструмент оживает в руках музыканта: девочка держит гитару, одной рукой прижимает струны, другой играет.',
    stepHints: ['нарисуй голову и причёску девочки', 'добавь платье и сидячую позу', 'положи перед ней большую гитару', 'соедини руки с грифом и струнами', 'добавь стул, пол и летящие ноты'],
    storyPrompt: 'Раскрась музыканта и придумай название её первой песни.',
    storyMissions: ['Раскрась одежду', 'Выдели гитару', 'Назови песню'],
    layers: [
      `<circle cx="91" cy="71" r="25" ${S} stroke-width="5"/><path d="M68 67 Q72 39 94 44 Q117 47 116 75 M70 60 Q55 75 67 91 M113 61 Q128 75 115 92" ${S} stroke-width="4"/><circle cx="84" cy="70" r="3" fill="currentColor"/><circle cx="99" cy="70" r="3" fill="currentColor"/><path d="M84 82 Q92 88 101 82" ${S} stroke-width="3"/>`,
      `<path d="M73 101 Q92 92 111 103 L125 157 Q93 170 60 157 Z M70 157 Q61 177 68 190 M110 159 Q122 178 116 191" ${S} stroke-width="6"/>`,
      `<path d="M106 112 Q126 96 144 111 Q157 125 145 143 Q159 158 145 174 Q127 188 111 169 Q95 181 79 168 Q65 153 78 139 Q65 124 80 112 Q91 103 106 112 Z" ${S} stroke-width="5"/><circle cx="111" cy="142" r="13" ${S} stroke-width="3"/><path d="M134 119 L217 73 L228 90 L145 142" ${S} stroke-width="5"/>`,
      `<path d="M76 112 Q92 128 108 139 M112 105 Q139 98 170 102 M111 130 L220 80 M116 135 L223 86" ${S} stroke-width="4"/>`,
      `<path d="M54 166 H128 M61 166 V195 M121 166 V195 M28 196 H270 M183 49 Q192 37 201 49 V69 M236 42 Q245 30 254 42 V62" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-08': {
    title: 'Мальчик играет на трубе',
    palette: ['#60a5fa', '#22c55e', '#facc15', '#f59e0b', '#fb7185'],
    intro: 'Мальчик подносит трубу к губам, нажимает кнопки и направляет широкий раструб вперёд.',
    stepHints: ['нарисуй голову мальчика и надутые щёки', 'добавь туловище и устойчивые ноги', 'протяни вперёд длинную трубу', 'положи пальцы на три кнопки', 'добавь громкие ноты перед раструбом'],
    storyPrompt: 'Раскрась музыканта и придумай, кого он зовёт своей весёлой трубой.',
    storyMissions: ['Покажи надутые щёки', 'Раскрась трубу', 'Добавь громкий звук'],
    layers: [
      `<circle cx="78" cy="78" r="25" ${S} stroke-width="5"/><path d="M57 70 Q62 42 84 48 Q105 52 103 79 M60 57 Q76 41 96 54" ${S} stroke-width="4"/><circle cx="72" cy="76" r="3" fill="currentColor"/><circle cx="88" cy="76" r="3" fill="currentColor"/><circle cx="99" cy="86" r="7" ${S} stroke-width="3"/>`,
      `<path d="M61 108 Q79 99 98 110 L109 161 H51 Z M63 161 L58 189 M96 161 L102 189" ${S} stroke-width="6"/>`,
      `<path d="M101 86 H225 M101 101 H225 Q238 101 247 94 Q238 87 225 87 M225 70 L280 51 V137 L225 118 Z" ${S} stroke-width="5"/>`,
      `<path d="M116 88 V68 H130 V88 M142 88 V61 H156 V88 M168 88 V68 H182 V88 M65 119 Q91 94 123 94 M98 119 Q129 105 164 101" ${S} stroke-width="4"/>`,
      `<path d="M247 41 Q256 29 265 41 V62 M259 154 Q268 142 277 154 V175 M25 192 Q142 182 279 192" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-09': {
    title: 'Весёлый музыкальный дуэт',
    palette: ['#fb7185', '#38bdf8', '#facc15', '#a78bfa', '#22c55e'],
    intro: 'Два музыканта смотрят друг на друга: один встряхивает маракасы, другой отбивает ритм на бубне.',
    stepHints: ['нарисуй слева музыканта с маракасами', 'добавь справа второго музыканта', 'положи в его руки круглый бубен', 'покажи поднятые руки и общий ритм', 'добавь сцену, ноты и цветные огоньки'],
    storyPrompt: 'Раскрась дуэт и придумай название их музыкальной группы.',
    storyMissions: ['Раздели героев цветом', 'Выдели инструменты', 'Назови группу'],
    layers: [
      `<circle cx="72" cy="78" r="20" ${S} stroke-width="4"/><path d="M57 103 Q72 96 88 104 L96 153 H48 Z M58 153 L55 181 M84 153 L88 181 M55 113 Q37 101 31 87 M88 113 Q105 101 111 87" ${S} stroke-width="5"/><path d="M24 67 Q34 61 40 70 Q45 80 36 87 Q27 92 20 84 Q14 75 24 67 Z M104 67 Q114 61 120 70 Q125 80 116 87 Q107 92 100 84 Q94 75 104 67 Z" ${S} stroke-width="3.5"/>`,
      `<circle cx="220" cy="78" r="20" ${S} stroke-width="4"/><path d="M205 103 Q220 96 236 104 L244 153 H196 Z M207 153 L204 181 M232 153 L236 181 M205 114 Q188 105 178 116 M235 114 Q251 105 260 117" ${S} stroke-width="5"/><circle cx="214" cy="77" r="2.5" fill="currentColor"/><circle cx="226" cy="77" r="2.5" fill="currentColor"/><path d="M214 88 Q220 93 227 88" ${S} stroke-width="2.5"/>`,
      `<circle cx="171" cy="126" r="27" ${S} stroke-width="5"/><circle cx="171" cy="126" r="18" ${S} stroke-width="3"/><circle cx="171" cy="99" r="5" ${S} stroke-width="3"/><circle cx="171" cy="153" r="5" ${S} stroke-width="3"/>`,
      `<path d="M88 113 L143 125 M205 114 L195 123 M34 87 L55 111 M111 87 L88 111" ${S} stroke-width="4"/>`,
      `<path d="M18 189 H280 M123 53 Q132 41 141 53 V73 M159 42 Q168 30 177 42 V62 M260 54 Q269 42 278 54 V74" ${S} stroke-width="4"/>`,
    ],
  },
  'preschool-m1-d17-10': {
    title: 'Наш первый концерт',
    palette: ['#a78bfa', '#fb7185', '#60a5fa', '#facc15', '#22c55e'],
    intro: 'Финал музыкального дня — настоящий концерт. Три ребёнка играют вместе, а сцена и огоньки объединяют их в одну историю.',
    stepHints: ['открой сцену занавесом и добавь пол', 'поставь слева музыканта с гитарой', 'посади в центре музыканта за ксилофоном', 'добавь справа музыканта с бубном', 'зажги огоньки и наполни сцену нотами'],
    storyPrompt: 'Раскрась концерт и придумай название группы, песню и зрителей в первом ряду.',
    storyMissions: ['Раздели трёх музыкантов', 'Сделай инструменты заметными', 'Назови концерт'],
    layers: [
      `<path d="M15 24 H285 V190 H15 Z M15 24 Q47 64 30 126 Q50 147 15 174 M285 24 Q253 64 270 126 Q250 147 285 174 M15 188 H285" ${S} stroke-width="6"/>`,
      `<circle cx="70" cy="92" r="15" ${S} stroke-width="3.5"/><path d="M59 110 Q70 104 82 111 L88 153 H51 Z M58 153 L56 177 M80 153 L83 177" ${S} stroke-width="4"/><path d="M79 119 Q93 105 106 118 Q117 130 106 142 Q116 154 104 165 Q91 175 81 159 Q69 170 58 159 Q49 147 59 137 Q50 126 61 117 Z M101 122 L145 93 L152 103 L109 143" ${S} stroke-width="3.5"/>`,
      `<circle cx="157" cy="91" r="15" ${S} stroke-width="3.5"/><path d="M145 109 Q157 103 169 110 L175 146 H139 Z" ${S} stroke-width="4"/><path d="M121 145 H193 L185 172 H129 Z M130 137 H185 M139 137 V159 M152 137 V159 M165 137 V159 M178 137 V159" ${S} stroke-width="3.5"/><path d="M146 119 L135 144 M168 119 L179 144" ${S} stroke-width="4"/>`,
      `<circle cx="235" cy="92" r="15" ${S} stroke-width="3.5"/><path d="M223 110 Q235 104 247 111 L254 153 H216 Z M224 153 L221 177 M246 153 L249 177" ${S} stroke-width="4"/><circle cx="211" cy="133" r="22" ${S} stroke-width="4"/><circle cx="211" cy="133" r="14" ${S} stroke-width="2.5"/><path d="M225 118 L217 126 M242 118 L231 127" ${S} stroke-width="3.5"/>`,
      `<circle cx="69" cy="44" r="7" ${S} stroke-width="3"/><circle cx="150" cy="43" r="7" ${S} stroke-width="3"/><circle cx="231" cy="44" r="7" ${S} stroke-width="3"/><path d="M111 67 Q120 55 129 67 V86 M187 62 Q196 50 205 62 V82 M26 198 Q150 188 274 198" ${S} stroke-width="4"/>`,
    ],
  },
};

function preview(layers, palette) {
  return '<path d="M0 0 H300 V210 H0 Z" fill="#fffaf0"/>' + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join('');
}

export const authoredPremiumDay17Lessons = {};

export function applyPremiumDay17Lessons(lessons) {
  for (const [slug, design] of Object.entries(musicLessons)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const authored = {
      title: design.title,
      viewBox: '0 0 300 210',
      coloredViewBox: '0 0 300 210',
      canvas: 'landscape',
      palette: design.palette,
      intro: design.intro,
      steps: design.layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${design.stepHints[index]}.`, layer })),
      storyStageLabel: slug.endsWith('-10') ? 'Первый концерт' : (Number(slug.slice(-2)) >= 7 ? 'Музыканты' : 'Инструмент'),
      storyPrompt: design.storyPrompt,
      storyMissions: design.storyMissions,
      colorHint: 'Выбери 3–5 согласованных цветов: инструмент сделай заметным, одежду музыканта — контрастной, а ноты — яркими акцентами.',
      finishIdea: 'Инструмент узнаётся по форме, поза показывает, как на нём играют, а ноты создают ощущение звучащей музыки.',
      parentNote: 'Назовите инструмент, повторите его ритм хлопками и попросите ребёнка показать, как музыкант держит руки.',
      coloredPreview: preview(design.layers, design.palette),
    };
    authoredPremiumDay17Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
