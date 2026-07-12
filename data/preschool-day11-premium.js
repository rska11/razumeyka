// День 11 — десять явных лесных композиций.
const S='fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const drawings={
'preschool-m1-d11-01':['Листик на ветке',[`<path d="M41 142 Q88 107 154 67" ${S} stroke-width="6"/>`,`<path d="M91 112 Q57 104 53 78 Q82 68 104 102 Q103 109 91 112 Z" ${S} stroke-width="4"/>` ,`<path d="M126 85 Q127 52 155 45 Q170 72 139 94 Q130 94 126 85 Z" ${S} stroke-width="4"/>` ,`<path d="M61 84 Q81 94 98 106 M153 52 Q143 72 132 87" ${S} stroke-width="3"/>`,`<path d="M35 169 Q101 159 168 169" ${S} stroke-width="4"/>`]],
'preschool-m1-d11-02':['Жёлудь',[`<path d="M76 88 Q101 70 127 88 Q139 121 119 151 Q102 171 84 151 Q64 121 76 88 Z" ${S} stroke-width="5"/>`,`<path d="M70 92 Q101 63 133 92 Q129 108 101 110 Q74 108 70 92 Z" ${S} stroke-width="4"/>` ,`<path d="M101 69 Q101 48 116 39" ${S} stroke-width="5"/>`,`<path d="M82 83 L89 94 M101 75 V101 M121 83 L113 97" ${S} stroke-width="3"/>`,`<path d="M44 171 Q101 161 159 171" ${S} stroke-width="4"/>`]],
'preschool-m1-d11-03':['Лесной кустик',[`<path d="M49 145 Q33 125 50 110 Q40 85 66 79 Q75 54 98 67 Q119 48 132 72 Q158 70 158 96 Q178 112 160 132 Q157 157 132 155 Q109 172 91 155 Q65 166 49 145 Z" ${S} stroke-width="5"/>`,`<path d="M101 151 V91 M101 122 Q78 103 66 112 M102 110 Q125 90 139 102" ${S} stroke-width="4"/>` ,`<path d="M75 84 Q85 97 91 110 M128 77 Q119 95 109 104" ${S} stroke-width="3"/>`,`<circle cx="68" cy="128" r="4" fill="currentColor"/><circle cx="129" cy="128" r="4" fill="currentColor"/><circle cx="103" cy="88" r="4" fill="currentColor"/>`,`<path d="M38 171 Q101 162 165 171" ${S} stroke-width="4"/>`]],
'preschool-m1-d11-04':['Гриб-домик',[`<path d="M48 94 Q101 34 154 94 Q137 112 101 111 Q65 112 48 94 Z" ${S} stroke-width="5"/>`,`<path d="M75 111 Q72 141 63 169 H139 Q130 141 127 111" ${S} stroke-width="5"/>`,`<path d="M88 169 V137 Q101 126 114 137 V169" ${S} stroke-width="4"/>` ,`<circle cx="75" cy="82" r="6" ${S} stroke-width="4"/><circle cx="108" cy="62" r="7" ${S} stroke-width="4"/><circle cx="133" cy="88" r="5" ${S} stroke-width="4"/>` ,`<path d="M39 176 Q101 167 164 176 M145 170 Q151 153 157 170" ${S} stroke-width="4"/>`]],
'preschool-m1-d11-05':['Ёжик с яблоком',[`<path d="M51 122 L42 103 L62 105 L55 84 L76 94 L77 69 L94 87 Q121 74 142 95 Q160 116 145 143 Q126 165 93 157 Q61 151 51 122 Z" ${S} stroke-width="5"/>`,`<path d="M93 88 Q114 77 137 94 Q151 111 145 132 Q126 145 105 133 Q92 117 93 88 Z" ${S} stroke-width="4"/>` ,`<circle cx="123" cy="104" r="4" fill="currentColor"/><circle cx="146" cy="119" r="5" fill="currentColor"/><path d="M124 120 Q132 126 139 120" ${S} stroke-width="3"/>`,`<path d="M73 148 Q67 164 78 174 M116 153 Q119 168 130 174" ${S} stroke-width="6"/>`,`<path d="M83 86 Q75 62 94 55 Q112 67 98 88 Z M94 55 Q96 44 104 39 M35 181 H166" ${S} stroke-width="4"/>`]],
'preschool-m1-d11-06':['Совёнок на ветке',[`<path d="M69 91 Q69 60 101 55 Q134 60 135 92 V139 Q103 157 69 139 Z" ${S} stroke-width="5"/>`,`<path d="M72 73 L59 50 L84 61 M131 73 L144 50 L119 61" ${S} stroke-width="4"/>` ,`<circle cx="88" cy="91" r="13" ${S} stroke-width="4"/><circle cx="116" cy="91" r="13" ${S} stroke-width="4"/><circle cx="88" cy="91" r="4" fill="currentColor"/><circle cx="116" cy="91" r="4" fill="currentColor"/>`,`<path d="M97 105 L103 112 L109 105 Z M78 119 Q89 103 99 123 M107 123 Q118 103 128 119" ${S} stroke-width="4"/>` ,`<path d="M42 153 Q102 144 163 153 M78 151 L72 170 M126 151 L132 170" ${S} stroke-width="5"/>`]],
'preschool-m1-d11-07':['Лесная тропинка',[`<path d="M82 197 Q92 157 112 127 Q128 103 123 78 M208 197 Q177 158 148 132 Q121 108 140 75" ${S} stroke-width="6"/>`,`<path d="M27 166 Q55 138 84 156 M205 151 Q239 125 270 151" ${S} stroke-width="4"/>` ,`<path d="M45 153 V96 M246 142 V83" ${S} stroke-width="6"/>`,`<path d="M18 101 Q43 61 70 96 Q88 61 111 102 M213 88 Q242 43 278 88" ${S} stroke-width="4"/>` ,`<circle cx="157" cy="44" r="17" ${S} stroke-width="4"/>`]],
'preschool-m1-d11-08':['Домик в лесу',[`<path d="M26 134 L69 94 L113 134 M38 134 H103 V178 H38 Z M61 178 V151 H79 V178" ${S} stroke-width="5"/>`,`<path d="M163 177 V101 M163 126 Q137 105 127 128 M163 117 Q190 93 201 119" ${S} stroke-width="6"/>`,`<path d="M133 102 Q142 73 163 82 Q180 61 194 85 Q221 82 224 108 Q207 126 177 122 Q151 128 133 102 Z" ${S} stroke-width="4"/>` ,`<path d="M226 176 Q230 144 244 167 Q247 137 261 164" ${S} stroke-width="4"/>` ,`<path d="M15 183 Q118 170 281 183" ${S} stroke-width="4"/><circle cx="265" cy="43" r="16" ${S} stroke-width="4"/>`]],
'preschool-m1-d11-09':['Зверёк у дерева',[`<path d="M58 177 V103 M58 127 Q34 107 26 129 M58 117 Q83 96 94 120" ${S} stroke-width="6"/>`,`<path d="M24 101 Q33 69 57 79 Q76 56 91 83 Q117 82 119 108 Q96 126 70 120 Q42 127 24 101 Z" ${S} stroke-width="4"/>` ,`<path d="M161 104 Q162 79 185 75 Q210 79 213 104 Q209 129 187 134 Q164 129 161 104 Z M164 88 Q144 78 148 107 M210 88 Q230 78 226 107" ${S} stroke-width="4"/>` ,`<path d="M169 138 Q187 130 205 140 Q216 158 209 178 H164 Q155 157 169 138 Z M171 157 V179 M202 157 V179" ${S} stroke-width="6"/>`,`<circle cx="179" cy="104" r="3" fill="currentColor"/><circle cx="196" cy="104" r="3" fill="currentColor"/><path d="M179 116 Q187 122 196 116 M17 184 H245" ${S} stroke-width="3"/>`]],
'preschool-m1-d11-10':['Лесной пикник друзей',[
  `<path d="M13 181 Q76 163 144 176 Q212 189 287 169" ${S} stroke-width="5"/><ellipse cx="166" cy="145" rx="35" ry="11" ${S} stroke-width="4"/><path d="M131 145 V166 Q166 181 201 166 V145 M144 169 L140 184 M188 169 L193 183" ${S} stroke-width="5"/>`,
  `<path d="M48 171 V91 Q38 73 43 55 Q55 69 61 88 Q78 69 94 58 Q91 78 67 101 V171" ${S} stroke-width="7"/><path d="M17 73 Q25 45 49 53 Q62 27 82 49 Q106 37 116 62 Q140 67 127 89 Q104 105 78 94 Q51 109 30 94 Q10 92 17 73 Z" ${S} stroke-width="5"/>`,
  `<path d="M74 139 L66 123 L83 125 L76 107 L94 115 L95 97 Q116 92 130 107 Q142 121 135 143 Q123 158 99 157 Q80 154 74 139 Z" ${S} stroke-width="5"/><path d="M98 104 Q116 95 130 108 Q140 120 134 137 Q120 147 106 138 Q97 126 98 104 Z" ${S} stroke-width="4"/><circle cx="119" cy="116" r="3" fill="currentColor"/><circle cx="136" cy="127" r="4" fill="currentColor"/><path d="M116 132 Q123 137 130 132 M87 154 L82 174 M119 155 L124 173" ${S} stroke-width="4"/>`,
  `<path d="M222 104 Q219 75 230 52 Q244 70 241 101 M246 105 Q249 75 264 56 Q271 82 260 111" ${S} stroke-width="5"/><path d="M215 111 Q235 94 255 109 Q270 127 261 151 Q249 166 224 160 Q207 148 215 111 Z" ${S} stroke-width="5"/><circle cx="228" cy="126" r="3" fill="currentColor"/><circle cx="246" cy="124" r="3" fill="currentColor"/><path d="M233 137 Q241 143 249 136 M222 157 L217 177 M252 158 L258 176 M216 132 L198 144" ${S} stroke-width="4"/>`,
  `<path d="M150 139 Q146 127 156 123 Q166 124 166 138 Z M176 139 Q173 126 184 124 Q195 127 192 140 Z M156 123 Q158 116 164 113 M184 124 Q185 116 191 113" ${S} stroke-width="3.5"/><path d="M24 174 Q29 157 35 174 M104 177 Q110 160 116 177 M270 169 Q276 151 283 169 M77 178 Q82 163 88 178" ${S} stroke-width="4"/><path d="M207 72 Q215 63 223 72 Q215 81 207 72 Z M215 72 V84" ${S} stroke-width="3"/><circle cx="28" cy="158" r="4" fill="currentColor"/><circle cx="276" cy="150" r="4" fill="currentColor"/>`
]]};
function preview(l,p,w){return `<path d="M0 0 H${w?300:200} V${w?210:200} H0 Z" fill="#f0fdf4"/>`+l.map((x,i)=>paint(x,p[i%p.length])).join('')}
export const authoredPremiumDay11Lessons = {};

export function applyPremiumDay11Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const lessonNumber = Number(slug.slice(-2));
    const wide = lessonNumber >= 8;
    const finale = lessonNumber === 10;
    const palette = finale
      ? ['#a16207', '#22c55e', '#f97316', '#a78bfa', '#ef4444']
      : ['#22c55e', '#a3e635', '#f97316', '#92400e'];
    const stepHints = finale
      ? ['наметь поляну и столик-пенёк', 'вырасти большое дерево над поляной', 'нарисуй ёжика, который пришёл в гости', 'посади напротив ушастого зайчика', 'добавь яблоки, траву, цветы и бабочку']
      : ['добавь отдельную часть лесной истории', 'добавь отдельную часть лесной истории', 'добавь отдельную часть лесной истории', 'добавь отдельную часть лесной истории', 'добавь отдельную часть лесной истории'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: finale
        ? 'Сегодня лесные друзья встретятся на поляне. Ёжик и зайчик сядут у столика-пенька и поделятся яблоками под большим деревом.'
        : `Сегодня ты нарисуешь «${title.toLowerCase()}». В лесу каждая форма отличается: лист, гриб, зверёк, дерево и дорожка занимают своё место.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${stepHints[index]}.`, layer })),
      storyStageLabel: finale ? 'Лесной пикник' : (wide ? 'Лесная история' : 'Лес'),
      ...(finale ? {
        storyPrompt: 'Раскрась лесных друзей и угощение. Придумай, кто принёс яблоки, о чём говорят ёжик и зайчик и кого они ещё ждут в гости.',
        storyMissions: ['Раскрась друзей по-разному', 'Добавь любимое угощение', 'Придумай третьего гостя'],
        colorHint: 'Сделай дерево спокойным зелёным, друзей — разными по цвету, а красные яблоки оставь самым ярким акцентом.',
        finishIdea: 'Получилась живая лесная история: герои смотрят друг на друга, делятся угощением и действительно проводят время вместе.',
        parentNote: 'Спросите ребёнка, как друзья делят угощение и что скажут друг другу. Так рисунок развивает не только моторику, но и связную речь.',
      } : {}),
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay11Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
