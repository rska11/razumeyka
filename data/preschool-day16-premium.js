// День 16 — десять широких сцен с разной архитектурой, героем и событием.
const S='fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const d={
'preschool-m1-d16-01':['Домик на закате',[
  `<path d="M15 166 Q78 151 140 165 Q206 179 287 159" ${S} stroke-width="5"/><path d="M176 154 Q224 138 281 151" ${S} stroke-width="3.5"/>`,
  `<path d="M43 120 L91 78 L140 120 M55 120 H129 V170 H55 Z M84 170 V141 H104 V170" ${S} stroke-width="5"/><path d="M116 91 V69 H128 V106" ${S} stroke-width="4"/>`,
  `<rect x="63" y="129" width="17" height="16" rx="2" ${S} stroke-width="4"/><rect x="108" y="129" width="17" height="16" rx="2" ${S} stroke-width="4"/><path d="M71 129 V145 M63 137 H80 M116 129 V145 M108 137 H125 M72 50 Q80 42 88 50 M96 43 Q104 35 112 43" ${S} stroke-width="3"/>`,
  `<path d="M216 151 A26 26 0 0 1 268 151 Z" ${S} stroke-width="5"/><path d="M242 112 V100 M214 123 L205 114 M270 123 L279 114 M206 145 H194 M278 145 H290" ${S} stroke-width="4"/>`,
  `<path d="M190 160 V120 M190 135 Q173 121 167 138 M190 141 Q208 125 215 143 M27 165 Q33 148 40 165 M151 164 Q157 148 164 164" ${S} stroke-width="4"/>`
]],
'preschool-m1-d16-02':['Луна над крышей',[`<path d="M18 172 Q89 157 154 170 Q220 183 285 165" ${S} stroke-width="5"/>`,`<path d="M84 128 L136 83 L188 128 M98 128 H176 V174 H98 Z M128 174 V146 H148 V174" ${S} stroke-width="5"/>`,`<path d="M115 136 H130 V151 H115 Z M149 136 H164 V151 H149 Z M163 83 V55 H179 V99" ${S} stroke-width="4"/>` ,`<path d="M229 29 Q198 41 194 70 Q192 99 216 114 Q238 126 257 108 Q234 109 224 91 Q212 70 221 49 Q224 37 229 29 Z" ${S} stroke-width="5"/>`,`<path d="M36 151 Q43 132 51 151 M235 157 Q243 137 251 157" ${S} stroke-width="4"/><circle cx="49" cy="61" r="4" fill="currentColor"/>`]],
'preschool-m1-d16-03':['Дерево у окна',[`<path d="M16 177 Q90 160 153 174 Q220 187 287 168" ${S} stroke-width="5"/>`,`<path d="M29 111 L66 78 L104 111 M39 111 H94 V169 H39 Z M55 123 H79 V148 H55 Z M63 123 V148 M55 135 H79" ${S} stroke-width="5"/>`,`<path d="M185 171 V108 M185 133 Q158 112 149 135 M185 124 Q211 101 224 126" ${S} stroke-width="7"/>`,`<path d="M145 104 Q151 72 177 81 Q195 55 213 84 Q240 80 244 109 Q222 130 195 122 Q166 131 145 104 Z" ${S} stroke-width="4"/>` ,`<circle cx="171" cy="95" r="4" fill="currentColor"/><circle cx="211" cy="100" r="4" fill="currentColor"/><path d="M252 163 Q260 141 269 163" ${S} stroke-width="4"/><circle cx="264" cy="44" r="17" ${S} stroke-width="4"/>`]],
'preschool-m1-d16-04':['Кот у двери',[`<path d="M17 177 Q91 161 155 175 Q222 188 286 169" ${S} stroke-width="5"/>`,`<path d="M26 123 L70 84 L114 123 M38 123 H103 V173 H38 Z M61 173 V143 H81 V173" ${S} stroke-width="5"/>`,`<path d="M142 125 L136 101 L154 112 Q166 106 178 112 L196 101 L191 127 Q188 150 167 155 Q145 150 142 125 Z" ${S} stroke-width="4"/>` ,`<path d="M149 158 Q168 149 187 160 Q197 176 191 187 H144 Q136 175 149 158 Z M191 169 Q217 158 219 178" ${S} stroke-width="5"/>`,`<circle cx="158" cy="128" r="3" fill="currentColor"/><circle cx="177" cy="128" r="3" fill="currentColor"/><path d="M161 140 Q168 146 176 140 M18 188 H238" ${S} stroke-width="3"/><circle cx="264" cy="44" r="16" ${S} stroke-width="4"/>`]],
'preschool-m1-d16-05':['Машина у дома',[`<path d="M15 180 Q95 163 160 177 Q224 190 287 171" ${S} stroke-width="5"/>`,`<path d="M25 122 L64 87 L104 122 M36 122 H94 V171 H36 Z M57 171 V145 H74 V171" ${S} stroke-width="5"/>`,`<path d="M139 148 H231 Q242 149 246 165 H129 Q132 153 139 148 Z M158 148 L172 127 H207 L225 148" ${S} stroke-width="5"/>`,`<circle cx="158" cy="169" r="11" ${S} stroke-width="4"/><circle cx="219" cy="169" r="11" ${S} stroke-width="4"/><path d="M177 130 V148" ${S} stroke-width="3"/>`,`<circle cx="267" cy="45" r="17" ${S} stroke-width="4"/><path d="M110 67 Q123 52 138 66 Q151 48 169 65" ${S} stroke-width="4"/>`]],
'preschool-m1-d16-06':['Цветы возле дома',[`<path d="M16 178 Q88 159 151 174 Q216 189 286 168" ${S} stroke-width="5"/>`,`<path d="M65 117 L116 72 L167 117 M78 117 H154 V170 H78 Z M109 170 V140 H129 V170" ${S} stroke-width="5"/>`,`<path d="M27 159 V130 M27 139 Q15 128 11 141 M27 138 Q39 126 44 140 M54 166 V132 M54 143 Q42 132 38 145 M54 142 Q67 130 72 144" ${S} stroke-width="4"/>` ,`<path d="M205 164 V125 M205 138 Q191 125 186 140 M205 137 Q220 123 226 139 M242 162 V132 M242 143 Q230 132 226 145 M242 142 Q255 130 260 144" ${S} stroke-width="4"/>` ,`<circle cx="27" cy="123" r="7" ${S} stroke-width="4"/><circle cx="54" cy="125" r="7" ${S} stroke-width="4"/><circle cx="205" cy="118" r="8" ${S} stroke-width="4"/><circle cx="242" cy="125" r="7" ${S} stroke-width="4"/><circle cx="269" cy="43" r="16" ${S} stroke-width="4"/>`]],
'preschool-m1-d16-07':['Облако над домом',[`<path d="M16 177 Q92 160 154 174 Q220 188 286 168" ${S} stroke-width="5"/>`,`<path d="M64 127 L111 86 L159 127 M77 127 H147 V171 H77 Z M103 171 V144 H122 V171" ${S} stroke-width="5"/>`,`<path d="M169 51 Q180 35 195 49 Q208 30 226 48 Q245 47 250 65 H169 Q157 62 169 51 Z" ${S} stroke-width="4"/>` ,`<path d="M184 78 L177 96 M211 78 L204 98 M238 78 L231 96" ${S} stroke-width="4"/>` ,`<path d="M32 165 Q39 145 47 165 M252 158 Q259 138 268 158" ${S} stroke-width="4"/><circle cx="47" cy="52" r="16" ${S} stroke-width="4"/>`]],
'preschool-m1-d16-08':['Дом и семья',[`<path d="M15 181 Q89 162 151 176 Q220 191 286 171" ${S} stroke-width="5"/>`,`<path d="M24 123 L66 86 L109 123 M36 123 H98 V172 H36 Z M58 172 V145 H76 V172" ${S} stroke-width="5"/>`,`<path d="M139 89 Q140 69 158 66 Q178 69 178 90 Q175 108 159 112 Q141 108 139 89 Z M207 87 Q208 65 227 62 Q248 65 248 88 Q245 108 228 112 Q209 108 207 87 Z" ${S} stroke-width="4"/>` ,`<path d="M143 116 Q159 108 175 117 Q185 139 181 167 H136 Q133 140 143 116 Z M211 116 Q228 108 245 117 Q255 139 251 167 H204 Q201 140 211 116 Z" ${S} stroke-width="5"/>`,`<path d="M141 128 Q125 139 120 154 M176 128 Q191 137 202 144 M211 128 Q201 138 198 147 M246 128 Q262 138 268 153 M150 168 V184 M169 168 V184 M218 168 V184 M239 168 V184" ${S} stroke-width="6"/>`]],
'preschool-m1-d16-09':['Двор с машиной',[`<path d="M14 181 Q88 160 153 176 Q220 191 287 169" ${S} stroke-width="5"/>`,`<path d="M22 126 L60 92 L99 126 M33 126 H89 V172 H33 Z M53 172 V148 H70 V172" ${S} stroke-width="4"/>` ,`<path d="M129 148 H219 Q231 150 235 166 H119 Q122 153 129 148 Z M148 148 L162 128 H196 L214 148" ${S} stroke-width="5"/>`,`<circle cx="148" cy="170" r="11" ${S} stroke-width="4"/><circle cx="209" cy="170" r="11" ${S} stroke-width="4"/><path d="M102 174 Q117 157 130 174" ${S} stroke-width="4"/>` ,`<path d="M255 166 V114 M255 132 Q235 115 228 134 M255 140 Q275 121 283 142" ${S} stroke-width="4"/><circle cx="265" cy="44" r="17" ${S} stroke-width="4"/>`]],
'preschool-m1-d16-10':['Сажаем деревце во дворе',[
  `<path d="M14 183 Q77 165 143 178 Q211 191 287 172" ${S} stroke-width="5"/><path d="M22 125 L61 91 L101 125 M33 125 H91 V174 H33 Z M54 174 V149 H71 V174 M42 136 H55 V149 H42 Z M71 136 H84 V149 H71 Z" ${S} stroke-width="4.5"/>`,
  `<circle cx="132" cy="103" r="15" ${S} stroke-width="4"/><path d="M117 121 Q132 112 148 122 Q158 139 153 154 L132 163 L108 151 Q105 134 117 121 Z" ${S} stroke-width="5"/><path d="M113 132 Q96 144 91 162 M148 132 Q161 144 172 155 M115 154 Q101 164 107 181 M143 158 Q154 168 151 181" ${S} stroke-width="6"/><circle cx="127" cy="102" r="2.5" fill="currentColor"/><circle cx="137" cy="102" r="2.5" fill="currentColor"/><path d="M127 111 Q132 115 138 111 M83 153 L97 177 M78 151 L91 146" ${S} stroke-width="3"/>`,
  `<circle cx="204" cy="112" r="13" ${S} stroke-width="4"/><path d="M191 127 Q204 119 218 128 L224 164 H184 Z" ${S} stroke-width="5"/><path d="M192 136 Q177 145 170 157 M216 136 Q229 145 233 157 M193 164 L190 182 M215 164 L218 182" ${S} stroke-width="5"/><circle cx="200" cy="111" r="2.5" fill="currentColor"/><circle cx="209" cy="111" r="2.5" fill="currentColor"/><path d="M200 119 Q204 122 209 119" ${S} stroke-width="2.5"/>`,
  `<path d="M254 176 V123 M254 141 Q236 124 229 143 M254 133 Q274 115 282 136" ${S} stroke-width="5"/><path d="M228 143 Q237 124 254 132 Q270 115 282 136 Q275 151 257 149 Q240 154 228 143 Z" ${S} stroke-width="4"/><path d="M165 153 H195 V173 H165 Z M195 157 Q210 156 208 169 Q202 177 195 171 M165 158 L156 151" ${S} stroke-width="4"/><path d="M207 166 Q218 170 227 166 M214 173 Q222 177 231 173" ${S} stroke-width="3"/>`,
  `<path d="M239 181 Q247 166 255 181 M270 177 Q276 160 283 177 M104 180 Q111 165 118 180 M24 177 Q30 160 37 177" ${S} stroke-width="4"/><circle cx="272" cy="157" r="4" fill="currentColor"/><circle cx="111" cy="163" r="4" fill="currentColor"/><circle cx="267" cy="43" r="17" ${S} stroke-width="4"/><path d="M267 18 V8 M242 43 H232 M292 43 H282 M249 25 L241 17 M285 25 L293 17 M111 64 Q119 56 127 64 M144 56 Q152 48 160 56" ${S} stroke-width="3.5"/>`
]]};
function preview(l,p){return '<path d="M0 0 H300 V210 H0 Z" fill="#fff7ed"/>'+l.map((x,i)=>paint(x,p[i%p.length])).join('')}
export const authoredPremiumDay16Lessons = {};

const specialScenes = {
  'preschool-m1-d16-01': {
    palette: ['#64748b', '#fb923c', '#facc15', '#f97316', '#22c55e'],
    intro: 'Сегодня нарисуем домик на закате. Солнце уже наполовину спряталось за холмом, небо становится тёплым, а в окнах зажигается свет.',
    stepHints: ['наметь землю и дальний вечерний холм', 'построй домик с трубой', 'зажги тёплый свет в окнах и добавь птиц', 'опусти половинку солнца за холм', 'добавь дерево и траву возле дома'],
    stageLabel: 'Вечер у дома',
    storyPrompt: 'Раскрась закат тёплыми цветами. Придумай, кто живёт в домике и чем он занимается, когда в окнах зажигается свет.',
    storyMissions: ['Сделай солнце оранжевым', 'Зажги жёлтые окна', 'Придумай вечернее занятие'],
    colorHint: 'Солнце и небо сделай оранжево-розовыми, окна — тёплыми жёлтыми, а землю и дерево — более спокойными и тёмными.',
    finishIdea: 'Время суток сразу понятно: солнце садится за холм, птицы улетают, а в доме уже горит свет.',
    parentNote: 'Обсудите с ребёнком признаки вечера: солнце становится ниже, тени темнее, в домах зажигают свет.',
  },
  'preschool-m1-d16-10': {
    palette: ['#fb923c', '#60a5fa', '#f9a8d4', '#22c55e', '#facc15'],
    intro: 'Сегодня взрослый и ребёнок вместе посадят молодое деревце во дворе: один готовит землю, другой приносит воду в лейке.',
    stepHints: ['нарисуй двор и дом на заднем плане', 'добавь взрослого с маленькой лопаткой', 'нарисуй ребёнка, который пришёл помогать', 'посади деревце и полей его из лейки', 'оживи двор цветами, солнцем и птицами'],
    stageLabel: 'Доброе дело во дворе',
    storyPrompt: 'Раскрась сцену и придумай, каким станет деревце, когда вырастет, и кто будет отдыхать в его тени.',
    storyMissions: ['Раздели героев цветом', 'Раскрась молодые листья', 'Добавь будущий плод или цветок'],
    colorHint: 'Дом сделай тёплым, одежду героев — разной, лейку — яркой, а молодое деревце выдели свежим зелёным цветом.',
    finishIdea: 'Получилась живая история о совместном деле: взрослый готовит землю, ребёнок поливает, а молодое дерево растёт между ними.',
    parentNote: 'Попросите ребёнка рассказать действия по порядку: выкопали ямку, посадили деревце, полили. Это поддерживает связную речь и понимание последовательности.',
  },
};

export function applyPremiumDay16Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(d)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const details = specialScenes[slug];
    const palette = details?.palette ?? ['#fb7185', '#fb923c', '#22c55e', '#60a5fa'];
    const genericHints = ['добавь отдельную зону двора', 'добавь отдельную зону двора', 'добавь отдельную зону двора', 'добавь отдельную зону двора', 'добавь отдельную зону двора'];
    const authored = {
      title,
      viewBox: '0 0 300 210',
      coloredViewBox: '0 0 300 210',
      canvas: 'landscape',
      palette,
      intro: details?.intro ?? `Сегодня ты нарисуешь широкую сцену «${title.toLowerCase()}». У дома, героя и природы есть отдельные места и воздух между ними.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${(details?.stepHints ?? genericHints)[index]}.`, layer })),
      storyStageLabel: details?.stageLabel ?? 'Двор',
      ...(details ? {
        storyPrompt: details.storyPrompt,
        storyMissions: details.storyMissions,
        colorHint: details.colorHint,
        finishIdea: details.finishIdea,
        parentNote: details.parentNote,
      } : {}),
      coloredPreview: preview(layers, palette),
    };
    authoredPremiumDay16Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
