// День 20 — итоговая выставка: оформление, подарки, авторство и презентация работ.
const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function paint(svg, color) {
  return svg.replaceAll('currentColor', color)
    .replace(/<(circle|ellipse|rect|polygon)([^>]*?)fill="none"/g, '<$1$2fill="' + color + '" fill-opacity=".32"')
    .replace(/<path(?=[^>]*d="[^"]*[zZ])([^>]*?)fill="none"/g, '<path$1fill="' + color + '" fill-opacity=".28"');
}

const exhibitionLessons = {
  'preschool-m1-d20-01': { title: 'Значок юного художника', palette: ['#a78bfa','#facc15','#fb7185','#60a5fa','#22c55e'], intro: 'Первый знак большого финала — нарядный значок юного художника с лентами, кисточкой и яркой звездой.', stepHints: ['нарисуй большую круглую розетку','добавь две праздничные ленты','помести в центр крупную звезду','положи крест-накрест кисть и карандаш','добавь маленькие цветные точки'], prompt: 'Раскрась значок и придумай, за какое художественное достижение ты его получаешь.', missions: ['Сделай звезду яркой','Укрась ленты','Назови достижение'], layers: [
    `<circle cx="150" cy="94" r="58" ${S} stroke-width="6"/><circle cx="150" cy="94" r="43" ${S} stroke-width="3.5"/>`,
    `<path d="M116 140 L99 194 L132 177 L150 203 L154 151 M184 140 L201 194 L168 177 L150 203" ${S} stroke-width="5"/>`,
    `<path d="M150 57 L160 82 L187 84 L166 101 L173 128 L150 113 L127 128 L134 101 L113 84 L140 82 Z" ${S} stroke-width="4"/>`,
    `<path d="M91 42 L205 146 M204 40 L96 147" ${S} stroke-width="5"/><path d="M85 36 L98 40 L91 49 Z M211 34 L207 49 L198 40 Z" ${S} stroke-width="3"/>`,
    `<circle cx="98" cy="79" r="4" fill="currentColor"/><circle cx="202" cy="79" r="4" fill="currentColor"/><circle cx="111" cy="124" r="4" fill="currentColor"/><circle cx="190" cy="124" r="4" fill="currentColor"/><path d="M25 205 H275" ${S} stroke-width="3.5"/>`,
  ]},
  'preschool-m1-d20-02': { title: 'Палитра любимых цветов', palette: ['#f8fafc','#fb7185','#facc15','#3b82f6','#22c55e'], intro: 'Художник выбирает собственную палитру. На ней пять крупных красок и две разные кисточки.', stepHints: ['нарисуй большую овальную палитру','вырежи круглое отверстие для пальца','размести пять больших пятен краски','положи рядом тонкую и широкую кисти','добавь смешанный цвет в центре'], prompt: 'Выбери пять любимых цветов и придумай название новому цвету, который получится при смешивании.', missions: ['Выбери пять цветов','Различи кисти','Назови новый цвет'], layers: [
    `<path d="M65 69 Q112 25 183 43 Q245 58 245 112 Q244 163 189 181 Q138 199 91 169 Q48 142 52 102 Q54 83 65 69 Z" ${S} stroke-width="6"/>`,
    `<ellipse cx="93" cy="102" rx="19" ry="26" ${S} stroke-width="4"/>`,
    `<circle cx="139" cy="70" r="14" ${S} stroke-width="3.5"/><circle cx="180" cy="72" r="14" ${S} stroke-width="3.5"/><circle cx="210" cy="104" r="14" ${S} stroke-width="3.5"/><circle cx="192" cy="143" r="14" ${S} stroke-width="3.5"/><circle cx="145" cy="151" r="14" ${S} stroke-width="3.5"/>`,
    `<path d="M31 184 L123 106 M265 181 L177 111" ${S} stroke-width="7"/><path d="M25 190 L39 174 L47 182 L31 196 Z M272 188 L258 174 L250 182 L265 196 Z" ${S} stroke-width="3"/>`,
    `<path d="M137 109 Q154 93 171 109 Q184 125 169 138 Q152 149 138 136 Q125 124 137 109 Z" ${S} stroke-width="4"/><path d="M35 202 H272" ${S} stroke-width="3"/>`,
  ]},
  'preschool-m1-d20-03': { title: 'Открытка-букет для мамы', palette: ['#f9a8d4','#fb7185','#facc15','#22c55e','#a78bfa'], intro: 'Для мамы создадим не один условный цветок, а настоящий букет на открытке: три разных цветка, листья и большой бант.', stepHints: ['нарисуй раскрытую открытку','собери три крупных разных цветка','протяни вниз стебли','добавь широкие листья','перевяжи букет большим бантом'], prompt: 'Раскрась букет и придумай короткое доброе пожелание маме.', missions: ['Раздели три цветка','Раскрась бант','Скажи пожелание'], layers: [
    `<rect x="34" y="25" width="232" height="166" rx="8" ${S} stroke-width="6"/><path d="M150 25 V191" ${S} stroke-width="3"/>`,
    `<circle cx="94" cy="78" r="10" ${S} stroke-width="3.5"/><path d="M94 68 Q80 45 94 39 Q109 47 94 68 M84 78 Q61 65 56 80 Q70 95 84 78 M104 78 Q126 64 132 80 Q118 95 104 78" ${S} stroke-width="3.5"/><circle cx="150" cy="66" r="12" ${S} stroke-width="3.5"/><path d="M150 54 Q137 34 150 27 Q164 35 150 54 M138 66 Q117 54 112 68 Q126 82 138 66 M162 66 Q183 53 188 68 Q174 82 162 66" ${S} stroke-width="3.5"/><circle cx="205" cy="82" r="10" ${S} stroke-width="3.5"/><path d="M205 72 Q191 50 205 44 Q219 51 205 72 M195 82 Q173 69 168 84 Q182 98 195 82 M215 82 Q237 68 242 84 Q228 98 215 82" ${S} stroke-width="3.5"/>`,
    `<path d="M94 90 L146 154 M150 78 V154 M205 94 L156 154" ${S} stroke-width="5"/>`,
    `<path d="M121 124 Q90 109 82 130 Q103 142 133 143 M178 126 Q211 108 219 131 Q198 145 167 144" ${S} stroke-width="4"/>`,
    `<path d="M150 151 Q126 132 116 150 Q128 165 150 159 Q174 132 184 151 Q172 166 150 159 M150 159 L135 184 M150 159 L166 184" ${S} stroke-width="4"/><path d="M45 199 H255" ${S} stroke-width="3"/>`,
  ]},
  'preschool-m1-d20-04': { title: 'Открытка «Наша семья»', palette: ['#60a5fa','#22c55e','#fb7185','#facc15','#a16207'], intro: 'Семейная открытка рассказывает не через дом или машину, а через дерево с разными сердечками-листьями — для каждого близкого человека.', stepHints: ['нарисуй большую открытку с округлыми углами','вырасти в центре крепкий ствол','раскрой широкую крону','добавь сердечки-листья разного размера','перевяжи открытку праздничной лентой'], prompt: 'Раскрась сердечки разными цветами и назови, кому принадлежит каждое из них.', missions: ['Выдели дерево','Раздели сердечки цветом','Назови близких'], layers: [
    `<rect x="38" y="25" width="224" height="166" rx="12" ${S} stroke-width="6"/>`,
    `<path d="M139 174 V107 Q150 91 161 107 V174 M145 126 L119 101 M155 126 L183 98" ${S} stroke-width="7"/>`,
    `<path d="M77 105 Q65 83 84 70 Q99 59 113 72 Q126 43 151 53 Q176 40 188 67 Q213 60 225 82 Q237 106 216 122 Q204 145 178 138 Q155 155 134 139 Q108 151 94 132 Q76 129 77 105 Z" ${S} stroke-width="5"/>`,
    `<path d="M112 89 Q102 77 92 88 Q91 103 112 118 Q133 103 132 88 Q122 77 112 89 Z M158 76 Q148 64 138 75 Q137 90 158 105 Q179 90 178 75 Q168 64 158 76 Z M198 99 Q188 87 178 98 Q177 113 198 128 Q219 113 218 98 Q208 87 198 99 Z" ${S} stroke-width="3.5"/>`,
    `<path d="M38 157 H262 M54 157 Q70 140 86 157 Q70 174 54 157 M246 157 Q230 140 214 157 Q230 174 246 157" ${S} stroke-width="4"/>`,
  ]},
  'preschool-m1-d20-05': { title: 'Портрет львёнка в рамке', palette: ['#d97706','#f59e0b','#facc15','#fb7185','#60a5fa'], intro: 'Вместо безымянного зверька создадим оформленный портрет львёнка: круглая грива, ушки, мордочка и настоящая рамка.', stepHints: ['нарисуй большую декоративную рамку','собери круглую гриву львёнка','добавь голову и два ушка','оживи мордочку глазами и улыбкой','укрась рамку лапками и листочками'], prompt: 'Раскрась портрет и придумай львёнку имя и доброе качество.', missions: ['Раздели гриву и мордочку','Укрась рамку','Дай львёнку имя'], layers: [
    `<rect x="45" y="22" width="210" height="174" rx="14" ${S} stroke-width="7"/><rect x="62" y="39" width="176" height="140" rx="10" ${S} stroke-width="3.5"/>`,
    `<path d="M91 107 Q72 88 86 69 Q98 54 116 61 Q126 38 150 46 Q174 37 184 61 Q205 55 216 73 Q226 93 209 108 Q221 128 204 143 Q188 159 168 150 Q150 169 132 151 Q109 160 95 143 Q77 129 91 107 Z" ${S} stroke-width="5"/>`,
    `<circle cx="150" cy="108" r="48" ${S} stroke-width="5"/><circle cx="117" cy="77" r="14" ${S} stroke-width="4"/><circle cx="183" cy="77" r="14" ${S} stroke-width="4"/>`,
    `<circle cx="134" cy="104" r="4" fill="currentColor"/><circle cx="166" cy="104" r="4" fill="currentColor"/><ellipse cx="150" cy="119" rx="9" ry="6" fill="currentColor"/><path d="M137 130 Q150 142 164 130 M122 119 H99 M124 128 L102 135 M178 119 H201 M176 128 L198 135" ${S} stroke-width="3"/>`,
    `<path d="M57 53 Q66 39 75 53 M224 53 Q233 39 242 53 M72 182 Q81 165 90 182 M210 182 Q219 165 228 182" ${S} stroke-width="3.5"/><circle cx="78" cy="52" r="4" fill="currentColor"/><circle cx="221" cy="52" r="4" fill="currentColor"/>`,
  ]},
  'preschool-m1-d20-06': { title: 'Автопортрет художника', palette: ['#60a5fa','#fde68a','#a78bfa','#facc15','#22c55e'], intro: 'Теперь главный герой понятен: это сам маленький художник в берете, с палитрой и кистью.', stepHints: ['нарисуй большую голову и причёску','надень на художника берет','добавь одежду и улыбающееся лицо','вложи в руки палитру и кисточку','поставь рядом маленький мольберт'], prompt: 'Раскрась автопортрет и добавь одну деталь, по которой тебя легко узнать.', missions: ['Выбери цвет берета','Раскрась палитру','Добавь свою деталь'], layers: [
    `<circle cx="118" cy="82" r="38" ${S} stroke-width="5"/><path d="M84 78 Q91 38 123 45 Q153 51 155 87" ${S} stroke-width="4"/>`,
    `<path d="M83 51 Q104 25 140 37 Q157 44 151 58 Q122 48 83 61 Z" ${S} stroke-width="5"/><circle cx="133" cy="34" r="6" ${S} stroke-width="3"/>`,
    `<path d="M86 125 Q118 108 150 127 L165 184 H71 Z" ${S} stroke-width="6"/><circle cx="105" cy="80" r="4" fill="currentColor"/><circle cx="131" cy="80" r="4" fill="currentColor"/><path d="M105 98 Q118 109 132 98" ${S} stroke-width="3"/>`,
    `<path d="M88 139 Q67 146 61 165 M149 139 Q169 144 179 158" ${S} stroke-width="6"/><path d="M42 148 Q66 130 88 147 Q95 164 79 178 Q58 187 42 171 Q33 159 42 148 Z" ${S} stroke-width="4"/><circle cx="53" cy="151" r="4" fill="currentColor"/><circle cx="68" cy="146" r="4" fill="currentColor"/><path d="M179 158 L229 83" ${S} stroke-width="5"/><path d="M225 78 L238 66 L235 84 Z" ${S} stroke-width="3"/>`,
    `<path d="M206 184 L226 105 L270 105 L278 184 M216 123 H270 V170 H216 Z" ${S} stroke-width="5"/><path d="M226 158 L242 139 L258 158 M36 195 H284" ${S} stroke-width="3.5"/>`,
  ]},
  'preschool-m1-d20-07': { title: 'Подписываем картину', palette: ['#fb7185','#60a5fa','#facc15','#22c55e','#a16207'], intro: 'Выставочная работа становится авторской, когда художник выбирает рамку, ставит знак-подпись и придумывает название.', stepHints: ['нарисуй большую раму для картины','создай внутри простую цветочную композицию','добавь солнце и декоративный фон','прикрепи снизу табличку с названием','поставь в углу личный знак-подпись'], prompt: 'Раскрась картину, придумай ей название и собственный простой знак вместо сложной подписи.', missions: ['Оформи рамку','Назови картину','Придумай авторский знак'], layers: [
    `<rect x="36" y="24" width="228" height="154" rx="6" ${S} stroke-width="7"/><rect x="53" y="41" width="194" height="120" ${S} stroke-width="3.5"/>`,
    `<path d="M112 145 V96 M112 112 Q94 98 87 114 M112 119 Q131 102 139 121" ${S} stroke-width="5"/><circle cx="112" cy="84" r="13" ${S} stroke-width="4"/><path d="M172 146 V105 M172 119 Q156 106 150 121 M172 124 Q188 110 195 126" ${S} stroke-width="4"/><circle cx="172" cy="94" r="11" ${S} stroke-width="3.5"/>`,
    `<circle cx="215" cy="68" r="15" ${S} stroke-width="3.5"/><path d="M57 149 Q109 136 160 149 Q205 159 245 145 M67 65 Q78 50 91 64 Q102 46 118 62" ${S} stroke-width="3.5"/>`,
    `<rect x="91" y="179" width="118" height="24" rx="6" ${S} stroke-width="4"/><path d="M108 191 H193" ${S} stroke-width="3"/>`,
    `<path d="M224 144 L229 154 L241 155 L232 162 M62 31 L72 41 M254 31 L244 41 M62 171 L72 161 M254 171 L244 161" ${S} stroke-width="3"/>`,
  ]},
  'preschool-m1-d20-08': { title: 'Приглашение на выставку', palette: ['#a78bfa','#f8fafc','#fb7185','#facc15','#60a5fa'], intro: 'Перед открытием выставки художник готовит красивое приглашение в конверте с кисточкой, звездой и праздничной лентой.', stepHints: ['нарисуй большой открытый конверт','вложи внутрь карточку','укрась карточку кистью и звездой','добавь праздничную ленту','поставь цветную печать художника'], prompt: 'Раскрась приглашение и назови человека, которого ты пригласишь первым.', missions: ['Раздели конверт и карточку','Укрась приглашение','Назови первого гостя'], layers: [
    `<path d="M42 84 H258 V184 H42 Z M42 84 L150 154 L258 84" ${S} stroke-width="6"/>`,
    `<rect x="72" y="28" width="156" height="118" rx="7" ${S} stroke-width="5"/>`,
    `<path d="M103 119 L166 55" ${S} stroke-width="6"/><path d="M96 126 L109 110 L116 117 L102 132 Z" ${S} stroke-width="3"/><path d="M187 55 L193 70 L209 71 L197 81 L201 97 L187 88 L174 97 L177 81 L165 71 L181 70 Z" ${S} stroke-width="3.5"/>`,
    `<path d="M84 45 H216 M93 45 Q110 27 127 45 Q110 63 93 45 M207 45 Q190 27 173 45 Q190 63 207 45" ${S} stroke-width="4"/>`,
    `<circle cx="223" cy="159" r="20" ${S} stroke-width="4"/><path d="M223 146 L228 157 L240 158 L231 166 L234 178 L223 171 L212 178 L215 166 L206 158 L218 157 Z M25 198 H275" ${S} stroke-width="3"/>`,
  ]},
  'preschool-m1-d20-09': { title: 'Домашняя галерея', palette: ['#facc15','#60a5fa','#fb7185','#22c55e','#a78bfa'], intro: 'Вместо непонятного стола построим настоящую стену домашней галереи с тремя разными рамами, гирляндой и подписями.', stepHints: ['наметь чистую стену и пол галереи','повесь большую центральную картину','добавь две рамки другой формы','подпиши каждую работу маленькой табличкой','укрась галерею флажками и светом'], prompt: 'Раскрась галерею и выбери, какая работа висит в самом важном месте.', missions: ['Различи три рамы','Добавь таблички','Выбери главную работу'], layers: [
    `<path d="M16 184 H284 M22 24 H278 V184" ${S} stroke-width="5"/>`,
    `<rect x="103" y="43" width="94" height="91" rx="6" ${S} stroke-width="6"/><path d="M116 119 L139 94 L160 116 L177 98 L187 119 M167 68 Q177 53 187 68" ${S} stroke-width="3.5"/>`,
    `<circle cx="59" cy="93" r="34" ${S} stroke-width="5"/><path d="M44 101 Q59 77 74 101 Q66 117 59 116 Q52 116 44 101 Z" ${S} stroke-width="3"/><rect x="220" y="58" width="46" height="70" rx="12" ${S} stroke-width="5"/><path d="M230 111 Q243 85 256 111" ${S} stroke-width="3"/>`,
    `<rect x="120" y="139" width="60" height="15" rx="4" ${S} stroke-width="3"/><rect x="36" y="134" width="46" height="14" rx="4" ${S} stroke-width="3"/><rect x="220" y="135" width="46" height="14" rx="4" ${S} stroke-width="3"/>`,
    `<path d="M31 35 Q150 12 269 35 M46 31 L55 45 L64 28 M91 24 L101 39 L110 21 M143 19 L152 34 L161 19 M198 22 L207 38 L216 25 M248 30 L257 44 L266 34" ${S} stroke-width="3.5"/><circle cx="38" cy="166" r="5" fill="currentColor"/><circle cx="262" cy="166" r="5" fill="currentColor"/>`,
  ]},
};

function preview(layers, palette) { return '<path d="M0 0 H300 V210 H0 Z" fill="#fffaf0"/>' + layers.map((layer, index) => paint(layer, palette[index % palette.length])).join(''); }
export const authoredPremiumDay20Lessons = {};
export function applyPremiumDay20Lessons(lessons) {
  for (const [slug, design] of Object.entries(exhibitionLessons)) {
    const lesson = lessons.find((item) => item.slug === slug); if (!lesson) continue;
    const authored = { title: design.title, viewBox: '0 0 300 210', coloredViewBox: '0 0 300 210', canvas: 'landscape', palette: design.palette, intro: design.intro,
      steps: design.layers.map((layer, index) => ({ hint: `Шаг ${index + 1} — ${design.stepHints[index]}.`, layer })), storyStageLabel: 'Моя выставка', storyPrompt: design.prompt, storyMissions: design.missions,
      colorHint: 'Выбери ограниченную палитру из 3–5 цветов и повтори главный цвет в нескольких деталях — так работа будет выглядеть собранной.',
      finishIdea: 'Работа имеет понятный центр, аккуратное оформление и авторскую деталь, по которой её можно узнать на выставке.',
      parentNote: 'Попросите ребёнка назвать работу и рассказать, что он выбрал сам. Хвалите решение, композицию и завершённость, а не точность линий.', coloredPreview: preview(design.layers, design.palette) };
    authoredPremiumDay20Lessons[slug] = authored; Object.assign(lesson, authored);
  }
}
