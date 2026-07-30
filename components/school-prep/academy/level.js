export const WORLD_H = 720;

const makeCoins = (points) => points.map(([x, y], id) => ({ id, x, y, taken: false }));
const makeStars = (points) => points.map(([x, y], id) => ({ id, x, y, taken: false }));
const introSteps = () => [
  { x: 210, y: 540, w: 190, h: 22, kind: 'step', step: 1, floorY: 620 },
  { x: 370, y: 470, w: 190, h: 22, kind: 'step', step: 2, floorY: 620 },
  { x: 530, y: 400, w: 190, h: 22, kind: 'step', step: 3, floorY: 620 },
];
const commonStart = (groundWidth, movingX) => [
  { x: 0, y: 620, w: groundWidth, h: 100, kind: 'ground' }, ...introSteps(),
  { x: movingX, y: 535, w: 120, h: 22, kind: 'moving', axis: 'y', range: 42, speed: 1.05 },
];

export const ACADEMY_LEVELS = [
  {
    id:'number-bridge',number:1,title:'Числовой мост',subtitle:'Три мастерские над облаками',
    skill:'number',skillLabel:'Ряды, соседи чисел и обратный счёт',answer:3,
    objective:'Запусти 3 мастерские и собери Числовой мост',
    taskTitle:'Какого числа не хватает?',task:'1  ·  2  ·  ?  ·  4',taskNote:'Найди число между 2 и 4',
    accent:'#66e6ff',glow:'#287fd8',background:'/images/games/academy/academy-world-bg-1.webp',worldW:5650,learningZone:{x:880,w:780},
    challenges:[
      {id:'missing-number',number:1,title:'Мастерская последовательностей',goal:'Восстанови числовой ряд',prompt:'1  ·  2  ·  ?  ·  4',note:'Прыгни на число, которое стоит между 2 и 4',answer:3,zone:{x:880,w:780},gate:{id:'missing-number',x:1670,y:390,w:58,h:230},successTitle:'Первая секция готова!',successDetail:'После 2 идёт 3 — мост появился над облаками.',wrongTitle:'Проверь ряд ещё раз',wrongDetail:'Посчитай вслух: один, два… какое число будет следующим?'},
      {id:'number-neighbors',number:2,title:'Башня соседних чисел',goal:'Найди обоих соседей числа 8',prompt:'?  ·  8  ·  ?',note:'Сначала выбери число перед 8, затем число после 8',answers:[7,9],ordered:true,zone:{x:2520,w:610},gate:{id:'number-neighbors',x:3140,y:390,w:58,h:230},successTitle:'Числовая арка собрана!',successDetail:'Соседи числа 8 — это 7 и 9. Открылась высокая часть моста.',wrongTitle:'Это не сосед числа 8',wrongDetail:'Перед 8 стоит 7, а сразу после 8 — число 9.'},
      {id:'reverse-count',number:3,title:'Пульт обратного хода',goal:'Продолжи обратный счёт',prompt:'10  ·  9  ·  8  ·  ?',note:'При обратном счёте каждое следующее число на один меньше',answer:7,zone:{x:4030,w:630},gate:{id:'reverse-count',x:4670,y:390,w:58,h:230},successTitle:'Маршрут к порталу открыт!',successDetail:'После 8 при обратном счёте идёт 7. Все три механизма работают.',wrongTitle:'Считаем в другую сторону',wrongDetail:'Начни с 10 и двигайся назад: десять, девять, восемь…'},
    ],
    platforms:[
      ...commonStart(720,745),{x:880,y:620,w:780,h:100,kind:'ground'},
      {x:950,y:525,w:180,h:24,kind:'numberPad',value:6,challengeId:'missing-number'},{x:1200,y:525,w:180,h:24,kind:'numberPad',value:3,challengeId:'missing-number'},{x:1450,y:525,w:180,h:24,kind:'numberPad',value:8,challengeId:'missing-number'},
      {x:1770,y:620,w:280,h:100,kind:'ground'},
      {x:2050,y:555,w:160,h:28,kind:'bridge',segment:1,requiresChallenge:'missing-number'},{x:2210,y:510,w:160,h:28,kind:'bridge',segment:2,requiresChallenge:'missing-number'},{x:2370,y:555,w:150,h:28,kind:'bridge',segment:3,requiresChallenge:'missing-number'},
      {x:2520,y:620,w:610,h:100,kind:'ground'},
      {x:2570,y:525,w:150,h:24,kind:'numberPad',value:6,challengeId:'number-neighbors'},{x:2760,y:525,w:150,h:24,kind:'numberPad',value:7,challengeId:'number-neighbors'},{x:2950,y:525,w:150,h:24,kind:'numberPad',value:9,challengeId:'number-neighbors'},
      {x:3200,y:550,w:170,h:28,kind:'bridge',segment:4,requiresChallenge:'number-neighbors'},{x:3370,y:480,w:170,h:28,kind:'bridge',segment:5,requiresChallenge:'number-neighbors'},{x:3540,y:410,w:170,h:28,kind:'bridge',segment:6,requiresChallenge:'number-neighbors'},{x:3710,y:480,w:170,h:28,kind:'bridge',segment:7,requiresChallenge:'number-neighbors'},{x:3880,y:550,w:150,h:28,kind:'bridge',segment:8,requiresChallenge:'number-neighbors'},
      {x:4030,y:620,w:630,h:100,kind:'ground'},
      {x:4090,y:525,w:150,h:24,kind:'numberPad',value:6,challengeId:'reverse-count'},{x:4290,y:525,w:150,h:24,kind:'numberPad',value:7,challengeId:'reverse-count'},{x:4490,y:525,w:150,h:24,kind:'numberPad',value:9,challengeId:'reverse-count'},
      {x:4730,y:545,w:160,h:28,kind:'bridge',segment:9,requiresChallenge:'reverse-count'},{x:4890,y:470,w:160,h:28,kind:'bridge',segment:10,requiresChallenge:'reverse-count'},{x:5050,y:545,w:160,h:28,kind:'bridge',segment:11,requiresChallenge:'reverse-count'},
      {x:5210,y:620,w:440,h:100,kind:'ground'},
    ],
    coins:makeCoins([[140,555],[300,490],[470,420],[640,350],[780,480],[1870,555],[2130,500],[2290,450],[2450,500],[3280,490],[3455,420],[3625,350],[3795,420],[3960,500],[4810,485],[4970,410],[5130,485],[5390,555]]),
    stars:makeStars([[625,325],[3625,320],[4970,380]]),enemies:[],hazards:[],
    checkpoints:[{x:80,y:540},{x:910,y:540},{x:1800,y:540},{x:2550,y:540},{x:4060,y:540},{x:5240,y:540}],
    portal:{x:5480,y:490,w:82,h:130},
    learningGates:{'missing-number':{id:'missing-number',x:1670,y:390,w:58,h:230},'number-neighbors':{id:'number-neighbors',x:3140,y:390,w:58,h:230},'reverse-count':{id:'reverse-count',x:4670,y:390,w:58,h:230}},
    solved:{number:false},
  },  {
    id:'energy-scales',number:2,title:'Весы энергии',subtitle:'Лаборатория кристальных лифтов',
    skill:'compare',skillLabel:'Сравнение, сложение и математические знаки',answer:5,
    objective:'Пройди 3 лаборатории и запусти энергетическую башню',
    taskTitle:'Где предметов больше?',task:'● ● ●       или       ● ● ● ● ●',taskNote:'Сравни две группы',
    accent:'#ffd65a',glow:'#e98a39',background:'/images/games/academy/academy-world-bg-2.webp',worldW:6400,learningZone:{x:1050,w:800},
    challenges:[
      {id:'compare-charge',number:1,theme:'energy',title:'Зал энергетических весов',goal:'Выбери более мощный кристалл',prompt:'● ● ●    или    ● ● ● ● ●',note:'Посчитай заряды на обеих платформах',answer:5,zone:{x:1050,w:800},gate:{id:'compare-charge',x:1860,y:390,w:58,h:230},successTitle:'Весы уравновешены!',successDetail:'5 зарядов больше, чем 3. Кристальные лифты включились.',wrongTitle:'Проверь количество зарядов',wrongDetail:'Не смотри на размер платформы — посчитай светящиеся точки.'},
      {id:'balance-seven',number:2,theme:'energy',title:'Комната равновесия',goal:'Дополняй число до 7',prompt:'3  +  ?  =  7',note:'Найди, сколько зарядов нужно добавить к трём',answer:4,zone:{x:2800,w:800},gate:{id:'balance-seven',x:3610,y:390,w:58,h:230},successTitle:'Контур замкнулся!',successDetail:'3 + 4 = 7. Второй каскад лифтов получил энергию.',wrongTitle:'Равновесие пока не найдено',wrongDetail:'Начни с 3 и досчитай до 7: четыре, пять, шесть, семь.'},
      {id:'compare-sign',number:3,theme:'energy',title:'Пульт математических знаков',goal:'Поставь правильный знак',prompt:'8  ?  6',note:'Выбери знак: меньше, больше или равно',answer:'>',zone:{x:4350,w:800},gate:{id:'compare-sign',x:5160,y:390,w:58,h:230},successTitle:'Башня получает энергию!',successDetail:'8 больше 6, поэтому нужен знак >. Маршрут к порталу открыт.',wrongTitle:'Посмотри, куда раскрывается знак',wrongDetail:'Большее число — 8. Широкая сторона знака смотрит на большее число.'},
    ],
    platforms:[
      {x:0,y:620,w:500,h:100,kind:'ground'},
      {x:500,y:520,w:170,h:26,kind:'lift',axis:'y',range:70,speed:.72,phase:0},{x:720,y:430,w:170,h:26,kind:'crystal'},{x:900,y:520,w:170,h:26,kind:'lift',axis:'y',range:82,speed:.68,phase:1.6},
      {x:1050,y:620,w:800,h:100,kind:'ground'},
      {x:1120,y:525,w:260,h:24,kind:'comparePad',amount:3,challengeId:'compare-charge'},{x:1490,y:525,w:260,h:24,kind:'comparePad',amount:5,challengeId:'compare-charge'},
      {x:1930,y:620,w:220,h:100,kind:'ground'},
      {x:2150,y:520,w:180,h:26,kind:'lift',axis:'y',range:105,speed:.70,phase:.4,requiresChallenge:'compare-charge'},{x:2380,y:420,w:180,h:26,kind:'lift',axis:'y',range:115,speed:.63,phase:2,requiresChallenge:'compare-charge'},{x:2610,y:510,w:180,h:26,kind:'lift',axis:'y',range:95,speed:.76,phase:3.4,requiresChallenge:'compare-charge'},
      {x:2800,y:620,w:800,h:100,kind:'ground'},
      {x:2870,y:525,w:180,h:24,kind:'numberPad',value:2,challengeId:'balance-seven'},{x:3110,y:525,w:180,h:24,kind:'numberPad',value:4,challengeId:'balance-seven'},{x:3350,y:525,w:180,h:24,kind:'numberPad',value:5,challengeId:'balance-seven'},
      {x:3680,y:620,w:180,h:100,kind:'ground'},
      {x:3860,y:500,w:180,h:26,kind:'crystal',requiresChallenge:'balance-seven'},{x:4090,y:405,w:180,h:26,kind:'lift',axis:'y',range:105,speed:.72,phase:1.2,requiresChallenge:'balance-seven'},
      {x:4350,y:620,w:800,h:100,kind:'ground'},
      {x:4420,y:525,w:180,h:24,kind:'symbolPad',value:'<',challengeId:'compare-sign'},{x:4660,y:525,w:180,h:24,kind:'symbolPad',value:'>',challengeId:'compare-sign'},{x:4900,y:525,w:180,h:24,kind:'symbolPad',value:'=',challengeId:'compare-sign'},
      {x:5230,y:620,w:170,h:100,kind:'ground'},
      {x:5400,y:510,w:180,h:26,kind:'lift',axis:'y',range:95,speed:.70,phase:.2,requiresChallenge:'compare-sign'},{x:5630,y:410,w:180,h:26,kind:'crystal',requiresChallenge:'compare-sign'},{x:5860,y:510,w:180,h:26,kind:'lift',axis:'y',range:100,speed:.74,phase:2.1,requiresChallenge:'compare-sign'},
      {x:6040,y:620,w:360,h:100,kind:'ground'},
    ],
    coins:makeCoins([[120,555],[300,555],[585,450],[805,370],[980,450],[2010,555],[2240,450],[2470,350],[2700,440],[3750,555],[3950,430],[4180,340],[5300,555],[5490,440],[5720,350],[5950,440],[6220,555]]),
    stars:makeStars([[805,340],[4180,310],[5720,320]]),enemies:[],
    hazards:[{id:0,kind:'sparkField',x:2150,y:595,w:640,h:25},{id:1,kind:'sparkField',x:3860,y:595,w:470,h:25},{id:2,kind:'sparkField',x:5400,y:595,w:640,h:25}],
    checkpoints:[{x:80,y:540},{x:1080,y:540},{x:1960,y:540},{x:2830,y:540},{x:3710,y:540},{x:4380,y:540},{x:5260,y:540},{x:6070,y:540}],
    portal:{x:6240,y:490,w:82,h:130},
    learningGates:{'compare-charge':{id:'compare-charge',x:1860,y:390,w:58,h:230},'balance-seven':{id:'balance-seven',x:3610,y:390,w:58,h:230},'compare-sign':{id:'compare-sign',x:5160,y:390,w:58,h:230}},
    solved:{compare:false},
  },  {
    id:'mechanism-rhythm',number:3,title:'Ритм механизмов',subtitle:'Квест в башне часов',
    skill:'pattern',skillLabel:'Закономерности, память и последовательности',answer:'diamond',
    objective:'Пройди 3 зала башни и восстанови ритм механизмов',
    taskTitle:'Какая фигура продолжает ряд?',task:'●  ●  ◆     ●  ●  ?',taskNote:'Найди повторяющийся фрагмент',
    accent:'#ff7db5',glow:'#8b63e8',background:'/images/games/academy/academy-world-bg-3.webp',worldW:6400,learningZone:{x:1000,w:800},
    challenges:[
      {id:'shape-pattern',number:1,theme:'rhythm',title:'Зал узоров',goal:'Продолжи последовательность фигур',prompt:'●  ●  ◆    ●  ●  ?',note:'Ряд повторяется группами по три фигуры',answer:'diamond',zone:{x:1000,w:800},gate:{id:'shape-pattern',x:1810,y:390,w:58,h:230},successTitle:'Первая шестерня вращается!',successDetail:'После двух кругов идёт ромб. Часовой проход открылся.',wrongTitle:'Найди повторяющийся кусочек',wrongDetail:'Раздели ряд на группы: круг, круг, ромб — и повтори.'},
      {id:'color-rhythm',number:2,theme:'rhythm',title:'Музыкальная мастерская',goal:'Повтори цветовой ритм',prompt:'🔵  →  🟡  →  🩷',note:'Активируй цветные барабаны слева направо',answers:['blue','gold','pink'],ordered:true,resetOnWrong:true,zone:{x:2600,w:800},gate:{id:'color-rhythm',x:3410,y:390,w:58,h:230},successTitle:'Мелодия механизмов собрана!',successDetail:'Синий, жёлтый, розовый — башня запомнила правильный ритм.',wrongTitle:'Ритм сбился',wrongDetail:'Посмотри на цветовую запись и начни снова с синего барабана.'},
      {id:'alternating-pattern',number:3,theme:'rhythm',title:'Хранилище закономерностей',goal:'Продолжи чередование',prompt:'▲  ●  ▲  ●  ?',note:'Фигуры сменяют друг друга по очереди',answer:'triangle',zone:{x:4300,w:800},gate:{id:'alternating-pattern',x:5110,y:390,w:58,h:230},successTitle:'Башня снова отсчитывает время!',successDetail:'После круга снова идёт треугольник. Портал синхронизирован.',wrongTitle:'Следи за чередованием',wrongDetail:'Треугольник, круг, треугольник, круг — какая фигура следующая?'},
    ],
    platforms:[
      {x:0,y:620,w:620,h:100,kind:'ground'},{x:620,y:510,w:170,h:28,kind:'gear',gearSize:78},{x:810,y:420,w:170,h:28,kind:'gear',gearSize:88},
      {x:1000,y:620,w:800,h:100,kind:'ground'},
      {x:1070,y:525,w:180,h:24,kind:'switch',rune:0,shape:'circle',challengeId:'shape-pattern'},{x:1310,y:525,w:180,h:24,kind:'switch',rune:1,shape:'diamond',challengeId:'shape-pattern'},{x:1550,y:525,w:180,h:24,kind:'switch',rune:2,shape:'triangle',challengeId:'shape-pattern'},
      {x:1880,y:620,w:640,h:100,kind:'ground'},{x:2050,y:485,w:170,h:28,kind:'gear',gearSize:82,requiresChallenge:'shape-pattern'},{x:2310,y:410,w:170,h:28,kind:'gear',gearSize:88,requiresChallenge:'shape-pattern'},
      {x:2600,y:620,w:800,h:100,kind:'ground'},
      {x:2670,y:525,w:180,h:24,kind:'rhythmPad',value:'blue',color:'#54c7ff',challengeId:'color-rhythm'},{x:2910,y:525,w:180,h:24,kind:'rhythmPad',value:'gold',color:'#ffd65a',challengeId:'color-rhythm'},{x:3150,y:525,w:180,h:24,kind:'rhythmPad',value:'pink',color:'#ff7db5',challengeId:'color-rhythm'},
      {x:3480,y:620,w:650,h:100,kind:'ground'},{x:3630,y:490,w:170,h:28,kind:'gear',gearSize:84,requiresChallenge:'color-rhythm'},{x:3890,y:400,w:170,h:28,kind:'gear',gearSize:92,requiresChallenge:'color-rhythm'},
      {x:4300,y:620,w:800,h:100,kind:'ground'},
      {x:4370,y:525,w:180,h:24,kind:'switch',rune:2,shape:'triangle',challengeId:'alternating-pattern'},{x:4610,y:525,w:180,h:24,kind:'switch',rune:0,shape:'circle',challengeId:'alternating-pattern'},{x:4850,y:525,w:180,h:24,kind:'switch',rune:1,shape:'diamond',challengeId:'alternating-pattern'},
      {x:5180,y:620,w:180,h:100,kind:'ground'},{x:5360,y:500,w:180,h:28,kind:'gear',gearSize:84,requiresChallenge:'alternating-pattern'},{x:5600,y:405,w:180,h:28,kind:'gear',gearSize:94,requiresChallenge:'alternating-pattern'},{x:5840,y:500,w:180,h:28,kind:'gear',gearSize:82,requiresChallenge:'alternating-pattern'},
      {x:6020,y:620,w:380,h:100,kind:'ground'},
    ],
    coins:makeCoins([[120,555],[310,555],[705,450],[895,360],[1940,555],[2135,425],[2395,350],[3550,555],[3715,430],[3975,340],[5250,555],[5450,440],[5690,345],[5930,440],[6210,555]]),
    stars:makeStars([[895,330],[3975,310],[5690,315]]),enemies:[],
    hazards:[{id:0,kind:'pendulum',pivotX:2020,pivotY:125,length:370,phase:.2},{id:1,kind:'pendulum',pivotX:2410,pivotY:120,length:365,phase:2.4},{id:2,kind:'pendulum',pivotX:3600,pivotY:125,length:370,phase:1.1},{id:3,kind:'pendulum',pivotX:4070,pivotY:120,length:365,phase:3.4},{id:4,kind:'pendulum',pivotX:5540,pivotY:120,length:370,phase:2}],
    checkpoints:[{x:80,y:540},{x:1030,y:540},{x:1910,y:540},{x:2630,y:540},{x:3510,y:540},{x:4330,y:540},{x:5210,y:540},{x:6050,y:540}],
    portal:{x:6240,y:490,w:82,h:130},
    learningGates:{'shape-pattern':{id:'shape-pattern',x:1810,y:390,w:58,h:230},'color-rhythm':{id:'color-rhythm',x:3410,y:390,w:58,h:230},'alternating-pattern':{id:'alternating-pattern',x:5110,y:390,w:58,h:230}},
    solved:{pattern:false},
  },  {
    id:'reactor-five',number:4,title:'Реактор знаний',subtitle:'Финальный завод Академии',
    skill:'composition',skillLabel:'Состав числа, сложение и первые группы',answer:[2,3],
    objective:'Пройди 3 производственных цеха и запусти главный реактор',
    taskTitle:'Собери число 5',task:'2  +  3  =  5',taskNote:'Соедини две части числа',
    accent:'#75f1bd',glow:'#2ba985',background:'/images/games/academy/academy-world-bg-4.webp',worldW:6400,learningZone:{x:1000,w:800},
    challenges:[
      {id:'make-five',number:1,theme:'reactor',title:'Цех состава числа',goal:'Собери энергию для числа 5',prompt:'?  +  ?  =  5',note:'Сначала активируй 2 заряда, затем 3 заряда',answers:[2,3],ordered:true,zone:{x:1000,w:800},gate:{id:'make-five',x:1810,y:390,w:58,h:230},successTitle:'Первый контур запущен!',successDetail:'2 + 3 = 5. Конвейер доставит энергию в следующий цех.',wrongTitle:'Эти части не собирают число 5',wrongDetail:'Нужны две группы: сначала 2 заряда, затем ещё 3.'},
      {id:'addition-seven',number:2,theme:'reactor',title:'Сборочный цех',goal:'Реши пример и выбери аккумулятор',prompt:'4  +  3  =  ?',note:'Начни с четырёх и сделай ещё три шага вперёд',answer:7,zone:{x:2700,w:800},gate:{id:'addition-seven',x:3510,y:390,w:58,h:230},successTitle:'Аккумулятор установлен!',successDetail:'4 + 3 = 7. Паровые клапаны открыли дорогу дальше.',wrongTitle:'Аккумулятор не подходит',wrongDetail:'Считай после 4 ещё три числа: пять, шесть, семь.'},
      {id:'first-groups',number:3,theme:'reactor',title:'Лаборатория одинаковых групп',goal:'Посчитай три пары',prompt:'2  +  2  +  2  =  ?',note:'Три одинаковые группы по два — первый шаг к умножению',answer:6,zone:{x:4350,w:800},gate:{id:'first-groups',x:5160,y:390,w:58,h:230},successTitle:'Главный реактор готов!',successDetail:'Три пары — это 6 предметов. Финальный конвейер запущен.',wrongTitle:'Пересчитай одинаковые группы',wrongDetail:'Считай двойками: два, четыре… какое число будет следующим?'},
    ],
    platforms:[
      {x:0,y:620,w:600,h:100,kind:'ground'},{x:600,y:535,w:190,h:28,kind:'conveyor',direction:1,beltSpeed:90},{x:800,y:450,w:180,h:28,kind:'conveyor',direction:-1,beltSpeed:75},
      {x:1000,y:620,w:800,h:100,kind:'ground'},
      {x:1070,y:525,w:180,h:24,kind:'compositionPad',amount:2,challengeId:'make-five'},{x:1310,y:525,w:180,h:24,kind:'compositionPad',amount:4,challengeId:'make-five'},{x:1550,y:525,w:180,h:24,kind:'compositionPad',amount:3,challengeId:'make-five'},
      {x:1880,y:620,w:240,h:100,kind:'ground'},{x:2120,y:520,w:210,h:28,kind:'conveyor',direction:1,beltSpeed:100,requiresChallenge:'make-five'},{x:2330,y:440,w:210,h:28,kind:'conveyor',direction:-1,beltSpeed:105,requiresChallenge:'make-five'},{x:2540,y:520,w:160,h:28,kind:'conveyor',direction:1,beltSpeed:110,requiresChallenge:'make-five'},
      {x:2700,y:620,w:800,h:100,kind:'ground'},
      {x:2770,y:525,w:180,h:24,kind:'numberPad',value:6,challengeId:'addition-seven'},{x:3010,y:525,w:180,h:24,kind:'numberPad',value:7,challengeId:'addition-seven'},{x:3250,y:525,w:180,h:24,kind:'numberPad',value:8,challengeId:'addition-seven'},
      {x:3580,y:620,w:680,h:100,kind:'ground'},{x:3730,y:490,w:220,h:28,kind:'conveyor',direction:-1,beltSpeed:110,requiresChallenge:'addition-seven'},{x:4000,y:405,w:220,h:28,kind:'conveyor',direction:1,beltSpeed:120,requiresChallenge:'addition-seven'},
      {x:4350,y:620,w:800,h:100,kind:'ground'},
      {x:4420,y:525,w:180,h:24,kind:'numberPad',value:4,challengeId:'first-groups'},{x:4660,y:525,w:180,h:24,kind:'numberPad',value:6,challengeId:'first-groups'},{x:4900,y:525,w:180,h:24,kind:'numberPad',value:8,challengeId:'first-groups'},
      {x:5230,y:620,w:170,h:100,kind:'ground'},{x:5400,y:510,w:200,h:28,kind:'conveyor',direction:1,beltSpeed:120,requiresChallenge:'first-groups'},{x:5600,y:420,w:200,h:28,kind:'conveyor',direction:-1,beltSpeed:125,requiresChallenge:'first-groups'},{x:5800,y:510,w:220,h:28,kind:'conveyor',direction:1,beltSpeed:130,requiresChallenge:'first-groups'},
      {x:6020,y:620,w:380,h:100,kind:'ground'},
    ],
    coins:makeCoins([[120,555],[320,555],[690,475],[890,390],[1960,555],[2225,460],[2435,380],[2620,460],[3650,555],[3840,430],[4110,345],[5300,555],[5500,450],[5700,360],[5910,450],[6210,555]]),
    stars:makeStars([[890,360],[4110,315],[5700,330]]),enemies:[],
    hazards:[{id:0,kind:'steam',x:2070,y:440,w:52,h:180,period:3.2,activeFor:1.15,phase:0},{id:1,kind:'steam',x:2520,y:430,w:52,h:190,period:3.4,activeFor:1.2,phase:1.7},{id:2,kind:'steam',x:3670,y:445,w:52,h:175,period:3.1,activeFor:1.1,phase:.8},{id:3,kind:'steam',x:4210,y:420,w:52,h:200,period:3.5,activeFor:1.25,phase:2.1},{id:4,kind:'steam',x:5340,y:440,w:52,h:180,period:3.3,activeFor:1.15,phase:1}],
    checkpoints:[{x:80,y:540},{x:1030,y:540},{x:1910,y:540},{x:2730,y:540},{x:3610,y:540},{x:4380,y:540},{x:5260,y:540},{x:6050,y:540}],
    portal:{x:6240,y:490,w:82,h:130},
    learningGates:{'make-five':{id:'make-five',x:1810,y:390,w:58,h:230},'addition-seven':{id:'addition-seven',x:3510,y:390,w:58,h:230},'first-groups':{id:'first-groups',x:5160,y:390,w:58,h:230}},
    solved:{composition:false},
  },
];

const WORKSHOP_PAD_KINDS = new Set(['numberPad', 'comparePad', 'switch', 'compositionPad', 'symbolPad', 'rhythmPad']);
for (const level of ACADEMY_LEVELS) {
  for (const challenge of level.challenges || []) {
    const choices = level.platforms.filter((item) => item.challengeId === challenge.id && WORKSHOP_PAD_KINDS.has(item.kind));
    if (!choices.length) continue;
    const gap = 24;
    const totalWidth = choices.reduce((sum, item) => sum + item.w, 0) + gap * (choices.length - 1);
    const safeOffset = Math.min(190, Math.max(60, challenge.zone.w - totalWidth - 20));
    let cursor = challenge.zone.x + safeOffset;
    for (const choice of choices) {
      choice.x = cursor;
      cursor += choice.w + gap;
    }
  }
}
export function getAcademyLevel(id=ACADEMY_LEVELS[0].id){return ACADEMY_LEVELS.find((level)=>level.id===id)||ACADEMY_LEVELS[0];}
const first=ACADEMY_LEVELS[0];
export const WORLD_W=first.worldW;
export const platforms=first.platforms;
export const coins=first.coins;
export const stars=first.stars;
export const enemies=first.enemies;
export const checkpoints=first.checkpoints;
export const portal=first.portal;
export const learningGates=first.learningGates;
export const gate=first.learningGates[first.skill];
export const runeOrder=[1];