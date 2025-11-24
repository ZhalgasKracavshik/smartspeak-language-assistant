export interface DialogueMessage {
    speaker: 'user' | 'bot';
    text: string;
    translation: {
        kz: string;
        ru: string;
    };
}

export interface Dialogue {
    id: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    scenario: string;
    scenarioTranslation: {
        kz: string;
        ru: string;
    };
    messages: DialogueMessage[];
}

export const dialogues: Dialogue[] = [
    // A1 Level
    {
        id: 'd1',
        level: 'A1',
        scenario: 'Meeting a new friend',
        scenarioTranslation: { kz: 'Жаңа досымен танысу', ru: 'Знакомство с новым другом' },
        messages: [
            { speaker: 'bot', text: 'Hello! My name is Sarah. What\'s your name?', translation: { kz: 'Сәлем! Менің атым Сара. Сіздің атыңыз кім?', ru: 'Привет! Меня зовут Сара. Как тебя зовут?' } },
            { speaker: 'user', text: 'Hi Sarah! I\'m Alex. Nice to meet you!', translation: { kz: 'Сәлем Сара! Мен Алекспін. Танысқанымыза қуаныштымын!', ru: 'Привет, Сара! Я Алекс. Приятно познакомиться!' } },
            { speaker: 'bot', text: 'Nice to meet you too! Where are you from?', translation: { kz: 'Мен де қуаныштымын! Сіз қайдансыз?', ru: 'Мне тоже приятно! Откуда ты?' } },
            { speaker: 'user', text: 'I\'m from Kazakhstan. And you?', translation: { kz: 'Мен Қазақстаннанмын. Ал сіз?', ru: 'Я из Казахстана. А ты?' } },
            { speaker: 'bot', text: 'I\'m from the USA. Welcome!', translation: { kz: 'Мен АҚШ-танмын. Қош келдіңіз!', ru: 'Я из США. Добро пожаловать!' } },
        ]
    },
    {
        id: 'd2',
        level: 'A1',
        scenario: 'Ordering coffee',
        scenarioTranslation: { kz: 'Кофеге тапсырыс беру', ru: 'Заказ кофе' },
        messages: [
            { speaker: 'bot', text: 'Hello! Can I help you?', translation: { kz: 'Сәлем! Сізге көмектесе аламын ба?', ru: 'Привет! Могу я вам помочь?' } },
            { speaker: 'user', text: 'Yes, I would like a coffee, please.', translation: { kz: 'Иә, маған кофе беріңізші.', ru: 'Да, я хотел бы кофе, пожалуйста.' } },
            { speaker: 'bot', text: 'Black or with milk?', translation: { kz: 'Қара ма әлде сүтпен бе?', ru: 'Черный или с молоком?' } },
            { speaker: 'user', text: 'With milk and sugar, please.', translation: { kz: 'Сүтпен және қантпен, өтінемін.', ru: 'С молоком и сахаром, пожалуйста.' } },
            { speaker: 'bot', text: 'Here you go. Enjoy!', translation: { kz: 'Мінекейіңіз. Ас болсын!', ru: 'Вот, пожалуйста. Наслаждайтесь!' } },
        ]
    },
    {
        id: 'd3',
        level: 'A1',
        scenario: 'Asking for directions',
        scenarioTranslation: { kz: 'Жол сұрау', ru: 'Спрашивать дорогу' },
        messages: [
            { speaker: 'user', text: 'Excuse me, where is the station?', translation: { kz: 'Кешіріңіз, вокзал қайда?', ru: 'Извините, где находится вокзал?' } },
            { speaker: 'bot', text: 'Go straight and turn left.', translation: { kz: 'Тіке жүріңіз және солға бұрылыңыз.', ru: 'Идите прямо и поверните налево.' } },
            { speaker: 'user', text: 'Is it far from here?', translation: { kz: 'Бұл жерден алыс па?', ru: 'Это далеко отсюда?' } },
            { speaker: 'bot', text: 'No, it\'s just 5 minutes walk.', translation: { kz: 'Жоқ, жаяу 5 минуттық жер.', ru: 'Нет, всего 5 минут ходьбы.' } },
            { speaker: 'user', text: 'Thank you very much!', translation: { kz: 'Көп рақмет!', ru: 'Большое спасибо!' } },
        ]
    },
    {
        id: 'd4',
        level: 'A1',
        scenario: 'At the hotel',
        scenarioTranslation: { kz: 'Қонақүйде', ru: 'В отеле' },
        messages: [
            { speaker: 'bot', text: 'Good afternoon. Checking in?', translation: { kz: 'Қайырлы күн. Тіркелесіз бе?', ru: 'Добрый день. Заселяетесь?' } },
            { speaker: 'user', text: 'Yes, I have a reservation.', translation: { kz: 'Иә, менде бронь бар.', ru: 'Да, у меня есть бронь.' } },
            { speaker: 'bot', text: 'Your name, please?', translation: { kz: 'Атыңыз кім?', ru: 'Ваше имя, пожалуйста?' } },
            { speaker: 'user', text: 'My name is John Smith.', translation: { kz: 'Менің атым Джон Смит.', ru: 'Меня зовут Джон Смит.' } },
            { speaker: 'bot', text: 'Here is your key. Room 205.', translation: { kz: 'Міне кілтіңіз. 205-бөлме.', ru: 'Вот ваш ключ. Комната 205.' } },
        ]
    },
    {
        id: 'd5',
        level: 'A1',
        scenario: 'Talking about family',
        scenarioTranslation: { kz: 'Отбасы туралы сөйлесу', ru: 'Разговор о семье' },
        messages: [
            { speaker: 'bot', text: 'Do you have a big family?', translation: { kz: 'Сіздің отбасыңыз үлкен бе?', ru: 'У вас большая семья?' } },
            { speaker: 'user', text: 'Yes, I have two brothers and one sister.', translation: { kz: 'Иә, менің екі ағам және бір қарындасым бар.', ru: 'Да, у меня два брата и одна сестра.' } },
            { speaker: 'bot', text: 'That\'s nice! How old are they?', translation: { kz: 'Керемет! Олар неше жаста?', ru: 'Здорово! Сколько им лет?' } },
            { speaker: 'user', text: 'My brothers are 20 and 22.', translation: { kz: 'Ағаларым 20 және 22 жаста.', ru: 'Моим братьям 20 и 22 года.' } },
            { speaker: 'bot', text: 'And your sister?', translation: { kz: 'Ал қарындасыңыз ше?', ru: 'А ваша сестра?' } },
        ]
    },
    {
        id: 'd6',
        level: 'A1',
        scenario: 'Shopping for food',
        scenarioTranslation: { kz: 'Азық-түлік сатып алу', ru: 'Покупка продуктов' },
        messages: [
            { speaker: 'bot', text: 'Can I help you?', translation: { kz: 'Сізге көмектесе аламын ба?', ru: 'Могу я вам помочь?' } },
            { speaker: 'user', text: 'I need some apples and milk.', translation: { kz: 'Маған алма мен сүт керек.', ru: 'Мне нужны яблоки и молоко.' } },
            { speaker: 'bot', text: 'How many apples do you want?', translation: { kz: 'Қанша алма алғыңыз келеді?', ru: 'Сколько яблок вы хотите?' } },
            { speaker: 'user', text: 'Five apples, please.', translation: { kz: 'Бес алма, өтінемін.', ru: 'Пять яблок, пожалуйста.' } },
            { speaker: 'bot', text: 'Anything else?', translation: { kz: 'Басқа нәрсе керек пе?', ru: 'Что-нибудь еще?' } },
        ]
    },
    {
        id: 'd7',
        level: 'A1',
        scenario: 'Talking about hobbies',
        scenarioTranslation: { kz: 'Хобби туралы сөйлесу', ru: 'Разговор о хобби' },
        messages: [
            { speaker: 'bot', text: 'What do you like to do?', translation: { kz: 'Сіз не істегенді ұнатасыз?', ru: 'Что вы любите делать?' } },
            { speaker: 'user', text: 'I like playing football.', translation: { kz: 'Мен футбол ойнағанды ұнатамын.', ru: 'Я люблю играть в футбол.' } },
            { speaker: 'bot', text: 'Do you play every day?', translation: { kz: 'Сіз күнде ойнайсыз ба?', ru: 'Вы играете каждый день?' } },
            { speaker: 'user', text: 'No, only on weekends.', translation: { kz: 'Жоқ, тек демалыс күндері.', ru: 'Нет, только по выходным.' } },
            { speaker: 'bot', text: 'That sounds fun!', translation: { kz: 'Бұл қызықты естіледі!', ru: 'Звучит весело!' } },
        ]
    },
    {
        id: 'd8',
        level: 'A1',
        scenario: 'Describing a room',
        scenarioTranslation: { kz: 'Бөлмені сипаттау', ru: 'Описание комнаты' },
        messages: [
            { speaker: 'bot', text: 'Is your room big?', translation: { kz: 'Сіздің бөлмеңіз үлкен бе?', ru: 'Твоя комната большая?' } },
            { speaker: 'user', text: 'No, it is small but cozy.', translation: { kz: 'Жоқ, ол кішкентай, бірақ ыңғайлы.', ru: 'Нет, она маленькая, но уютная.' } },
            { speaker: 'bot', text: 'What is in your room?', translation: { kz: 'Бөлмеңізде не бар?', ru: 'Что есть в твоей комнате?' } },
            { speaker: 'user', text: 'There is a bed and a desk.', translation: { kz: 'Онда төсек және үстел бар.', ru: 'Там есть кровать и стол.' } },
            { speaker: 'bot', text: 'Do you have a computer?', translation: { kz: 'Сізде компьютер бар ма?', ru: 'У тебя есть компьютер?' } },
        ]
    },

    // A2 Level
    {
        id: 'd9',
        level: 'A2',
        scenario: 'At a restaurant',
        scenarioTranslation: { kz: 'Мейрамханада', ru: 'В ресторане' },
        messages: [
            { speaker: 'bot', text: 'Good evening! Are you ready to order?', translation: { kz: 'Қайырлы кеш! Тапсырыс беруге дайынсыз ба?', ru: 'Добрый вечер! Вы готовы сделать заказ?' } },
            { speaker: 'user', text: 'Yes, I would like a salad and pasta, please.', translation: { kz: 'Иә, маған салат пен паста беріңізші.', ru: 'Да, я хотел бы салат и пасту, пожалуйста.' } },
            { speaker: 'bot', text: 'Great choice! What would you like to drink?', translation: { kz: 'Жақсы таңдау! Не ішесіз?', ru: 'Отличный выбор! Что будете пить?' } },
            { speaker: 'user', text: 'I\'ll have orange juice, please.', translation: { kz: 'Маған апельсин шырыны беріңіз.', ru: 'Мне апельсиновый сок, пожалуйста.' } },
            { speaker: 'bot', text: 'Perfect! Your order will be ready soon.', translation: { kz: 'Керемет! Тапсырысыңыз жақында дайын болады.', ru: 'Отлично! Ваш заказ скоро будет готов.' } },
        ]
    },
    {
        id: 'd10',
        level: 'A2',
        scenario: 'Shopping for clothes',
        scenarioTranslation: { kz: 'Киім сатып алу', ru: 'Покупка одежды' },
        messages: [
            { speaker: 'bot', text: 'Hello! Can I help you find something?', translation: { kz: 'Сәлем! Бірдеңе табуға көмектесе аламын ба?', ru: 'Привет! Могу я помочь вам что-то найти?' } },
            { speaker: 'user', text: 'Yes, I\'m looking for a jacket.', translation: { kz: 'Иә, мен куртка іздеп жүрмін.', ru: 'Да, я ищу куртку.' } },
            { speaker: 'bot', text: 'What size do you wear?', translation: { kz: 'Қандай өлшем киесіз?', ru: 'Какой размер вы носите?' } },
            { speaker: 'user', text: 'I wear medium. Do you have it in blue?', translation: { kz: 'Мен орташа киемін. Көк түсте бар ма?', ru: 'Я ношу средний. Есть ли в синем цвете?' } },
            { speaker: 'bot', text: 'Yes, we do! Let me show you.', translation: { kz: 'Иә, бар! Көрсетейін.', ru: 'Да, есть! Позвольте мне показать вам.' } },
        ]
    },
    {
        id: 'd11',
        level: 'A2',
        scenario: 'Making an appointment',
        scenarioTranslation: { kz: 'Кездесу белгілеу', ru: 'Назначение встречи' },
        messages: [
            { speaker: 'bot', text: 'Doctor\'s office. How can I help?', translation: { kz: 'Дәрігер қабылдауы. Қалай көмектесе аламын?', ru: 'Кабинет врача. Чем могу помочь?' } },
            { speaker: 'user', text: 'I\'d like to make an appointment.', translation: { kz: 'Мен қабылдауға жазылғым келеді.', ru: 'Я хотел бы записаться на прием.' } },
            { speaker: 'bot', text: 'Is tomorrow at 10 AM okay?', translation: { kz: 'Ертең сағат 10-да ыңғайлы ма?', ru: 'Завтра в 10 утра подойдет?' } },
            { speaker: 'user', text: 'Yes, that works for me.', translation: { kz: 'Иә, маған келеді.', ru: 'Да, мне подходит.' } },
            { speaker: 'bot', text: 'Okay, see you tomorrow.', translation: { kz: 'Жарайды, ертең көрісеміз.', ru: 'Хорошо, увидимся завтра.' } },
        ]
    },
    {
        id: 'd12',
        level: 'A2',
        scenario: 'Talking about weather',
        scenarioTranslation: { kz: 'Ауа райы туралы сөйлесу', ru: 'Разговор о погоде' },
        messages: [
            { speaker: 'bot', text: 'It\'s very cold today, isn\'t it?', translation: { kz: 'Бүгін өте суық, солай емес пе?', ru: 'Сегодня очень холодно, не так ли?' } },
            { speaker: 'user', text: 'Yes, I think it might snow.', translation: { kz: 'Иә, меніңше қар жаууы мүмкін.', ru: 'Да, я думаю, может пойти снег.' } },
            { speaker: 'bot', text: 'Do you like winter?', translation: { kz: 'Сіз қысты жақсы көресіз бе?', ru: 'Вам нравится зима?' } },
            { speaker: 'user', text: 'Not really, I prefer summer.', translation: { kz: 'Аса емес, мен жазды қалаймын.', ru: 'Не очень, я предпочитаю лето.' } },
            { speaker: 'bot', text: 'Me too. I love the sun.', translation: { kz: 'Мен де. Мен күнді жақсы көремін.', ru: 'Я тоже. Я люблю солнце.' } },
        ]
    },
    {
        id: 'd13',
        level: 'A2',
        scenario: 'Inviting a friend',
        scenarioTranslation: { kz: 'Досты шақыру', ru: 'Приглашение друга' },
        messages: [
            { speaker: 'user', text: 'Would you like to go to the cinema?', translation: { kz: 'Киноға барғыңыз келе ме?', ru: 'Хочешь пойти в кино?' } },
            { speaker: 'bot', text: 'I\'d love to! What movie?', translation: { kz: 'Қуана-қуана! Қандай фильм?', ru: 'С удовольствием! Какой фильм?' } },
            { speaker: 'user', text: 'There is a new comedy playing.', translation: { kz: 'Жаңа комедия болып жатыр.', ru: 'Идет новая комедия.' } },
            { speaker: 'bot', text: 'Great! What time?', translation: { kz: 'Керемет! Сағат қаншада?', ru: 'Отлично! Во сколько?' } },
            { speaker: 'user', text: 'Let\'s meet at 7 PM.', translation: { kz: 'Кешкі 7-де кездесейік.', ru: 'Давай встретимся в 7 вечера.' } },
        ]
    },
    {
        id: 'd14',
        level: 'A2',
        scenario: 'Asking for help',
        scenarioTranslation: { kz: 'Көмек сұрау', ru: 'Просьба о помощи' },
        messages: [
            { speaker: 'user', text: 'Could you help me with this bag?', translation: { kz: 'Маған мына сөмкемен көмектесе аласыз ба?', ru: 'Не могли бы вы помочь мне с этой сумкой?' } },
            { speaker: 'bot', text: 'Sure, it looks heavy.', translation: { kz: 'Әрине, ол ауыр көрінеді.', ru: 'Конечно, она выглядит тяжелой.' } },
            { speaker: 'user', text: 'Yes, I bought too many things.', translation: { kz: 'Иә, мен тым көп зат сатып алдым.', ru: 'Да, я купил слишком много вещей.' } },
            { speaker: 'bot', text: 'Where should I put it?', translation: { kz: 'Оны қайда қоюым керек?', ru: 'Куда мне ее поставить?' } },
            { speaker: 'user', text: 'Just on the table, thanks.', translation: { kz: 'Жай ғана үстелге, рахмет.', ru: 'Просто на стол, спасибо.' } },
        ]
    },
    {
        id: 'd15',
        level: 'A2',
        scenario: 'Describing a holiday',
        scenarioTranslation: { kz: 'Демелысты сипаттау', ru: 'Описание отпуска' },
        messages: [
            { speaker: 'bot', text: 'How was your holiday?', translation: { kz: 'Демелысыңыз қалай өтті?', ru: 'Как прошел ваш отпуск?' } },
            { speaker: 'user', text: 'It was wonderful! I went to Italy.', translation: { kz: 'Керемет болды! Мен Италияға бардым.', ru: 'Это было чудесно! Я ездил в Италию.' } },
            { speaker: 'bot', text: 'Did you like the food?', translation: { kz: 'Тамақ ұнады ма?', ru: 'Вам понравилась еда?' } },
            { speaker: 'user', text: 'Yes, the pizza was amazing.', translation: { kz: 'Иә, пицца ғажап болды.', ru: 'Да, пицца была восхитительной.' } },
            { speaker: 'bot', text: 'I want to go there too.', translation: { kz: 'Менің де барғым келеді.', ru: 'Я тоже хочу туда поехать.' } },
        ]
    },
    {
        id: 'd16',
        level: 'A2',
        scenario: 'At the pharmacy',
        scenarioTranslation: { kz: 'Дәріханада', ru: 'В аптеке' },
        messages: [
            { speaker: 'bot', text: 'Can I help you?', translation: { kz: 'Сізге көмектесе аламын ба?', ru: 'Могу я вам помочь?' } },
            { speaker: 'user', text: 'I have a headache.', translation: { kz: 'Менің басым ауырып тұр.', ru: 'У меня болит голова.' } },
            { speaker: 'bot', text: 'You should take this medicine.', translation: { kz: 'Сіз мына дәріні ішуіңіз керек.', ru: 'Вам следует принять это лекарство.' } },
            { speaker: 'user', text: 'How often should I take it?', translation: { kz: 'Оны қаншалықты жиі ішуім керек?', ru: 'Как часто мне его принимать?' } },
            { speaker: 'bot', text: 'Twice a day after meals.', translation: { kz: 'Күніне екі рет тамақтан кейін.', ru: 'Дважды в день после еды.' } },
        ]
    },

    // B1 Level
    {
        id: 'd17',
        level: 'B1',
        scenario: 'Job interview',
        scenarioTranslation: { kz: 'Жұмысқа сұхбат', ru: 'Собеседование' },
        messages: [
            { speaker: 'bot', text: 'Thank you for coming. Tell me about yourself.', translation: { kz: 'Келгеніңіз үшін рахмет. Өзіңіз туралы айтып беріңіз.', ru: 'Спасибо, что пришли. Расскажите о себе.' } },
            { speaker: 'user', text: 'I have 5 years of experience in marketing.', translation: { kz: 'Менде маркетинг бойынша 5 жылдық тәжірибе бар.', ru: 'У меня 5 лет опыта в маркетинге.' } },
            { speaker: 'bot', text: 'That\'s impressive! What are your strengths?', translation: { kz: 'Бұл әсерлі! Сіздің күшті жақтарыңыз қандай?', ru: 'Это впечатляет! Каковы ваши сильные стороны?' } },
            { speaker: 'user', text: 'I\'m creative and work well in teams.', translation: { kz: 'Мен шығармашылмын және командада жақсы жұмыс істеймін.', ru: 'Я креативен и хорошо работаю в команде.' } },
            { speaker: 'bot', text: 'Excellent! When can you start?', translation: { kz: 'Керемет! Қашан бастай аласыз?', ru: 'Отлично! Когда вы можете начать?' } },
        ]
    },
    {
        id: 'd18',
        level: 'B1',
        scenario: 'Planning a trip',
        scenarioTranslation: { kz: 'Саяхатты жоспарлау', ru: 'Планирование поездки' },
        messages: [
            { speaker: 'user', text: 'We should book our flights soon.', translation: { kz: 'Біз рейстерімізді жақында брондауымыз керек.', ru: 'Нам следует скоро забронировать рейсы.' } },
            { speaker: 'bot', text: 'I agree. Prices are going up.', translation: { kz: 'Келісемін. Бағалар өсіп жатыр.', ru: 'Согласен. Цены растут.' } },
            { speaker: 'user', text: 'Should we stay in a hotel or an apartment?', translation: { kz: 'Біз қонақүйде тұруымыз керек пе әлде пәтерде ме?', ru: 'Нам остановиться в отеле или в квартире?' } },
            { speaker: 'bot', text: 'An apartment gives us more freedom.', translation: { kz: 'Пәтер бізге көбірек еркіндік береді.', ru: 'Квартира дает нам больше свободы.' } },
            { speaker: 'user', text: 'Okay, let\'s look for one online.', translation: { kz: 'Жарайды, онлайн іздеп көрейік.', ru: 'Хорошо, давай поищем онлайн.' } },
        ]
    },
    {
        id: 'd19',
        level: 'B1',
        scenario: 'Complaining about service',
        scenarioTranslation: { kz: 'Қызмет туралы шағымдану', ru: 'Жалоба на обслуживание' },
        messages: [
            { speaker: 'user', text: 'Excuse me, I\'ve been waiting for 30 minutes.', translation: { kz: 'Кешіріңіз, мен 30 минут күтіп отырмын.', ru: 'Извините, я жду уже 30 минут.' } },
            { speaker: 'bot', text: 'I am very sorry about the delay.', translation: { kz: 'Кешігу үшін өте өкініштімін.', ru: 'Мне очень жаль за задержку.' } },
            { speaker: 'user', text: 'This is unacceptable. I want to see the manager.', translation: { kz: 'Бұл қабылданбайды. Мен менеджерді көргім келеді.', ru: 'Это неприемлемо. Я хочу видеть менеджера.' } },
            { speaker: 'bot', text: 'He is busy right now, but I can help you.', translation: { kz: 'Ол қазір бос емес, бірақ мен сізге көмектесе аламын.', ru: 'Он сейчас занят, но я могу вам помочь.' } },
            { speaker: 'user', text: 'I hope you can resolve this quickly.', translation: { kz: 'Сіз мұны тез шеше аласыз деп үміттенемін.', ru: 'Я надеюсь, вы сможете решить это быстро.' } },
        ]
    },
    {
        id: 'd20',
        level: 'B1',
        scenario: 'Talking about movies',
        scenarioTranslation: { kz: 'Фильмдер туралы сөйлесу', ru: 'Разговор о фильмах' },
        messages: [
            { speaker: 'bot', text: 'Have you seen the new Marvel movie?', translation: { kz: 'Сіз жаңа Marvel фильмін көрдіңіз бе?', ru: 'Вы видели новый фильм Marvel?' } },
            { speaker: 'user', text: 'Yes, I saw it last weekend.', translation: { kz: 'Иә, мен оны өткен демалыста көрдім.', ru: 'Да, я видел его в прошлые выходные.' } },
            { speaker: 'bot', text: 'What did you think of the special effects?', translation: { kz: 'Арнайы эффектілер туралы не ойлайсыз?', ru: 'Что вы думаете о спецэффектах?' } },
            { speaker: 'user', text: 'They were incredible, but the story was weak.', translation: { kz: 'Олар керемет болды, бірақ оқиға әлсіз болды.', ru: 'Они были невероятны, но сюжет был слабым.' } },
            { speaker: 'bot', text: 'I heard mixed reviews about it.', translation: { kz: 'Мен ол туралы әртүрлі пікірлер естідім.', ru: 'Я слышал смешанные отзывы о нем.' } },
        ]
    },
    {
        id: 'd21',
        level: 'B1',
        scenario: 'Giving advice',
        scenarioTranslation: { kz: 'Кеңес беру', ru: 'Давать советы' },
        messages: [
            { speaker: 'user', text: 'I feel tired all the time.', translation: { kz: 'Мен үнемі шаршап жүремін.', ru: 'Я чувствую усталость все время.' } },
            { speaker: 'bot', text: 'You should try to get more sleep.', translation: { kz: 'Сіз көбірек ұйықтауға тырысуыңыз керек.', ru: 'Вам следует попытаться больше спать.' } },
            { speaker: 'user', text: 'I try, but I can\'t fall asleep.', translation: { kz: 'Мен тырысамын, бірақ ұйықтай алмаймын.', ru: 'Я пытаюсь, но не могу уснуть.' } },
            { speaker: 'bot', text: 'Maybe you should avoid caffeine at night.', translation: { kz: 'Мүмкін сіз түнде кофеиннен аулақ болуыңыз керек.', ru: 'Может быть, вам стоит избегать кофеина на ночь.' } },
            { speaker: 'user', text: 'That is a good idea. I will try that.', translation: { kz: 'Бұл жақсы идея. Мен соны байқап көремін.', ru: 'Это хорошая идея. Я попробую.' } },
        ]
    },
    {
        id: 'd22',
        level: 'B1',
        scenario: 'Talking about future plans',
        scenarioTranslation: { kz: 'Болашақ жоспарлар туралы сөйлесу', ru: 'Разговор о планах на будущее' },
        messages: [
            { speaker: 'bot', text: 'What are you going to do after graduation?', translation: { kz: 'Оқу бітірген соң не істейсіз?', ru: 'Что вы собираетесь делать после выпуска?' } },
            { speaker: 'user', text: 'I plan to travel for a year.', translation: { kz: 'Мен бір жыл саяхаттауды жоспарлап отырмын.', ru: 'Я планирую путешествовать год.' } },
            { speaker: 'bot', text: 'That sounds exciting! Where will you go?', translation: { kz: 'Бұл қызықты естіледі! Қайда барасыз?', ru: 'Звучит захватывающе! Куда вы поедете?' } },
            { speaker: 'user', text: 'I want to visit South America.', translation: { kz: 'Мен Оңтүстік Америкаға барғым келеді.', ru: 'Я хочу посетить Южную Америку.' } },
            { speaker: 'bot', text: 'You will have a great time.', translation: { kz: 'Сіз уақытты керемет өткізесіз.', ru: 'Вы отлично проведете время.' } },
        ]
    },
    {
        id: 'd23',
        level: 'B1',
        scenario: 'Returning a product',
        scenarioTranslation: { kz: 'Тауарды қайтару', ru: 'Возврат товара' },
        messages: [
            { speaker: 'user', text: 'I would like to return this shirt.', translation: { kz: 'Мен мына жейдені қайтарғым келеді.', ru: 'Я хотел бы вернуть эту рубашку.' } },
            { speaker: 'bot', text: 'Is there something wrong with it?', translation: { kz: 'Онымен бірдеңе дұрыс емес пе?', ru: 'С ней что-то не так?' } },
            { speaker: 'user', text: 'It is too small for me.', translation: { kz: 'Ол маған тым кішкентай.', ru: 'Она мне мала.' } },
            { speaker: 'bot', text: 'Do you have the receipt?', translation: { kz: 'Сізде чек бар ма?', ru: 'У вас есть чек?' } },
            { speaker: 'user', text: 'Yes, here it is.', translation: { kz: 'Иә, мінекей.', ru: 'Да, вот он.' } },
        ]
    },
    {
        id: 'd24',
        level: 'B1',
        scenario: 'Asking for clarification',
        scenarioTranslation: { kz: 'Түсініктеме сұрау', ru: 'Просьба разъяснить' },
        messages: [
            { speaker: 'bot', text: 'You need to submit the report by Friday.', translation: { kz: 'Сіз есепті жұмаға дейін тапсыруыңыз керек.', ru: 'Вы должны сдать отчет к пятнице.' } },
            { speaker: 'user', text: 'Sorry, could you repeat that?', translation: { kz: 'Кешіріңіз, қайталай аласыз ба?', ru: 'Извините, не могли бы вы повторить?' } },
            { speaker: 'bot', text: 'The deadline is this Friday.', translation: { kz: 'Мерзім осы жұма.', ru: 'Крайний срок - эта пятница.' } },
            { speaker: 'user', text: 'Does that include the weekend?', translation: { kz: 'Бұған демалыс күндері кіре ме?', ru: 'Это включает выходные?' } },
            { speaker: 'bot', text: 'No, by 5 PM on Friday.', translation: { kz: 'Жоқ, жұма күні сағат 17:00-ге дейін.', ru: 'Нет, до 17:00 в пятницу.' } },
        ]
    },

    // B2 Level
    {
        id: 'd25',
        level: 'B2',
        scenario: 'Discussing a project',
        scenarioTranslation: { kz: 'Жоба туралы талқылау', ru: 'Обсуждение проекта' },
        messages: [
            { speaker: 'bot', text: 'Let\'s discuss the timeline for this project.', translation: { kz: 'Осы жобаның графигін талқылайық.', ru: 'Давайте обсудим сроки этого проекта.' } },
            { speaker: 'user', text: 'I think we need at least three months to complete it.', translation: { kz: 'Менің ойымша, оны аяқтау үшін кемінде үш ай керек.', ru: 'Я думаю, нам нужно как минимум три месяца, чтобы завершить его.' } },
            { speaker: 'bot', text: 'That seems reasonable. What are the main challenges?', translation: { kz: 'Бұл орынды көрінеді. Негізгі қиындықтар қандай?', ru: 'Это кажется разумным. Каковы основные проблемы?' } },
            { speaker: 'user', text: 'The budget is tight, and we need more resources.', translation: { kz: 'Бюджет тығыз, және бізге қосымша ресурстар керек.', ru: 'Бюджет ограничен, и нам нужно больше ресурсов.' } },
            { speaker: 'bot', text: 'I\'ll see what I can do to help with that.', translation: { kz: 'Мен бұл жағдайда қалай көмектесе алатынымды қараймын.', ru: 'Я посмотрю, что я могу сделать, чтобы помочь с этим.' } },
        ]
    },
    {
        id: 'd26',
        level: 'B2',
        scenario: 'Negotiating a salary',
        scenarioTranslation: { kz: 'Жалақы туралы келіссөз', ru: 'Переговоры о зарплате' },
        messages: [
            { speaker: 'bot', text: 'We would like to offer you the position.', translation: { kz: 'Біз сізге осы лауазымды ұсынғымыз келеді.', ru: 'Мы хотели бы предложить вам эту должность.' } },
            { speaker: 'user', text: 'Thank you. What is the starting salary?', translation: { kz: 'Рахмет. Бастапқы жалақы қанша?', ru: 'Спасибо. Какова начальная зарплата?' } },
            { speaker: 'bot', text: 'We are offering $50,000 per year.', translation: { kz: 'Біз жылына 50 000 доллар ұсынамыз.', ru: 'Мы предлагаем 50 000 долларов в год.' } },
            { speaker: 'user', text: 'Based on my experience, I was expecting around $60,000.', translation: { kz: 'Тәжірибеме сүйене отырып, мен шамамен 60 000 доллар күткен едім.', ru: 'Исходя из моего опыта, я ожидал около 60 000 долларов.' } },
            { speaker: 'bot', text: 'I will discuss this with the manager.', translation: { kz: 'Мен мұны менеджермен талқылаймын.', ru: 'Я обсужу это с менеджером.' } },
        ]
    },
    {
        id: 'd27',
        level: 'B2',
        scenario: 'Expressing dissatisfaction',
        scenarioTranslation: { kz: 'Ризашылық білдірмеу', ru: 'Выражение недовольства' },
        messages: [
            { speaker: 'user', text: 'I am not satisfied with the quality of this product.', translation: { kz: 'Мен бұл өнімнің сапасына қанағаттанбаймын.', ru: 'Я не удовлетворен качеством этого продукта.' } },
            { speaker: 'bot', text: 'I apologize. What exactly is the issue?', translation: { kz: 'Кешірім сұраймын. Мәселе нақты неде?', ru: 'Я извиняюсь. В чем именно проблема?' } },
            { speaker: 'user', text: 'It stopped working after only two days.', translation: { kz: 'Ол екі күннен кейін жұмысын тоқтатты.', ru: 'Он перестал работать всего через два дня.' } },
            { speaker: 'bot', text: 'We can offer you a full refund or a replacement.', translation: { kz: 'Біз сізге толық ақшаны қайтаруды немесе ауыстыруды ұсына аламыз.', ru: 'Мы можем предложить вам полный возврат средств или замену.' } },
            { speaker: 'user', text: 'I would prefer a refund, thank you.', translation: { kz: 'Мен ақшаны қайтаруды қалаймын, рахмет.', ru: 'Я бы предпочел возврат, спасибо.' } },
        ]
    },
    {
        id: 'd28',
        level: 'B2',
        scenario: 'Talking about technology',
        scenarioTranslation: { kz: 'Технология туралы сөйлесу', ru: 'Разговор о технологиях' },
        messages: [
            { speaker: 'bot', text: 'Do you think AI will replace human jobs?', translation: { kz: 'Сіздің ойыңызша, жасанды интеллект адам жұмысын алмастыра ма?', ru: 'Как вы думаете, ИИ заменит человеческие рабочие места?' } },
            { speaker: 'user', text: 'It might replace some routine tasks, but not creativity.', translation: { kz: 'Ол кейбір күнделікті тапсырмаларды алмастыруы мүмкін, бірақ шығармашылықты емес.', ru: 'Он может заменить некоторые рутинные задачи, но не творчество.' } },
            { speaker: 'bot', text: 'That is a valid point. Adaptation is key.', translation: { kz: 'Бұл дұрыс пікір. Бейімделу - басты нәрсе.', ru: 'Это веский аргумент. Адаптация - это ключ.' } },
            { speaker: 'user', text: 'Exactly. We need to learn how to work with it.', translation: { kz: 'Дәл солай. Біз онымен жұмыс істеуді үйренуіміз керек.', ru: 'Точно. Нам нужно научиться работать с ним.' } },
            { speaker: 'bot', text: 'Education will play a major role in this transition.', translation: { kz: 'Бұл ауысуда білім беру үлкен рөл атқарады.', ru: 'Образование сыграет важную роль в этом переходе.' } },
        ]
    },
    {
        id: 'd29',
        level: 'B2',
        scenario: 'Discussing news',
        scenarioTranslation: { kz: 'Жаңалықтарды талқылау', ru: 'Обсуждение новостей' },
        messages: [
            { speaker: 'bot', text: 'Did you hear about the election results?', translation: { kz: 'Сіз сайлау нәтижелері туралы естідіңіз бе?', ru: 'Вы слышали о результатах выборов?' } },
            { speaker: 'user', text: 'Yes, it was quite surprising.', translation: { kz: 'Иә, бұл өте таңқаларлық болды.', ru: 'Да, это было довольно неожиданно.' } },
            { speaker: 'bot', text: 'Many people didn\'t expect that outcome.', translation: { kz: 'Көп адамдар мұндай нәтижені күтпеген еді.', ru: 'Многие люди не ожидали такого исхода.' } },
            { speaker: 'user', text: 'It shows how unpredictable politics can be.', translation: { kz: 'Бұл саясаттың қаншалықты болжамсыз болатынын көрсетеді.', ru: 'Это показывает, насколько непредсказуемой может быть политика.' } },
            { speaker: 'bot', text: 'Indeed. It will be interesting to see what happens next.', translation: { kz: 'Шынымен. Келесі не болатынын көру қызықты болады.', ru: 'Действительно. Будет интересно посмотреть, что произойдет дальше.' } },
        ]
    },
    {
        id: 'd30',
        level: 'B2',
        scenario: 'Describing a memorable event',
        scenarioTranslation: { kz: 'Есте қаларлық оқиғаны сипаттау', ru: 'Описание памятного события' },
        messages: [
            { speaker: 'bot', text: 'What is your most memorable childhood memory?', translation: { kz: 'Сіздің балалық шағыңыздағы ең есте қаларлық естелік қандай?', ru: 'Какое ваше самое памятное воспоминание из детства?' } },
            { speaker: 'user', text: 'I remember the first time I saw the ocean.', translation: { kz: 'Мен мұхитты алғаш көрген кезім есімде.', ru: 'Я помню, как впервые увидел океан.' } },
            { speaker: 'bot', text: 'How did you feel?', translation: { kz: 'Сіз қандай сезімде болдыңыз?', ru: 'Что вы чувствовали?' } },
            { speaker: 'user', text: 'I felt so small and amazed by its vastness.', translation: { kz: 'Мен өзімді кішкентай сезіндім және оның кеңдігіне таң қалдым.', ru: 'Я чувствовал себя таким маленьким и был поражен его необъятностью.' } },
            { speaker: 'bot', text: 'Nature has that effect on us.', translation: { kz: 'Табиғат бізге сондай әсер етеді.', ru: 'Природа оказывает на нас такое влияние.' } },
        ]
    },
    {
        id: 'd31',
        level: 'B2',
        scenario: 'Apologizing for a mistake',
        scenarioTranslation: { kz: 'Қателік үшін кешірім сұрау', ru: 'Извинение за ошибку' },
        messages: [
            { speaker: 'user', text: 'I am terribly sorry for losing your book.', translation: { kz: 'Кітабыңызды жоғалтып алғаным үшін қатты өкінемін.', ru: 'Я ужасно извиняюсь за то, что потерял вашу книгу.' } },
            { speaker: 'bot', text: 'Oh no! That was a gift from my mother.', translation: { kz: 'О жоқ! Бұл анамның сыйлығы еді.', ru: 'О нет! Это был подарок от моей мамы.' } },
            { speaker: 'user', text: 'I will buy you a new copy immediately.', translation: { kz: 'Мен сізге дереу жаңа данасын сатып алып беремін.', ru: 'Я немедленно куплю вам новый экземпляр.' } },
            { speaker: 'bot', text: 'It\'s not about the money, it\'s the sentimental value.', translation: { kz: 'Мәселе ақшада емес, оның сезімдік құндылығында.', ru: 'Дело не в деньгах, а в сентиментальной ценности.' } },
            { speaker: 'user', text: 'I understand. Please forgive me.', translation: { kz: 'Түсінемін. Өтінемін, мені кешіріңіз.', ru: 'Я понимаю. Пожалуйста, простите меня.' } },
        ]
    },
    {
        id: 'd32',
        level: 'B2',
        scenario: 'Giving instructions',
        scenarioTranslation: { kz: 'Нұсқау беру', ru: 'Давать инструкции' },
        messages: [
            { speaker: 'user', text: 'How do I use this coffee machine?', translation: { kz: 'Бұл кофе машинасын қалай қолданамын?', ru: 'Как мне пользоваться этой кофемашиной?' } },
            { speaker: 'bot', text: 'First, fill the tank with water.', translation: { kz: 'Алдымен, резервуарды сумен толтырыңыз.', ru: 'Сначала наполните резервуар водой.' } },
            { speaker: 'user', text: 'Okay, what\'s next?', translation: { kz: 'Жарайды, келесі не?', ru: 'Хорошо, что дальше?' } },
            { speaker: 'bot', text: 'Put the capsule in and press the button.', translation: { kz: 'Капсуланы салып, түймені басыңыз.', ru: 'Вставьте капсулу и нажмите кнопку.' } },
            { speaker: 'user', text: 'That seems simple enough. Thanks.', translation: { kz: 'Бұл өте қарапайым көрінеді. Рахмет.', ru: 'Это кажется достаточно простым. Спасибо.' } },
        ]
    },

    // C1 Level
    {
        id: 'd33',
        level: 'C1',
        scenario: 'Debating environmental policy',
        scenarioTranslation: { kz: 'Экология саясаты туралы пікірталас', ru: 'Дебаты об экологической политике' },
        messages: [
            { speaker: 'bot', text: 'What\'s your stance on renewable energy policies?', translation: { kz: 'Жаңартылатын энергия саясатына қатысты көзқарасыңыз қандай?', ru: 'Какова ваша позиция в отношении политики возобновляемых источников энергии?' } },
            { speaker: 'user', text: 'I believe they\'re crucial for sustainable development.', translation: { kz: 'Менің ойымша, олар тұрақты даму үшін өте маңызды.', ru: 'Я считаю, что они имеют решающее значение для устойчивого развития.' } },
            { speaker: 'bot', text: 'Could you elaborate on the economic implications?', translation: { kz: 'Экономикалық салдарлары туралы толығырақ айта аласыз ба?', ru: 'Не могли бы вы подробнее рассказать об экономических последствиях?' } },
            { speaker: 'user', text: 'While initial costs are high, long-term benefits outweigh them.', translation: { kz: 'Бастапқы шығындар жоғары болса да, ұзақ мерзімді пайдасы одан жоғары.', ru: 'Хотя первоначальные затраты высоки, долгосрочные выгоды перевешивают их.' } },
            { speaker: 'bot', text: 'That\'s a compelling argument. What about implementation?', translation: { kz: 'Бұл сендірілімді дәлел. Енгізу туралы не айтасыз?', ru: 'Это убедительный аргумент. А как насчет реализации?' } },
        ]
    },
    {
        id: 'd34',
        level: 'C1',
        scenario: 'Discussing literature',
        scenarioTranslation: { kz: 'Әдебиетті талқылау', ru: 'Обсуждение литературы' },
        messages: [
            { speaker: 'bot', text: 'What did you think of the protagonist\'s dilemma?', translation: { kz: 'Бас кейіпкердің дилеммасы туралы не ойладыңыз?', ru: 'Что вы думаете о дилемме главного героя?' } },
            { speaker: 'user', text: 'It was a profound exploration of morality vs survival.', translation: { kz: 'Бұл мораль мен аман қалудың терең зерттелуі болды.', ru: 'Это было глубокое исследование морали против выживания.' } },
            { speaker: 'bot', text: 'Do you think his actions were justified?', translation: { kz: 'Оның әрекеттері ақталды деп ойлайсыз ба?', ru: 'Как вы думаете, его действия были оправданы?' } },
            { speaker: 'user', text: 'It\'s ambiguous, which makes the novel so compelling.', translation: { kz: 'Бұл екіұшты, сондықтан роман өте қызықты.', ru: 'Это неоднозначно, что делает роман таким захватывающим.' } },
            { speaker: 'bot', text: 'I agree. The author leaves it to the reader.', translation: { kz: 'Келісемін. Автор мұны оқырманның еркіне қалдырады.', ru: 'Согласен. Автор оставляет это на усмотрение читателя.' } },
        ]
    },
    {
        id: 'd35',
        level: 'C1',
        scenario: 'Analyzing global economy',
        scenarioTranslation: { kz: 'Жаһандық экономиканы талдау', ru: 'Анализ мировой экономики' },
        messages: [
            { speaker: 'bot', text: 'How do you view the current inflation trends?', translation: { kz: 'Ағымдағы инфляция үрдістеріне қалай қарайсыз?', ru: 'Как вы оцениваете текущие тенденции инфляции?' } },
            { speaker: 'user', text: 'It is a complex interplay of supply chain issues and demand.', translation: { kz: 'Бұл жеткізу тізбегі мәселелері мен сұраныстың күрделі өзара әрекеттесуі.', ru: 'Это сложное взаимодействие проблем цепочки поставок и спроса.' } },
            { speaker: 'bot', text: 'Do you foresee a recession in the near future?', translation: { kz: 'Сіз жақын арада рецессияны болжайсыз ба?', ru: 'Вы предвидите рецессию в ближайшем будущем?' } },
            { speaker: 'user', text: 'Indicators suggest a slowdown, but a full recession is uncertain.', translation: { kz: 'Көрсеткіштер баяулауды көрсетеді, бірақ толық рецессия белгісіз.', ru: 'Индикаторы указывают на замедление, но полная рецессия неопределенна.' } },
            { speaker: 'bot', text: 'Central banks have a difficult path ahead.', translation: { kz: 'Орталық банктердің алдында қиын жол тұр.', ru: 'У центральных банков впереди трудный путь.' } },
        ]
    },
    {
        id: 'd36',
        level: 'C1',
        scenario: 'Critiquing art',
        scenarioTranslation: { kz: 'Өнерді сынау', ru: 'Критика искусства' },
        messages: [
            { speaker: 'bot', text: 'This painting evokes a strong sense of melancholy.', translation: { kz: 'Бұл сурет күшті мұң сезімін тудырады.', ru: 'Эта картина вызывает сильное чувство меланхолии.' } },
            { speaker: 'user', text: 'The use of color really accentuates that mood.', translation: { kz: 'Түсті қолдану бұл көңіл-күйді шынымен баса көрсетеді.', ru: 'Использование цвета действительно подчеркивает это настроение.' } },
            { speaker: 'bot', text: 'However, the composition feels slightly unbalanced.', translation: { kz: 'Алайда, композиция сәл теңгерімсіз сезіледі.', ru: 'Однако композиция кажется слегка несбалансированной.' } },
            { speaker: 'user', text: 'Perhaps that was the artist\'s intention to create tension.', translation: { kz: 'Мүмкін бұл суретшінің шиеленіс тудыру мақсаты болған шығар.', ru: 'Возможно, это было намерением художника создать напряжение.' } },
            { speaker: 'bot', text: 'An interesting interpretation.', translation: { kz: 'Қызықты интерпретация.', ru: 'Интересная интерпретация.' } },
        ]
    },
    {
        id: 'd37',
        level: 'C1',
        scenario: 'Discussing ethics of AI',
        scenarioTranslation: { kz: 'ЖИ этикасын талқылау', ru: 'Обсуждение этики ИИ' },
        messages: [
            { speaker: 'bot', text: 'Should AI be granted rights if it becomes sentient?', translation: { kz: 'Егер ЖИ саналы болса, оған құқықтар берілуі керек пе?', ru: 'Должны ли ИИ быть предоставлены права, если он станет разумным?' } },
            { speaker: 'user', text: 'That raises fundamental questions about consciousness.', translation: { kz: 'Бұл сана туралы түбегейлі сұрақтар тудырады.', ru: 'Это поднимает фундаментальные вопросы о сознании.' } },
            { speaker: 'bot', text: 'If it suffers, do we have a moral obligation?', translation: { kz: 'Егер ол зардап шексе, бізде моральдық міндеттеме бар ма?', ru: 'Если он страдает, есть ли у нас моральное обязательство?' } },
            { speaker: 'user', text: 'Defining suffering in a machine is problematic.', translation: { kz: 'Машинадағы зардапты анықтау проблемалы.', ru: 'Определение страдания в машине проблематично.' } },
            { speaker: 'bot', text: 'We are entering uncharted territory.', translation: { kz: 'Біз белгісіз аумаққа кіріп жатырмыз.', ru: 'Мы вступаем на неизведанную территорию.' } },
        ]
    },
    {
        id: 'd38',
        level: 'C1',
        scenario: 'Negotiating a business deal',
        scenarioTranslation: { kz: 'Бизнес келісімін жүргізу', ru: 'Ведение деловых переговоров' },
        messages: [
            { speaker: 'bot', text: 'Your terms are acceptable, with one caveat.', translation: { kz: 'Сіздің шарттарыңыз қабылданады, бір ескертумен.', ru: 'Ваши условия приемлемы, с одной оговоркой.' } },
            { speaker: 'user', text: 'Please elaborate on your concerns.', translation: { kz: 'Өтінемін, алаңдаушылықтарыңызды толығырақ айтыңыз.', ru: 'Пожалуйста, расскажите подробнее о ваших опасениях.' } },
            { speaker: 'bot', text: 'We require exclusivity for the first year.', translation: { kz: 'Біз бірінші жылға эксклюзивтілікті талап етеміз.', ru: 'Мы требуем эксклюзивности на первый год.' } },
            { speaker: 'user', text: 'That would restrict our market penetration significantly.', translation: { kz: 'Бұл біздің нарыққа енуімізді айтарлықтай шектейді.', ru: 'Это значительно ограничит наше проникновение на рынок.' } },
            { speaker: 'bot', text: 'Perhaps we can compromise on a shorter duration.', translation: { kz: 'Мүмкін біз қысқа мерзімге ымыраға келе аламыз.', ru: 'Возможно, мы сможем пойти на компромисс по более короткому сроку.' } },
        ]
    },
    {
        id: 'd39',
        level: 'C1',
        scenario: 'Discussing philosophy',
        scenarioTranslation: { kz: 'Философияны талқылау', ru: 'Обсуждение философии' },
        messages: [
            { speaker: 'bot', text: 'Is free will an illusion?', translation: { kz: 'Ерік бостандығы иллюзия ма?', ru: 'Является ли свобода воли иллюзией?' } },
            { speaker: 'user', text: 'Neuroscience suggests our decisions are predetermined.', translation: { kz: 'Нейробиология біздің шешімдеріміз алдын ала анықталғанын болжайды.', ru: 'Нейробиология предполагает, что наши решения предопределены.' } },
            { speaker: 'bot', text: 'But we experience the sensation of choice.', translation: { kz: 'Бірақ біз таңдау сезімін бастан кешіреміз.', ru: 'Но мы испытываем ощущение выбора.' } },
            { speaker: 'user', text: 'That experience might be a post-hoc rationalization.', translation: { kz: 'Бұл тәжірибе пост-фактум рационализация болуы мүмкін.', ru: 'Этот опыт может быть постфактум рационализацией.' } },
            { speaker: 'bot', text: 'It is a disturbing thought.', translation: { kz: 'Бұл мазасыз ой.', ru: 'Это тревожная мысль.' } },
        ]
    },
    {
        id: 'd40',
        level: 'C1',
        scenario: 'Talking about cultural differences',
        scenarioTranslation: { kz: 'Мәдени айырмашылықтар туралы сөйлесу', ru: 'Разговор о культурных различиях' },
        messages: [
            { speaker: 'bot', text: 'I found the communication style here quite direct.', translation: { kz: 'Мен мұндағы қарым-қатынас стилін өте тікелей деп таптым.', ru: 'Я нашел стиль общения здесь довольно прямым.' } },
            { speaker: 'user', text: 'Yes, in my culture, we value subtlety more.', translation: { kz: 'Иә, менің мәдениетімде біз нәзіктікті көбірек бағалаймыз.', ru: 'Да, в моей культуре мы больше ценим тонкость.' } },
            { speaker: 'bot', text: 'I\'ll see what I can do to help with that.', translation: { kz: 'Мен бұл жағдайда қалай көмектесе алатынымды қараймын.', ru: 'Я посмотрю, что я могу сделать, чтобы помочь с этим.' } },
        ]
    },
    {
        id: 'd26',
        level: 'B2',
        scenario: 'Negotiating a salary',
        scenarioTranslation: { kz: 'Жалақы туралы келіссөз', ru: 'Переговоры о зарплате' },
        messages: [
            { speaker: 'bot', text: 'We would like to offer you the position.', translation: { kz: 'Біз сізге осы лауазымды ұсынғымыз келеді.', ru: 'Мы хотели бы предложить вам эту должность.' } },
            { speaker: 'user', text: 'Thank you. What is the starting salary?', translation: { kz: 'Рахмет. Бастапқы жалақы қанша?', ru: 'Спасибо. Какова начальная зарплата?' } },
            { speaker: 'bot', text: 'We are offering $50,000 per year.', translation: { kz: 'Біз жылына 50 000 доллар ұсынамыз.', ru: 'Мы предлагаем 50 000 долларов в год.' } },
            { speaker: 'user', text: 'Based on my experience, I was expecting around $60,000.', translation: { kz: 'Тәжірибеме сүйене отырып, мен шамамен 60 000 доллар күткен едім.', ru: 'Исходя из моего опыта, я ожидал около 60 000 долларов.' } },
            { speaker: 'bot', text: 'I will discuss this with the manager.', translation: { kz: 'Мен мұны менеджермен талқылаймын.', ru: 'Я обсужу это с менеджером.' } },
        ]
    },
    {
        id: 'd27',
        level: 'B2',
        scenario: 'Expressing dissatisfaction',
        scenarioTranslation: { kz: 'Ризашылық білдірмеу', ru: 'Выражение недовольства' },
        messages: [
            { speaker: 'user', text: 'I am not satisfied with the quality of this product.', translation: { kz: 'Мен бұл өнімнің сапасына қанағаттанбаймын.', ru: 'Я не удовлетворен качеством этого продукта.' } },
            { speaker: 'bot', text: 'I apologize. What exactly is the issue?', translation: { kz: 'Кешірім сұраймын. Мәселе нақты неде?', ru: 'Я извиняюсь. В чем именно проблема?' } },
            { speaker: 'user', text: 'It stopped working after only two days.', translation: { kz: 'Ол екі күннен кейін жұмысын тоқтатты.', ru: 'Он перестал работать всего через два дня.' } },
            { speaker: 'bot', text: 'We can offer you a full refund or a replacement.', translation: { kz: 'Біз сізге толық ақшаны қайтаруды немесе ауыстыруды ұсына аламыз.', ru: 'Мы можем предложить вам полный возврат средств или замену.' } },
            { speaker: 'user', text: 'I would prefer a refund, thank you.', translation: { kz: 'Мен ақшаны қайтаруды қалаймын, рахмет.', ru: 'Я бы предпочел возврат, спасибо.' } },
        ]
    },
    {
        id: 'd28',
        level: 'B2',
        scenario: 'Talking about technology',
        scenarioTranslation: { kz: 'Технология туралы сөйлесу', ru: 'Разговор о технологиях' },
        messages: [
            { speaker: 'bot', text: 'Do you think AI will replace human jobs?', translation: { kz: 'Сіздің ойыңызша, жасанды интеллект адам жұмысын алмастыра ма?', ru: 'Как вы думаете, ИИ заменит человеческие рабочие места?' } },
            { speaker: 'user', text: 'It might replace some routine tasks, but not creativity.', translation: { kz: 'Ол кейбір күнделікті тапсырмаларды алмастыруы мүмкін, бірақ шығармашылықты емес.', ru: 'Он может заменить некоторые рутинные задачи, но не творчество.' } },
            { speaker: 'bot', text: 'That is a valid point. Adaptation is key.', translation: { kz: 'Бұл дұрыс пікір. Бейімделу - басты нәрсе.', ru: 'Это веский аргумент. Адаптация - это ключ.' } },
            { speaker: 'user', text: 'Exactly. We need to learn how to work with it.', translation: { kz: 'Дәл солай. Біз онымен жұмыс істеуді үйренуіміз керек.', ru: 'Точно. Нам нужно научиться работать с ним.' } },
            { speaker: 'bot', text: 'Education will play a major role in this transition.', translation: { kz: 'Бұл ауысуда білім беру үлкен рөл атқарады.', ru: 'Образование сыграет важную роль в этом переходе.' } },
        ]
    },
    {
        id: 'd29',
        level: 'B2',
        scenario: 'Discussing news',
        scenarioTranslation: { kz: 'Жаңалықтарды талқылау', ru: 'Обсуждение новостей' },
        messages: [
            { speaker: 'bot', text: 'Did you hear about the election results?', translation: { kz: 'Сіз сайлау нәтижелері туралы естідіңіз бе?', ru: 'Вы слышали о результатах выборов?' } },
            { speaker: 'user', text: 'Yes, it was quite surprising.', translation: { kz: 'Иә, бұл өте таңқаларлық болды.', ru: 'Да, это было довольно неожиданно.' } },
            { speaker: 'bot', text: 'Many people didn\'t expect that outcome.', translation: { kz: 'Көп адамдар мұндай нәтижені күтпеген еді.', ru: 'Многие люди не ожидали такого исхода.' } },
            { speaker: 'user', text: 'It shows how unpredictable politics can be.', translation: { kz: 'Бұл саясаттың қаншалықты болжамсыз болатынын көрсетеді.', ru: 'Это показывает, насколько непредсказуемой может быть политика.' } },
            { speaker: 'bot', text: 'Indeed. It will be interesting to see what happens next.', translation: { kz: 'Шынымен. Келесі не болатынын көру қызықты болады.', ru: 'Действительно. Будет интересно посмотреть, что произойдет дальше.' } },
        ]
    },
    {
        id: 'd30',
        level: 'B2',
        scenario: 'Describing a memorable event',
        scenarioTranslation: { kz: 'Есте қаларлық оқиғаны сипаттау', ru: 'Описание памятного события' },
        messages: [
            { speaker: 'bot', text: 'What is your most memorable childhood memory?', translation: { kz: 'Сіздің балалық шағыңыздағы ең есте қаларлық естелік қандай?', ru: 'Какое ваше самое памятное воспоминание из детства?' } },
            { speaker: 'user', text: 'I remember the first time I saw the ocean.', translation: { kz: 'Мен мұхитты алғаш көрген кезім есімде.', ru: 'Я помню, как впервые увидел океан.' } },
            { speaker: 'bot', text: 'How did you feel?', translation: { kz: 'Сіз қандай сезімде болдыңыз?', ru: 'Что вы чувствовали?' } },
            { speaker: 'user', text: 'I felt so small and amazed by its vastness.', translation: { kz: 'Мен өзімді кішкентай сезіндім және оның кеңдігіне таң қалдым.', ru: 'Я чувствовал себя таким маленьким и был поражен его необъятностью.' } },
            { speaker: 'bot', text: 'Nature has that effect on us.', translation: { kz: 'Табиғат бізге сондай әсер етеді.', ru: 'Природа оказывает на нас такое влияние.' } },
        ]
    },
    {
        id: 'd31',
        level: 'B2',
        scenario: 'Apologizing for a mistake',
        scenarioTranslation: { kz: 'Қателік үшін кешірім сұрау', ru: 'Извинение за ошибку' },
        messages: [
            { speaker: 'user', text: 'I am terribly sorry for losing your book.', translation: { kz: 'Кітабыңызды жоғалтып алғаным үшін қатты өкінемін.', ru: 'Я ужасно извиняюсь за то, что потерял вашу книгу.' } },
            { speaker: 'bot', text: 'Oh no! That was a gift from my mother.', translation: { kz: 'О жоқ! Бұл анамның сыйлығы еді.', ru: 'О нет! Это был подарок от моей мамы.' } },
            { speaker: 'user', text: 'I will buy you a new copy immediately.', translation: { kz: 'Мен сізге дереу жаңа данасын сатып алып беремін.', ru: 'Я немедленно куплю вам новый экземпляр.' } },
            { speaker: 'bot', text: 'It\'s not about the money, it\'s the sentimental value.', translation: { kz: 'Мәселе ақшада емес, оның сезімдік құндылығында.', ru: 'Дело не в деньгах, а в сентиментальной ценности.' } },
            { speaker: 'user', text: 'I understand. Please forgive me.', translation: { kz: 'Түсінемін. Өтінемін, мені кешіріңіз.', ru: 'Я понимаю. Пожалуйста, простите меня.' } },
        ]
    },
    {
        id: 'd32',
        level: 'B2',
        scenario: 'Giving instructions',
        scenarioTranslation: { kz: 'Нұсқау беру', ru: 'Давать инструкции' },
        messages: [
            { speaker: 'user', text: 'How do I use this coffee machine?', translation: { kz: 'Бұл кофе машинасын қалай қолданамын?', ru: 'Как мне пользоваться этой кофемашиной?' } },
            { speaker: 'bot', text: 'First, fill the tank with water.', translation: { kz: 'Алдымен, резервуарды сумен толтырыңыз.', ru: 'Сначала наполните резервуар водой.' } },
            { speaker: 'user', text: 'Okay, what\'s next?', translation: { kz: 'Жарайды, келесі не?', ru: 'Хорошо, что дальше?' } },
            { speaker: 'bot', text: 'Put the capsule in and press the button.', translation: { kz: 'Капсуланы салып, түймені басыңыз.', ru: 'Вставьте капсулу и нажмите кнопку.' } },
            { speaker: 'user', text: 'That seems simple enough. Thanks.', translation: { kz: 'Бұл өте қарапайым көрінеді. Рахмет.', ru: 'Это кажется достаточно простым. Спасибо.' } },
        ]
    },

    // C1 Level
    {
        id: 'd33',
        level: 'C1',
        scenario: 'Debating environmental policy',
        scenarioTranslation: { kz: 'Экология саясаты туралы пікірталас', ru: 'Дебаты об экологической политике' },
        messages: [
            { speaker: 'bot', text: 'What\'s your stance on renewable energy policies?', translation: { kz: 'Жаңартылатын энергия саясатына қатысты көзқарасыңыз қандай?', ru: 'Какова ваша позиция в отношении политики возобновляемых источников энергии?' } },
            { speaker: 'user', text: 'I believe they\'re crucial for sustainable development.', translation: { kz: 'Менің ойымша, олар тұрақты даму үшін өте маңызды.', ru: 'Я считаю, что они имеют решающее значение для устойчивого развития.' } },
            { speaker: 'bot', text: 'Could you elaborate on the economic implications?', translation: { kz: 'Экономикалық салдарлары туралы толығырақ айта аласыз ба?', ru: 'Не могли бы вы подробнее рассказать об экономических последствиях?' } },
            { speaker: 'user', text: 'While initial costs are high, long-term benefits outweigh them.', translation: { kz: 'Бастапқы шығындар жоғары болса да, ұзақ мерзімді пайдасы одан жоғары.', ru: 'Хотя первоначальные затраты высоки, долгосрочные выгоды перевешивают их.' } },
            { speaker: 'bot', text: 'That\'s a compelling argument. What about implementation?', translation: { kz: 'Бұл сендірілімді дәлел. Енгізу туралы не айтасыз?', ru: 'Это убедительный аргумент. А как насчет реализации?' } },
        ]
    },
    {
        id: 'd34',
        level: 'C1',
        scenario: 'Discussing literature',
        scenarioTranslation: { kz: 'Әдебиетті талқылау', ru: 'Обсуждение литературы' },
        messages: [
            { speaker: 'bot', text: 'What did you think of the protagonist\'s dilemma?', translation: { kz: 'Бас кейіпкердің дилеммасы туралы не ойладыңыз?', ru: 'Что вы думаете о дилемме главного героя?' } },
            { speaker: 'user', text: 'It was a profound exploration of morality vs survival.', translation: { kz: 'Бұл мораль мен аман қалудың терең зерттелуі болды.', ru: 'Это было глубокое исследование морали против выживания.' } },
            { speaker: 'bot', text: 'Do you think his actions were justified?', translation: { kz: 'Оның әрекеттері ақталды деп ойлайсыз ба?', ru: 'Как вы думаете, его действия были оправданы?' } },
            { speaker: 'user', text: 'It\'s ambiguous, which makes the novel so compelling.', translation: { kz: 'Бұл екіұшты, сондықтан роман өте қызықты.', ru: 'Это неоднозначно, что делает роман таким захватывающим.' } },
            { speaker: 'bot', text: 'I agree. The author leaves it to the reader.', translation: { kz: 'Келісемін. Автор мұны оқырманның еркіне қалдырады.', ru: 'Согласен. Автор оставляет это на усмотрение читателя.' } },
        ]
    },
    {
        id: 'd35',
        level: 'C1',
        scenario: 'Analyzing global economy',
        scenarioTranslation: { kz: 'Жаһандық экономиканы талдау', ru: 'Анализ мировой экономики' },
        messages: [
            { speaker: 'bot', text: 'How do you view the current inflation trends?', translation: { kz: 'Ағымдағы инфляция үрдістеріне қалай қарайсыз?', ru: 'Как вы оцениваете текущие тенденции инфляции?' } },
            { speaker: 'user', text: 'It is a complex interplay of supply chain issues and demand.', translation: { kz: 'Бұл жеткізу тізбегі мәселелері мен сұраныстың күрделі өзара әрекеттесуі.', ru: 'Это сложное взаимодействие проблем цепочки поставок и спроса.' } },
            { speaker: 'bot', text: 'Do you foresee a recession in the near future?', translation: { kz: 'Сіз жақын арада рецессияны болжайсыз ба?', ru: 'Вы предвидите рецессию в ближайшем будущем?' } },
            { speaker: 'user', text: 'Indicators suggest a slowdown, but a full recession is uncertain.', translation: { kz: 'Көрсеткіштер баяулауды көрсетеді, бірақ толық рецессия белгісіз.', ru: 'Индикаторы указывают на замедление, но полная рецессия неопределенна.' } },
            { speaker: 'bot', text: 'Central banks have a difficult path ahead.', translation: { kz: 'Орталық банктердің алдында қиын жол тұр.', ru: 'У центральных банков впереди трудный путь.' } },
        ]
    },
    {
        id: 'd36',
        level: 'C1',
        scenario: 'Critiquing art',
        scenarioTranslation: { kz: 'Өнерді сынау', ru: 'Критика искусства' },
        messages: [
            { speaker: 'bot', text: 'This painting evokes a strong sense of melancholy.', translation: { kz: 'Бұл сурет күшті мұң сезімін тудырады.', ru: 'Эта картина вызывает сильное чувство меланхолии.' } },
            { speaker: 'user', text: 'The use of color really accentuates that mood.', translation: { kz: 'Түсті қолдану бұл көңіл-күйді шынымен баса көрсетеді.', ru: 'Использование цвета действительно подчеркивает это настроение.' } },
            { speaker: 'bot', text: 'However, the composition feels slightly unbalanced.', translation: { kz: 'Алайда, композиция сәл теңгерімсіз сезіледі.', ru: 'Однако композиция кажется слегка несбалансированной.' } },
            { speaker: 'user', text: 'Perhaps that was the artist\'s intention to create tension.', translation: { kz: 'Мүмкін бұл суретшінің шиеленіс тудыру мақсаты болған шығар.', ru: 'Возможно, это было намерением художника создать напряжение.' } },
            { speaker: 'bot', text: 'An interesting interpretation.', translation: { kz: 'Қызықты интерпретация.', ru: 'Интересная интерпретация.' } },
        ]
    },
    {
        id: 'd37',
        level: 'C1',
        scenario: 'Discussing ethics of AI',
        scenarioTranslation: { kz: 'ЖИ этикасын талқылау', ru: 'Обсуждение этики ИИ' },
        messages: [
            { speaker: 'bot', text: 'Should AI be granted rights if it becomes sentient?', translation: { kz: 'Егер ЖИ саналы болса, оған құқықтар берілуі керек пе?', ru: 'Должны ли ИИ быть предоставлены права, если он станет разумным?' } },
            { speaker: 'user', text: 'That raises fundamental questions about consciousness.', translation: { kz: 'Бұл сана туралы түбегейлі сұрақтар тудырады.', ru: 'Это поднимает фундаментальные вопросы о сознании.' } },
            { speaker: 'bot', text: 'If it suffers, do we have a moral obligation?', translation: { kz: 'Егер ол зардап шексе, бізде моральдық міндеттеме бар ма?', ru: 'Если он страдает, есть ли у нас моральное обязательство?' } },
            { speaker: 'user', text: 'Defining suffering in a machine is problematic.', translation: { kz: 'Машинадағы зардапты анықтау проблемалы.', ru: 'Определение страдания в машине проблематично.' } },
            { speaker: 'bot', text: 'We are entering uncharted territory.', translation: { kz: 'Біз белгісіз аумаққа кіріп жатырмыз.', ru: 'Мы вступаем на неизведанную территорию.' } },
        ]
    },
    {
        id: 'd38',
        level: 'C1',
        scenario: 'Negotiating a business deal',
        scenarioTranslation: { kz: 'Бизнес келісімін жүргізу', ru: 'Ведение деловых переговоров' },
        messages: [
            { speaker: 'bot', text: 'Your terms are acceptable, with one caveat.', translation: { kz: 'Сіздің шарттарыңыз қабылданады, бір ескертумен.', ru: 'Ваши условия приемлемы, с одной оговоркой.' } },
            { speaker: 'user', text: 'Please elaborate on your concerns.', translation: { kz: 'Өтінемін, алаңдаушылықтарыңызды толығырақ айтыңыз.', ru: 'Пожалуйста, расскажите подробнее о ваших опасениях.' } },
            { speaker: 'bot', text: 'We require exclusivity for the first year.', translation: { kz: 'Біз бірінші жылға эксклюзивтілікті талап етеміз.', ru: 'Мы требуем эксклюзивности на первый год.' } },
            { speaker: 'user', text: 'That would restrict our market penetration significantly.', translation: { kz: 'Бұл біздің нарыққа енуімізді айтарлықтай шектейді.', ru: 'Это значительно ограничит наше проникновение на рынок.' } },
            { speaker: 'bot', text: 'Perhaps we can compromise on a shorter duration.', translation: { kz: 'Мүмкін біз қысқа мерзімге ымыраға келе аламыз.', ru: 'Возможно, мы сможем пойти на компромисс по более короткому сроку.' } },
        ]
    },
    {
        id: 'd39',
        level: 'C1',
        scenario: 'Discussing philosophy',
        scenarioTranslation: { kz: 'Философияны талқылау', ru: 'Обсуждение философии' },
        messages: [
            { speaker: 'bot', text: 'Is free will an illusion?', translation: { kz: 'Ерік бостандығы иллюзия ма?', ru: 'Является ли свобода воли иллюзией?' } },
            { speaker: 'user', text: 'Neuroscience suggests our decisions are predetermined.', translation: { kz: 'Нейробиология біздің шешімдеріміз алдын ала анықталғанын болжайды.', ru: 'Нейробиология предполагает, что наши решения предопределены.' } },
            { speaker: 'bot', text: 'But we experience the sensation of choice.', translation: { kz: 'Бірақ біз таңдау сезімін бастан кешіреміз.', ru: 'Но мы испытываем ощущение выбора.' } },
            { speaker: 'user', text: 'That experience might be a post-hoc rationalization.', translation: { kz: 'Бұл тәжірибе пост-фактум рационализация болуы мүмкін.', ru: 'Этот опыт может быть постфактум рационализацией.' } },
            { speaker: 'bot', text: 'It is a disturbing thought.', translation: { kz: 'Бұл мазасыз ой.', ru: 'Это тревожная мысль.' } },
        ]
    },
    {
        id: 'd40',
        level: 'C1',
        scenario: 'Talking about cultural differences',
        scenarioTranslation: { kz: 'Мәдени айырмашылықтар туралы сөйлесу', ru: 'Разговор о культурных различиях' },
        messages: [
            { speaker: 'bot', text: 'I found the communication style here quite direct.', translation: { kz: 'Мен мұндағы қарым-қатынас стилін өте тікелей деп таптым.', ru: 'Я нашел стиль общения здесь довольно прямым.' } },
            { speaker: 'user', text: 'Yes, in my culture, we value subtlety more.', translation: { kz: 'Иә, менің мәдениетімде біз нәзіктікті көбірек бағалаймыз.', ru: 'Да, в моей культуре мы больше ценим тонкость.' } },
            { speaker: 'bot', text: 'It can lead to misunderstandings.', translation: { kz: 'Бұл түсініспеушіліктерге әкелуі мүмкін.', ru: 'Это может привести к недоразумениям.' } },
            { speaker: 'user', text: 'We need to be aware of these nuances.', translation: { kz: 'Біз бұл нюанстардан хабардар болуымыз керек.', ru: 'Нам нужно знать об этих нюансах.' } },
            { speaker: 'bot', text: 'Cultural intelligence is essential nowadays.', translation: { kz: 'Мәдени интеллект қазіргі кезде өте маңызды.', ru: 'Культурный интеллект сегодня необходим.' } },
        ]
    },
    {
        id: 'd41',
        level: 'A2',
        scenario: 'Checking in at airport',
        scenarioTranslation: { kz: 'Әуежайда тіркелу', ru: 'Регистрация в аэропорту' },
        messages: [
            { speaker: 'bot', text: 'Passport and ticket, please.', translation: { kz: 'Паспорт пен билетіңізді беріңіз.', ru: 'Паспорт и билет, пожалуйста.' } },
            { speaker: 'user', text: 'Here you go. Which gate?', translation: { kz: 'Міне. Қай шығу?', ru: 'Вот. Какой выход?' } },
            { speaker: 'bot', text: 'Gate 12. Boarding at 3 PM.', translation: { kz: '12-ші шығу. Мінгізу 15:00-де.', ru: 'Выход 12. Посадка в 15:00.' } }
        ]
    },
    {
        id: 'd42',
        level: 'A2',
        scenario: 'Opening bank account',
        scenarioTranslation: { kz: 'Банкте шот ашу', ru: 'Открытие счета в банке' },
        messages: [
            { speaker: 'user', text: 'I want to open an account.', translation: { kz: 'Мен шот ашқым келеді.', ru: 'Я хочу открыть счет.' } },
            { speaker: 'bot', text: 'Do you have your ID?', translation: { kz: 'Жеке куәлігіңіз бар ма?', ru: 'У вас есть удостоверение?' } },
            { speaker: 'user', text: 'Yes, here it is.', translation: { kz: 'Иә, міне.', ru: 'Да, вот он.' } }
        ]
    },
    {
        id: 'd43',
        level: 'B1',
        scenario: 'Emergency call',
        scenarioTranslation: { kz: 'Жедел қоңырау', ru: 'Экстренный звонок' },
        messages: [
            { speaker: 'user', text: 'Emergency! I need an ambulance!', translation: { kz: 'Жедел жағдай! Маған жедел жәрдем керек!', ru: 'Срочно! Мне нужна скорая!' } },
            { speaker: 'bot', text: 'What is your location?', translation: { kz: 'Сіздің орныңыз қайда?', ru: 'Где вы находитесь?' } },
            { speaker: 'user', text: '15 Main Street, apartment 5.', translation: { kz: 'Негізгі көше 15, 5-пәтер.', ru: 'Главная улица 15, квартира 5.' } }
        ]
    },
    {
        id: 'd44',
        level: 'A2',
        scenario: 'Making a phone call',
        scenarioTranslation: { kz: 'Телефон соғу', ru: 'Телефонный звонок' },
        messages: [
            { speaker: 'bot', text: 'Hello, who is calling?', translation: { kz: 'Алло, кім сөйлесіп жатыр?', ru: 'Алло, кто звонит?' } },
            { speaker: 'user', text: 'This is John. Is Mary there?', translation: { kz: 'Бұл Джон. Мэри үйде ме?', ru: 'Это Джон. Мэри дома?' } },
            { speaker: 'bot', text: 'Just a moment, please.', translation: { kz: 'Бір сәт күтіңіз.', ru: 'Одну минуту, пожалуйста.' } }
        ]
    },
    {
        id: 'd45',
        level: 'A1',
        scenario: 'Playing sports',
        scenarioTranslation: { kz: 'Спортпен айналысу', ru: 'Занятия спортом' },
        messages: [
            { speaker: 'bot', text: 'Do you play any sports?', translation: { kz: 'Спортпен айналасасыз ба?', ru: 'Вы занимаетесь спортом?' } },
            { speaker: 'user', text: 'Yes, I play tennis.', translation: { kz: 'Иә, мен теннис ойнаймын.', ru: 'Да, я играю в теннис.' } },
            { speaker: 'bot', text: 'How often do you play?', translation: { kz: 'Қаншалықты жиі ойнайсыз?', ru: 'Как часто вы играете?' } }
        ]
    },
    {
        id: 'd46',
        level: 'B1',
        scenario: 'Tech support',
        scenarioTranslation: { kz: 'Техникалық қолдау', ru: 'Техподдержка' },
        messages: [
            { speaker: 'user', text: 'My internet is not working.', translation: { kz: 'Менің интернетім жұмыс істемейді.', ru: 'Мой интернет не работает.' } },
            { speaker: 'bot', text: 'Have you tried restarting the router?', translation: { kz: 'Роутерді қайта іске қосып көрдіңіз бе?', ru: 'Вы пробовали перезагрузить роутер?' } },
            { speaker: 'user', text: 'Yes, but it still doesn\'t work.', translation: { kz: 'Иә, бірақ әлі жұмыс істемейді.', ru: 'Да, но все равно не работает.' } }
        ]
    },
    {
        id: 'd47',
        level: 'A2',
        scenario: 'Buying groceries',
        scenarioTranslation: { kz: 'Азық-түлік сатып алу', ru: 'Покупка продуктов' },
        messages: [
            { speaker: 'bot', text: 'Do you need a bag?', translation: { kz: 'Сізге пакет керек пе?', ru: 'Вам нужен пакет?' } },
            { speaker: 'user', text: 'No thanks, I have my own.', translation: { kz: 'Жоқ рахмет, менде өзімнің бар.', ru: 'Нет спасибо, у меня есть свой.' } },
            { speaker: 'bot', text: 'That\'s $25.50, please.', translation: { kz: 'Барлығы 25.50 доллар.', ru: 'С вас 25.50 долларов.' } }
        ]
    },
    {
        id: 'd48',
        level: 'B2',
        scenario: 'Job performance review',
        scenarioTranslation: { kz: 'Жұмысты бағалау', ru: 'Аттестация' },
        messages: [
            { speaker: 'bot', text: 'Your performance this quarter was excellent.', translation: { kz: 'Сіздің бұл тоқсандағы жұмысыңыз керемет болды.', ru: 'Ваша работа в этом квартале была отличной.' } },
            { speaker: 'user', text: 'Thank you. I worked really hard.', translation: { kz: 'Рахмет. Мен шынымен қатты жұмыс істедім.', ru: 'Спасибо. Я очень старался.' } },
            { speaker: 'bot', text: 'I\'d like to discuss a promotion.', translation: { kz: 'Мен көтерілу туралы талқылағым келеді.', ru: 'Я хотел бы обсудить повышение.' } }
        ]
    },
    {
        id: 'd49',
        level: 'A2',
        scenario: 'Ordering pizza',
        scenarioTranslation: { kz: 'Пицца тапсыру', ru: 'Заказ пиццы' },
        messages: [
            { speaker: 'bot', text: 'What size pizza would you like?', translation: { kz: 'Қандай өлшемдегі пицца қалайсыз?', ru: 'Какого размера пиццу хотите?' } },
            { speaker: 'user', text: 'Large, please. With extra cheese.', translation: { kz: 'Үлкен, өтінемін. Қосымша ірімшікпен.', ru: 'Большую, пожалуйста. С дополнительным сыром.' } },
            { speaker: 'bot', text: 'It will be ready in 30 minutes.', translation: { kz: 'Ол 30 минутта дайын болады.', ru: 'Будет готова через 30 минут.' } }
        ]
    },
    {
        id: 'd50',
        level: 'B1',
        scenario: 'Meeting new neighbors',
        scenarioTranslation: { kz: 'Жаңа көршілермен танысу', ru: 'Знакомство с соседями' },
        messages: [
            { speaker: 'user', text: 'Hi! We just moved in next door.', translation: { kz: 'Сәлем! Біз жаңа қасыңызға көшіп келдік.', ru: 'Привет! Мы только переехали по соседству.' } },
            { speaker: 'bot', text: 'Welcome to the neighborhood!', translation: { kz: 'Аймаққа қош келдіңіздер!', ru: 'Добро пожаловать в район!' } },
            { speaker: 'user', text: 'Thank you! We love it here already.', translation: { kz: 'Рахмет! Бізге бұл жер қазірдің өзінде ұнайды.', ru: 'Спасибо! Нам уже нравится здесь.' } }
        ]
    },
    {
        id: 'd51',
        level: 'A2',
        scenario: 'Gym membership',
        scenarioTranslation: { kz: 'Спорт залына жазылу', ru: 'Абонемент в зал' },
        messages: [
            { speaker: 'user', text: 'How much is a monthly membership?', translation: { kz: 'Айлық жазылым қанша тұрады?', ru: 'Сколько стоит месячный абонемент?' } },
            { speaker: 'bot', text: 'It\'s $50 per month.', translation: { kz: 'Айына 50 доллар.', ru: '50 долларов в месяц.' } },
            { speaker: 'user', text: 'Does it include classes?', translation: { kz: 'Онда сабақтар кіреді ме?', ru: 'Это включает занятия?' } }
        ]
    },
    {
        id: 'd52',
        level: 'B1',
        scenario: 'Discussing weekend plans',
        scenarioTranslation: { kz: 'Демалыс жоспарларын талқылау', ru: 'Обсуждение планов на выходные' },
        messages: [
            { speaker: 'bot', text: 'Any plans for the weekend?', translation: { kz: 'Демалысқа жоспарыңыз бар ма?', ru: 'Есть планы на выходные?' } },
            { speaker: 'user', text: 'I\'m thinking of going hiking.', translation: { kz: 'Мен саяхатқа баруды ойлап жүрмін.', ru: 'Думаю пойти в поход.' } },
            { speaker: 'bot', text: 'That sounds fun! Can I join?', translation: { kz: 'Қызықты естіледі! Қосыла аламын ба?', ru: 'Звучит весело! Могу присоединиться?' } }
        ]
    },
    {
        id: 'd53',
        level: 'A1',
        scenario: 'Asking for time',
        scenarioTranslation: { kz: 'Уақытты сұрау', ru: 'Спросить время' },
        messages: [
            { speaker: 'user', text: 'Excuse me, what time is it?', translation: { kz: 'Кешіріңіз, сағат қанша?', ru: 'Извините, сколько времени?' } },
            { speaker: 'bot', text: 'It\'s 3:30.', translation: { kz: 'Сағат 3:30.', ru: '3:30.' } },
            { speaker: 'user', text: 'Thank you very much!', translation: { kz: 'Көп рақмет!', ru: 'Большое спасибо!' } }
        ]
    },
    {
        id: 'd54',
        level: 'B2',
        scenario: 'Discussing climate change',
        scenarioTranslation: { kz: 'Климат өзгерісін талқылау', ru: 'Обсуждение изменения климата' },
        messages: [
            { speaker: 'bot', text: 'Climate change is a serious issue.', translation: { kz: 'Климат өзгерісі маңызды мәселе.', ru: 'Изменение климата - серьезная проблема.' } },
            { speaker: 'user', text: 'We need to act immediately.', translation: { kz: 'Біз дереу әрекет етуіміз керек.', ru: 'Нам нужно действовать немедленно.' } },
            { speaker: 'bot', text: 'What can individuals do to help?', translation: { kz: 'Жеке адамдар көмектесу үшін не істей алады?', ru: 'Что могут сделать отдельные люди?' } }
        ]
    },
    {
        id: 'd55',
        level: 'A2',
        scenario: 'Visiting the dentist',
        scenarioTranslation: { kz: 'Стоматологқа бару', ru: 'Посещение стоматолога' },
        messages: [
            { speaker: 'bot', text: 'Open your mouth, please.', translation: { kz: 'Аузыңызды ашыңыз.', ru: 'Откройте рот, пожалуйста.' } },
            { speaker: 'user', text: 'Is it bad, doctor?', translation: { kz: 'Жаман ба, дәрігер?', ru: 'Плохо, доктор?' } },
            { speaker: 'bot', text: 'You have a small cavity.', translation: { kz: 'Сізде кішкентай тесік бар.', ru: 'У вас небольшая полость.' } }
        ]
    },
    {
        id: 'd56',
        level: 'B1',
        scenario: 'Renting an apartment',
        scenarioTranslation: { kz: 'Пәтер жалдау', ru: 'Аренда квартиры' },
        messages: [
            { speaker: 'user', text: 'Is the apartment still available?', translation: { kz: 'Пәтер әлі бос па?', ru: 'Квартира еще свободна?' } },
            { speaker: 'bot', text: 'Yes, would you like to see it?', translation: { kz: 'Иә, көргіңіз келе ме?', ru: 'Да, хотите посмотреть?' } },
            { speaker: 'user', text: 'Yes, when can I visit?', translation: { kz: 'Иә, қашан бара аламын?', ru: 'Да, когда могу прийти?' } }
        ]
    },
    {
        id: 'd57',
        level: 'A2',
        scenario: 'Buying shoes',
        scenarioTranslation: { kz: 'Аяқ киім сатып алу', ru: 'Покупка обуви' },
        messages: [
            { speaker: 'user', text: 'Can I try these in size 9?', translation: { kz: 'Мұны 9 өлшемде киюге бола ма?', ru: 'Могу я примерить это в размере 9?' } },
            { speaker: 'bot', text: 'Of course. One moment.', translation: { kz: 'Әрине. Бір сәт.', ru: 'Конечно. Минутку.' } },
            { speaker: 'user', text: 'They fit perfectly!', translation: { kz: 'Олар дәл келеді!', ru: 'Они отлично подходят!' } }
        ]
    },
    {
        id: 'd58',
        level: 'B1',
        scenario: 'Getting a haircut',
        scenarioTranslation: { kz: 'Шаш қию', ru: 'Стрижка' },
        messages: [
            { speaker: 'bot', text: 'How would you like your hair?', translation: { kz: 'Шашыңызды қалай қиғыңыз келеді?', ru: 'Как вы хотите свою стрижку?' } },
            { speaker: 'user', text: 'Just a trim, please. Not too short.', translation: { kz: 'Тек шеттерін қиюды сұраймын. Тым қысқа емес.', ru: 'Просто подровнять, пожалуйста. Не слишком коротко.' } },
            { speaker: 'bot', text: 'Perfect. I\'ll get started.', translation: { kz: 'Керемет. Бастаймын.', ru: 'Отлично. Начну.' } }
        ]
    },
    {
        id: 'd59',
        level: 'A1',
        scenario: 'Ordering coffee to go',
        scenarioTranslation: { kz: 'Кофе алып кетуге тапсыру', ru: 'Заказ кофе на вынос' },
        messages: [
            { speaker: 'user', text: 'One coffee to go, please.', translation: { kz: 'Бір кофе алып кетуге, өтінемін.', ru: 'Один кофе с собой, пожалуйста.' } },
            { speaker: 'bot', text: 'Small, medium or large?', translation: { kz: 'Кіші, орташа немесе үлкен?', ru: 'Маленький, средний или большой?' } },
            { speaker: 'user', text: 'Medium, with milk.', translation: { kz: 'Орташа, сүтпен.', ru: 'Средний, с молоком.' } }
        ]
    },
    {
        id: 'd60',
        level: 'B2',
        scenario: 'Business presentation',
        scenarioTranslation: { kz: 'Бизнес презентация', ru: 'Бизнес-презентация' },
        messages: [
            { speaker: 'user', text: 'Let me show you our quarterly results.', translation: { kz: 'Сізге тоқсандық нәтижелерімізді көрсетейін.', ru: 'Позвольте показать наши квартальные результаты.' } },
            { speaker: 'bot', text: 'The growth is impressive.', translation: { kz: 'Өсу әсерлі.', ru: 'Рост впечатляющий.' } },
            { speaker: 'user', text: 'We exceeded all targets.', translation: { kz: 'Біз барлық мақсаттардан асып түстік.', ru: 'Мы превысили все цели.' } }
        ]
    },
    // Travel & Tourism (d61-d80)
    {
        id: 'd61',
        level: 'A2',
        scenario: 'At the airport check-in',
        scenarioTranslation: { kz: 'Әуежайда тіркелу', ru: 'Регистрация в аэропорту' },
        messages: [
            { speaker: 'bot', text: 'Passport and ticket, please.', translation: { kz: 'Паспорт пен билетіңізді көрсетіңіз.', ru: 'Паспорт и билет, пожалуйста.' } },
            { speaker: 'user', text: 'Here they are.', translation: { kz: 'Мінекейіңіз.', ru: 'Вот они.' } },
            { speaker: 'bot', text: 'Do you have any luggage?', translation: { kz: 'Жүгіңіз бар ма?', ru: 'У вас есть багаж?' } },
            { speaker: 'user', text: 'Yes, one suitcase.', translation: { kz: 'Иә, бір чемодан.', ru: 'Да, один чемодан.' } }
        ]
    },
    {
        id: 'd62',
        level: 'B1',
        scenario: 'Customs control',
        scenarioTranslation: { kz: 'Кедендік бақылау', ru: 'Таможенный контроль' },
        messages: [
            { speaker: 'bot', text: 'Anything to declare?', translation: { kz: 'Декларациялайтын заттарыңыз бар ма?', ru: 'Есть что декларировать?' } },
            { speaker: 'user', text: 'No, just personal items.', translation: { kz: 'Жоқ, тек жеке заттар.', ru: 'Нет, только личные вещи.' } },
            { speaker: 'bot', text: 'Open your bag, please.', translation: { kz: 'Сөмкеңізді ашыңызшы.', ru: 'Откройте сумку, пожалуйста.' } }
        ]
    },
    {
        id: 'd63',
        level: 'A2',
        scenario: 'Buying a train ticket',
        scenarioTranslation: { kz: 'Пойызға билет сатып алу', ru: 'Покупка билета на поезд' },
        messages: [
            { speaker: 'user', text: 'One ticket to London, please.', translation: { kz: 'Лондонға бір билет беріңізші.', ru: 'Один билет до Лондона, пожалуйста.' } },
            { speaker: 'bot', text: 'Single or return?', translation: { kz: 'Бір бағытқа ма әлде қайту билетімен бе?', ru: 'В одну сторону или туда-обратно?' } },
            { speaker: 'user', text: 'Return, please.', translation: { kz: 'Қайту билетімен.', ru: 'Туда-обратно, пожалуйста.' } }
        ]
    },
    {
        id: 'd64',
        level: 'B1',
        scenario: 'Asking for recommendations',
        scenarioTranslation: { kz: 'Ұсыныстар сұрау', ru: 'Просить рекомендации' },
        messages: [
            { speaker: 'user', text: 'Can you recommend a good restaurant?', translation: { kz: 'Жақсы мейрамхана ұсына аласыз ба?', ru: 'Можете порекомендовать хороший ресторан?' } },
            { speaker: 'bot', text: 'What kind of food do you like?', translation: { kz: 'Сізге қандай тағам ұнайды?', ru: 'Какую еду вы любите?' } },
            { speaker: 'user', text: 'I love Italian food.', translation: { kz: 'Маған итальян тағамдары ұнайды.', ru: 'Я люблю итальянскую еду.' } }
        ]
    },
    {
        id: 'd65',
        level: 'A2',
        scenario: 'Lost luggage',
        scenarioTranslation: { kz: 'Жоғалған жүк', ru: 'Потерянный багаж' },
        messages: [
            { speaker: 'user', text: 'My suitcase is missing.', translation: { kz: 'Менің чемоданым жоқ.', ru: 'Мой чемодан пропал.' } },
            { speaker: 'bot', text: 'What does it look like?', translation: { kz: 'Ол қандай?', ru: 'Как он выглядит?' } },
            { speaker: 'user', text: 'It is a large red bag.', translation: { kz: 'Бұл үлкен қызыл сөмке.', ru: 'Это большая красная сумка.' } }
        ]
    },
    {
        id: 'd66',
        level: 'B2',
        scenario: 'Renting a car',
        scenarioTranslation: { kz: 'Көлік жалдау', ru: 'Аренда автомобиля' },
        messages: [
            { speaker: 'user', text: 'I\'d like to rent a car for 3 days.', translation: { kz: 'Мен 3 күнге көлік жалдағым келеді.', ru: 'Я хотел бы арендовать машину на 3 дня.' } },
            { speaker: 'bot', text: 'We have a compact and an SUV available.', translation: { kz: 'Бізде шағын көлік және жол талғамайтын көлік бар.', ru: 'У нас есть компакт и внедорожник.' } },
            { speaker: 'user', text: 'I\'ll take the compact one.', translation: { kz: 'Мен шағын көлікті аламын.', ru: 'Я возьму компактную.' } }
        ]
    },
    {
        id: 'd67',
        level: 'A1',
        scenario: 'Asking for wifi',
        scenarioTranslation: { kz: 'Wi-Fi сұрау', ru: 'Спрашивать Wi-Fi' },
        messages: [
            { speaker: 'user', text: 'Do you have free wifi?', translation: { kz: 'Сіздерде тегін Wi-Fi бар ма?', ru: 'У вас есть бесплатный Wi-Fi?' } },
            { speaker: 'bot', text: 'Yes, the password is "guest123".', translation: { kz: 'Иә, құпия сөз "guest123".', ru: 'Да, пароль "guest123".' } },
            { speaker: 'user', text: 'Thank you.', translation: { kz: 'Рақмет.', ru: 'Спасибо.' } }
        ]
    },
    {
        id: 'd68',
        level: 'B1',
        scenario: 'Booking a tour',
        scenarioTranslation: { kz: 'Турға тапсырыс беру', ru: 'Бронирование тура' },
        messages: [
            { speaker: 'user', text: 'I want to book a city tour.', translation: { kz: 'Мен қалалық турға тапсырыс бергім келеді.', ru: 'Я хочу заказать экскурсию по городу.' } },
            { speaker: 'bot', text: 'We have one starting at 10 AM.', translation: { kz: 'Бізде сағат 10-да басталатын тур бар.', ru: 'У нас есть тур, начинающийся в 10 утра.' } },
            { speaker: 'user', text: 'Great, how much is it?', translation: { kz: 'Керемет, бағасы қанша?', ru: 'Отлично, сколько это стоит?' } }
        ]
    },
    {
        id: 'd69',
        level: 'A2',
        scenario: 'At the museum',
        scenarioTranslation: { kz: 'Мұражайда', ru: 'В музее' },
        messages: [
            { speaker: 'bot', text: 'Tickets are $15 for adults.', translation: { kz: 'Ересектерге билет 15 доллар.', ru: 'Билеты для взрослых стоят 15 долларов.' } },
            { speaker: 'user', text: 'Two adults, please.', translation: { kz: 'Екі ересек адамға, өтінемін.', ru: 'Двое взрослых, пожалуйста.' } },
            { speaker: 'bot', text: 'Here are your tickets and a map.', translation: { kz: 'Міне билеттеріңіз және карта.', ru: 'Вот ваши билеты и карта.' } }
        ]
    },
    {
        id: 'd70',
        level: 'B2',
        scenario: 'Complaining about room',
        scenarioTranslation: { kz: 'Бөлме туралы шағымдану', ru: 'Жалоба на номер' },
        messages: [
            { speaker: 'user', text: 'The air conditioner in my room is broken.', translation: { kz: 'Менің бөлмемдегі кондиционер бұзылған.', ru: 'Кондиционер в моем номере сломан.' } },
            { speaker: 'bot', text: 'I apologize. We will send someone to fix it.', translation: { kz: 'Кешірім сұраймын. Біз жөндеушіні жібереміз.', ru: 'Приношу извинения. Мы пришлем кого-нибудь починить его.' } },
            { speaker: 'user', text: 'Please do it quickly.', translation: { kz: 'Мұны тездетіп жасаңызшы.', ru: 'Пожалуйста, сделайте это быстро.' } }
        ]
    },
    {
        id: 'd71',
        level: 'A1',
        scenario: 'Buying a souvenir',
        scenarioTranslation: { kz: 'Кәдесый сатып алу', ru: 'Покупка сувенира' },
        messages: [
            { speaker: 'user', text: 'How much is this magnet?', translation: { kz: 'Бұл магнит қанша тұрады?', ru: 'Сколько стоит этот магнит?' } },
            { speaker: 'bot', text: 'It is 5 dollars.', translation: { kz: 'Ол 5 доллар тұрады.', ru: 'Это стоит 5 долларов.' } },
            { speaker: 'user', text: 'I will take it.', translation: { kz: 'Мен оны аламын.', ru: 'Я возьму это.' } }
        ]
    },
    {
        id: 'd72',
        level: 'B1',
        scenario: 'Asking for photo',
        scenarioTranslation: { kz: 'Суретке түсіруді сұрау', ru: 'Просьба сфотографировать' },
        messages: [
            { speaker: 'user', text: 'Could you take a photo of us?', translation: { kz: 'Бізді суретке түсіре аласыз ба?', ru: 'Не могли бы вы нас сфотографировать?' } },
            { speaker: 'bot', text: 'Sure, just press this button?', translation: { kz: 'Әрине, мына түймені бассам болды ма?', ru: 'Конечно, просто нажать эту кнопку?' } },
            { speaker: 'user', text: 'Yes, thank you!', translation: { kz: 'Иә, рақмет!', ru: 'Да, спасибо!' } }
        ]
    },
    {
        id: 'd73',
        level: 'A2',
        scenario: 'Ordering a taxi',
        scenarioTranslation: { kz: 'Такси шақыру', ru: 'Заказ такси' },
        messages: [
            { speaker: 'bot', text: 'Taxi service. Where are you?', translation: { kz: 'Такси қызметі. Сіз қайдасыз?', ru: 'Служба такси. Где вы находитесь?' } },
            { speaker: 'user', text: 'I am at the Grand Hotel.', translation: { kz: 'Мен Гранд қонақүйіндемін.', ru: 'Я в отеле Гранд.' } },
            { speaker: 'bot', text: 'A car will be there in 10 minutes.', translation: { kz: 'Көлік 10 минутта болады.', ru: 'Машина будет через 10 минут.' } }
        ]
    },
    {
        id: 'd74',
        level: 'B2',
        scenario: 'Changing reservation',
        scenarioTranslation: { kz: 'Броньды өзгерту', ru: 'Изменение бронирования' },
        messages: [
            { speaker: 'user', text: 'I need to change the date of my flight.', translation: { kz: 'Маған ұшу күнін өзгерту керек.', ru: 'Мне нужно изменить дату вылета.' } },
            { speaker: 'bot', text: 'What is your booking reference?', translation: { kz: 'Брондау нөміріңіз қандай?', ru: 'Какой у вас номер бронирования?' } },
            { speaker: 'user', text: 'It is AB123.', translation: { kz: 'Бұл AB123.', ru: 'Это AB123.' } }
        ]
    },
    {
        id: 'd75',
        level: 'A1',
        scenario: 'Asking time',
        scenarioTranslation: { kz: 'Уақыт сұрау', ru: 'Спрашивать время' },
        messages: [
            { speaker: 'user', text: 'Excuse me, what time is it?', translation: { kz: 'Кешіріңіз, сағат қанша?', ru: 'Извините, сколько времени?' } },
            { speaker: 'bot', text: 'It is half past two.', translation: { kz: 'Сағат екі жарым.', ru: 'Половина третьего.' } },
            { speaker: 'user', text: 'Thanks.', translation: { kz: 'Рақмет.', ru: 'Спасибо.' } }
        ]
    },
    {
        id: 'd76',
        level: 'B1',
        scenario: 'Pharmacy',
        scenarioTranslation: { kz: 'Дәріхана', ru: 'Аптека' },
        messages: [
            { speaker: 'user', text: 'I have a headache. Do you have aspirin?', translation: { kz: 'Басым ауырып тұр. Сізде аспирин бар ма?', ru: 'У меня болит голова. У вас есть аспирин?' } },
            { speaker: 'bot', text: 'Yes, here you go. Take two pills.', translation: { kz: 'Иә, мінекейіңіз. Екі таблеткадан ішіңіз.', ru: 'Да, вот. Примите две таблетки.' } },
            { speaker: 'user', text: 'Thank you.', translation: { kz: 'Рақмет.', ru: 'Спасибо.' } }
        ]
    },
    {
        id: 'd77',
        level: 'A2',
        scenario: 'At the market',
        scenarioTranslation: { kz: 'Базарда', ru: 'На рынке' },
        messages: [
            { speaker: 'user', text: 'How much are these oranges?', translation: { kz: 'Бұл апельсиндер қанша тұрады?', ru: 'Сколько стоят эти апельсины?' } },
            { speaker: 'bot', text: 'Two dollars a kilo.', translation: { kz: 'Кіләсі екі доллар.', ru: 'Два доллара за килограмм.' } },
            { speaker: 'user', text: 'Give me two kilos, please.', translation: { kz: 'Маған екі келі беріңізші.', ru: 'Дайте мне два килограмма, пожалуйста.' } }
        ]
    },
    {
        id: 'd78',
        level: 'B2',
        scenario: 'Reporting a crime',
        scenarioTranslation: { kz: 'Қылмыс туралы хабарлау', ru: 'Сообщение о преступлении' },
        messages: [
            { speaker: 'user', text: 'I want to report a theft.', translation: { kz: 'Мен ұрлық туралы хабарлағым келеді.', ru: 'Я хочу заявить о краже.' } },
            { speaker: 'bot', text: 'What was stolen?', translation: { kz: 'Не ұрланды?', ru: 'Что было украдено?' } },
            { speaker: 'user', text: 'My wallet and phone.', translation: { kz: 'Менің әмияным мен телефоным.', ru: 'Мой кошелек и телефон.' } }
        ]
    },
    {
        id: 'd79',
        level: 'A1',
        scenario: 'Meeting neighbors',
        scenarioTranslation: { kz: 'Көршілермен танысу', ru: 'Знакомство с соседями' },
        messages: [
            { speaker: 'user', text: 'Hi, I am new here.', translation: { kz: 'Сәлем, мен мұнда жаңамын.', ru: 'Привет, я здесь новенький.' } },
            { speaker: 'bot', text: 'Welcome to the neighborhood!', translation: { kz: 'Көршілерге қош келдіңіз!', ru: 'Добро пожаловать в район!' } },
            { speaker: 'user', text: 'Thank you.', translation: { kz: 'Рақмет.', ru: 'Спасибо.' } }
        ]
    },
    {
        id: 'd80',
        level: 'B1',
        scenario: 'Calling for pizza',
        scenarioTranslation: { kz: 'Пиццаға тапсырыс беру', ru: 'Заказ пиццы' },
        messages: [
            { speaker: 'bot', text: 'Pizza place. How can I help?', translation: { kz: 'Пицца орталығы. Қалай көмектесе аламын?', ru: 'Пиццерия. Чем могу помочь?' } },
            { speaker: 'user', text: 'I\'d like a large pepperoni pizza.', translation: { kz: 'Маған үлкен пепперони пиццасы керек.', ru: 'Я хотел бы большую пиццу пепперони.' } },
            { speaker: 'bot', text: 'Address please?', translation: { kz: 'Мекенжайыңыз?', ru: 'Адрес, пожалуйста?' } }
        ]
    },
    // Work & Business (d81-d100)
    {
        id: 'd81',
        level: 'B1',
        scenario: 'Job interview',
        scenarioTranslation: { kz: 'Жұмыс сұхбаты', ru: 'Собеседование' },
        messages: [
            { speaker: 'bot', text: 'Tell me about yourself.', translation: { kz: 'Өзіңіз туралы айтып беріңіз.', ru: 'Расскажите о себе.' } },
            { speaker: 'user', text: 'I have 5 years of experience in sales.', translation: { kz: 'Менің сату саласында 5 жылдық тәжірибем бар.', ru: 'У меня 5 лет опыта в продажах.' } },
            { speaker: 'bot', text: 'Why do you want this job?', translation: { kz: 'Неге бұл жұмысты қалайсыз?', ru: 'Почему вы хотите эту работу?' } }
        ]
    },
    {
        id: 'd82',
        level: 'A2',
        scenario: 'Calling in sick',
        scenarioTranslation: { kz: 'Ауырып қалу туралы хабарлау', ru: 'Сообщение о болезни' },
        messages: [
            { speaker: 'user', text: 'I cannot come to work today.', translation: { kz: 'Мен бүгін жұмысқа келе алмаймын.', ru: 'Я не могу прийти на работу сегодня.' } },
            { speaker: 'bot', text: 'What is wrong?', translation: { kz: 'Не болды?', ru: 'Что случилось?' } },
            { speaker: 'user', text: 'I have a fever.', translation: { kz: 'Менің қызуым көтеріліп тұр.', ru: 'У меня температура.' } }
        ]
    },
    {
        id: 'd83',
        level: 'B2',
        scenario: 'Negotiating a price',
        scenarioTranslation: { kz: 'Бағаны келісу', ru: 'Переговоры о цене' },
        messages: [
            { speaker: 'user', text: 'The price is too high for us.', translation: { kz: 'Баға біз үшін тым жоғары.', ru: 'Цена слишком высока для нас.' } },
            { speaker: 'bot', text: 'We can offer a 10% discount.', translation: { kz: 'Біз 10% жеңілдік ұсына аламыз.', ru: 'Мы можем предложить скидку 10%.' } },
            { speaker: 'user', text: 'That sounds reasonable.', translation: { kz: 'Бұл ақылға қонымды.', ru: 'Это звучит разумно.' } }
        ]
    },
    {
        id: 'd84',
        level: 'A1',
        scenario: 'Meeting a colleague',
        scenarioTranslation: { kz: 'Әріптеспен кездесу', ru: 'Встреча с коллегой' },
        messages: [
            { speaker: 'user', text: 'Hi, I am new here.', translation: { kz: 'Сәлем, мен мұнда жаңамын.', ru: 'Привет, я здесь новенький.' } },
            { speaker: 'bot', text: 'Nice to meet you. I am Tom.', translation: { kz: 'Танысқаныма қуаныштымын. Мен Томмын.', ru: 'Приятно познакомиться. Я Том.' } },
            { speaker: 'user', text: 'I am Anna.', translation: { kz: 'Мен Аннамын.', ru: 'Я Анна.' } }
        ]
    },
    {
        id: 'd85',
        level: 'B1',
        scenario: 'Scheduling a meeting',
        scenarioTranslation: { kz: 'Кездесуді жоспарлау', ru: 'Планирование встречи' },
        messages: [
            { speaker: 'user', text: 'Are you free on Monday?', translation: { kz: 'Дүйсенбіде боссыз ба?', ru: 'Вы свободны в понедельник?' } },
            { speaker: 'bot', text: 'No, I am busy all day.', translation: { kz: 'Жоқ, мен күні бойы бос емеспін.', ru: 'Нет, я занят весь день.' } },
            { speaker: 'user', text: 'How about Tuesday morning?', translation: { kz: 'Сейсенбі күні таңертең ше?', ru: 'Как насчет утра вторника?' } }
        ]
    },
    {
        id: 'd86',
        level: 'C1',
        scenario: 'Discussing strategy',
        scenarioTranslation: { kz: 'Стратегияны талқылау', ru: 'Обсуждение стратегии' },
        messages: [
            { speaker: 'user', text: 'We need to diversify our portfolio.', translation: { kz: 'Біз портфелімізді әртараптандыруымыз керек.', ru: 'Нам нужно диверсифицировать наш портфель.' } },
            { speaker: 'bot', text: 'I agree. The market is volatile.', translation: { kz: 'Келісемін. Нарық тұрақсыз.', ru: 'Согласен. Рынок нестабилен.' } },
            { speaker: 'user', text: 'Let\'s focus on emerging markets.', translation: { kz: 'Дамушы нарықтарға назар аударайық.', ru: 'Давайте сосредоточимся на развивающихся рынках.' } }
        ]
    },
    {
        id: 'd87',
        level: 'A2',
        scenario: 'Asking for leave',
        scenarioTranslation: { kz: 'Демелу сұрау', ru: 'Просьба об отпуске' },
        messages: [
            { speaker: 'user', text: 'Can I take a day off tomorrow?', translation: { kz: 'Ертең демалыс ала аламын ба?', ru: 'Могу я взять выходной завтра?' } },
            { speaker: 'bot', text: 'Why do you need it?', translation: { kz: 'Неге керек?', ru: 'Зачем вам это?' } },
            { speaker: 'user', text: 'I have a family appointment.', translation: { kz: 'Менің отбасылық кездесуім бар.', ru: 'У меня семейная встреча.' } }
        ]
    },
    {
        id: 'd88',
        level: 'B1',
        scenario: 'IT support',
        scenarioTranslation: { kz: 'IT қолдау', ru: 'IT-поддержка' },
        messages: [
            { speaker: 'user', text: 'My computer is not working.', translation: { kz: 'Менің компьютерім жұмыс істемей тұр.', ru: 'Мой компьютер не работает.' } },
            { speaker: 'bot', text: 'Have you tried restarting it?', translation: { kz: 'Қайта қосып көрдіңіз бе?', ru: 'Вы пробовали перезагрузить его?' } },
            { speaker: 'user', text: 'Yes, but it is still frozen.', translation: { kz: 'Иә, бірақ ол әлі қатып тұр.', ru: 'Да, но он все еще завис.' } }
        ]
    },
    {
        id: 'd89',
        level: 'B2',
        scenario: 'Giving feedback',
        scenarioTranslation: { kz: 'Кері байланыс беру', ru: 'Давать обратную связь' },
        messages: [
            { speaker: 'bot', text: 'How did I do on the presentation?', translation: { kz: 'Презентацияны қалай жасадым?', ru: 'Как я справился с презентацией?' } },
            { speaker: 'user', text: 'It was good, but you spoke too fast.', translation: { kz: 'Жақсы болды, бірақ сіз тым тез сөйледіңіз.', ru: 'Было хорошо, но вы говорили слишком быстро.' } },
            { speaker: 'bot', text: 'I will try to slow down next time.', translation: { kz: 'Келесі жолы баяулауға тырысамын.', ru: 'Я постараюсь говорить медленнее в следующий раз.' } }
        ]
    },
    {
        id: 'd90',
        level: 'A1',
        scenario: 'Office supplies',
        scenarioTranslation: { kz: 'Кеңсе тауарлары', ru: 'Канцелярские товары' },
        messages: [
            { speaker: 'user', text: 'I need a pen.', translation: { kz: 'Маған қалам керек.', ru: 'Мне нужна ручка.' } },
            { speaker: 'bot', text: 'There are pens in the cabinet.', translation: { kz: 'Шкафта қаламдар бар.', ru: 'В шкафу есть ручки.' } },
            { speaker: 'user', text: 'Thanks.', translation: { kz: 'Рақмет.', ru: 'Спасибо.' } }
        ]
    },
    {
        id: 'd91',
        level: 'B1',
        scenario: 'Answering the phone',
        scenarioTranslation: { kz: 'Телефонға жауап беру', ru: 'Ответ на звонок' },
        messages: [
            { speaker: 'bot', text: 'ABC Company, how can I help?', translation: { kz: 'ABC компаниясы, қалай көмектесе аламын?', ru: 'Компания ABC, чем могу помочь?' } },
            { speaker: 'user', text: 'Can I speak to Mr. Jones?', translation: { kz: 'Мистер Джонспен сөйлесе аламын ба?', ru: 'Могу я поговорить с мистером Джонсом?' } },
            { speaker: 'bot', text: 'He is in a meeting right now.', translation: { kz: 'Ол қазір жиналыста.', ru: 'Он сейчас на совещании.' } }
        ]
    },
    {
        id: 'd92',
        level: 'C1',
        scenario: 'Contract review',
        scenarioTranslation: { kz: 'Келісімшартты қарау', ru: 'Обзор контракта' },
        messages: [
            { speaker: 'user', text: 'Have you read the new clause?', translation: { kz: 'Жаңа тармақты оқыдыңыз ба?', ru: 'Вы читали новый пункт?' } },
            { speaker: 'bot', text: 'Yes, it seems ambiguous.', translation: { kz: 'Иә, ол екіұшты сияқты.', ru: 'Да, он кажется двусмысленным.' } },
            { speaker: 'user', text: 'We should ask legal to clarify.', translation: { kz: 'Біз заңгерлерден түсіндіруді сұрауымыз керек.', ru: 'Нам следует попросить юристов разъяснить.' } }
        ]
    },
    {
        id: 'd93',
        level: 'A2',
        scenario: 'Lunch break',
        scenarioTranslation: { kz: 'Түскі үзіліс', ru: 'Обеденный перерыв' },
        messages: [
            { speaker: 'user', text: 'When is lunch?', translation: { kz: 'Түскі ас қашан?', ru: 'Когда обед?' } },
            { speaker: 'bot', text: 'It is at 12:30.', translation: { kz: 'Сағат 12:30-да.', ru: 'В 12:30.' } },
            { speaker: 'user', text: 'Let\'s go together.', translation: { kz: 'Бірге барайық.', ru: 'Пойдем вместе.' } }
        ]
    },
    {
        id: 'd94',
        level: 'B2',
        scenario: 'Project deadline',
        scenarioTranslation: { kz: 'Жоба мерзімі', ru: 'Срок сдачи проекта' },
        messages: [
            { speaker: 'bot', text: 'When is the project due?', translation: { kz: 'Жоба қашан тапсырылуы керек?', ru: 'Когда срок сдачи проекта?' } },
            { speaker: 'user', text: 'The deadline is this Friday.', translation: { kz: 'Мерзімі осы жұмада.', ru: 'Крайний срок в эту пятницу.' } },
            { speaker: 'bot', text: 'We need to work overtime.', translation: { kz: 'Бізге үстеме жұмыс істеу керек.', ru: 'Нам нужно работать сверхурочно.' } }
        ]
    },
    {
        id: 'd95',
        level: 'A1',
        scenario: 'Printer problem',
        scenarioTranslation: { kz: 'Принтер мәселесі', ru: 'Проблема с принтером' },
        messages: [
            { speaker: 'user', text: 'The printer is out of paper.', translation: { kz: 'Принтерде қағаз таусылды.', ru: 'В принтере закончилась бумага.' } },
            { speaker: 'bot', text: 'There is more paper in the box.', translation: { kz: 'Қорапта көбірек қағаз бар.', ru: 'В коробке есть еще бумага.' } },
            { speaker: 'user', text: 'Okay, I see it.', translation: { kz: 'Жарайды, көрдім.', ru: 'Хорошо, вижу.' } }
        ]
    },
    {
        id: 'd96',
        level: 'B1',
        scenario: 'Business trip',
        scenarioTranslation: { kz: 'Іссапар', ru: 'Командировка' },
        messages: [
            { speaker: 'user', text: 'I am going to Paris for work.', translation: { kz: 'Мен жұмыс бабымен Парижге бара жатырмын.', ru: 'Я еду в Париж по работе.' } },
            { speaker: 'bot', text: 'How long will you stay?', translation: { kz: 'Қанша уақыт боласыз?', ru: 'Как долго вы пробудете?' } },
            { speaker: 'user', text: 'Just for two days.', translation: { kz: 'Тек екі күнге.', ru: 'Всего на два дня.' } }
        ]
    },
    {
        id: 'd97',
        level: 'C2',
        scenario: 'Merger discussion',
        scenarioTranslation: { kz: 'Бірігуді талқылау', ru: 'Обсуждение слияния' },
        messages: [
            { speaker: 'user', text: 'The merger will create synergies.', translation: { kz: 'Бірігу синергияны тудырады.', ru: 'Слияние создаст синергию.' } },
            { speaker: 'bot', text: 'But there will be redundancies.', translation: { kz: 'Бірақ қысқартулар болады.', ru: 'Но будут сокращения.' } },
            { speaker: 'user', text: 'We must handle them carefully.', translation: { kz: 'Біз оларды мұқият қарастыруымыз керек.', ru: 'Мы должны обращаться с ними осторожно.' } }
        ]
    },
    {
        id: 'd98',
        level: 'A2',
        scenario: 'Sending an email',
        scenarioTranslation: { kz: 'Электрондық хат жіберу', ru: 'Отправка электронного письма' },
        messages: [
            { speaker: 'user', text: 'Did you send the email?', translation: { kz: 'Сіз хатты жібердіңіз бе?', ru: 'Вы отправили письмо?' } },
            { speaker: 'bot', text: 'Yes, I sent it an hour ago.', translation: { kz: 'Иә, мен оны бір сағат бұрын жібердім.', ru: 'Да, я отправил его час назад.' } },
            { speaker: 'user', text: 'Did they reply?', translation: { kz: 'Олар жауап берді ме?', ru: 'Они ответили?' } }
        ]
    },
    {
        id: 'd99',
        level: 'B1',
        scenario: 'Client meeting',
        scenarioTranslation: { kz: 'Клиентпен кездесу', ru: 'Встреча с клиентом' },
        messages: [
            { speaker: 'bot', text: 'The client is waiting in the lobby.', translation: { kz: 'Клиент фойеде күтіп тұр.', ru: 'Клиент ждет в холле.' } },
            { speaker: 'user', text: 'Bring them to the conference room.', translation: { kz: 'Оларды конференц-залға әкеліңіз.', ru: 'Проводите их в конференц-зал.' } },
            { speaker: 'bot', text: 'Would they like coffee?', translation: { kz: 'Олар кофе іше ме?', ru: 'Они хотят кофе?' } }
        ]
    },
    {
        id: 'd100',
        level: 'A1',
        scenario: 'Leaving work',
        scenarioTranslation: { kz: 'Жұмыстан кету', ru: 'Уход с работы' },
        messages: [
            { speaker: 'user', text: 'Goodbye, see you tomorrow.', translation: { kz: 'Сау болыңыз, ертең кездескенше.', ru: 'До свидания, увидимся завтра.' } },
            { speaker: 'bot', text: 'Have a good evening!', translation: { kz: 'Кешіңіз жақсы өтсін!', ru: 'Хорошего вечера!' } },
            { speaker: 'user', text: 'You too.', translation: { kz: 'Сізге де.', ru: 'Вам тоже.' } }
        ]
    },
    // Social & Daily Life (d101-d120)
    {
        id: 'd101',
        level: 'A1',
        scenario: 'Talking about hobbies',
        scenarioTranslation: { kz: 'Хобби туралы сөйлесу', ru: 'Разговор о хобби' },
        messages: [
            { speaker: 'bot', text: 'What do you do in your free time?', translation: { kz: 'Бос уақытыңызда не істейсіз?', ru: 'Что вы делаете в свободное время?' } },
            { speaker: 'user', text: 'I like playing football.', translation: { kz: 'Маған футбол ойнаған ұнайды.', ru: 'Мне нравится играть в футбол.' } },
            { speaker: 'bot', text: 'That is great exercise.', translation: { kz: 'Бұл керемет жаттығу.', ru: 'Это отличное упражнение.' } }
        ]
    },
    {
        id: 'd102',
        level: 'B1',
        scenario: 'Inviting to a party',
        scenarioTranslation: { kz: 'Кешкі асқа шақыру', ru: 'Приглашение на вечеринку' },
        messages: [
            { speaker: 'user', text: 'I am having a birthday party on Saturday.', translation: { kz: 'Сенбіде менің туған күнім болады.', ru: 'В субботу у меня день рождения.' } },
            { speaker: 'bot', text: 'Oh, happy birthday! Can I come?', translation: { kz: 'О, туған күніңізбен! Мен келе аламын ба?', ru: 'О, с днем рождения! Могу я прийти?' } },
            { speaker: 'user', text: 'Of course! It starts at 7 PM.', translation: { kz: 'Әрине! Ол кешкі сағат 7-де басталады.', ru: 'Конечно! Начало в 7 вечера.' } }
        ]
    },
    {
        id: 'd103',
        level: 'A2',
        scenario: 'Describing a friend',
        scenarioTranslation: { kz: 'Досты сипаттау', ru: 'Описание друга' },
        messages: [
            { speaker: 'bot', text: 'What does your best friend look like?', translation: { kz: 'Ең жақын досыңыз қандай?', ru: 'Как выглядит твой лучший друг?' } },
            { speaker: 'user', text: 'He is tall and has brown hair.', translation: { kz: 'Ол ұзын бойлы және қоңыр шашты.', ru: 'Он высокий и у него каштановые волосы.' } },
            { speaker: 'bot', text: 'Is he funny?', translation: { kz: 'Ол күлкілі ме?', ru: 'Он смешной?' } }
        ]
    },
    {
        id: 'd104',
        level: 'B2',
        scenario: 'Discussing movies',
        scenarioTranslation: { kz: 'Фильмдерді талқылау', ru: 'Обсуждение фильмов' },
        messages: [
            { speaker: 'user', text: 'Have you seen the new Marvel movie?', translation: { kz: 'Жаңа Marvel фильмін көрдіңіз бе?', ru: 'Вы видели новый фильм Marvel?' } },
            { speaker: 'bot', text: 'Yes, the special effects were amazing.', translation: { kz: 'Иә, арнайы эффектілер керемет болды.', ru: 'Да, спецэффекты были потрясающими.' } },
            { speaker: 'user', text: 'I thought the plot was a bit weak.', translation: { kz: 'Менің ойымша, сюжет сәл әлсіз болды.', ru: 'Я думал, что сюжет был немного слабым.' } }
        ]
    },
    {
        id: 'd105',
        level: 'A1',
        scenario: 'Weather talk',
        scenarioTranslation: { kz: 'Ауа райы туралы сөйлесу', ru: 'Разговор о погоде' },
        messages: [
            { speaker: 'user', text: 'It is very cold today.', translation: { kz: 'Бүгін өте суық.', ru: 'Сегодня очень холодно.' } },
            { speaker: 'bot', text: 'Yes, it might snow later.', translation: { kz: 'Иә, кейінірек қар жаууы мүмкін.', ru: 'Да, позже может пойти снег.' } },
            { speaker: 'user', text: 'I need a warm coat.', translation: { kz: 'Маған жылы пальто керек.', ru: 'Мне нужно теплое пальто.' } }
        ]
    },
    {
        id: 'd106',
        level: 'C1',
        scenario: 'Political debate',
        scenarioTranslation: { kz: 'Саяси пікірталас', ru: 'Политические дебаты' },
        messages: [
            { speaker: 'user', text: 'What do you think about the new policy?', translation: { kz: 'Жаңа саясат туралы не ойлайсыз?', ru: 'Что вы думаете о новой политике?' } },
            { speaker: 'bot', text: 'It has pros and cons.', translation: { kz: 'Оның артықшылықтары мен кемшіліктері бар.', ru: 'У нее есть плюсы и минусы.' } },
            { speaker: 'user', text: 'It might affect the economy negatively.', translation: { kz: 'Бұл экономикаға теріс әсер етуі мүмкін.', ru: 'Это может негативно сказаться на экономике.' } }
        ]
    },
    {
        id: 'd107',
        level: 'A2',
        scenario: 'Making plans',
        scenarioTranslation: { kz: 'Жоспар құру', ru: 'Строить планы' },
        messages: [
            { speaker: 'bot', text: 'What are you doing this weekend?', translation: { kz: 'Осы демалыста не істейсіз?', ru: 'Что вы делаете в эти выходные?' } },
            { speaker: 'user', text: 'I am going to the park.', translation: { kz: 'Мен саябаққа барамын.', ru: 'Я иду в парк.' } },
            { speaker: 'bot', text: 'Can I join you?', translation: { kz: 'Сізге қосыла аламын ба?', ru: 'Могу я присоединиться к вам?' } }
        ]
    },
    {
        id: 'd108',
        level: 'B1',
        scenario: 'Cooking dinner',
        scenarioTranslation: { kz: 'Кешкі ас дайындау', ru: 'Готовить ужин' },
        messages: [
            { speaker: 'user', text: 'I am making pasta for dinner.', translation: { kz: 'Мен кешкі асқа паста дайындап жатырмын.', ru: 'Я готовлю пасту на ужин.' } },
            { speaker: 'bot', text: 'Do you need any help?', translation: { kz: 'Сізге көмек керек пе?', ru: 'Вам нужна помощь?' } },
            { speaker: 'user', text: 'Yes, please chop the onions.', translation: { kz: 'Иә, пиязды тураңызшы.', ru: 'Да, пожалуйста, нарежьте лук.' } }
        ]
    },
    {
        id: 'd109',
        level: 'B2',
        scenario: 'Fitness goals',
        scenarioTranslation: { kz: 'Фитнес мақсаттары', ru: 'Фитнес-цели' },
        messages: [
            { speaker: 'bot', text: 'Do you work out often?', translation: { kz: 'Сіз жиі жаттығасыз ба?', ru: 'Вы часто тренируетесь?' } },
            { speaker: 'user', text: 'I try to go to the gym 3 times a week.', translation: { kz: 'Мен аптасына 3 рет жаттығу залына баруға тырысамын.', ru: 'Я стараюсь ходить в спортзал 3 раза в неделю.' } },
            { speaker: 'bot', text: 'That is a good routine.', translation: { kz: 'Бұл жақсы тәртіп.', ru: 'Это хороший режим.' } }
        ]
    },
    {
        id: 'd110',
        level: 'A1',
        scenario: 'Favorite color',
        scenarioTranslation: { kz: 'Сүйікті түс', ru: 'Любимый цвет' },
        messages: [
            { speaker: 'bot', text: 'What is your favorite color?', translation: { kz: 'Сүйікті түсіңіз қандай?', ru: 'Какой ваш любимый цвет?' } },
            { speaker: 'user', text: 'I like blue.', translation: { kz: 'Маған көк түс ұнайды.', ru: 'Мне нравится синий.' } },
            { speaker: 'bot', text: 'Me too!', translation: { kz: 'Маған да!', ru: 'Мне тоже!' } }
        ]
    },
    {
        id: 'd111',
        level: 'B1',
        scenario: 'Public transport',
        scenarioTranslation: { kz: 'Қоғамдық көлік', ru: 'Общественный транспорт' },
        messages: [
            { speaker: 'user', text: 'Does this bus go to the city center?', translation: { kz: 'Бұл автобус қала орталығына бара ма?', ru: 'Этот автобус идет в центр города?' } },
            { speaker: 'bot', text: 'No, you need the number 5.', translation: { kz: 'Жоқ, сізге 5 нөмірлі автобус керек.', ru: 'Нет, вам нужен номер 5.' } },
            { speaker: 'user', text: 'How often does it come?', translation: { kz: 'Ол қаншалықты жиі келеді?', ru: 'Как часто он ходит?' } }
        ]
    },
    {
        id: 'd112',
        level: 'C2',
        scenario: 'Philosophy',
        scenarioTranslation: { kz: 'Философия', ru: 'Философия' },
        messages: [
            { speaker: 'user', text: 'What is the meaning of life?', translation: { kz: 'Өмірдің мәні неде?', ru: 'В чем смысл жизни?' } },
            { speaker: 'bot', text: 'That is a profound question.', translation: { kz: 'Бұл терең сұрақ.', ru: 'Это глубокий вопрос.' } },
            { speaker: 'user', text: 'Perhaps it is to find happiness.', translation: { kz: 'Мүмкін, бақытты табу шығар.', ru: 'Возможно, это найти счастье.' } }
        ]
    },
    {
        id: 'd113',
        level: 'A2',
        scenario: 'Shopping for clothes',
        scenarioTranslation: { kz: 'Киім сатып алу', ru: 'Покупка одежды' },
        messages: [
            { speaker: 'bot', text: 'Can I help you find something?', translation: { kz: 'Бірдеңе табуға көмектесе аламын ба?', ru: 'Могу я помочь вам найти что-нибудь?' } },
            { speaker: 'user', text: 'I am looking for jeans.', translation: { kz: 'Мен джинсы іздеп жүрмін.', ru: 'Я ищу джинсы.' } },
            { speaker: 'bot', text: 'What size are you?', translation: { kz: 'Өлшеміңіз қандай?', ru: 'Какой у вас размер?' } }
        ]
    },
    {
        id: 'd114',
        level: 'B2',
        scenario: 'Online shopping',
        scenarioTranslation: { kz: 'Онлайн шопинг', ru: 'Онлайн-шопинг' },
        messages: [
            { speaker: 'user', text: 'I ordered a book online.', translation: { kz: 'Мен кітапқа онлайн тапсырыс бердім.', ru: 'Я заказал книгу онлайн.' } },
            { speaker: 'bot', text: 'When will it arrive?', translation: { kz: 'Ол қашан келеді?', ru: 'Когда она придет?' } },
            { speaker: 'user', text: 'It should be here tomorrow.', translation: { kz: 'Ол ертең осында болуы керек.', ru: 'Она должна быть здесь завтра.' } }
        ]
    },
    {
        id: 'd115',
        level: 'A1',
        scenario: 'Pets',
        scenarioTranslation: { kz: 'Үй жануарлары', ru: 'Домашние животные' },
        messages: [
            { speaker: 'bot', text: 'Do you have a pet?', translation: { kz: 'Үй жануарыңыз бар ма?', ru: 'У вас есть домашнее животное?' } },
            { speaker: 'user', text: 'Yes, I have a cat.', translation: { kz: 'Иә, менде мысық бар.', ru: 'Да, у меня есть кошка.' } },
            { speaker: 'bot', text: 'What is its name?', translation: { kz: 'Оның аты кім?', ru: 'Как ее зовут?' } }
        ]
    },
    {
        id: 'd116',
        level: 'B1',
        scenario: 'Weekend trip',
        scenarioTranslation: { kz: 'Демалыс күнгі сапар', ru: 'Поездка на выходные' },
        messages: [
            { speaker: 'user', text: 'We went to the lake last weekend.', translation: { kz: 'Біз өткен демалыста көлге бардық.', ru: 'Мы ездили на озеро в прошлые выходные.' } },
            { speaker: 'bot', text: 'Did you swim?', translation: { kz: 'Сіз жүздіңіз бе?', ru: 'Вы купались?' } },
            { speaker: 'user', text: 'Yes, the water was warm.', translation: { kz: 'Иә, су жылы болды.', ru: 'Да, вода была теплой.' } }
        ]
    },
    {
        id: 'd117',
        level: 'C1',
        scenario: 'Environmental issues',
        scenarioTranslation: { kz: 'Экологиялық мәселелер', ru: 'Экологические проблемы' },
        messages: [
            { speaker: 'bot', text: 'Pollution is a major problem.', translation: { kz: 'Ластану - үлкен мәселе.', ru: 'Загрязнение - это большая проблема.' } },
            { speaker: 'user', text: 'We need to reduce plastic waste.', translation: { kz: 'Біз пластик қалдықтарды азайтуымыз керек.', ru: 'Нам нужно сократить пластиковые отходы.' } },
            { speaker: 'bot', text: 'Everyone must do their part.', translation: { kz: 'Әркім өз үлесін қосуы керек.', ru: 'Каждый должен внести свой вклад.' } }
        ]
    },
    {
        id: 'd118',
        level: 'A2',
        scenario: 'Learning English',
        scenarioTranslation: { kz: 'Ағылшын тілін үйрену', ru: 'Изучение английского' },
        messages: [
            { speaker: 'user', text: 'English is difficult.', translation: { kz: 'Ағылшын тілі қиын.', ru: 'Английский трудный.' } },
            { speaker: 'bot', text: 'Practice makes perfect.', translation: { kz: 'Тәжірибе шеберлікке жеткізеді.', ru: 'Практика приводит к совершенству.' } },
            { speaker: 'user', text: 'I will try harder.', translation: { kz: 'Мен көбірек тырысамын.', ru: 'Я буду стараться усерднее.' } }
        ]
    },
    {
        id: 'd119',
        level: 'B1',
        scenario: 'Social media',
        scenarioTranslation: { kz: 'Әлеуметтік желілер', ru: 'Социальные сети' },
        messages: [
            { speaker: 'bot', text: 'Are you on Instagram?', translation: { kz: 'Сіз Инстаграмда барсыз ба?', ru: 'Вы есть в Инстаграме?' } },
            { speaker: 'user', text: 'Yes, I post photos of my food.', translation: { kz: 'Иә, мен тамағымның суреттерін саламын.', ru: 'Да, я выкладываю фото своей еды.' } },
            { speaker: 'bot', text: 'I will follow you.', translation: { kz: 'Мен сізге жазыламын.', ru: 'Я подпишусь на вас.' } }
        ]
    },
    {
        id: 'd120',
        level: 'A1',
        scenario: 'Saying thank you',
        scenarioTranslation: { kz: 'Рақмет айту', ru: 'Говорить спасибо' },
        messages: [
            { speaker: 'user', text: 'Thank you for your help.', translation: { kz: 'Көмегіңізге рақмет.', ru: 'Спасибо за вашу помощь.' } },
            { speaker: 'bot', text: 'You are welcome.', translation: { kz: 'Оқасы жоқ.', ru: 'Пожалуйста.' } },
            { speaker: 'user', text: 'You are very kind.', translation: { kz: 'Сіз өте мейірімдісіз.', ru: 'Вы очень добры.' } }
        ]
    }
];
