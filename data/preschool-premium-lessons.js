import { applyDay1Coloring, applyDay2Lessons } from './preschool-day2.js';
import { showcaseFinalLesson } from './preschool-showcase.js';
import { applyPremiumDay03Lessons } from './preschool-day03-premium.js';
import { applyDay03FinalScenes } from './preschool-day03-final-scenes.js';
import { applyPremiumDay04Lessons } from './preschool-day04-premium.js';
import { applyPremiumDay05Lessons } from './preschool-day05-premium.js';
import { applyPremiumDay07Lessons } from './preschool-day07-premium.js';
import { applyPremiumDay08Lessons } from './preschool-day08-premium.js';
import { applyPremiumDay09Lessons } from './preschool-day09-premium.js';
import { applyPremiumDay10Lessons } from './preschool-day10-premium.js';
import { applyPremiumDay11Lessons } from './preschool-day11-premium.js';
import { applyPremiumDay12Lessons } from './preschool-day12-premium.js';
import { applyPremiumDay13Lessons } from './preschool-day13-premium.js';
import { applyPremiumDay14Lessons } from './preschool-day14-premium.js';
import { applyPremiumDay15Lessons } from './preschool-day15-premium.js';
import { applyPremiumDay16Lessons } from './preschool-day16-premium.js';
import { applyPremiumDay17Lessons } from './preschool-day17-premium.js';
import { applyPremiumDay18Lessons } from './preschool-day18-premium.js';
import { applyPremiumDay19Lessons } from './preschool-day19-premium.js';
import { applyPremiumDay20Lessons } from './preschool-day20-premium.js';
import { applyPremiumDay06Lessons } from './preschool-day06-premium.js';
// Премиальная программа первого месяца для 3-4 лет.
// Цель: видимый рост от одного предмета к мини-сцене без ощущения шаблонной библиотеки.

const palettes = {
  sun: ['#facc15', '#fb923c', '#60a5fa'],
  grass: ['#22c55e', '#84cc16', '#facc15'],
  water: ['#38bdf8', '#0ea5e9', '#fbbf24'],
  home: ['#fb7185', '#f59e0b', '#60a5fa'],
  forest: ['#22c55e', '#a3e635', '#f97316'],
  party: ['#fb7185', '#a855f7', '#facc15'],
  night: ['#6366f1', '#facc15', '#38bdf8'],
  soft: ['#f9a8d4', '#93c5fd', '#bef264'],
};

const meta = {
  sun: ['Растения и цветы', '☀️', 'orange'], ball: ['Узоры и мандалы', '⚽', 'blue'], apple: ['Растения и цветы', '🍎', 'pink'], flower: ['Растения и цветы', '🌸', 'pink'], mushroom: ['Растения и цветы', '🍄', 'orange'], fish: ['Животные', '🐟', 'cyan'], cloud: ['Эмоции и лица', '☁️', 'blue'], house: ['Первые формы', '🏠', 'green'], tree: ['Растения и цветы', '🌳', 'green'], person: ['Эмоции и лица', '🙂', 'purple'], car: ['Транспорт', '🚗', 'orange'], boat: ['Транспорт', '⛵', 'cyan'], animal: ['Животные', '🐾', 'pink'], bird: ['Животные', '🐦', 'blue'], rocket: ['Космос', '🚀', 'purple'], gift: ['Эмоции и лица', '🎁', 'pink'], rainbow: ['Узоры и мандалы', '🌈', 'yellow'], sea: ['Животные', '🌊', 'cyan'], homeScene: ['Первые формы', '🏡', 'green'], space: ['Космос', '🪐', 'purple'], partyScene: ['Эмоции и лица', '🎉', 'pink'],
};

const layers = {
  sun: [
    '<circle cx="100" cy="86" r="34" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<line x1="100" y1="35" x2="100" y2="18" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="100" y1="137" x2="100" y2="154" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="49" y1="86" x2="30" y2="86" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="151" y1="86" x2="170" y2="86" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<circle cx="88" cy="80" r="4" fill="currentColor"/><circle cx="112" cy="80" r="4" fill="currentColor"/><path d="M84 98 Q100 111 116 98" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M45 158 Q100 142 155 158" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  ball: [
    '<circle cx="100" cy="102" r="47" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<path d="M62 76 Q100 104 138 76 M62 128 Q100 100 138 128" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M88 57 Q77 102 88 147 M112 57 Q123 102 112 147" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M42 160 Q84 146 122 156 Q144 162 162 152" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  apple: [
    '<path d="M100 62 Q70 43 55 78 Q43 112 64 145 Q82 168 100 151 Q118 168 136 145 Q157 112 145 78 Q130 43 100 62 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    '<path d="M100 62 Q103 44 116 34" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M116 43 Q138 38 134 61 Q121 61 116 43" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<path d="M78 90 Q100 76 122 90" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="82" cy="112" r="3" fill="currentColor"/><circle cx="120" cy="118" r="3" fill="currentColor"/>',
    '<path d="M55 164 Q100 176 145 164" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  flower: [
    '<circle cx="100" cy="78" r="13" fill="none" stroke="currentColor" stroke-width="4"/>',
    '<ellipse cx="100" cy="49" rx="14" ry="22" fill="none" stroke="currentColor" stroke-width="4"/><ellipse cx="100" cy="107" rx="14" ry="22" fill="none" stroke="currentColor" stroke-width="4"/><ellipse cx="71" cy="78" rx="22" ry="14" fill="none" stroke="currentColor" stroke-width="4"/><ellipse cx="129" cy="78" rx="22" ry="14" fill="none" stroke="currentColor" stroke-width="4"/>',
    '<line x1="100" y1="120" x2="100" y2="164" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M100 139 Q78 126 69 148 M100 150 Q124 136 133 158" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M48 168 Q100 180 152 168" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="78" r="4" fill="currentColor"/>',
  ],
  mushroom: [
    '<path d="M55 92 Q100 36 145 92 Q132 110 100 108 Q68 110 55 92 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    '<path d="M82 108 Q80 139 70 160 H130 Q120 139 118 108" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    '<circle cx="82" cy="82" r="5" fill="currentColor"/><circle cx="110" cy="70" r="5" fill="currentColor"/><circle cx="124" cy="91" r="4" fill="currentColor"/>',
    '<path d="M45 166 Q100 178 155 166" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  fish: [
    '<ellipse cx="92" cy="103" rx="44" ry="29" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M134 103 L166 78 V128 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<circle cx="76" cy="96" r="4" fill="currentColor"/><path d="M94 76 Q106 103 94 130" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M42 151 Q68 137 94 151 Q119 165 145 151" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="154" cy="58" r="3" fill="currentColor"/>',
  ],
  cloud: [
    '<path d="M52 118 Q47 94 70 91 Q77 66 101 77 Q120 55 140 78 Q163 81 160 108 Q156 129 130 126 H75 Q58 128 52 118 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    '<line x1="68" y1="142" x2="62" y2="157" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><line x1="95" y1="142" x2="89" y2="157" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><line x1="122" y1="142" x2="116" y2="157" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<circle cx="83" cy="104" r="3.5" fill="currentColor"/><circle cx="113" cy="104" r="3.5" fill="currentColor"/><path d="M87 116 Q100 124 113 116" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    '<path d="M42 172 Q85 160 128 170 Q146 174 160 166" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  house: [
    '<path d="M55 93 L100 55 L145 93" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    '<path d="M66 93 H134 V156 H66 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<path d="M88 156 V122 H112 V156 M75 106 H92 V123 H75 Z M108 106 H125 V123 H108 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
    '<path d="M42 162 H158 M130 76 V48 H146 V89" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
  ],
  tree: [
    '<path d="M92 157 V104 H110 V157" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    '<circle cx="82" cy="93" r="28" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="116" cy="86" r="31" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="106" cy="59" r="24" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<circle cx="79" cy="84" r="4" fill="currentColor"/><circle cx="123" cy="102" r="4" fill="currentColor"/><path d="M48 163 Q100 177 152 163" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M67 155 Q58 143 48 154 M136 155 Q147 143 156 154" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
  ],
  person: [
    '<circle cx="100" cy="61" r="23" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M100 84 V132 M72 104 H128" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<path d="M100 132 L78 164 M100 132 L122 164" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="92" cy="58" r="3.5" fill="currentColor"/><circle cx="108" cy="58" r="3.5" fill="currentColor"/>',
    '<path d="M88 70 Q100 80 112 70" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M54 168 H146" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  car: [
    '<path d="M47 112 H150 Q160 112 164 130 H39 Q42 116 47 112 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<path d="M75 112 L91 88 H122 L140 112" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="72" cy="132" r="11" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="132" cy="132" r="11" fill="none" stroke="currentColor" stroke-width="4"/>',
    '<path d="M38 153 H166" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="156" cy="105" r="3" fill="currentColor"/>',
  ],
  boat: [
    '<path d="M49 122 Q100 154 151 122" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<line x1="100" y1="122" x2="100" y2="55" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M100 58 L137 113 H100 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<path d="M100 66 L70 112 H100 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<path d="M42 156 Q66 144 90 156 Q115 168 140 156 Q152 150 164 156" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  animal: [
    '<circle cx="100" cy="88" r="37" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<path d="M75 61 L63 38 L91 52 M125 61 L137 38 L109 52" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="87" cy="84" r="4" fill="currentColor"/><circle cx="113" cy="84" r="4" fill="currentColor"/><path d="M93 101 Q100 109 107 101" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    '<ellipse cx="100" cy="139" rx="39" ry="24" fill="none" stroke="currentColor" stroke-width="4"/><path d="M63 141 Q49 154 38 141 M137 141 Q151 154 162 141" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
  ],
  bird: [
    '<ellipse cx="101" cy="105" rx="35" ry="28" fill="none" stroke="currentColor" stroke-width="5"/>',
    '<circle cx="79" cy="83" r="18" fill="none" stroke="currentColor" stroke-width="4"/><path d="M61 84 L42 75 L61 69" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="75" cy="79" r="3.5" fill="currentColor"/><path d="M102 100 Q126 77 139 104 Q122 116 102 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<line x1="92" y1="132" x2="86" y2="153" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><line x1="112" y1="132" x2="118" y2="153" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M55 157 H145" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  rocket: [
    '<path d="M100 39 Q128 70 116 132 H84 Q72 70 100 39 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<circle cx="100" cy="82" r="12" fill="none" stroke="currentColor" stroke-width="4"/><path d="M84 122 L62 147 H86 M116 122 L138 147 H114" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<path d="M91 132 Q100 165 109 132" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="54" cy="61" r="3.5" fill="currentColor"/><circle cx="146" cy="76" r="3.5" fill="currentColor"/>',
    '<circle cx="70" cy="42" r="3" fill="currentColor"/><circle cx="132" cy="40" r="3" fill="currentColor"/><path d="M45 160 Q100 176 155 160" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
  ],
  gift: [
    '<path d="M58 88 H142 V154 H58 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<line x1="100" y1="88" x2="100" y2="154" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><line x1="58" y1="111" x2="142" y2="111" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M100 88 Q78 54 63 73 Q80 88 100 88 M100 88 Q122 54 137 73 Q120 88 100 88" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="48" cy="58" r="3" fill="currentColor"/><circle cx="154" cy="54" r="3" fill="currentColor"/><path d="M45 162 H155" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  rainbow: [
    '<path d="M46 139 Q100 52 154 139" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<path d="M62 139 Q100 77 138 139" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<path d="M78 139 Q100 101 122 139" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<path d="M43 141 Q49 123 69 132 M131 132 Q151 123 157 141" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  sea: [
    '<path d="M35 142 Q61 128 87 142 Q113 156 139 142 Q153 135 165 142" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    '<ellipse cx="89" cy="104" rx="31" ry="19" fill="none" stroke="currentColor" stroke-width="4"/><path d="M119 104 L145 88 V120 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="78" cy="100" r="3.5" fill="currentColor"/><path d="M54 151 Q55 129 68 146 M139 152 Q143 133 154 148" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    '<circle cx="56" cy="58" r="15" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="146" cy="68" r="4" fill="currentColor"/><circle cx="160" cy="88" r="3" fill="currentColor"/>',
  ],
  homeScene: [
    '<path d="M46 111 L82 78 L118 111" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M56 111 H108 V158 H56 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<path d="M74 158 V132 H90 V158 M63 119 H76 V132 H63 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
    '<circle cx="145" cy="73" r="18" fill="none" stroke="currentColor" stroke-width="4"/><path d="M145 102 V158 M129 125 Q145 113 161 125" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M38 164 H164" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="139" cy="65" r="3" fill="currentColor"/><circle cx="151" cy="65" r="3" fill="currentColor"/>',
  ],
  space: [
    '<path d="M91 46 Q121 78 111 133 H75 Q65 78 91 46 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>',
    '<circle cx="93" cy="83" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M75 125 L55 148 H78 M111 125 L132 148 H108" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="144" cy="73" r="20" fill="none" stroke="currentColor" stroke-width="4"/><path d="M122 76 Q144 91 166 76" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    '<circle cx="49" cy="62" r="3" fill="currentColor"/><circle cx="157" cy="119" r="3" fill="currentColor"/><path d="M83 134 Q93 170 103 134" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
  partyScene: [
    '<path d="M55 89 H126 V154 H55 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><line x1="90" y1="89" x2="90" y2="154" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M90 89 Q70 56 55 73 Q72 89 90 89 M90 89 Q111 56 126 73 Q109 89 90 89" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
    '<circle cx="151" cy="66" r="18" fill="none" stroke="currentColor" stroke-width="4"/><path d="M151 84 Q146 115 154 142" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    '<circle cx="45" cy="52" r="3" fill="currentColor"/><circle cx="135" cy="45" r="3" fill="currentColor"/><circle cx="165" cy="121" r="3" fill="currentColor"/><path d="M42 162 H160" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  ],
};
const plan = [
  ['День 1. Смелые круги','круг превращается в предмет и маленькую картинку','sun','Солнышко проснулось:sun,Мячик катится:ball,Яблочко на столе:apple,Цветок для мамы:flower,Грибок на полянке:mushroom,Рыбка улыбается:fish,Домик с окошком:house,Солнце и дорожка:sun,Мячик на траве:ball,Первая тёплая картинка:homeScene'],
  ['День 2. Дом и двор','домик, предметы рядом и простая сцена','home','Окошко:house,Крыша домика:house,Дверь и ручка:house,Чашка на столе:apple,Лампа светит:sun,Коврик у двери:ball,Дерево возле дома:tree,Домик и солнце:homeScene,Двор с дорожкой:homeScene,Мой уютный дом:homeScene'],
  ['День 3. Сад и цветы','стебли, листья, цветы и первый сад','grass','Травинка:flower,Листик:tree,Ягодка:apple,Ромашка:flower,Тюльпан:flower,Гриб под листом:mushroom,Деревце:tree,Цветок и жучок:flower,Садовая дорожка:homeScene,Маленький сад:tree'],
  ['День 4. Вода и рыбки','волны, рыбки, лодки и подводный мир','water','Волна:cloud,Капелька:ball,Рыбка:fish,Ракушка:mushroom,Лодочка:boat,Утёнок на воде:bird,Медуза:cloud,Рыбка и водоросли:sea,Лодка у острова:boat,Подводный мир:sea'],
  ['День 5. Первые зверята','мордочка, ушки, тело и характер героя','soft','Мордочка котика:animal,Ушки зайчика:animal,Птичка:bird,Щенок сидит:animal,Котёнок с клубком:animal,Лисёнок:animal,Овечка:animal,Зайчик и морковка:animal,Птичка на ветке:bird,Друзья на полянке:homeScene'],
  ['День 6. Транспорт едет','колёса, движение и дорога','home','Колесо:ball,Дорога:cloud,Машинка:car,Автобус:car,Самокат:car,Паровозик:car,Лодка с парусом:boat,Машина у дома:car,Поезд и облако:car,Городская поездка:homeScene'],
  ['День 7. Небо и погода','облака, дождь, радуга и настроение','water','Облачко:cloud,Капли дождя:cloud,Лужица:cloud,Зонтик:mushroom,Радуга:rainbow,Солнышко после дождя:sun,Тучка с лицом:cloud,Домик под дождём:homeScene,Радуга над травой:rainbow,Погода на листе:homeScene'],
  ['День 8. Человек и эмоции','лицо, тело, жест и настроение','party','Весёлое лицо:person,Грустное лицо:person,Большая улыбка:person,Малыш машет рукой:person,Девочка с шариком:person,Мальчик с цветком:person,Семейный человечек:person,Человек у домика:homeScene,Друг и подарок:partyScene,Мой первый герой:person'],
  ['День 9. Космос для малышей','ракета, планеты, звёзды и полёт','night','Звёздочка:sun,Луна:cloud,Планета:ball,Ракета:rocket,Окошко ракеты:rocket,Комета:cloud,Сатурн:ball,Ракета и звёзды:space,Планета с домиком:space,Космическая история:space'],
  ['День 10. Праздник','подарки, шарики, свечки и радостный стол','party','Шарик:ball,Свечка:sun,Конфетка:apple,Подарок:gift,Праздничный колпачок:mushroom,Кекс со свечкой:mushroom,Гирлянда:rainbow,Подарок и шарик:partyScene,Открытка семье:gift,Праздничный стол:partyScene'],
  ['День 11. Лесная прогулка','деревья, тропинка и лесные герои','forest','Листик на ветке:tree,Жёлудь:apple,Кустик:tree,Гриб-домик:mushroom,Ёжик с яблоком:animal,Совёнок на ветке:bird,Лесная тропинка:tree,Домик в лесу:homeScene,Зверёк у дерева:animal,Сказочная поляна:homeScene'],
  ['День 12. Игрушки оживают','любимые игрушки получают характер и место','soft','Кубик:house,Барабан:ball,Воздушный змей:rainbow,Мишка-игрушка:animal,Кукла улыбается:person,Роботик:house,Игрушечный поезд:car,Полка с игрушками:homeScene,Мишка и мяч:animal,Комната игрушек:homeScene'],
  ['День 13. Еда и посуда','круглые формы, тарелки и уютная сцена','home','Бублик:ball,Апельсин:apple,Тарелочка:ball,Чашка чая:apple,Мороженое:mushroom,Пирожное:mushroom,Ложка рядом:boat,Яблоко на тарелке:apple,Чай у окна:homeScene,Вкусный завтрак:homeScene'],
  ['День 14. Две руки легко','симметрия, вторая рука и смелые повторы','soft','Два облачка:cloud,Два листика:tree,Два сердечка:ball,Две волны:cloud,Два цветочка:flower,Две рыбки:fish,Два шарика:ball,Сад двумя руками:homeScene,Радуга двумя руками:rainbow,Симметричная открытка:partyScene','both'],
  ['День 15. Сказка на листе','фантазия, герой и простое волшебство','party','Корона:mushroom,Волшебная палочка:sun,Башенка:house,Замок:house,Добрый дракончик:animal,Фея с крылышками:person,Волшебный гриб:mushroom,Замок и дорожка:homeScene,Герой у башни:person,Моя сказка:partyScene'],
  ['День 16. Сюжеты с домом','несколько объектов на одном листе','home','Домик вечером:house,Луна над крышей:cloud,Дерево у окна:tree,Кот у двери:animal,Машина у дома:car,Цветы возле дома:flower,Облако над домом:cloud,Дом и семья:homeScene,Двор с машиной:homeScene,Мой двор:homeScene'],
  ['День 17. Сюжеты с морем','море, берег, герои и движение воды','water','Большая волна:cloud,Маленький остров:mushroom,Морская звезда:sun,Кораблик:boat,Рыбка у дна:fish,Птичка над морем:bird,Солнце над морем:sun,Лодка и рыбка:sea,Остров с пальмой:sea,Моё море:sea'],
  ['День 18. Сюжеты с небом','небо как место действия','night','Большое облако:cloud,Звёздная дорожка:sun,Радуга:rainbow,Птичка летит:bird,Ракета летит:rocket,Воздушный змей:rainbow,Луна улыбается:cloud,Птица и облако:bird,Ракета и планета:space,Небесная история:space'],
  ['День 19. Моя история','ребёнок выбирает героя, место и настроение','soft','Главный герой:person,Друг героя:animal,Дом героя:house,Дорога героя:cloud,Подарок героя:gift,Дерево истории:tree,Облако настроения:cloud,Герой и домик:homeScene,Герой идёт в гости:partyScene,Моя история на листе:homeScene'],
  ['День 20. Выставка месяца','итог, повторение любимого и большая гордость','party','Медаль художника:sun,Рамка рисунка:house,Открытка маме:gift,Открытка папе:gift,Любимый зверёк:animal,Любимый домик:house,Любимое море:sea,Любимый космос:space,Стол выставки:partyScene,Большой рисунок месяца:homeScene'],
];

function parseLessons(line) {
  return line.split(',').map((item) => {
    const [title, type] = item.split(':');
    return { title, type };
  });
}

function lessonSlug(day, index) {
  return `preschool-m1-d${String(day).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
}

function levelFor(index) {
  if (index < 3) return 1;
  if (index < 7) return 2;
  return 3;
}

function kindFor(index, type) {
  if (index >= 7 || ['sea', 'homeScene', 'space', 'partyScene'].includes(type)) return 'combo';
  if (['rainbow', 'ball', 'cloud'].includes(type)) return 'repeat';
  if (['person', 'animal', 'bird'].includes(type)) return 'fantasy';
  return 'draw';
}

function stepHint(index, stepIndex, title) {
  const banks = [
    ['начни с большой формы', 'добавь главную часть', 'оживи рисунок простой деталью', 'поставь рисунок на землю или в небо'],
    ['собери основу рисунка', 'добавь вторую важную часть', 'нарисуй детали, по которым предмет узнают', 'добавь место: землю, воду, стол или небо'],
    ['выбери главного героя картинки', 'добавь место, где он находится', 'покажи настроение маленькими деталями', 'заверши сцену: пусть получится история'],
  ];
  const bank = index < 3 ? banks[0] : index < 7 ? banks[1] : banks[2];
  return `Шаг ${stepIndex + 1} — ${bank[stepIndex]}: «${title.toLowerCase()}».`;
}

function makeLesson(day, dayNumber, spec, index) {
  const [theme, emoji, tone] = meta[spec.type] ?? meta.homeScene;
  const palette = palettes[day.palette] ?? palettes.soft;
  const hand = day.hand ?? (index === 6 && dayNumber % 4 === 0 ? 'left' : 'any');
  const stageText = index < 3 ? 'один понятный предмет' : index < 7 ? 'предмет с деталями' : 'маленькая сцена';
  const stepLayers = layers[spec.type] ?? layers.homeScene;
  return {
    slug: lessonSlug(dayNumber, index),
    ageBand: '3-4',
    level: levelFor(index),
    title: spec.title,
    theme,
    chapter: day.chapter,
    skill: `${stageText}: ${day.focus}`,
    kind: kindFor(index, spec.type),
    order: dayNumber * 100 + index,
    free: true,
    hand,
    handHint: hand === 'both'
      ? 'Попробуй вести две похожие линии двумя руками. Ровность не цель: важно почувствовать движение.'
      : hand === 'left'
        ? 'Если ребёнок правша, одну маленькую деталь можно сделать левой рукой: точку, травинку или облачко.'
        : undefined,
    cover: { emoji, theme: tone },
    palette,
    intro: index < 3
      ? `Сегодня ты рисуешь «${spec.title.toLowerCase()}». Начнём просто, но в конце добавим маленький знак места, чтобы это была картинка, а не один контур.`
      : index < 7
        ? `Сегодня «${spec.title.toLowerCase()}» станет взрослее: будет главная форма, детали и место на листе.`
        : `Сегодня собираем мини-сюжет «${spec.title.toLowerCase()}»: герой, место и настроение. Ты уже можешь рисовать целую историю.`,
    steps: stepLayers.map((layer, stepIndex) => ({ hint: stepHint(index, stepIndex, spec.title), layer })),
    storyPrompt: index < 3
      ? `После контура добавь один простой знак: травинку, точку, дорожку, облачко или маленькую тень. Так «${spec.title.toLowerCase()}» окажется в своём месте.`
      : index < 7
        ? `Раскрась «${spec.title.toLowerCase()}» и добавь рядом вторую деталь из этого дня. Пусть ребёнок сам решит, где находится рисунок.`
        : 'Сделай из рисунка законченную сцену: добавь фон, две маленькие детали и придумай название. Это уже работа для мини-выставки.',
    storyMissions: index < 3
      ? ['Раскрась главный предмет', 'Добавь один знак места', 'Покажи, где верх и низ картинки']
      : index < 7
        ? ['Раскрась главный предмет', 'Добавь вторую деталь рядом', 'Дорисуй землю, воду, стол или небо']
        : ['Раскрась главного героя', 'Добавь фон и две детали', 'Придумай название рисунку'],
    colorHint: `Пример: главный объект — ${palette[0]}, детали — ${palette[1]}, фон или настроение — ${palette[2]}. Можно выбрать свои цвета.`,
    finishIdea: index < 3
      ? 'Финал простой: один предмет и маленькая подсказка, где он находится.'
      : index < 7
        ? 'Финал богаче: предмет, деталь рядом и понятное место на листе.'
        : 'Финал — маленькая история. Родитель должен увидеть не только объект, но и событие.',
    parentNote: index < 3
      ? 'Похвалите ребёнка за смелый крупный контур и за маленькую деталь от себя.'
      : index < 7
        ? 'Отметьте, что рисунок стал подробнее: появились части, место и характер. Лучше спросить, что происходит на картинке, чем исправлять линии.'
        : 'Похвалите ребёнка как автора: он собрал героя, место и настроение в одну работу. Это важнее ровности.',
  };
}

export function applyPremiumPreschoolMonth(drawingLessons, drawingChapterGuides) {
  const premium = plan.flatMap(([chapter, focus, palette, lessonLine, hand], dayIndex) => {
    const day = { chapter, focus, palette, hand };
    drawingChapterGuides[chapter] = {
      why: `${focus}. Внутри дня задания идут от простого предмета к маленькой сцене, поэтому родителю видно развитие, а ребёнок быстро получает красивый результат.`,
      hand: hand === 'both'
        ? 'В этот день мягко подключаем вторую руку и симметрию: не ради ровности, а ради смелости движения и переключения внимания.'
        : 'Иногда предложите одну маленькую деталь непишущей рукой: точку, листик, травинку или облако. Это делает упражнение правополушарным и снимает страх ошибки.',
      parent: 'Хвалите не копию один в один, а законченную картинку: главный объект, детали, место и собственную идею ребёнка.',
    };
    return parseLessons(lessonLine).map((spec, index) => makeLesson(day, dayIndex + 1, spec, index));
  });

  applyDay1Coloring(premium);
  applyDay2Lessons(premium);
  applyPremiumDay03Lessons(premium);
  applyDay03FinalScenes(premium);
  applyPremiumDay04Lessons(premium);
  applyPremiumDay06Lessons(premium);
  applyPremiumDay05Lessons(premium);
  applyPremiumDay07Lessons(premium);
  applyPremiumDay08Lessons(premium);
  applyPremiumDay09Lessons(premium);
  applyPremiumDay10Lessons(premium);
  applyPremiumDay11Lessons(premium);
  applyPremiumDay12Lessons(premium);
  applyPremiumDay13Lessons(premium);
  applyPremiumDay14Lessons(premium);
  applyPremiumDay15Lessons(premium);
  applyPremiumDay16Lessons(premium);
  applyPremiumDay17Lessons(premium);
  applyPremiumDay18Lessons(premium);
  applyPremiumDay19Lessons(premium);
  applyPremiumDay20Lessons(premium);

  const finalLesson = premium.find((lesson) => lesson.slug === 'preschool-m1-d20-10');
  if (finalLesson) Object.assign(finalLesson, showcaseFinalLesson);

  drawingLessons.splice(0, drawingLessons.length, ...drawingLessons.filter((lesson) => lesson.ageBand !== '3-4'), ...premium);
}
