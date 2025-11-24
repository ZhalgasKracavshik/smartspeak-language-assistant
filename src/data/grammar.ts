// Tenses Data
export interface Tense {
  id: string;
  name: string;
  nameKz: string;
  nameRu: string;
  structure: string;
  usage: string;
  usageRu: string;
  examples: Array<{ en: string; kz: string; ru: string }>;
  keywords: string[];
}

export const tenses: Tense[] = [
  {
    id: 'present-simple',
    name: 'Present Simple',
    nameKz: 'Жай осы шақ',
    nameRu: 'Настоящее простое время',
    structure: 'Subject + V1 / Subject + do/does not + V1',
    usage: 'Үнемі болатын әрекеттер, фактілер, әдеттер',
    usageRu: 'Регулярные действия, факты, привычки',
    examples: [
      { en: 'I work every day.', kz: 'Мен күн сайын жұмыс істеймін.', ru: 'Я работаю каждый день.' },
      { en: 'She doesn\'t like coffee.', kz: 'Ол кофені ұнатпайды.', ru: 'Она не любит кофе.' },
      { en: 'Do you speak English?', kz: 'Сіз ағылшынша сөйлейсіз бе?', ru: 'Вы говорите по-английски?' },
    ],
    keywords: ['always', 'usually', 'often', 'sometimes', 'never', 'every day']
  },
  {
    id: 'present-continuous',
    name: 'Present Continuous',
    nameKz: 'Үздіксіз осы шақ',
    nameRu: 'Настоящее продолженное время',
    structure: 'Subject + am/is/are + V-ing',
    usage: 'Қазір болып жатқан әрекеттер',
    usageRu: 'Действия, происходящие в данный момент',
    examples: [
      { en: 'I am reading a book now.', kz: 'Мен қазір кітап оқып жатырмын.', ru: 'Я читаю книгу сейчас.' },
      { en: 'She is working at the moment.', kz: 'Ол қазір жұмыс істеп жатыр.', ru: 'Она работает в данный момент.' },
      { en: 'Are you listening to me?', kz: 'Сіз мені тыңдап жатырсыз ба?', ru: 'Вы меня слушаете?' },
    ],
    keywords: ['now', 'at the moment', 'currently', 'right now', 'today']
  },
  {
    id: 'present-perfect',
    name: 'Present Perfect',
    nameKz: 'Аяқталған осы шақ',
    nameRu: 'Настоящее совершенное время',
    structure: 'Subject + have/has + V3',
    usage: 'Нәтижесі қазір маңызды болып тұрған әрекеттер',
    usageRu: 'Действия, завершенные к настоящему моменту, результат важен сейчас',
    examples: [
      { en: 'I have finished my work.', kz: 'Мен жұмысымды аяқтадым.', ru: 'Я закончил работу.' },
      { en: 'She has visited Paris twice.', kz: 'Ол Парижде екі рет болды.', ru: 'Она была в Париже дважды.' },
      { en: 'Have you ever been to London?', kz: 'Сіз Лондонда болдыңыз ба?', ru: 'Вы когда-нибудь были в Лондоне?' },
    ],
    keywords: ['already', 'yet', 'just', 'ever', 'never', 'recently', 'lately']
  },
  {
    id: 'present-perfect-continuous',
    name: 'Present Perfect Continuous',
    nameKz: 'Үздіксіз аяқталған осы шақ',
    nameRu: 'Настоящее совершенное продолженное время',
    structure: 'Subject + have/has been + V-ing',
    usage: 'Бұрын басталып, қазір де жалғасып жатқан әрекеттер',
    usageRu: 'Действия, начавшиеся в прошлом и продолжающиеся до сих пор',
    examples: [
      { en: 'I have been studying for 3 hours.', kz: 'Мен 3 сағат бойы оқып жатырмын.', ru: 'Я учусь уже 3 часа.' },
      { en: 'She has been working here since 2010.', kz: 'Ол мұнда 2010 жылдан бері жұмыс істеп жатыр.', ru: 'Она работает здесь с 2010 года.' },
      { en: 'How long have you been waiting?', kz: 'Сіз қанша уақыт күтіп жатырсыз?', ru: 'Как долго вы ждете?' },
    ],
    keywords: ['for', 'since', 'how long', 'all day', 'all morning']
  },
  {
    id: 'past-simple',
    name: 'Past Simple',
    nameKz: 'Жай өткен шақ',
    nameRu: 'Прошедшее простое время',
    structure: 'Subject + V2 / Subject + did not + V1',
    usage: 'Өткенде болған әрекеттер',
    usageRu: 'Действия, произошедшие в прошлом',
    examples: [
      { en: 'I visited my grandparents yesterday.', kz: 'Мен кеше ата-әжемді қонаққа бардым.', ru: 'Я навестил бабушку и дедушку вчера.' },
      { en: 'She didn\'t go to school.', kz: 'Ол мектепке бармады.', ru: 'Она не пошла в школу.' },
      { en: 'Did you see that movie?', kz: 'Сіз ол фильмді көрдіңіз бе?', ru: 'Вы видели этот фильм?' },
    ],
    keywords: ['yesterday', 'ago', 'last week', 'in 2020', 'when']
  },
  {
    id: 'past-continuous',
    name: 'Past Continuous',
    nameKz: 'Үздіксіз өткен шақ',
    nameRu: 'Прошедшее продолженное время',
    structure: 'Subject + was/were + V-ing',
    usage: 'Өткенде белгілі бір уақытта болып жатқан әрекеттер',
    usageRu: 'Действия, происходившие в определенный момент в прошлом',
    examples: [
      { en: 'I was reading when you called.', kz: 'Сіз қоңырау шалғанда мен оқып жатырмын.', ru: 'Я читал, когда вы позвонили.' },
      { en: 'They were playing football at 5 pm.', kz: 'Олар сағат 5-те футбол ойнап жатты.', ru: 'Они играли в футбол в 5 вечера.' },
      { en: 'What were you doing at that time?', kz: 'Сол уақытта не істеп жаттыңыз?', ru: 'Что вы делали в это время?' },
    ],
    keywords: ['while', 'when', 'at that time', 'at 5 o\'clock']
  },
  {
    id: 'past-perfect',
    name: 'Past Perfect',
    nameKz: 'Аяқталған өткен шақ',
    nameRu: 'Прошедшее совершенное время',
    structure: 'Subject + had + V3',
    usage: 'Өткенде басқа әрекетке дейін болған әрекеттер',
    usageRu: 'Действия, завершившиеся до определенного момента в прошлом',
    examples: [
      { en: 'I had finished dinner before he arrived.', kz: 'Ол келгенге дейін мен кешкі асты аяқтаған едім.', ru: 'Я закончил ужин до того, как он пришел.' },
      { en: 'She had left when I got there.', kz: 'Мен барғанда ол кеткен еді.', ru: 'Она ушла, когда я пришел туда.' },
      { en: 'Had you seen him before?', kz: 'Сіз оны бұрын көрген едіңіз бе?', ru: 'Вы видели его раньше?' },
    ],
    keywords: ['before', 'after', 'already', 'by the time', 'when']
  },
  {
    id: 'past-perfect-continuous',
    name: 'Past Perfect Continuous',
    nameKz: 'Үздіксіз аяқталған өткен шақ',
    nameRu: 'Прошедшее совершенное продолженное время',
    structure: 'Subject + had been + V-ing',
    usage: 'Өткенде ұзақ уақыт жалғасқан әрекеттер',
    usageRu: 'Действия, длившиеся в течение некоторого времени до момента в прошлом',
    examples: [
      { en: 'I had been waiting for an hour when he arrived.', kz: 'Ол келгенде мен бір сағат күтіп жатырмын.', ru: 'Я ждал час, когда он пришел.' },
      { en: 'She had been studying all day.', kz: 'Ол күні бойы оқып жатты.', ru: 'Она училась весь день.' },
      { en: 'How long had you been working there?', kz: 'Сіз сонда қанша уақыт жұмыс істедіңіз?', ru: 'Как долго вы там работали?' },
    ],
    keywords: ['for', 'since', 'before', 'by the time']
  },
  {
    id: 'future-simple',
    name: 'Future Simple',
    nameKz: 'Жай келер шақ',
    nameRu: 'Будущее простое время',
    structure: 'Subject + will + V1',
    usage: 'Болашақта болатын әрекеттер',
    usageRu: 'Действия, которые произойдут в будущем',
    examples: [
      { en: 'I will call you tomorrow.', kz: 'Мен сізге ертең қоңырау шаламын.', ru: 'Я позвоню тебе завтра.' },
      { en: 'She will not come to the party.', kz: 'Ол кешке келмейді.', ru: 'Она не придет на вечеринку.' },
      { en: 'Will you help me?', kz: 'Маған көмектесесіз бе?', ru: 'Ты мне поможешь?' },
    ],
    keywords: ['tomorrow', 'next week', 'in the future', 'soon', 'later']
  },
  {
    id: 'future-continuous',
    name: 'Future Continuous',
    nameKz: 'Үздіксіз келер шақ',
    nameRu: 'Будущее продолженное время',
    structure: 'Subject + will be + V-ing',
    usage: 'Болашақта белгілі бір уақытта болатын әрекеттер',
    usageRu: 'Действия, которые будут происходить в определенный момент в будущем',
    examples: [
      { en: 'I will be working at 9 am tomorrow.', kz: 'Мен ертең таңғы 9-да жұмыс істеп жатамын.', ru: 'Я буду работать завтра в 9 утра.' },
      { en: 'She will be traveling next week.', kz: 'Ол келесі аптада саяхаттап жүреді.', ru: 'Она будет путешествовать на следующей неделе.' },
      { en: 'Will you be using the car?', kz: 'Сіз машинаны пайдаланасыз ба?', ru: 'Вы будете пользоваться машиной?' },
    ],
    keywords: ['at this time tomorrow', 'next week', 'at 9 am']
  },
  {
    id: 'future-perfect',
    name: 'Future Perfect',
    nameKz: 'Аяқталған келер шақ',
    nameRu: 'Будущее совершенное время',
    structure: 'Subject + will have + V3',
    usage: 'Болашақта белгілі бір уақытқа дейін аяқталатын әрекеттер',
    usageRu: 'Действия, которые завершатся к определенному моменту в будущем',
    examples: [
      { en: 'I will have finished by 5 pm.', kz: 'Мен сағат 5-ке дейін аяқтайтын боламын.', ru: 'Я закончу к 5 вечера.' },
      { en: 'She will have graduated by next year.', kz: 'Ол келесі жылға дейін бітіреді.', ru: 'Она закончит учебу к следующему году.' },
      { en: 'Will you have completed it by Monday?', kz: 'Сіз оны дүйсенбіге дейін аяқтайсыз ба?', ru: 'Вы закончите это к понедельнику?' },
    ],
    keywords: ['by', 'by the time', 'before', 'by next week']
  },
  {
    id: 'future-perfect-continuous',
    name: 'Future Perfect Continuous',
    nameKz: 'Үздіксіз аяқталған келер шақ',
    nameRu: 'Будущее совершенное продолженное время',
    structure: 'Subject + will have been + V-ing',
    usage: 'Болашақта ұзақ уақыт жалғасатын әрекеттер',
    usageRu: 'Действия, которые будут продолжаться в течение некоторого времени до момента в будущем',
    examples: [
      { en: 'By next year, I will have been working here for 5 years.', kz: 'Келесі жылға қарай мен мұнда 5 жыл жұмыс істеп жатқан боламын.', ru: 'К следующему году я буду работать здесь уже 5 лет.' },
      { en: 'She will have been studying for 3 hours by then.', kz: 'Ол сол уақытқа дейін 3 сағат оқып жатқан болады.', ru: 'К тому времени она будет учиться уже 3 часа.' },
      { en: 'How long will you have been living here?', kz: 'Сіз мұнда қанша уақыт тұрып жатасыз?', ru: 'Как долго вы будете здесь жить?' },
    ],
    keywords: ['for', 'by the time', 'by next year']
  },
];

// Conditionals Data
export interface Conditional {
  id: string;
  type: string;
  typeKz: string;
  typeRu: string;
  structure: string;
  usage: string;
  usageRu: string;
  examples: Array<{ en: string; kz: string; ru: string }>;
}

export const conditionals: Conditional[] = [
  {
    id: 'zero-conditional',
    type: 'Zero Conditional',
    typeKz: 'Нөлдік шартты',
    typeRu: 'Нулевое условие',
    structure: 'If + Present Simple, Present Simple',
    usage: 'Жалпы шындықтар, ғылыми фактілер',
    usageRu: 'Общеизвестные истины, научные факты',
    examples: [
      { en: 'If you heat water to 100°C, it boils.', kz: 'Егер суды 100°C-қа дейін қыздырсаңыз, ол қайнайды.', ru: 'Если нагреть воду до 100°C, она закипит.' },
      { en: 'If it rains, the ground gets wet.', kz: 'Егер жаңбыр жауса, жер дымқыл болады.', ru: 'Если идет дождь, земля становится мокрой.' },
      { en: 'If you don\'t eat, you get hungry.', kz: 'Егер тамақтанбасаңыз, аш боласыз.', ru: 'Если не есть, проголодаешься.' },
    ]
  },
  {
    id: 'first-conditional',
    type: 'First Conditional',
    typeKz: 'Бірінші шартты',
    typeRu: 'Первое условие',
    structure: 'If + Present Simple, will + V1',
    usage: 'Нақты болу мүмкіндігі бар болашақ жағдайлар',
    usageRu: 'Реальные будущие ситуации',
    examples: [
      { en: 'If it rains tomorrow, I will stay home.', kz: 'Егер ертең жаңбыр жауса, мен үйде қаламын.', ru: 'Если завтра пойдет дождь, я останусь дома.' },
      { en: 'If you study hard, you will pass the exam.', kz: 'Егер жақсы оқысаңыз, емтиханнан өтесіз.', ru: 'Если будешь усердно учиться, сдашь экзамен.' },
      { en: 'If she comes, we will go together.', kz: 'Егер ол келсе, біз бірге барамыз.', ru: 'Если она придет, мы пойдем вместе.' },
    ]
  },
  {
    id: 'second-conditional',
    type: 'Second Conditional',
    typeKz: 'Екінші шартты',
    typeRu: 'Второе условие',
    structure: 'If + Past Simple, would + V1',
    usage: 'Қиял, ықтималдығы аз жағдайлар',
    usageRu: 'Воображаемые, маловероятные ситуации',
    examples: [
      { en: 'If I had a million dollars, I would travel the world.', kz: 'Егер менде миллион доллар болса, мен әлемді аралап шығар едім.', ru: 'Если бы у меня был миллион долларов, я бы путешествовал по миру.' },
      { en: 'If she were here, she would help us.', kz: 'Егер ол мұнда болса, бізге көмектесер еді.', ru: 'Если бы она была здесь, она бы нам помогла.' },
      { en: 'If I were you, I would accept the offer.', kz: 'Егер мен сіз болсам, ұсынысты қабылдаған болар едім.', ru: 'На твоем месте я бы принял предложение.' },
    ]
  },
  {
    id: 'third-conditional',
    type: 'Third Conditional',
    typeKz: 'Үшінші шартты',
    typeRu: 'Третье условие',
    structure: 'If + Past Perfect, would have + V3',
    usage: 'Өткенде болмаған жағдайлар туралы өкіну',
    usageRu: 'Сожаления о прошлом, нереальные ситуации в прошлом',
    examples: [
      { en: 'If I had known, I would have told you.', kz: 'Егер білсем, сізге айтқан болар едім.', ru: 'Если бы я знал, я бы тебе сказал.' },
      { en: 'If she had studied harder, she would have passed.', kz: 'Егер ол жақсы оқыса, өткен болар еді.', ru: 'Если бы она училась усерднее, она бы сдала.' },
      { en: 'If we had left earlier, we would have caught the train.', kz: 'Егер ерте кетсек, пойызға үлгерер едік.', ru: 'Если бы мы вышли раньше, мы бы успели на поезд.' },
    ]
  },
  {
    id: 'mixed-conditional',
    type: 'Mixed Conditional',
    typeKz: 'Аралас шартты',
    typeRu: 'Смешанное условие',
    structure: 'If + Past Perfect, would + V1 (or vice versa)',
    usage: 'Өткен мен қазіргі жағдайларды байланыстыру',
    usageRu: 'Связь прошлого и настоящего',
    examples: [
      { en: 'If I had studied medicine, I would be a doctor now.', kz: 'Егер медицина оқығанымда, қазір дәрігер болар едім.', ru: 'Если бы я изучал медицину, я был бы сейчас врачом.' },
      { en: 'If she were more careful, she wouldn\'t have made that mistake.', kz: 'Егер ол мұқият болса, сол қатені жібермес еді.', ru: 'Если бы она была внимательнее, она бы не совершила эту ошибку.' },
      { en: 'If I were rich, I would have bought that house.', kz: 'Егер бай болсам, сол үйді сатып алар едім.', ru: 'Если бы я был богат, я бы купил этот дом.' },
    ]
  },
];

// Phrasal Verbs Data
export interface PhrasalVerb {
  id: string;
  verb: string;
  meaning: string;
  meaningKz: string;
  meaningRu: string;
  examples: Array<{ en: string; kz: string; ru: string }>;
  separable: boolean;
}

export const phrasalVerbs: PhrasalVerb[] = [
  { id: 'pv1', verb: 'break down', meaning: 'stop working', meaningKz: 'бұзылу', meaningRu: 'сломаться', examples: [{ en: 'My car broke down.', kz: 'Менің машинам бұзылды.', ru: 'Моя машина сломалась.' }], separable: false },
  { id: 'pv2', verb: 'bring up', meaning: 'raise a child', meaningKz: 'тәрбиелеу', meaningRu: 'воспитывать', examples: [{ en: 'She brought up three children.', kz: 'Ол үш баланы тәрбиеледі.', ru: 'Она воспитала троих детей.' }], separable: true },
  { id: 'pv3', verb: 'call off', meaning: 'cancel', meaningKz: 'болдырмау', meaningRu: 'отменить', examples: [{ en: 'They called off the meeting.', kz: 'Олар жиналысты болдырмады.', ru: 'Они отменили встречу.' }], separable: true },
  { id: 'pv4', verb: 'carry on', meaning: 'continue', meaningKz: 'жалғастыру', meaningRu: 'продолжать', examples: [{ en: 'Carry on with your work.', kz: 'Жұмысыңызды жалғастырыңыз.', ru: 'Продолжайте работу.' }], separable: false },
  { id: 'pv5', verb: 'come across', meaning: 'find by chance', meaningKz: 'кездейсоқ табу', meaningRu: 'случайно найти', examples: [{ en: 'I came across an old photo.', kz: 'Мен ескі суретке кездестім.', ru: 'Я случайно нашел старое фото.' }], separable: false },
  { id: 'pv6', verb: 'come up with', meaning: 'think of an idea', meaningKz: 'ойлап табу', meaningRu: 'придумать', examples: [{ en: 'She came up with a great idea.', kz: 'Ол тамаша идея ойлап тапты.', ru: 'Она придумала отличную идею.' }], separable: false },
  { id: 'pv7', verb: 'figure out', meaning: 'solve, understand', meaningKz: 'түсіну, шешу', meaningRu: 'понять, выяснить', examples: [{ en: 'I can\'t figure out this problem.', kz: 'Мен бұл мәселені шеше алмаймын.', ru: 'Я не могу решить эту проблему.' }], separable: true },
  { id: 'pv8', verb: 'fill in', meaning: 'complete a form', meaningKz: 'толтыру', meaningRu: 'заполнить', examples: [{ en: 'Fill in this form.', kz: 'Бұл нысанды толтырыңыз.', ru: 'Заполните эту форму.' }], separable: true },
  { id: 'pv9', verb: 'get along', meaning: 'have a good relationship', meaningKz: 'тату тұру', meaningRu: 'ладить', examples: [{ en: 'We get along well.', kz: 'Біз жақсы тұрамыз.', ru: 'Мы хорошо ладим.' }], separable: false },
  { id: 'pv10', verb: 'get over', meaning: 'recover from', meaningKz: 'жеңу', meaningRu: 'преодолеть, оправиться', examples: [{ en: 'She got over her illness.', kz: 'Ол ауруын жеңді.', ru: 'Она оправилась от болезни.' }], separable: false },
  { id: 'pv11', verb: 'give up', meaning: 'stop trying', meaningKz: 'бас тарту', meaningRu: 'сдаваться', examples: [{ en: 'Don\'t give up!', kz: 'Бас тартпа!', ru: 'Не сдавайся!' }], separable: true },
  { id: 'pv12', verb: 'go on', meaning: 'continue', meaningKz: 'жалғасу', meaningRu: 'продолжать', examples: [{ en: 'Please go on.', kz: 'Жалғастырыңыз.', ru: 'Пожалуйста, продолжайте.' }], separable: false },
  { id: 'pv13', verb: 'grow up', meaning: 'become an adult', meaningKz: 'өсу', meaningRu: 'расти, взрослеть', examples: [{ en: 'I grew up in Almaty.', kz: 'Мен Алматыда өстім.', ru: 'Я вырос в Алматы.' }], separable: false },
  { id: 'pv14', verb: 'hand in', meaning: 'submit', meaningKz: 'тапсыру', meaningRu: 'сдавать', examples: [{ en: 'Hand in your homework.', kz: 'Үй тапсырмаңызды тапсырыңыз.', ru: 'Сдайте домашнее задание.' }], separable: true },
  { id: 'pv15', verb: 'hold on', meaning: 'wait', meaningKz: 'күту', meaningRu: 'ждать', examples: [{ en: 'Hold on a moment.', kz: 'Бір сәт күтіңіз.', ru: 'Подождите минуту.' }], separable: false },
  { id: 'pv16', verb: 'keep on', meaning: 'continue doing', meaningKz: 'жалғастыру', meaningRu: 'продолжать делать', examples: [{ en: 'Keep on trying.', kz: 'Әрекет жалғастырыңыз.', ru: 'Продолжайте пытаться.' }], separable: false },
  { id: 'pv17', verb: 'look after', meaning: 'take care of', meaningKz: 'қарау', meaningRu: 'присматривать', examples: [{ en: 'Look after your health.', kz: 'Денсаулығыңызды қараңыз.', ru: 'Следите за здоровьем.' }], separable: false },
  { id: 'pv18', verb: 'look for', meaning: 'search', meaningKz: 'іздеу', meaningRu: 'искать', examples: [{ en: 'I\'m looking for my keys.', kz: 'Мен кілттерімді іздеп жүрмін.', ru: 'Я ищу свои ключи.' }], separable: false },
  { id: 'pv19', verb: 'look forward to', meaning: 'anticipate with pleasure', meaningKz: 'асыға күту', meaningRu: 'с нетерпением ждать', examples: [{ en: 'I look forward to seeing you.', kz: 'Мен сізбен кездесуді асыға күтемін.', ru: 'Я с нетерпением жду встречи с вами.' }], separable: false },
  { id: 'pv20', verb: 'look up', meaning: 'search for information', meaningKz: 'іздеу (ақпарат)', meaningRu: 'искать (информацию)', examples: [{ en: 'Look it up in the dictionary.', kz: 'Оны сөздіктен іздеңіз.', ru: 'Посмотрите это в словаре.' }], separable: true },
  { id: 'pv21', verb: 'make up', meaning: 'invent', meaningKz: 'ойлап шығару', meaningRu: 'выдумывать', examples: [{ en: 'Don\'t make up stories.', kz: 'Әңгімелер ойлап шығарма.', ru: 'Не выдумывай истории.' }], separable: true },
  { id: 'pv22', verb: 'pick up', meaning: 'collect', meaningKz: 'алу', meaningRu: 'подбирать, забирать', examples: [{ en: 'Pick up your clothes.', kz: 'Киімдеріңді жина.', ru: 'Собери свою одежду.' }], separable: true },
  { id: 'pv23', verb: 'put off', meaning: 'postpone', meaningKz: 'кейінге қалдыру', meaningRu: 'откладывать', examples: [{ en: 'Don\'t put off until tomorrow.', kz: 'Ертеңге қалдырма.', ru: 'Не откладывай на завтра.' }], separable: true },
  { id: 'pv24', verb: 'put on', meaning: 'wear', meaningKz: 'кию', meaningRu: 'надевать', examples: [{ en: 'Put on your coat.', kz: 'Пальтоңды кий.', ru: 'Надень пальто.' }], separable: true },
  { id: 'pv25', verb: 'run into', meaning: 'meet by chance', meaningKz: 'кездесу', meaningRu: 'случайно встретить', examples: [{ en: 'I ran into an old friend.', kz: 'Мен ескі досыма кездестім.', ru: 'Я случайно встретил старого друга.' }], separable: false },
  { id: 'pv26', verb: 'set up', meaning: 'establish', meaningKz: 'құру', meaningRu: 'устанавливать, основывать', examples: [{ en: 'They set up a new company.', kz: 'Олар жаңа компания құрды.', ru: 'Они основали новую компанию.' }], separable: true },
  { id: 'pv27', verb: 'show up', meaning: 'appear', meaningKz: 'келу', meaningRu: 'появляться', examples: [{ en: 'He didn\'t show up.', kz: 'Ол келмеді.', ru: 'Он не появился.' }], separable: false },
  { id: 'pv28', verb: 'take off', meaning: 'remove clothes', meaningKz: 'шешу', meaningRu: 'снимать', examples: [{ en: 'Take off your shoes.', kz: 'Аяқ киіміңді шеш.', ru: 'Сними обувь.' }], separable: true },
  { id: 'pv29', verb: 'turn down', meaning: 'refuse', meaningKz: 'бас тарту', meaningRu: 'отказываться', examples: [{ en: 'She turned down the offer.', kz: 'Ол ұсыныстан бас тартты.', ru: 'Она отклонила предложение.' }], separable: true },
  { id: 'pv30', verb: 'turn up', meaning: 'arrive', meaningKz: 'келу', meaningRu: 'появляться, приходить', examples: [{ en: 'He turned up late.', kz: 'Ол кешігіп келді.', ru: 'Он пришел поздно.' }], separable: false },
  { id: 'pv31', verb: 'work out', meaning: 'exercise', meaningKz: 'жаттығу', meaningRu: 'тренироваться', examples: [{ en: 'I work out every day.', kz: 'Мен күн сайын жаттығамын.', ru: 'Я тренируюсь каждый день.' }], separable: false },
  { id: 'pv32', verb: 'work out', meaning: 'solve a problem', meaningKz: 'шешу', meaningRu: 'решать', examples: [{ en: 'We worked out a solution.', kz: 'Біз шешім таптық.', ru: 'Мы нашли решение.' }], separable: true },
];

// Irregular Verbs Data
export interface IrregularVerb {
  id: string;
  baseForm: string;
  pastSimple: string;
  pastParticiple: string;
  translation: string;
  translationRu: string;
  example: { en: string; kz: string; ru: string };
}

export const irregularVerbs: IrregularVerb[] = [
  { id: 'iv1', baseForm: 'be', pastSimple: 'was/were', pastParticiple: 'been', translation: 'болу', translationRu: 'быть', example: { en: 'I have been there.', kz: 'Мен сонда болдым.', ru: 'Я был там.' } },
  { id: 'iv2', baseForm: 'become', pastSimple: 'became', pastParticiple: 'become', translation: 'болу', translationRu: 'становиться', example: { en: 'She became a doctor.', kz: 'Ол дәрігер болды.', ru: 'Она стала врачом.' } },
  { id: 'iv3', baseForm: 'begin', pastSimple: 'began', pastParticiple: 'begun', translation: 'бастау', translationRu: 'начинать', example: { en: 'We have begun the project.', kz: 'Біз жобаны бастадық.', ru: 'Мы начали проект.' } },
  { id: 'iv4', baseForm: 'break', pastSimple: 'broke', pastParticiple: 'broken', translation: 'сындыру', translationRu: 'ломать', example: { en: 'He broke the window.', kz: 'Ол терезені сындырды.', ru: 'Он разбил окно.' } },
  { id: 'iv5', baseForm: 'bring', pastSimple: 'brought', pastParticiple: 'brought', translation: 'әкелу', translationRu: 'приносить', example: { en: 'I brought a gift.', kz: 'Мен сыйлық әкелдім.', ru: 'Я принес подарок.' } },
  { id: 'iv6', baseForm: 'build', pastSimple: 'built', pastParticiple: 'built', translation: 'салу', translationRu: 'строить', example: { en: 'They built a house.', kz: 'Олар үй салды.', ru: 'Они построили дом.' } },
  { id: 'iv7', baseForm: 'buy', pastSimple: 'bought', pastParticiple: 'bought', translation: 'сатып алу', translationRu: 'покупать', example: { en: 'I bought a car.', kz: 'Мен машина сатып алдым.', ru: 'Я купил машину.' } },
  { id: 'iv8', baseForm: 'catch', pastSimple: 'caught', pastParticiple: 'caught', translation: 'ұстау', translationRu: 'ловить', example: { en: 'He caught the ball.', kz: 'Ол добты ұстады.', ru: 'Он поймал мяч.' } },
  { id: 'iv9', baseForm: 'choose', pastSimple: 'chose', pastParticiple: 'chosen', translation: 'таңдау', translationRu: 'выбирать', example: { en: 'She chose the blue one.', kz: 'Ол көк түстісін таңдады.', ru: 'Она выбрала синий.' } },
  { id: 'iv10', baseForm: 'come', pastSimple: 'came', pastParticiple: 'come', translation: 'келу', translationRu: 'приходить', example: { en: 'They came yesterday.', kz: 'Олар кеше келді.', ru: 'Они пришли вчера.' } },
  { id: 'iv11', baseForm: 'do', pastSimple: 'did', pastParticiple: 'done', translation: 'жасау', translationRu: 'делать', example: { en: 'I have done my homework.', kz: 'Мен үй тапсырмамды орындадым.', ru: 'Я сделал домашнее задание.' } },
  { id: 'iv12', baseForm: 'drink', pastSimple: 'drank', pastParticiple: 'drunk', translation: 'ішу', translationRu: 'пить', example: { en: 'He drank water.', kz: 'Ол су ішті.', ru: 'Он пил воду.' } },
  { id: 'iv13', baseForm: 'drive', pastSimple: 'drove', pastParticiple: 'driven', translation: 'жүргізу', translationRu: 'водить', example: { en: 'She drove to work.', kz: 'Ол жұмысқа машинамен жүрді.', ru: 'Она поехала на работу на машине.' } },
  { id: 'iv14', baseForm: 'eat', pastSimple: 'ate', pastParticiple: 'eaten', translation: 'жеу', translationRu: 'есть', example: { en: 'We ate dinner.', kz: 'Біз кешкі асты жедік.', ru: 'Мы поужинали.' } },
  { id: 'iv15', baseForm: 'fall', pastSimple: 'fell', pastParticiple: 'fallen', translation: 'құлау', translationRu: 'падать', example: { en: 'He fell down.', kz: 'Ол құлады.', ru: 'Он упал.' } },
  { id: 'iv16', baseForm: 'feel', pastSimple: 'felt', pastParticiple: 'felt', translation: 'сезіну', translationRu: 'чувствовать', example: { en: 'I felt happy.', kz: 'Мен бақытты сезіндім.', ru: 'Я чувствовал себя счастливым.' } },
  { id: 'iv17', baseForm: 'find', pastSimple: 'found', pastParticiple: 'found', translation: 'табу', translationRu: 'находить', example: { en: 'I found my keys.', kz: 'Мен кілттерімді таптым.', ru: 'Я нашел свои ключи.' } },
  { id: 'iv18', baseForm: 'fly', pastSimple: 'flew', pastParticiple: 'flown', translation: 'ұшу', translationRu: 'летать', example: { en: 'The bird flew away.', kz: 'Құс ұшып кетті.', ru: 'Птица улетела.' } },
  { id: 'iv19', baseForm: 'forget', pastSimple: 'forgot', pastParticiple: 'forgotten', translation: 'ұмыту', translationRu: 'забывать', example: { en: 'I forgot my password.', kz: 'Мен пароліме ұмыттым.', ru: 'Я забыл свой пароль.' } },
  { id: 'iv20', baseForm: 'get', pastSimple: 'got', pastParticiple: 'got/gotten', translation: 'алу', translationRu: 'получать', example: { en: 'I got a present.', kz: 'Мен сыйлық алдым.', ru: 'Я получил подарок.' } },
  { id: 'iv21', baseForm: 'give', pastSimple: 'gave', pastParticiple: 'given', translation: 'беру', translationRu: 'давать', example: { en: 'She gave me a book.', kz: 'Ол маған кітап берді.', ru: 'Она дала мне книгу.' } },
  { id: 'iv22', baseForm: 'go', pastSimple: 'went', pastParticiple: 'gone', translation: 'бару', translationRu: 'идти', example: { en: 'They went home.', kz: 'Олар үйге кетті.', ru: 'Они пошли домой.' } },
  { id: 'iv23', baseForm: 'have', pastSimple: 'had', pastParticiple: 'had', translation: 'болу', translationRu: 'иметь', example: { en: 'I had a problem.', kz: 'Менде проблема болды.', ru: 'У меня была проблема.' } },
  { id: 'iv24', baseForm: 'hear', pastSimple: 'heard', pastParticiple: 'heard', translation: 'есту', translationRu: 'слышать', example: { en: 'I heard a noise.', kz: 'Мен шу естідім.', ru: 'Я услышал шум.' } },
  { id: 'iv25', baseForm: 'keep', pastSimple: 'kept', pastParticiple: 'kept', translation: 'сақтау', translationRu: 'держать, хранить', example: { en: 'Keep the change.', kz: 'Қалғанын сақтаңыз.', ru: 'Оставьте сдачу себе.' } },
  { id: 'iv26', baseForm: 'know', pastSimple: 'knew', pastParticiple: 'known', translation: 'білу', translationRu: 'знать', example: { en: 'I knew the answer.', kz: 'Мен жауапты білдім.', ru: 'Я знал ответ.' } },
  { id: 'iv27', baseForm: 'leave', pastSimple: 'left', pastParticiple: 'left', translation: 'кету', translationRu: 'покидать', example: { en: 'He left early.', kz: 'Ол ерте кетті.', ru: 'Он ушел рано.' } },
  { id: 'iv28', baseForm: 'lose', pastSimple: 'lost', pastParticiple: 'lost', translation: 'жоғалту', translationRu: 'терять', example: { en: 'I lost my wallet.', kz: 'Мен әмиянымды жоғалттым.', ru: 'Я потерял кошелек.' } },
  { id: 'iv29', baseForm: 'make', pastSimple: 'made', pastParticiple: 'made', translation: 'жасау', translationRu: 'делать', example: { en: 'She made a cake.', kz: 'Ол торт жасады.', ru: 'Она испекла торт.' } },
  { id: 'iv30', baseForm: 'meet', pastSimple: 'met', pastParticiple: 'met', translation: 'кездесу', translationRu: 'встречать', example: { en: 'I met a friend.', kz: 'Мен досыммен кездестім.', ru: 'Я встретил друга.' } },
  { id: 'iv31', baseForm: 'pay', pastSimple: 'paid', pastParticiple: 'paid', translation: 'төлеу', translationRu: 'платить', example: { en: 'He paid the bill.', kz: 'Ол төлем төледі.', ru: 'Он оплатил счет.' } },
  { id: 'iv32', baseForm: 'put', pastSimple: 'put', pastParticiple: 'put', translation: 'қою', translationRu: 'класть', example: { en: 'Put it here.', kz: 'Мұнда қойыңыз.', ru: 'Положи это сюда.' } },
  { id: 'iv33', baseForm: 'read', pastSimple: 'read', pastParticiple: 'read', translation: 'оқу', translationRu: 'читать', example: { en: 'I read a book.', kz: 'Мен кітап оқыдым.', ru: 'Я читал книгу.' } },
  { id: 'iv34', baseForm: 'run', pastSimple: 'ran', pastParticiple: 'run', translation: 'жүгіру', translationRu: 'бежать', example: { en: 'He ran fast.', kz: 'Ол жылдам жүгірді.', ru: 'Он бежал быстро.' } },
  { id: 'iv35', baseForm: 'say', pastSimple: 'said', pastParticiple: 'said', translation: 'айту', translationRu: 'сказать', example: { en: 'She said hello.', kz: 'Ол сәлем деді.', ru: 'Она сказала привет.' } },
  { id: 'iv36', baseForm: 'see', pastSimple: 'saw', pastParticiple: 'seen', translation: 'көру', translationRu: 'видеть', example: { en: 'I saw a movie.', kz: 'Мен фильм көрдім.', ru: 'Я видел фильм.' } },
  { id: 'iv37', baseForm: 'sell', pastSimple: 'sold', pastParticiple: 'sold', translation: 'сату', translationRu: 'продавать', example: { en: 'They sold their house.', kz: 'Олар үйін сатты.', ru: 'Они продали свой дом.' } },
  { id: 'iv38', baseForm: 'send', pastSimple: 'sent', pastParticiple: 'sent', translation: 'жіберу', translationRu: 'отправлять', example: { en: 'I sent an email.', kz: 'Мен email жібердім.', ru: 'Я отправил письмо.' } },
  { id: 'iv39', baseForm: 'sing', pastSimple: 'sang', pastParticiple: 'sung', translation: 'ән айту', translationRu: 'петь', example: { en: 'She sang beautifully.', kz: 'Ол әдемі ән айтты.', ru: 'Она красиво пела.' } },
  { id: 'iv40', baseForm: 'sit', pastSimple: 'sat', pastParticiple: 'sat', translation: 'отыру', translationRu: 'сидеть', example: { en: 'Please sit down.', kz: 'Отырыңыз.', ru: 'Пожалуйста, садитесь.' } },
  { id: 'iv41', baseForm: 'sleep', pastSimple: 'slept', pastParticiple: 'slept', translation: 'ұйықтау', translationRu: 'спать', example: { en: 'I slept well.', kz: 'Мен жақсы ұйықтадым.', ru: 'Я хорошо спал.' } },
  { id: 'iv42', baseForm: 'speak', pastSimple: 'spoke', pastParticiple: 'spoken', translation: 'сөйлеу', translationRu: 'говорить', example: { en: 'He spoke English.', kz: 'Ол ағылшынша сөйледі.', ru: 'Он говорил по-английски.' } },
  { id: 'iv43', baseForm: 'spend', pastSimple: 'spent', pastParticiple: 'spent', translation: 'жұмсау', translationRu: 'тратить', example: { en: 'I spent money.', kz: 'Мен ақша жұмсадым.', ru: 'Я потратил деньги.' } },
  { id: 'iv44', baseForm: 'stand', pastSimple: 'stood', pastParticiple: 'stood', translation: 'тұру', translationRu: 'стоять', example: { en: 'He stood up.', kz: 'Ол тұрды.', ru: 'Он встал.' } },
  { id: 'iv45', baseForm: 'take', pastSimple: 'took', pastParticiple: 'taken', translation: 'алу', translationRu: 'брать', example: { en: 'Take this.', kz: 'Мұны алыңыз.', ru: 'Возьми это.' } },
  { id: 'iv46', baseForm: 'teach', pastSimple: 'taught', pastParticiple: 'taught', translation: 'үйрету', translationRu: 'учить', example: { en: 'She taught me English.', kz: 'Ол маған ағылшын тілін үйретті.', ru: 'Она научила меня английскому.' } },
  { id: 'iv47', baseForm: 'tell', pastSimple: 'told', pastParticiple: 'told', translation: 'айту', translationRu: 'рассказывать', example: { en: 'He told a story.', kz: 'Ол әңгіме айтты.', ru: 'Он рассказал историю.' } },
  { id: 'iv48', baseForm: 'think', pastSimple: 'thought', pastParticiple: 'thought', translation: 'ойлау', translationRu: 'думать', example: { en: 'I thought about it.', kz: 'Мен ол туралы ойладым.', ru: 'Я думал об этом.' } },
  { id: 'iv49', baseForm: 'understand', pastSimple: 'understood', pastParticiple: 'understood', translation: 'түсіну', translationRu: 'понимать', example: { en: 'I understood everything.', kz: 'Мен бәрін түсіндім.', ru: 'Я все понял.' } },
  { id: 'iv50', baseForm: 'wear', pastSimple: 'wore', pastParticiple: 'worn', translation: 'кию', translationRu: 'носить', example: { en: 'She wore a dress.', kz: 'Ол көйлек киді.', ru: 'Она носила платье.' } },
  { id: 'iv51', baseForm: 'win', pastSimple: 'won', pastParticiple: 'won', translation: 'жеңу', translationRu: 'выигрывать', example: { en: 'We won the game.', kz: 'Біз ойынды жеңдік.', ru: 'Мы выиграли игру.' } },
  { id: 'iv52', baseForm: 'write', pastSimple: 'wrote', pastParticiple: 'written', translation: 'жазу', translationRu: 'писать', example: { en: 'I wrote a letter.', kz: 'Мен хат жаздым.', ru: 'Я написал письмо.' } },
];
