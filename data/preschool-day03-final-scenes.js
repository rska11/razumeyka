// Усиленный финал дня 3: три полноценные садовые сцены с заметным ростом сложности.
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}

const scenes = {
  'preschool-m1-d03-08': {
    title: 'Ромашка и божья коровка',
    storyStageLabel: 'Встреча в саду',
    steps: [
      {
        hint: 'Шаг 1 — проведи землю и вырасти высокую ромашку слева.',
        layer: `<path d="M17 178 Q82 163 149 176 Q216 189 286 169" ${S} stroke-width="5"/><path d="M87 166 Q84 126 91 84" ${S} stroke-width="6"/>`,
      },
      {
        hint: 'Шаг 2 — добавь ромашке живые лепестки разной длины.',
        layer: `<circle cx="91" cy="75" r="12" ${S} stroke-width="4"/><path d="M91 63 Q78 41 91 31 Q105 42 91 63 M79 75 Q57 61 48 76 Q63 91 79 75 M103 75 Q126 60 135 76 Q119 92 103 75 M83 65 Q68 45 58 57 Q63 73 83 72 M99 64 Q115 43 126 56 Q119 72 100 72" ${S} stroke-width="4"/>`,
      },
      {
        hint: 'Шаг 3 — нарисуй листья и маленькие травинки вокруг цветка.',
        layer: `<path d="M88 121 Q62 103 54 126 Q70 142 88 132 M89 139 Q114 117 124 141 Q107 156 89 149 M34 174 Q39 154 46 172 M137 174 Q143 151 150 172 M260 166 Q267 143 275 165" ${S} stroke-width="4"/>`,
      },
      {
        hint: 'Шаг 4 — справа посади божью коровку: панцирь, головка и лапки.',
        layer: `<path d="M181 148 Q183 118 211 112 Q240 118 243 148 Q234 168 212 171 Q190 168 181 148 Z" ${S} stroke-width="5"/><path d="M191 123 Q198 105 212 107 Q226 106 233 123 M212 113 V169 M181 144 L164 136 M184 155 L166 161 M241 144 L259 136 M239 155 L257 162" ${S} stroke-width="3.5"/>`,
      },
      {
        hint: 'Шаг 5 — оживи жучка точками, усиками и солнечным уголком.',
        layer: `<circle cx="199" cy="137" r="4" fill="currentColor"/><circle cx="226" cy="137" r="4" fill="currentColor"/><circle cx="200" cy="155" r="4" fill="currentColor"/><circle cx="225" cy="155" r="4" fill="currentColor"/><path d="M201 111 Q192 98 184 104 M223 111 Q232 98 240 104" ${S} stroke-width="3"/><circle cx="266" cy="43" r="17" ${S} stroke-width="4"/>`,
      },
    ],
  },
  'preschool-m1-d03-09': {
    title: 'Тропинка к цветущему саду',
    storyStageLabel: 'Дорога в сад',
    steps: [
      {
        hint: 'Шаг 1 — начни с широкой дорожки, которая уходит вдаль.',
        layer: `<path d="M83 209 Q90 172 116 143 Q139 119 136 91 M224 209 Q196 174 160 148 Q128 126 157 89" ${S} stroke-width="6"/>`,
      },
      {
        hint: 'Шаг 2 — поставь в конце дорожки маленькую садовую калитку.',
        layer: `<path d="M124 105 V71 Q146 53 168 71 V105 M124 82 H168 M132 105 V77 M146 105 V66 M160 105 V77" ${S} stroke-width="4"/>`,
      },
      {
        hint: 'Шаг 3 — собери цветочную клумбу слева: три разных цветка.',
        layer: `<path d="M30 167 V131 M54 162 V119 M78 157 V128" ${S} stroke-width="4"/><circle cx="30" cy="123" r="8" ${S} stroke-width="3"/><path d="M54 112 Q43 98 54 89 Q66 99 54 112 M46 119 Q31 109 27 121 Q39 132 46 119 M62 119 Q77 108 82 121 Q69 133 62 119" ${S} stroke-width="3"/><path d="M78 121 Q66 106 78 98 Q91 108 78 121 Z" ${S} stroke-width="3"/>`,
      },
      {
        hint: 'Шаг 4 — справа добавь куст, цветы и маленькую бабочку.',
        layer: `<path d="M218 160 Q199 145 213 130 Q210 111 229 113 Q241 96 253 113 Q272 111 272 132 Q286 145 270 160 Q247 169 218 160 Z" ${S} stroke-width="4"/><path d="M238 101 Q226 88 217 98 Q224 111 238 106 M238 101 Q250 87 259 98 Q253 111 238 106 M238 104 V119" ${S} stroke-width="3"/>`,
      },
      {
        hint: 'Шаг 5 — добавь землю, солнце и воздух между уголками сада.',
        layer: `<path d="M15 174 Q72 155 117 171 M181 170 Q233 153 286 168 M20 169 Q26 148 34 168 M274 162 Q280 142 287 160" ${S} stroke-width="4"/><circle cx="269" cy="43" r="17" ${S} stroke-width="4"/><path d="M32 61 Q47 45 63 60 Q77 41 96 59" ${S} stroke-width="3"/>`,
      },
    ],
  },
  'preschool-m1-d03-10': {
    title: 'Сад мечты',
    storyStageLabel: 'Большая садовая история',
    steps: [
      {
        hint: 'Шаг 1 — положи широкую землю и наметь маленький круглый пруд.',
        layer: `<path d="M14 176 Q78 154 141 172 Q209 190 287 166" ${S} stroke-width="5"/><ellipse cx="157" cy="164" rx="53" ry="18" ${S} stroke-width="4"/>`,
      },
      {
        hint: 'Шаг 2 — слева вырасти цветущее дерево с одной мягкой кроной.',
        layer: `<path d="M62 171 V109 M62 136 Q38 116 30 139 M62 126 Q87 103 98 128" ${S} stroke-width="7"/><path d="M23 104 Q29 73 55 82 Q74 55 92 85 Q120 81 124 110 Q102 132 73 123 Q44 134 23 104 Z" ${S} stroke-width="5"/>`,
      },
      {
        hint: 'Шаг 3 — справа поставь садовую арку и дорожку к ней.',
        layer: `<path d="M213 171 V112 Q238 84 263 112 V171 M213 131 H263 M225 171 V116 M238 171 V102 M251 171 V116" ${S} stroke-width="4"/><path d="M178 181 Q204 164 222 151 M194 202 Q221 178 238 165" ${S} stroke-width="4"/>`,
      },
      {
        hint: 'Шаг 4 — оживи пруд кувшинкой, камешками и камышами.',
        layer: `<path d="M140 159 Q157 146 175 159 Q159 172 140 159 Z" ${S} stroke-width="3"/><circle cx="157" cy="151" r="6" ${S} stroke-width="3"/><path d="M111 171 Q104 155 111 139 M119 171 Q125 152 119 136 M188 173 Q196 157 190 143" ${S} stroke-width="3.5"/><ellipse cx="99" cy="178" rx="8" ry="4" ${S} stroke-width="3"/><ellipse cx="203" cy="179" rx="9" ry="4" ${S} stroke-width="3"/>`,
      },
      {
        hint: 'Шаг 5 — добавь цветы, бабочку и солнце: сад готов к выставке.',
        layer: `<path d="M25 167 V145 M25 151 Q14 141 10 153 M25 151 Q36 139 41 152 M91 169 V148 M91 154 Q80 144 76 156 M91 154 Q103 142 108 155 M260 163 Q267 141 275 162" ${S} stroke-width="3.5"/><path d="M151 91 Q138 76 127 87 Q136 101 151 96 M151 91 Q164 76 175 87 Q166 101 151 96 M151 95 V110" ${S} stroke-width="3"/><circle cx="270" cy="43" r="18" ${S} stroke-width="4"/><circle cx="48" cy="96" r="4" fill="currentColor"/><circle cx="89" cy="99" r="4" fill="currentColor"/>`,
      },
    ],
  },
};

export const authoredDay03FinalScenes = {};

export function applyDay03FinalScenes(lessons) {
  const palette = ['#22c55e', '#f9a8d4', '#facc15', '#fb923c'];
  for (const [slug, scene] of Object.entries(scenes)) {
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const authored = {
      ...scene,
      viewBox: '0 0 300 210',
      coloredViewBox: '0 0 300 210',
      canvas: 'landscape',
      palette,
      intro: `Сегодня ты создашь большую садовую работу «${scene.title.toLowerCase()}». В ней есть главный герой, место, событие и свободный воздух между деталями.`,
      storyPrompt: 'Раскрась сад тёплыми цветами, выбери главный акцент и добавь одну собственную деталь.',
      storyMissions: ['Раскрась главный объект', 'Покажи землю и небо', 'Добавь свою садовую деталь'],
      colorHint: 'Используй зелёный для сада, розовый или оранжевый для цветов, жёлтый для света и голубой для воздуха или воды.',
      finishIdea: 'Это уже не отдельный значок, а законченная садовая история на широком листе.',
      parentNote: 'Спросите, куда ведёт дорожка, кто живёт в саду и какая деталь получилась любимой. Похвалите композицию и собственную историю.',
    };
    authored.coloredPreview = '<path d="M0 0 H300 V210 H0 Z" fill="#fffaf3"/>' + authored.steps.map((step, index) => paint(step.layer, palette[index % palette.length])).join('');
    authoredDay03FinalScenes[slug] = authored;
    Object.assign(lesson, authored);
  }
}
