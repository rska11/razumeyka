// День 6 — десять самостоятельных транспортных рисунков без повторения одного автомобиля.

const O = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}

const designs = [
  {
    title: 'Колесо с цветной ступицей',
    layers: [
      `<path d="M100 45 C134 43 158 68 157 103 C156 137 132 160 98 158 C65 157 43 133 45 99 C47 66 69 46 100 45 Z" ${O} stroke-width="6"/>`,
      `<path d="M100 61 C125 60 141 79 140 103 C139 127 122 143 98 142 C75 141 60 124 62 100 C63 77 78 62 100 61 Z" ${O} stroke-width="4"/>`,
      `<circle cx="100" cy="102" r="12" ${O} stroke-width="4"/>`,
      `<path d="M100 90 V62 M111 96 L135 82 M111 110 L134 124 M99 114 L98 141 M89 109 L65 122 M89 96 L66 82" ${O} stroke-width="3.5"/>`,
      `<path d="M39 169 Q99 160 161 169" ${O} stroke-width="4"/><path d="M48 165 Q53 153 58 165 M143 165 Q149 151 154 165" ${O} stroke-width="3"/>`,
    ],
  },
  {
    title: 'Дорога у холмов',
    layers: [
      `<path d="M31 172 C58 139 66 112 96 85 C119 65 145 48 168 32" ${O} stroke-width="7"/><path d="M82 181 C92 145 105 119 128 96 C148 76 161 65 178 54" ${O} stroke-width="7"/>`,
      `<path d="M60 158 L74 146 M91 126 L104 114 M125 92 L137 81 M151 67 L161 58" ${O} stroke-width="4"/>`,
      `<path d="M20 124 Q48 92 77 116 M125 64 Q150 35 181 53" ${O} stroke-width="4"/>`,
      `<path d="M36 132 Q31 115 26 132 M165 70 Q170 52 176 68" ${O} stroke-width="3.5"/>`,
      `<path d="M30 185 Q100 176 177 184" ${O} stroke-width="3.5"/><circle cx="48" cy="57" r="15" ${O} stroke-width="3.5"/>`,
    ],
  },
  {
    title: 'Красная машинка',
    layers: [
      `<path d="M43 116 Q47 103 62 101 H139 Q153 101 160 116 L166 137 H37 Z" ${O} stroke-width="5"/>`,
      `<path d="M69 101 L86 76 H124 L143 101 Z" ${O} stroke-width="4"/>`,
      `<path d="M91 79 V101 M124 79 L139 101" ${O} stroke-width="3"/>`,
      `<circle cx="69" cy="139" r="13" ${O} stroke-width="5"/><circle cx="137" cy="139" r="13" ${O} stroke-width="5"/><circle cx="69" cy="139" r="4" fill="currentColor"/><circle cx="137" cy="139" r="4" fill="currentColor"/>`,
      `<path d="M31 161 Q99 153 171 161" ${O} stroke-width="4"/><circle cx="151" cy="116" r="4" fill="currentColor"/>`,
    ],
  },
  {
    title: 'Весёлый автобус',
    layers: [
      `<path d="M38 68 Q40 57 54 55 H148 Q162 57 163 72 V139 H38 Z" ${O} stroke-width="5"/>`,
      `<path d="M49 72 H151 V103 H49 Z M58 72 V103 M88 72 V103 M119 72 V103" ${O} stroke-width="3.5"/>`,
      `<path d="M48 112 H70 V132 H48 Z M138 109 H163 M151 109 V137" ${O} stroke-width="3.5"/>`,
      `<circle cx="66" cy="141" r="12" ${O} stroke-width="5"/><circle cx="139" cy="141" r="12" ${O} stroke-width="5"/>`,
      `<path d="M27 163 Q100 156 176 163" ${O} stroke-width="4"/><circle cx="46" cy="63" r="3" fill="currentColor"/><path d="M92 119 Q101 126 110 119" ${O} stroke-width="3"/>`,
    ],
  },
  {
    title: 'Самокат с ленточкой',
    layers: [
      `<path d="M86 144 Q109 151 136 143" ${O} stroke-width="7"/>`,
      `<path d="M127 141 L119 68 Q118 57 128 56 H145" ${O} stroke-width="5"/>`,
      `<path d="M113 69 H133" ${O} stroke-width="5"/>`,
      `<circle cx="83" cy="151" r="13" ${O} stroke-width="5"/><circle cx="139" cy="151" r="13" ${O} stroke-width="5"/>`,
      `<path d="M145 58 Q161 66 148 78 Q161 84 149 93" ${O} stroke-width="3.5"/><path d="M45 170 Q108 162 166 170" ${O} stroke-width="4"/>`,
    ],
  },
  {
    title: 'Паровозик с дымом',
    layers: [
      `<path d="M55 91 H126 Q143 95 148 116 V139 H48 V108 Q48 97 55 91 Z" ${O} stroke-width="5"/>`,
      `<path d="M61 91 V66 H112 V91 M70 73 H101 V91" ${O} stroke-width="4"/>`,
      `<path d="M119 92 V61 H137 L132 98 M143 120 H163 L153 137 H147" ${O} stroke-width="4"/>`,
      `<circle cx="72" cy="142" r="15" ${O} stroke-width="5"/><circle cx="123" cy="142" r="15" ${O} stroke-width="5"/><circle cx="72" cy="142" r="5" fill="currentColor"/><circle cx="123" cy="142" r="5" fill="currentColor"/>`,
      `<path d="M127 55 Q117 45 128 36 Q139 30 145 41 Q159 36 164 48 Q161 59 146 58" ${O} stroke-width="3.5"/><path d="M32 164 H169" ${O} stroke-width="4"/>`,
    ],
  },
  {
    title: 'Лодка с парусом',
    layers: [
      `<path d="M47 126 Q98 151 154 124 Q145 153 101 159 Q60 154 47 126 Z" ${O} stroke-width="5"/>`,
      `<path d="M101 126 V48" ${O} stroke-width="5"/>`,
      `<path d="M98 53 Q72 76 65 117 H98 Z" ${O} stroke-width="4"/>`,
      `<path d="M105 56 Q136 74 146 119 H105 Z" ${O} stroke-width="4"/>`,
      `<path d="M28 173 Q53 160 78 173 Q103 186 128 173 Q153 160 178 173" ${O} stroke-width="4"/><path d="M123 38 Q132 31 141 38" ${O} stroke-width="3"/>`,
    ],
  },
  {
    title: 'Машина приехала домой',
    layers: [
      `<path d="M25 105 L63 72 L101 105 M34 105 H92 V153 H34 Z M55 153 V128 H72 V153" ${O} stroke-width="4.5"/>`,
      `<path d="M116 127 H190 Q196 129 198 142 H108 Q110 132 116 127 Z M132 127 L143 110 H169 L181 127" ${O} stroke-width="4"/>`,
      `<circle cx="132" cy="145" r="9" ${O} stroke-width="4"/><circle cx="178" cy="145" r="9" ${O} stroke-width="4"/>`,
      `<path d="M101 158 Q144 151 198 158" ${O} stroke-width="4"/><path d="M18 159 H96" ${O} stroke-width="4"/>`,
      `<circle cx="169" cy="48" r="15" ${O} stroke-width="3.5"/><path d="M117 63 Q128 51 140 62 Q151 45 167 62" ${O} stroke-width="3"/>`,
    ],
    wide: true,
  },
  {
    title: 'Поезд под облаком',
    layers: [
      `<path d="M24 111 H91 V146 H24 Z M96 101 H151 V146 H96 Z M157 91 H211 V146 H157 Z" ${O} stroke-width="4.5"/>`,
      `<path d="M171 91 V66 H198 L207 91 M211 119 H228 L218 143 H211" ${O} stroke-width="4"/>`,
      `<path d="M36 121 H54 V136 H36 Z M65 121 H82 V136 H65 Z M109 112 H126 V130 H109 Z M169 103 H188 V121 H169 Z" ${O} stroke-width="3"/>`,
      `<circle cx="43" cy="150" r="9" ${O} stroke-width="4"/><circle cx="78" cy="150" r="9" ${O} stroke-width="4"/><circle cx="113" cy="150" r="9" ${O} stroke-width="4"/><circle cx="140" cy="150" r="9" ${O} stroke-width="4"/><circle cx="180" cy="150" r="10" ${O} stroke-width="4"/>`,
      `<path d="M32 174 H235" ${O} stroke-width="4"/><path d="M70 55 Q81 40 96 53 Q108 33 126 51 Q142 50 146 65 H70 Z" ${O} stroke-width="3.5"/>`,
    ],
    wide: true,
  },
  {
    title: 'Городская поездка',
    layers: [
      `<path d="M18 152 V84 H65 V152 M72 152 V57 H121 V152 M129 152 V94 H174 V152 M182 152 V69 H230 V152" ${O} stroke-width="4"/>`,
      `<path d="M29 96 H43 V111 H29 Z M49 96 H59 V111 H49 Z M84 71 H99 V88 H84 Z M105 71 H116 V88 H105 Z M143 106 H159 V122 H143 Z M194 82 H209 V99 H194 Z" ${O} stroke-width="3"/>`,
      `<path d="M74 153 H178 Q189 154 193 168 H65 Q67 158 74 153 Z M96 153 L109 137 H145 L160 153" ${O} stroke-width="4"/>`,
      `<circle cx="93" cy="170" r="10" ${O} stroke-width="4"/><circle cx="166" cy="170" r="10" ${O} stroke-width="4"/><path d="M15 181 H244" ${O} stroke-width="4"/>`,
      `<circle cx="256" cy="39" r="17" ${O} stroke-width="3.5"/><path d="M236 117 Q248 104 261 117 M245 117 V151" ${O} stroke-width="3.5"/>`,
    ],
    wide: true,
  },
];

function preview(layers, palette, wide) {
  const bg = wide ? '<path d="M0 0 H300 V210 H0 Z" fill="#fff7ed"/><path d="M0 157 H300 V210 H0 Z" fill="#dcfce7"/>' : '<path d="M0 0 H200 V200 H0 Z" fill="#fff7ed"/>';
  return bg + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join('');
}

export const authoredPremiumDay06Lessons = {};

export function applyPremiumDay06Lessons(lessons) {
  const surfaceHints = [
    'соедини обод, спицы и цветную ступицу',
    'добавь разметку и покажи поворот дороги',
    'поставь машинку колёсами на дорогу',
    'поставь автобус колёсами на городскую улицу',
    'поставь самокат колёсами на дорожку',
    'поставь паровоз колёсами на рельсы',
    'поставь лодку корпусом на волну',
    'поставь машину колёсами на дорогу у дома',
    'поставь поезд колёсами на рельсы',
    'поставь автомобиль колёсами на городскую улицу',
  ];
  for (let index = 0; index < designs.length; index += 1) {
    const slug = `preschool-m1-d06-${String(index + 1).padStart(2, '0')}`;
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const design = designs[index];
    const wide = design.wide ?? index >= 7;
    const palette = ['#f97316', '#38bdf8', '#facc15', '#22c55e'];
    const authored = {
      title: design.title,
      viewBox: wide ? '0 0 300 210' : '0 0 200 200',
      coloredViewBox: wide ? '0 0 300 210' : '0 0 200 200',
      ...(wide ? { canvas: 'landscape' } : {}),
      palette,
      intro: `Сегодня ты нарисуешь «${design.title.toLowerCase()}». Сначала найдём большую форму, затем добавим только те детали, по которым транспорт сразу узнаётся.`,
      steps: design.layers.map((layer, step) => ({ hint: `Шаг ${step + 1} — ${['нарисуй главную форму', 'добавь важную часть', 'покажи характерную деталь', surfaceHints[index], 'добавь место и движение'][step]}.`, layer })),
      storyStageLabel: index < 7 ? 'Транспорт' : 'Поездка',
      storyPrompt: 'Раскрась транспорт, покажи его место движения и придумай, куда он направляется.',
      storyMissions: ['Раскрась главную форму', 'Добавь место движения', 'Придумай пассажира или цель поездки'],
      colorHint: 'Выбери 3–4 согласованных цвета: один для кузова или паруса, второй для деталей, третий для дороги, воды или города.',
      finishIdea: 'По силуэту и деталям сразу понятно, какой это транспорт и где он движется.',
      parentNote: 'Спросите ребёнка, чем этот транспорт отличается от остальных и куда он едет. Хвалите узнаваемые детали и ощущение движения.',
      coloredPreview: preview(design.layers, palette, wide),
    };
    authoredPremiumDay06Lessons[slug] = authored;
    Object.assign(lesson, authored);
  }
}
