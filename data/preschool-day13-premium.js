// День 13 — десять самостоятельных рисунков еды, посуды и завтрака.
const S='fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}
const drawings={
'preschool-m1-d13-01':['Бублик с маком',[`<path d="M101 49 Q143 49 155 87 Q167 126 137 151 Q105 175 72 153 Q39 132 47 94 Q55 55 101 49 Z" ${S} stroke-width="5"/>`,`<path d="M101 80 Q122 80 128 98 Q133 117 117 128 Q100 140 85 127 Q70 114 75 98 Q80 81 101 80 Z" ${S} stroke-width="4"/>` ,`<circle cx="73" cy="77" r="3" fill="currentColor"/><circle cx="129" cy="72" r="3" fill="currentColor"/><circle cx="142" cy="105" r="3" fill="currentColor"/>`,`<circle cx="63" cy="119" r="3" fill="currentColor"/><circle cx="112" cy="151" r="3" fill="currentColor"/><circle cx="91" cy="62" r="3" fill="currentColor"/>`,`<path d="M43 177 Q101 168 159 177" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-02':['Апельсин с долькой',[`<path d="M101 51 Q139 51 153 85 Q168 121 144 148 Q119 175 83 160 Q47 146 45 109 Q43 73 74 56 Q86 51 101 51 Z" ${S} stroke-width="5"/>`,`<path d="M101 52 Q103 34 117 27 M115 39 Q137 32 135 52 Q124 55 115 39 Z" ${S} stroke-width="4"/>` ,`<path d="M101 109 L144 148 M101 109 L83 160 M101 109 L45 109 M101 109 L74 56 M101 109 L153 85" ${S} stroke-width="3"/>`,`<circle cx="101" cy="109" r="7" ${S} stroke-width="4"/>` ,`<path d="M40 177 Q101 167 163 177" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-03':['Тарелочка с узором',[`<ellipse cx="101" cy="109" rx="66" ry="48" ${S} stroke-width="5"/>`,`<ellipse cx="101" cy="109" rx="48" ry="33" ${S} stroke-width="4"/>` ,`<path d="M61 95 Q101 72 141 95 M61 123 Q101 146 141 123" ${S} stroke-width="3"/>`,`<circle cx="78" cy="109" r="4" fill="currentColor"/><circle cx="101" cy="109" r="4" fill="currentColor"/><circle cx="124" cy="109" r="4" fill="currentColor"/>`,`<path d="M38 169 Q101 160 165 169" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-04':['Чашка тёплого чая',[`<path d="M55 82 H132 V144 Q125 165 94 167 Q62 164 55 144 Z" ${S} stroke-width="5"/>`,`<path d="M132 96 Q161 91 161 119 Q159 145 133 141" ${S} stroke-width="5"/>`,`<ellipse cx="94" cy="82" rx="39" ry="12" ${S} stroke-width="4"/>` ,`<path d="M78 64 Q67 48 80 36 M101 64 Q90 47 104 34 M122 64 Q112 48 124 38" ${S} stroke-width="3"/>`,`<path d="M41 176 Q101 166 163 176" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-05':['Мороженое в рожке',[`<path d="M70 89 Q68 60 91 57 Q101 35 117 57 Q141 59 139 89 Q129 104 104 103 Q80 104 70 89 Z" ${S} stroke-width="5"/>`,`<path d="M76 101 H134 L106 171 Z" ${S} stroke-width="5"/>`,`<path d="M84 112 L122 153 M125 111 L94 151" ${S} stroke-width="3"/>`,`<circle cx="90" cy="83" r="3" fill="currentColor"/><circle cx="119" cy="82" r="3" fill="currentColor"/><path d="M94 92 Q105 99 116 92" ${S} stroke-width="3"/>`,`<path d="M46 178 Q104 169 159 178" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-06':['Пирожное с ягодкой',[`<path d="M58 104 Q64 75 88 78 Q101 58 116 78 Q140 75 146 104 Q132 120 102 119 Q72 120 58 104 Z" ${S} stroke-width="5"/>`,`<path d="M67 117 H137 L129 169 H77 Z" ${S} stroke-width="5"/>`,`<path d="M77 134 Q102 147 128 134 M83 120 L88 164 M116 120 L112 164" ${S} stroke-width="3"/>`,`<circle cx="102" cy="67" r="11" ${S} stroke-width="4"/><path d="M102 56 Q104 44 113 40" ${S} stroke-width="4"/>` ,`<path d="M43 178 Q102 169 161 178" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-07':['Ложка рядом',[`<ellipse cx="76" cy="72" rx="24" ry="34" ${S} stroke-width="5"/>`,`<path d="M76 106 Q73 142 77 178" ${S} stroke-width="8"/>`,`<path d="M120 68 H151 V158 Q136 169 120 158 Z" ${S} stroke-width="5"/>`,`<path d="M126 91 H145 M126 111 H145 M126 131 H145" ${S} stroke-width="3"/>`,`<path d="M41 182 Q101 174 160 182" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-08':['Яблоко на тарелке',[`<ellipse cx="126" cy="157" rx="91" ry="27" ${S} stroke-width="5"/>`,`<path d="M126 62 Q96 43 81 78 Q69 111 90 141 Q108 158 126 145 Q144 158 162 141 Q183 111 171 78 Q156 43 126 62 Z" ${S} stroke-width="5"/>`,`<path d="M126 62 Q129 43 142 33 M142 43 Q164 38 160 61 Q147 61 142 43" ${S} stroke-width="4"/>` ,`<circle cx="109" cy="98" r="3" fill="currentColor"/><circle cx="146" cy="104" r="3" fill="currentColor"/><path d="M110 119 Q126 131 143 119" ${S} stroke-width="3"/>`,`<path d="M25 187 Q126 176 230 187" ${S} stroke-width="4"/><circle cx="267" cy="45" r="17" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-09':['Чай у окна',[`<path d="M27 48 H126 V145 H27 Z M76 48 V145 M27 96 H126" ${S} stroke-width="5"/>`,`<path d="M35 56 Q50 69 36 84 M117 57 Q104 69 117 84" ${S} stroke-width="4"/>` ,`<path d="M161 116 H222 V166 Q216 183 191 184 Q166 182 161 166 Z M222 128 Q246 124 247 145 Q244 165 223 162" ${S} stroke-width="5"/>`,`<path d="M180 101 Q169 85 181 73 M201 101 Q190 84 203 71" ${S} stroke-width="3"/>`,`<path d="M17 188 Q126 177 250 188" ${S} stroke-width="4"/><circle cx="273" cy="45" r="16" ${S} stroke-width="4"/>`]],
'preschool-m1-d13-10':['Яичница на завтрак',[
  `<ellipse cx="139" cy="132" rx="92" ry="57" ${S} stroke-width="6"/><ellipse cx="139" cy="132" rx="78" ry="44" ${S} stroke-width="3"/><path d="M17 193 Q144 182 285 193" ${S} stroke-width="4"/>`,
  `<path d="M72 130 Q66 111 86 103 Q96 84 117 96 Q136 88 149 105 Q166 113 155 132 Q160 151 139 157 Q122 171 105 157 Q84 160 80 143 Q68 141 72 130 Z" ${S} stroke-width="5"/>`,
  `<circle cx="115" cy="127" r="22" ${S} stroke-width="5"/><path d="M106 119 Q115 112 124 119" ${S} stroke-width="3"/><circle cx="108" cy="124" r="3" fill="currentColor"/>`,
  `<path d="M164 101 Q189 87 216 103 L211 151 Q189 160 168 148 Z" ${S} stroke-width="5"/><path d="M171 111 Q189 101 208 112 M174 126 Q190 117 207 127" ${S} stroke-width="3"/>`,
  `<path d="M31 101 V164 M23 101 V122 M31 101 V122 M39 101 V122" ${S} stroke-width="4"/><path d="M237 76 H276 L271 145 Q257 154 242 145 Z" ${S} stroke-width="5"/><path d="M241 113 Q257 106 273 113 M251 71 Q257 61 264 71" ${S} stroke-width="3.5"/><circle cx="267" cy="91" r="4" fill="currentColor"/>`
]]};
function preview(l,p,w){return `<path d="M0 0 H${w?300:200} V${w?210:200} H0 Z" fill="#fff7ed"/>`+l.map((x,i)=>paint(x,p[i%p.length])).join('')}
export const authoredPremiumDay13Lessons = {};

export function applyPremiumDay13Lessons(lessons) {
  for (const [slug, [title, layers]] of Object.entries(drawings)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const lessonNumber = Number(slug.slice(-2));
    const wide = lessonNumber >= 8;
    const finale = lessonNumber === 10;
    const palette = finale
      ? ['#60a5fa', '#f8fafc', '#facc15', '#d97706', '#fb923c']
      : ['#fb923c', '#facc15', '#fb7185', '#60a5fa'];
    const stepHints = finale
      ? ['нарисуй большую круглую тарелку', 'положи на неё волнистый белок', 'добавь круглый жёлтый желток', 'положи рядом румяный тост', 'добавь вилку и прозрачный стакан сока']
      : ['добавь отдельную часть вкусной картинки', 'добавь отдельную часть вкусной картинки', 'добавь отдельную часть вкусной картинки', 'добавь отдельную часть вкусной картинки', 'добавь отдельную часть вкусной картинки'];
    const authored = {
      title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: finale
        ? 'Сегодня нарисуем простой и понятный завтрак: большую тарелку с яичницей, румяный тост и стакан апельсинового сока.'
        : `Сегодня ты нарисуешь «${title.toLowerCase()}». Посуда и еда отличаются силуэтом, деталями и тем, как стоят на столе.`,
      steps: layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${stepHints[index]}.`, layer })),
      storyStageLabel: finale ? 'Мой завтрак' : (wide ? 'Завтрак' : 'Еда и посуда'),
      ...(finale ? {
        storyPrompt: 'Раскрась яичницу, тост и сок. Придумай, что ещё ты положишь на тарелку для вкусного завтрака.',
        storyMissions: ['Сделай желток ярким', 'Подрумянь тост', 'Добавь любимый фрукт'],
        colorHint: 'Белок оставь почти белым, желток сделай солнечно-жёлтым, тост — тёплым коричневым, а сок — оранжевым.',
        finishIdea: 'Завтрак сразу узнаётся: крупная яичница лежит на тарелке, рядом видны тост, вилка и сок.',
        parentNote: 'Предложите ребёнку назвать круглые формы и продукты на рисунке. Не требуйте ровного белка — его неровный край как раз удобно и весело рисовать в 3–4 года.',
      } : {}),
      coloredPreview: preview(layers, palette, wide),
    };
    authoredPremiumDay13Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
