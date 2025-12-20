export interface GrammarQuestion {
    id: string;
    type: 'tenses' | 'conditionals' | 'phrasal' | 'irregular';
    category_id?: string; // Links to specific tense/conditional id
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: {
        en: string;
        ru: string;
        kz: string;
    };
    level: 'B1' | 'B2' | 'C1' | 'C2';
}

export const grammarQuestions: GrammarQuestion[] = [
    // TENSES - ADVANCED
    {
        id: 'q_t_1',
        type: 'tenses',
        category_id: 'future-perfect',
        question: "By the time you get home, I _____ the house from top to bottom.",
        options: ["will clean", "will have cleaned", "will be cleaning", "am cleaning"],
        correctAnswer: "will have cleaned",
        explanation: {
            en: "We use Future Perfect (will have + V3) to describe an action that will be completed before a specific time in the future.",
            ru: "Future Perfect используется для действий, которые будут завершены к определенному моменту в будущем.",
            kz: "Future Perfect келешектегі белгілі бір уақытқа дейін аяқталатын іс-әрекеттер үшін қолданылады."
        },
        level: 'B2'
    },
    {
        id: 'q_t_2',
        type: 'tenses',
        category_id: 'past-perfect-continuous',
        question: "She was exhausted because she _____ for ten hours straight.",
        options: ["was working", "had been working", "has worked", "worked"],
        correctAnswer: "had been working",
        explanation: {
            en: "Past Perfect Continuous emphasizes the duration of an activity that happened before another event in the past.",
            ru: "Past Perfect Continuous подчеркивает длительность действия, которое происходило до другого события в прошлом.",
            kz: "Past Perfect Continuous өткендегі басқа оқиғаға дейін болған іс-әрекеттің ұзақтығын көрсетеді."
        },
        level: 'C1'
    },
    {
        id: 'q_t_3',
        type: 'tenses',
        category_id: 'present-continuous',
        question: "Why _____ you always _____ your dirty socks on the floor? It's annoying!",
        options: ["do / leave", "are / leaving", "have / left", "did / leave"],
        correctAnswer: "are / leaving",
        explanation: {
            en: "Present Continuous with 'always' is used to express annoyance at a repeated habit.",
            ru: "Present Continuous с 'always' используется для выражения раздражения по поводу повторяющейся привычки.",
            kz: "Present Continuous 'always' сөзімен бірге жағымсыз, қайталанатын әдеттерді сипаттау үшін қолданылады."
        },
        level: 'C1'
    },
    {
        id: 'q_t_4',
        type: 'tenses',
        category_id: 'future-continuous',
        question: "Don't call me at 8 PM. I _____ dinner with my family.",
        options: ["will have", "will be having", "will have had", "am having"],
        correctAnswer: "will be having",
        explanation: {
            en: "Future Continuous describes an action that will be in progress at a specific time in the future.",
            ru: "Future Continuous описывает действие, которое будет происходить в определенный момент в будущем.",
            kz: "Future Continuous келешектегі белгілі бір уақытта болып жататын іс-әрекетті білдіреді."
        },
        level: 'B2'
    },

    // CONDITIONALS - ADVANCED
    {
        id: 'q_c_1',
        type: 'conditionals',
        category_id: 'mixed-conditional',
        question: "If I _____ harder at school, I _____ a better job now.",
        options: ["studied / would have", "had studied / would have", "had studied / would have had"],
        correctAnswer: "had studied / would have",
        explanation: {
            en: "This is a Mixed Conditional (Type 3 + Type 2). Past condition (had studied) with present result (would have).",
            ru: "Это смешанный тип условных предложений. Условие в прошлом (had studied), результат в настоящем (would have).",
            kz: "Бұл аралас шартты сөйлем. Өткендегі шарт (had studied) және қазіргі нәтиже (would have)."
        },
        level: 'C1'
    },
    {
        id: 'q_c_2',
        type: 'conditionals',
        category_id: 'third-conditional',
        question: "But for his help, we _____ in time.",
        options: ["wouldn't finish", "wouldn't have finished", "won't finish", "didn't finish"],
        correctAnswer: "wouldn't have finished",
        explanation: {
            en: "'But for' is used here to mean 'If it hadn't been for'. It requires the Third Conditional structure in the main clause.",
            ru: "'But for' здесь означает 'Если бы не'. Требует структуры третьего условного наклонения.",
            kz: "'But for' тіркесі 'егер болмағанда' деген мағынада қолданылады және үшінші шартты сөйлем құрылымын талап етеді."
        },
        level: 'C2'
    },
    {
        id: 'q_c_3',
        type: 'conditionals',
        category_id: 'second-conditional',
        question: "If I _____ you, I would apologize immediately.",
        options: ["was", "were", "am", "have been"],
        correctAnswer: "were",
        explanation: {
            en: "In Second Conditional, 'were' is formally used for all persons (Subjunctive Mood). 'Was' is acceptable in informal speech but 'were' is standard.",
            ru: "Во втором условном наклонении 'were' используется для всех лиц (сослагательное наклонение).",
            kz: "Екінші шартты сөйлемде барлық жақтар үшін 'were' қолданылады."
        },
        level: 'B1'
    },

    // PHRASAL VERBS - ADVANCED
    {
        id: 'q_p_1',
        type: 'phrasal',
        question: "The meeting was _____ until next week due to the CEO's illness.",
        options: ["put out", "put off", "called off", "brought up"],
        correctAnswer: "put off",
        explanation: {
            en: "'Put off' means to postpone. 'Call off' means to cancel completely.",
            ru: "'Put off' означает отложить. 'Call off' — отменить полностью.",
            kz: "'Put off' кейінге қалдыру дегенді білдіреді. 'Call off' — мүлдем болдырмау."
        },
        level: 'B2'
    },
    {
        id: 'q_p_2',
        type: 'phrasal',
        question: "I can't _____ with this noise anymore! I'm leaving.",
        options: ["put up", "keep up", "catch up", "face up"],
        correctAnswer: "put up",
        explanation: {
            en: "'Put up with' means to tolerate or endure something unpleasant.",
            ru: "'Put up with' означает мириться с чем-то, терпеть.",
            kz: "'Put up with' — шыдау, төзу деген мағынада."
        },
        level: 'B2'
    },
    {
        id: 'q_p_3',
        type: 'phrasal',
        question: "It took him a long time to _____ the shock of losing his job.",
        options: ["get over", "get off", "get through", "get by"],
        correctAnswer: "get over",
        explanation: {
            en: "'Get over' means to recover from an illness, shock, or difficult situation.",
            ru: "'Get over' — оправиться, пережить (шок, болезнь).",
            kz: "'Get over' — қиындықты жеңу, аурудан айығу."
        },
        level: 'B1'
    },

    // IRREGULAR VERBS - TRICKY
    {
        id: 'q_i_1',
        type: 'irregular',
        question: "The sun has _____ in the East.",
        options: ["rose", "risen", "raised", "arisen"],
        correctAnswer: "risen",
        explanation: {
            en: "The past participle of 'rise' (intransitive) is 'risen'. 'Raised' is from 'raise' (transitive).",
            ru: "Причастие прошедшего времени от 'rise' (вставать) — 'risen'. 'Raised' — от 'raise' (поднимать что-то).",
            kz: "'Rise' (көтерілу) етістігінің өткен шақ есімшесі — 'risen'."
        },
        level: 'B2'
    },
    {
        id: 'q_i_2',
        type: 'irregular',
        question: "He _____ the book on the table and left.",
        options: ["lay", "laid", "lied", "lain"],
        correctAnswer: "laid",
        explanation: {
            en: "'Laid' is the past tense of 'lay' (to put something down). 'Lay' is the past tense of 'lie' (to recline).",
            ru: "'Laid' — прошедшее от 'lay' (класть). 'Lay' — прошедшее от 'lie' (лежать).",
            kz: "'Laid' — 'lay' (қою) етістігінің өткен шағы."
        },
        level: 'C1'
    }
];
