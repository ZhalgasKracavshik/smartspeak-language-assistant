import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Library, GraduationCap, ChevronRight, Lock, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";

interface DictionaryItem {
    word: string;
    trans: string;
    context: string;
}

interface Section {
    id: string;
    items: DictionaryItem[];
}

interface Module {
    id: string;
    title: string;
    sections: Section[];
}

interface GradeContent {
    dictionary: Module[];
    rules: any[];
    materials: any[];
}

export function Classes() {
    const { language } = useLanguage();
    const [selectedGrade, setSelectedGrade] = useState<string>('9');
    const [activeTab, setActiveTab] = useState('dictionary');

    const grades = ['5', '6', '7', '8', '9'];

    const translations = {
        title: { kz: 'Сыныптар', ru: 'Классы' },
        subtitle: { kz: 'Мектеп бағдарламасы бойынша материалдар', ru: 'Материалы по школьной программе' },
        grade: { kz: 'сынып', ru: 'класс' },
        dictionary: { kz: 'Сөздіктер', ru: 'Словари' },
        rules: { kz: 'Ережелер', ru: 'Правила' },
        materials: { kz: 'Материалдар', ru: 'Материалы' },
        locked: { kz: 'Бұл бөлім әзірленуде', ru: 'Этот раздел в разработке' },
        start: { kz: 'Бастау', ru: 'Начать' }
    };

    const content: Record<string, GradeContent> = {
        '5': {
            dictionary: [
                {
                    id: 'Module 1',
                    title: 'All about me',
                    sections: [
                        {
                            id: '1a',
                            items: [
                                { word: 'Family', trans: 'Отбасы', context: 'My family is big.' },
                                { word: 'School', trans: 'Мектеп', context: 'I go to school.' },
                                { word: 'Friend', trans: 'Дос', context: 'He is my best friend.' },
                            ]
                        }
                    ]
                }
            ],
            rules: [
                { title: 'Present Simple', desc: 'Basic present tense' },
                { title: 'Plural Nouns', desc: 'Adding -s/-es' },
            ],
            materials: [
                { title: 'Unit 1: All about me', type: 'PDF' },
                { title: 'Unit 2: My home', type: 'Video' },
            ]
        },
        '9': {
            dictionary: [
                {
                    id: 'Module 1',
                    title: 'Hobbies & Qualities',
                    sections: [
                        {
                            id: '1a',
                            items: [
                                { word: 'blood /blʌd/ (n)', trans: 'қан', context: 'кровь' },
                                { word: 'catch a wave (phr)', trans: 'толқынды ұстау', context: 'поймать волну' },
                                { word: 'enter a competition (phr)', trans: 'додаға қатысу', context: 'вступить в соревнование' },
                                { word: 'escape death (phr)', trans: 'өлімнен аулақ болу', context: 'избежать смерти' },
                                { word: 'fit /fɪt/ (v)', trans: 'сай / сәйкестік', context: 'подходить / соответствовать' },
                                { word: 'handle /ˈhændl/ (n)', trans: 'тұтқа', context: 'рукоятка' },
                                { word: 'look bright (phr)', trans: 'алдыңыз болып көріну', context: 'казаться умным / смышленым' },
                                { word: 'lose arm (phr)', trans: 'қолын жоғалту', context: 'потерять руку' },
                                { word: 'overcome obstacles (phr)', trans: 'кедергілерді еңсеру', context: 'преодолевать препятствия' },
                                { word: 'rank /ræŋk/ (v)', trans: 'дәреже', context: 'ранг / звание' },
                                { word: 'rush /rʌʃ/ (v)', trans: 'асығу', context: 'спешить' },
                                { word: 'shark attack /ʃɑːk əˈtæk/ (n)', trans: 'акуланың шабуылы', context: 'атака акулы' },
                                { word: 'sharp pain /ʃɑːp peɪn/ (n)', trans: 'өткір ауырсыну', context: 'резкая боль' },
                                { word: 'strike /straɪk/ (v)', trans: 'ұру, соғу', context: 'ударить' },
                                { word: 'terror /ˈterə/ (n)', trans: 'террор', context: 'террор' },
                                { word: 'victim /ˈvɪktɪm/ (n)', trans: 'құрбан', context: 'жертва' },
                                { word: 'victory /ˈvɪkt(ə)ri/ (n)', trans: 'жеңіс', context: 'победа' },
                            ]
                        },
                        {
                            id: '1c',
                            items: [
                                { word: 'antique /ænˈtiːk/ (n)', trans: 'көне', context: 'античный' },
                                { word: 'colleague /ˈkɒliːɡ/ (n)', trans: 'әріптес', context: 'коллега' },
                                { word: 'determination /dɪˌtɜːmɪˈneɪʃn/ (n)', trans: 'анықтау', context: 'определение' },
                                { word: 'engrave /ɪnˈɡreɪv/ (v)', trans: 'ойып жазу', context: 'выгравировать' },
                                { word: 'exhibition /ˌeksɪˈbɪʃn/ (n)', trans: 'көрме', context: 'выставка' },
                                { word: 'high-quality /ˌhaɪ ˈkwɒləti/ (adj)', trans: 'жоғары сапа', context: 'высокое качество' },
                                { word: 'miniature /ˈmɪnɪətʃə/ (adj)', trans: 'миниатюралық', context: 'миниатюрный' },
                                { word: 'official /əˈfɪʃl/ (adj)', trans: 'ресми', context: 'официальный' },
                                { word: 'rug /rʌɡ/ (n)', trans: 'кілем', context: 'ковер' },
                                { word: 'success /səkˈses/ (n)', trans: 'сәттілік', context: 'удача' },
                                { word: 'textile /ˈtekstaɪl/ (n)', trans: 'тоқыма', context: 'текстиль' },
                            ]
                        },
                        {
                            id: '1e',
                            items: [
                                { word: 'amusement park /əˈmjuːzmənt pɑːk/ (n)', trans: 'ойын-сауық паркі', context: 'парк аттракционов' },
                                { word: 'hiking /ˈhaɪkɪŋ/ (n)', trans: 'жаяу серуендеу', context: 'пешая прогулка' },
                                { word: 'landscape /ˈlændskeɪp/ (n)', trans: 'ландшафт', context: 'ландшафт' },
                                { word: 'local rink /ˈləʊkl rɪŋk/ (n)', trans: 'жергілікті сырғанау айдыны', context: 'местный каток' },
                                { word: 'mate /meɪt/ (n)', trans: 'дос / әріптес / дос', context: 'приятель / товарищ / друг' },
                                { word: 'water park /ˈwɔːtə pɑːk/ (n)', trans: 'аквапарк', context: 'аквапарк' },
                            ]
                        },
                        {
                            id: '1f',
                            items: [
                                { word: 'bathing suit /ˈbeɪðɪŋ suːt/ (n)', trans: 'шомылатын костюм', context: 'купальный костюм' },
                                { word: 'day trip /deɪ trɪp/ (n)', trans: 'күндік сапар', context: 'дневная поездка' },
                                { word: 'era /ˈɪərə/ (n)', trans: 'дәуір', context: 'эпоха / эра' },
                                { word: 'gramophone /ˈɡræməfəʊn/ (n)', trans: 'граммофон', context: 'граммофон' },
                                { word: 'lacrosse /ləˈkrɒs/ (n)', trans: 'лакросс', context: 'лакросс' },
                                { word: 'music hall /ˈmjuːzɪk hɔːl/ (n)', trans: 'музыка бөлмесі', context: 'музыкальный зал' },
                                { word: 'musical instrument /ˈmjuːzɪkl ˈɪnstrəmənt/ (n)', trans: 'музыкалық аспап', context: 'музыкальный инструмент' },
                                { word: 'performance /pəˈfɔːməns/ (n)', trans: 'сөз сөйлеу', context: 'выступление' },
                                { word: 'railway system /ˈreɪlweɪ ˈsɪstəm/ (n)', trans: 'теміржол жүйесі', context: 'железнодорожная система' },
                                { word: 'record /ˈrekɔːd/ (n)', trans: 'жазба', context: 'запись' },
                                { word: 'seafront /ˈsiːfrʌnt/ (n)', trans: 'жағалау', context: 'набережная' },
                                { word: 'wheel /wiːl/ (v)', trans: 'доңғалақ', context: 'колесо' },
                                { word: 'wooden hut /ˈwʊdn hʌt/ (n)', trans: 'ағаш лашық', context: 'деревянная хижина' },
                            ]
                        },
                        {
                            id: '1g',
                            items: [
                                { word: 'attitude /ˈætɪtjuːd/ (n)', trans: 'мінез-құлық', context: 'поведение' },
                                { word: 'competition /ˌkɒmpəˈtɪʃn/ (n)', trans: 'жарыс, сайыс, дода, конкурс', context: 'соревнование / конкурс' },
                                { word: 'distance /ˈdɪstəns/ (n)', trans: 'қашықтық', context: 'дистанция / расстояние' },
                                { word: 'national celebration /ˌnæʃnəl seləˈbreɪʃn/ (n)', trans: 'ұлттық мереке', context: 'национальный праздник' },
                                { word: 'proud /praʊd/ (adj)', trans: 'тәкаппар, менмен', context: 'гордый' },
                                { word: 'strength /streŋθ/ (n)', trans: 'күш', context: 'сила' },
                                { word: 'surface /ˈsɜːfɪs/ (n)', trans: 'беті', context: 'поверхность' },
                                { word: 'take part in (phr)', trans: 'қатысу', context: 'участвовать в...' },
                                { word: 'be tied to sth (phr)', trans: 'бір нәрсеге тәуелді болу', context: 'быть привязанным к чему-то' },
                            ]
                        }
                    ]
                },
                {
                    id: 'Module 2',
                    title: 'Exercise & Sport',
                    sections: [
                        {
                            id: '2a',
                            items: [
                                { word: 'at a snail\'s pace (phr)', trans: 'ұлулардың жылдамдығымен (өте баяу)', context: 'со скоростью улитки' },
                                { word: 'championship /ˈtʃæmpiənʃɪp/ (n)', trans: 'чемпионат', context: 'чемпионат' },
                                { word: 'competition /ˌkɒmpəˈtɪʃn/ (n)', trans: 'жарыс; сайыс, дода конкурс', context: 'соревнование / конкурс / конкуренция' },
                                { word: 'cross /krɒs/ (v)', trans: 'кірес', context: 'крест' },
                                { word: 'field /fiːld/ (n)', trans: 'өріс', context: 'поле' },
                                { word: 'hilarious /hɪˈleəriəs/ (adj)', trans: 'қызықты, көңілді', context: 'уморительный' },
                                { word: 'local /ˈləʊkl/ (adj)', trans: 'жергілікті', context: 'местный / локальный' },
                                { word: 'outer /ˈaʊtə/ (adj)', trans: 'сыртқы', context: 'внешний' },
                                { word: 'paddle /ˈpædl/ (n)', trans: 'педаль', context: 'педаль' },
                                { word: 'pound /paʊnd/ (n)', trans: 'тоған', context: 'пруд' },
                                { word: 'reach /riːtʃ/ (v)', trans: 'жету', context: 'достигать' },
                                { word: 'spray /spreɪ/ (v)', trans: 'бүрку; бүріктіру; себу;', context: 'опрыскивать / распылять / разбрызгивать / опылять / пульверизировать' },
                                { word: 'stick /stɪk/ (v)', trans: 'ұсталу, ұстау', context: 'придерживаться / держаться' },
                            ]
                        },
                        {
                            id: '2c',
                            items: [
                                { word: 'achievement /əˈtʃiːvmənt/ (n)', trans: 'жетістік', context: 'достижение' },
                                { word: 'ambition /æmˈbɪʃn/ (n)', trans: 'кеудемсоқтық; менмендік;', context: 'амбиции' },
                                { word: 'bother /ˈbɒðə/ (v)', trans: 'кедергі жасау', context: 'мешать' },
                                { word: 'circuit /ˈsɜːkɪt/ (n)', trans: 'схемасы / тізбегі / циклі', context: 'схема / контур / цикл' },
                                { word: 'complete /kəmˈpliːt/ (v)', trans: 'аяқталу', context: 'завершать' },
                                { word: 'inspire /ɪnˈspaɪə/ (v)', trans: 'шабыттандыру', context: 'вдохновлять' },
                                { word: 'kart /kɑːt/ (n)', trans: 'арба', context: 'тележка' },
                                { word: 'in the spotlight (phr)', trans: 'назарында', context: 'в центре внимания' },
                                { word: 'transition /trænˈzɪʃn/ (n)', trans: 'асу; өткел', context: 'переход' },
                            ]
                        },
                        {
                            id: '2d',
                            items: [
                                { word: 'bandage /ˈbændɪdʒ/ (n)', trans: 'жабыстырғыш;', context: 'бандаж / пластырь' },
                                { word: 'focus /ˈfəʊkəs/ (v)', trans: 'назар аудару', context: 'фокусироваться' },
                                { word: 'pressure /ˈpreʃə/ (n)', trans: 'қысым', context: 'давление' },
                                { word: 'sore /sɔː/ (adj)', trans: 'қабыну / ауру / ауырсыну', context: 'воспалённый / больной / болезненный' },
                                { word: 'swell /swel/ (v)', trans: 'бөртіну / ісіну', context: 'набухаться' },
                                { word: 'trip over /trɪp ˈəʊvə/ (phr v)', trans: 'сүріну', context: 'споткнуться' },
                            ]
                        },
                        {
                            id: '2e',
                            items: [
                                { word: 'arch /ɑːtʃ/ (n)', trans: 'арка', context: 'арка' },
                                { word: 'demolish /dɪˈmɒlɪʃ/ (v)', trans: 'жойып жіберу', context: 'снести' },
                                { word: 'host /həʊst/ (v)', trans: 'қабылдау, қарсы алу.', context: 'принимать / встречать' },
                                { word: 'judo /ˈdʒuːdəʊ/ (n)', trans: 'дзюдо', context: 'дзюдо' },
                                { word: 'kiosk /ˈkiːɒsk/ (n)', trans: 'киоск', context: 'киоск' },
                                { word: 'measure /ˈmeʒə/ (v)', trans: 'өлшеуіш', context: 'мера' },
                                { word: 'moveable /ˈmuːvəbl/ (adj)', trans: 'жылжымалы', context: 'подвижный' },
                                { word: 'sliding /ˈslaɪdɪŋ/ (adj)', trans: 'сырғыма', context: 'скользящий' },
                                { word: 'spectator /spekˈteɪtə/ (n)', trans: 'көрермен', context: 'зритель' },
                                { word: 'structure /ˈstrʌktʃə/ (n)', trans: 'үлгі', context: 'структура' },
                                { word: 'wrestling /ˈreslɪŋ/ (n)', trans: 'күрес', context: 'борьба' },
                            ]
                        },
                        {
                            id: '2f',
                            items: [
                                { word: 'adjust /əˈdʒʌst/ (v)', trans: 'реттеу', context: 'регулировать / приспосабливать / подгонять' },
                                { word: 'administer /ədˈmɪnɪstə/ (v)', trans: 'жүргізу; меңгеру, басқару;', context: 'управлять' },
                                { word: 'airway /ˈeəweɪ/ (n)', trans: 'ауа құбыры', context: 'воздуховод' },
                                { word: 'be based on sth (phr)', trans: 'негізделу керек', context: 'основываться на...' },
                                { word: 'care /keə/ (n)', trans: 'қамқорлық', context: 'забота' },
                                { word: 'casualty /ˈkæʒuəlti/ (n)', trans: 'өлім, жазатайым оқиға;', context: 'жертва / несчастный случай' },
                                { word: 'choke /tʃəʊk/ (v)', trans: 'қылқындыру; тұншықтыру; буындыру', context: 'душить / задыхаться / тұншыға бастау' },
                                { word: 'medical /ˈmedɪkl/ (adj)', trans: 'медициналық', context: 'медицинский' },
                                { word: 'prevent /prɪˈvent/ (v)', trans: 'алдын алу', context: 'предотвращать' },
                                { word: 'principle /ˈprɪnsəpl/ (n)', trans: 'қағида', context: 'принцип' },
                                { word: 'recovery position /rɪˈkʌvəri pəˌzɪʃn/ (n)', trans: 'қалпына келтіру орны', context: 'место восстановления' },
                                { word: 'unconscious /ʌnˈkɒnʃəs/ (adj)', trans: 'бейсаналық', context: 'бессознательный' },
                                { word: 'upright /ˈʌpraɪt/ (adj)', trans: 'тік / адал', context: 'вертикальный / честный' },
                                { word: 'victim /ˈvɪktɪm/ (n)', trans: 'құрбан;', context: 'жертва' },
                                { word: 'wave /weɪv/ (v)', trans: 'толқын', context: 'волна' },
                            ]
                        }
                    ]
                },
                {
                    id: 'Module 8',
                    title: 'Travel & Tourism',
                    sections: [
                        {
                            id: '8d',
                            items: [
                                { word: 'announcement /əˈnaʊnsmənt/ (n)', trans: 'хабарландыру', context: 'объявление' },
                                { word: 'delay /dɪˈleɪ/ (v)', trans: 'кешіктіру', context: 'задержка' },
                                { word: 'handle /ˈhændl/ (n)', trans: 'ұстау тұтқасы', context: 'рукоять / ручка' },
                                { word: 'sticker /ˈstɪkə/ (n)', trans: 'жапсырма', context: 'наклейка' },
                                { word: 'trip /trɪp/ (n)', trans: 'сапар', context: 'поездка' },
                            ]
                        },
                        {
                            id: '8e',
                            items: [
                                { word: 'construction /kənˈstrʌkʃn/ (n)', trans: 'құрылымы', context: 'конструкция / сооружение' },
                                { word: 'dome /dəʊm/ (n)', trans: 'шатыр', context: 'купол' },
                                { word: 'grand /ɡrænd/ (adj)', trans: 'ұлы', context: 'великий' },
                                { word: 'landscape /ˈlændskeɪp/ (v)', trans: 'ландшафт', context: 'пейзаж' },
                                { word: 'locate /ləʊˈkeɪt/ (v)', trans: 'табу', context: 'находить / найти' },
                                { word: 'mausoleum /ˌmɔːsəˈliːəm/ (n)', trans: 'кесене', context: 'мавзолей' },
                                { word: 'military leader /ˈmɪlɪtəri ˈliːdə/ (n)', trans: 'әскери көшбасшы', context: 'военный лидер' },
                                { word: 'modern-day /mɒdn deɪ/ (adj)', trans: 'қазіргі заманғы күн', context: 'современный день' },
                                { word: 'pilgrim /ˈpɪlɡrɪm/ (n)', trans: 'қажы', context: 'поломник' },
                                { word: 'privacy /ˈprɪvəsi/ (n)', trans: 'құпиялылық', context: 'конфиденциальность' },
                                { word: 'religious /rɪˈlɪdʒəs/ (adj)', trans: 'діни', context: 'религиозный' },
                                { word: 'stretch /stretʃ/ (v)', trans: 'созылу', context: 'тянуться / подтягиваться / разминаться' },
                                { word: 'tile /taɪl/ (n)', trans: 'үй жабатын/жұқа қатырма', context: 'черепица' },
                                { word: 'warrior /ˈwɒriə/ (n)', trans: 'жауынгер', context: 'воин' },
                            ]
                        },
                        {
                            id: '8f',
                            items: [
                                { word: 'exchange /ɪksˈtʃeɪndʒ/ (v)', trans: 'өзгерту', context: 'менять' },
                                { word: 'globalization /ˌɡləʊbəlaɪˈzeɪʃn/ (n)', trans: 'жаһандану', context: 'глобализация' },
                                { word: 'gunpowder /ˈɡʌnˌpaʊdə/ (n)', trans: 'атыс қаруы', context: 'порох' },
                                { word: 'legacy /ˈleɡəsi/ (n)', trans: 'мұра', context: 'наследие' },
                                { word: 'loop /luːp/ (v)', trans: 'ілмек', context: 'петля' },
                                { word: 'mass media /ˌmæs ˈmiːdiə/ (n)', trans: 'бұқаралық ақпарат құралдары', context: 'средства массовой информации' },
                                { word: 'material goods /məˌtɪəriəl ˈɡʊdz/ (pl n)', trans: 'материалдық пайда', context: 'материальные блага' },
                                { word: 'merchant /ˈmɜːtʃənt/ (n)', trans: 'сатушы', context: 'продавец / купец' },
                                { word: 'muscle /ˈmʌsl/ (n)', trans: 'бұлшық ет', context: 'мускул' },
                                { word: 'nerve /nɜːv/ (n)', trans: 'жүйке', context: 'нерв' },
                                { word: 'part-mechanical /ˌpɑːt mɪˈkænɪkl/ (adj)', trans: 'ішінара механикалық', context: 'частично механический' },
                                { word: 'porcelain /ˈpɔːsəlɪn/ (n)', trans: 'фарфор', context: 'фарфор' },
                                { word: 'settlement /ˈsetlmənt/ (n)', trans: 'қонысы', context: 'поселение' },
                                { word: 'silk /sɪlk/ (n)', trans: 'жібек', context: 'шелк' },
                                { word: 'sophisticated /səˈfɪstɪkeɪtɪd/ (adj)', trans: 'кешенді / тазартылған', context: 'сложный / утончённый' },
                                { word: 'weapon /ˈwepən/ (n)', trans: 'қару', context: 'оружие' },
                                { word: 'wire /ˈwaɪə/ (n)', trans: 'сым / телеграмма / телеграф', context: 'провод / проволока / телеграмма / телеграф' },
                            ]
                        }
                    ]
                },
                {
                    id: 'Module 3',
                    title: 'Earth & our place on it',
                    sections: [
                        {
                            id: '3a',
                            items: [
                                { word: 'abandoned /əˈbændənd/ (adj)', trans: 'қараусыз қалған / озық / жетілдірілген', context: 'заброшенный / продвинутый / передовой / прогрессивный' },
                                { word: 'advanced /ədˈvɑːnst/ (adj)', trans: 'прогрессивтік', context: 'счетливый / шумный / хлопотливый' },
                                { word: 'bustling /ˈbʌslɪŋ/ (adj)', trans: 'шулы / тынам тыптайтын, бос емес', context: 'космополит' },
                                { word: 'cosmopolitan /ˌkɒzməˈpɒlɪtən/ (adj)', trans: 'космополит', context: 'распадаться / крошиться / разрушаться' },
                                { word: 'crumble /ˈkrʌmbl/ (v)', trans: 'ажырау; амарып кету; ыдрау', context: 'выкапывать' },
                                { word: 'excavate /ˈekskəveɪt/ (v)', trans: 'қазу', context: 'доказательство' },
                                { word: 'evidence /ˈevɪdəns/ (n)', trans: 'дәлел', context: 'влиятельный' },
                                { word: 'influential /ˌɪnfluˈenʃl/ (adj)', trans: 'әкімдіді', context: 'житель' },
                                { word: 'inhabitants /ɪnˈhæbɪtənt/ (n)', trans: 'тұрған', context: 'мечеть' },
                                { word: 'mosque /mɒsk/ (n)', trans: 'мешіт', context: 'сеть' },
                                { word: 'network /ˈnetwɜːk/ (n)', trans: 'желі', context: 'сухопутный' },
                                { word: 'overland /ˌəʊvəˈlænd/ (adj)', trans: 'құрлық', context: 'пополнять' },
                                { word: 'replenish /rɪˈplenɪʃ/ (v)', trans: 'толтыру', context: 'руины' },
                                { word: 'ruins /ˈruːɪnz/ (pl n)', trans: 'күйреген', context: 'осада' },
                                { word: 'siege /siːdʒ/ (n)', trans: 'қоршау', context: 'важный' },
                                { word: 'significant /sɪɡˈnɪfɪkənt/ (adj)', trans: 'маңызды', context: 'поддерживать' },
                                { word: 'sustain /səˈsteɪn/ (v)', trans: 'қолдау көрсету', context: 'снабжение' },
                                { word: 'supply /səˈplaɪ/ (n)', trans: 'жабдықтау', context: 'торговый маршрут' },
                                { word: 'trade route /treɪd ruːt/ (n)', trans: 'сауда жолы', context: 'торговый маршрут' },
                            ]
                        },
                        {
                            id: '3c',
                            items: [
                                { word: 'carve /kɑːv/ (v)', trans: 'накалытау; оюлайын жазу', context: 'гравировать' },
                                { word: 'chat /tʃæt/ (v)', trans: 'әңгімелесу, сөлесу', context: 'болтать' },
                                { word: 'cone /kəʊn/ (n)', trans: 'конус / мұйіз', context: 'конус / рожок' },
                                { word: 'cosy /ˈkəʊzi/ (adj)', trans: 'жайлы', context: 'уютный' },
                                { word: 'courtyard /ˈkɔːtjɑːd/ (n)', trans: 'ауыл', context: 'двор' },
                                { word: 'disease /dɪˈziːz/ (n)', trans: 'ауру', context: 'болезнь' },
                                { word: 'fairy /ˈfeəri/ (n)', trans: 'перізад; пері', context: 'фея' },
                                { word: 'chimney /ˈtʃɪmni/ (n)', trans: 'түтін мұржасы', context: 'дымоход' },
                                { word: 'fairytale /ˈfeəriteil/ (n)', trans: 'ертегі', context: 'сказка' },
                                { word: 'mosquito /mɒˈskiːtəʊ/ (n)', trans: 'маса', context: 'комар' },
                                { word: 'nature /ˈneɪtʃə/ (n)', trans: 'табиғат', context: 'природа' },
                                { word: 'nightfall /ˈnaɪtfɔːl/ (n)', trans: 'ымырт; пір; ақшам; алоқоленке;', context: 'сумерки' },
                                { word: 'notch /nɒtʃ/ (n)', trans: 'жапсырма / шокты', context: 'метка / засечка' },
                                { word: 'thatched roof /θætʃt ruːf/ (n)', trans: 'сабан шатыры', context: 'соломенная крыша' },
                                { word: 'tree top /triː tɒp/ (n)', trans: 'ағаштын жоғары жағы', context: 'вершина дерева' },
                                { word: 'upside-down /ˌʌpsaɪd ˈdaʊn/ (adj)', trans: 'жоғары жене төмен', context: 'верх-вниз' },
                            ]
                        },
                        {
                            id: '3e',
                            items: [
                                { word: 'artificial /ɑːtɪˈfɪʃl/ (adj)', trans: 'жасанды', context: 'искусственный' },
                                { word: 'bank /bæŋk/ (n)', trans: 'банк', context: 'банк' },
                                { word: 'cable car /ˈkeɪbl kɑː/ (n)', trans: 'арқан жол', context: 'канатная дорога' },
                                { word: 'drift /drɪft/ (v)', trans: 'дрейфтеу', context: 'дрейфовать' },
                                { word: 'flow /fləʊ/ (v)', trans: 'зу; сорғылау', context: 'течь' },
                                { word: 'iconic /aɪˈkɒnɪk/ (adj)', trans: 'аса күрделі; заманалық', context: 'портретный; традиционный; канонический, эпохальный' },
                            ]
                        },
                        {
                            id: '3f',
                            items: [
                                { word: 'in the blink of an eye (phr)', trans: 'көз ашып жұмғанша; тамаша', context: 'в мгновение ока' },
                                { word: 'magnificent /mæɡˈnɪfɪsənt/ (adj)', trans: 'қайшар бүвак', context: 'великолепный / источник' },
                                { word: 'source /sɔːs/ (n)', trans: 'жану серуендеу', context: 'гудеть' },
                                { word: 'stroll /strəʊl/ (v)', trans: 'күніш батуы', context: 'закат солнца' },
                                { word: 'sunset /ˈsʌnset/ (n)', trans: 'сокты��ысу / кидылысу', context: 'сталкиваться / пересекаться' },
                            ]
                        },
                        {
                            id: '3g',
                            items: [
                                { word: 'collide /kəˈlaɪd/ (v)', trans: 'жарык', context: 'трещина' },
                                { word: 'crack /kræk/ (v)', trans: 'қабыты / күртысы', context: 'кора / корка' },
                                { word: 'crust /krʌst/ (n)', trans: 'күте', context: 'ошибка' },
                                { word: 'fault /fɔːlt/ (n)', trans: 'пішін', context: 'форма' },
                                { word: 'form /fɔːm/ (v)', trans: 'балқитылаған', context: 'расплавленный' },
                                { word: 'melted /ˈmeltɪd/ (adj)', trans: 'қысым', context: 'давление' },
                                { word: 'pressure /ˈpreʃə/ (n)', trans: 'тектоникалық плита', context: 'тектоническая плита' },
                                { word: 'tectonic plate /tekˌtɒnɪk pleɪt/ (n)', trans: 'нажарқай дауыл', context: 'шторм с грозой' },
                                { word: 'electrical storm /ɪˌlektrɪks ˈstɔːm/ (n)', trans: 'оттану', context: 'фейерверк' },
                                { word: 'fireworks display /ˈfaɪəwɜːks dɪˌspleɪ/ (n)', trans: 'саташалды', context: 'продается' },
                                { word: 'for sale (phr)', trans: 'қонақ Үй', context: 'гостевой дом' },
                                { word: 'guesthouse /ˈɡesthaʊs/ (n)', trans: 'қырқында қозғалысы / кемпелік', context: 'интенсивный трафик / сильные пробки' },
                                { word: 'heavy traffic /ˌhevi ˈtræfɪk/ (n)', trans: 'оқшауланған', context: 'изолированный' },
                                { word: 'isolated /ˈaɪsəleɪtɪd/ (adj)', trans: 'шамцирай', context: 'маяк' },
                                { word: 'lighthouse /ˈlaɪthaʊs/ (n)', trans: 'кең жүдысы', context: 'офисная работа' },
                                { word: 'office job /ˈɒfɪs dʒɒb/ (n)', trans: 'себітілді', context: 'мирный' },
                                { word: 'peaceful /ˈpiːsfl/ (adj)', trans: 'жалға беру', context: 'сдавать в аренду' },
                                { word: 'rent out /rent aʊt/ (phr v)', trans: 'шашырау', context: 'брызгать' },
                                { word: 'splash /splæʃ/ (v)', trans: 'толқы��', context: 'волна' },
                                { word: 'wave /weɪv/ (n)', trans: 'толқын', context: 'волна' },
                            ]
                        }
                    ]
                },
                {
                    id: 'Module 4',
                    title: 'Charities & Conflict',
                    sections: [
                        {
                            id: '4a',
                            items: [
                                { word: 'ankle /ˈæŋkl/ (n)', trans: 'жілінішік / тобықа', context: 'лодыжка' },
                                { word: 'assistance /əˈsɪstəns/ (n)', trans: 'көмек', context: 'помощь' },
                                { word: 'awareness /əˈweənəs/ (n)', trans: 'сезінуге түсіру, хабардар болу', context: 'освоение, осведомлённость' },
                                { word: 'charity /ˈtʃærəti/ (n)', trans: 'қайырымдылық', context: 'благотворительность' },
                                { word: 'determination /dɪˌtɜːmɪˈneɪʃn/ (n)', trans: 'батырлық; ерлік; қайармандық', context: 'решимость' },
                                { word: 'feat /fiːt/ (n)', trans: 'шаһаын еп айтымы', context: 'подвиг' },
                                { word: 'get stung (phr)', trans: 'құрмет', context: 'быть ужаленным / честь' },
                                { word: 'honour /ˈɒnə/ (n)', trans: 'алалла сиялма��үын; нанысысыз; сенбошәк', context: 'невероятный' },
                                { word: 'incredible /ɪnˈkredəbl/ (adj)', trans: 'шабыт', context: 'вдохновение' },
                                { word: 'inspiration /ˌɪnspəˈreɪʃn/ (n)', trans: 'мақсет', context: 'цель' },
                                { word: 'objective /əbˈdʒektɪv/ (n)', trans: 'кедергілерді жену / тотеп беру', context: 'преодоление препятствий' },
                                { word: 'overcome obstacles (phr)', trans: 'қайым мақайтын', context: 'упорствовать' },
                                { word: 'persist /pəˈsɪst/ (v)', trans: 'кедегерді', context: 'нищета / бедность' },
                                { word: 'poverty /ˈpɒvəti/ (n)', trans: 'қатар', context: 'строка / ряд' },
                                { word: 'row /rəʊ/ (v)', trans: 'соло', context: 'сольный' },
                                { word: 'solo /ˈsəʊləʊ/ (adv)', trans: 'проектор / жарықтандыру', context: 'прожектор / центр внимания' },
                                { word: 'spotlight /ˈspɒtlaɪt/ (n)', trans: 'шаю; шарын алу', context: 'жалить' },
                                { word: 'sting /stɪŋ/ (v)', trans: 'жілінішік / тобіқ', context: 'лодыжка' },
                            ]
                        },
                        {
                            id: '4c',
                            items: [
                                { word: 'aid /eɪd/ (n)', trans: 'көмек', context: 'помощь' },
                                { word: 'campaign /kæmˈpeɪn/ (v)', trans: 'түп жүргізу; түттеу', context: 'агитировать' },
                                { word: 'draw sb\'s attention to sth (phr)', trans: 'назар аудару', context: 'обратить чьё-то внимание на что-то' },
                                { word: 'enterprising /ˈentəpraɪzɪŋ/ (adj)', trans: 'қасіиерлік', context: 'предприимчивый' },
                                { word: 'healthcare /ˈhelθkeə/ (n)', trans: 'денсаулық сақтау', context: 'здравоохранение' },
                                { word: 'non-profit /ˌnɒn ˈprɒfɪt/ (adj)', trans: 'коммерциялық емес', context: 'некоммерческий' },
                                { word: 'refugee camp /ˌrefjʊdʒiː kæmp/ (n)', trans: 'босққндар лагері', context: 'лагерь беженцев' },
                                { word: 'stand up /ˈstænd ʌp/ (phr v)', trans: 'артнан түру', context: 'выступать за / стоять за / отстаивать' },
                                { word: 'struggle /ˈstrʌɡl/ (v)', trans: 'күрес', context: 'борьба' },
                                { word: 'sustainable development /səˌsteɪnəbl dɪˈveləpmənt/ (n)', trans: 'түрақты даму', context: 'устойчивое развитие' },
                                { word: 'vaccinate /ˈvæksɪneɪt/ (v)', trans: 'вакцина егу', context: 'вакцинировать / прививать' },
                                { word: 'wage /weɪdʒ/ (n)', trans: 'еңбекақы', context: 'заработная плата' },
                                { word: 'well /wel/ (n)', trans: 'жақсы', context: 'хорошо' },
                            ]
                        },
                        {
                            id: '4e',
                            items: [
                                { word: 'abused /əˈbjuːzd/ (adj)', trans: 'қиянат ету / қордау', context: 'злоупотреблять / оскорблённый' },
                                { word: 'community /kəˈmjuːnəti/ (n)', trans: 'қауымдастык', context: 'сообщество / община' },
                                { word: 'conservation /ˌkɒnsəˈveɪʃn/ (n)', trans: 'сақтау, құткару қорлығы', context: 'сохранение, заповедник' },
                                { word: 'critically endangered (phr)', trans: 'хотуздын аздында', context: 'на грани исчезновения' },
                                { word: 'disturb /dɪˈstɜːb/ (v)', trans: 'мазалау, өкірретті', context: 'беспокоить' },
                                { word: 'habitat /ˈhæbɪtæt/ (n)', trans: 'тірішілік ету аймағы', context: 'среда обитания' },
                                { word: 'pride /praɪd/ (n)', trans: 'мағызпа', context: 'гордость' },
                                { word: 'primate /ˈpraɪmeɪt/ (n)', trans: 'басімдық', context: 'примат' },
                                { word: 'raise awareness (phr)', trans: 'хабардарлықты қамтамасыз ету', context: 'повысить осведомлённость убежище' },
                                { word: 'refuge /ˈrefjuːdʒ/ (n)', trans: 'бастана', context: 'убежище' },
                                { word: 'sanctuary /ˈsæŋktʃuəri/ (n)', trans: 'тұодаахана', context: 'святилище' },
                                { word: 'snap /snæp/ (v)', trans: 'шер��у, әкрердадау', context: 'щелкать' },
                                { word: 'trap /træp/ (n)', trans: 'түзак / қалпан', context: 'ловушка / западня' },
                            ]
                        },
                        {
                            id: '4f',
                            items: [
                                { word: 'allied /əˈlaɪd/ (adj)', trans: 'одақ', context: 'союзный' },
                                { word: 'cultural heritage (phr)', trans: 'мадени мұра', context: 'культурное наследие' },
                                { word: 'defend /dɪˈfend/ (v)', trans: 'қорғау', context: 'защищать' },
                                { word: 'development /dɪˈveləpmənt/ (n)', trans: 'даму, өркендеу', context: 'развитие' },
                                { word: 'diversity /daɪˈvɜːsəti/ (n)', trans: 'әртүрлілік', context: 'разнообразие' },
                                { word: 'found /faʊnd/ (v)', trans: 'табылды', context: 'найдено' },
                                { word: 'fund /fʌnd/ (v)', trans: 'қор', context: 'фонд' },
                                { word: 'government /ˈɡʌvənmənt/ (n)', trans: 'үкімет', context: 'правительство' },
                                { word: 'headquarters /hedˈkwɔːtəz/ (pl n)', trans: 'басты кенсе', context: 'головной офис' },
                                { word: 'poverty /ˈpɒvəti/ (n)', trans: 'кедейлік', context: 'бедность' },
                                { word: 'promote peace (phr)', trans: 'бейбітшілікті қотермелейді', context: 'поощрять мир' },
                                { word: 'reduce inequality (phr)', trans: 'теңсіздігті төмендету', context: 'уменьшать неравенство' },
                                { word: 'standard of living (phr)', trans: 'өмір және өкіністеу', context: 'уровень жизни' },
                                { word: 'strive /straɪv/ (v)', trans: 'талгашиддыру', context: 'стремиться' },
                                { word: 'wipe out /waɪp aʊt/ (phr v)', trans: 'үмтгиду / бительдыну', context: 'стремиться' },
                                { word: 'жою', trans: 'жою', context: 'уничтожить' },
                            ]
                        },
                        {
                            id: '4g',
                            items: [
                                { word: 'assess /əˈses/ (v)', trans: 'бағалау', context: 'оценивать' },
                                { word: 'creature /ˈkriːtʃə/ (n)', trans: 'жаратылыс нес��', context: 'создание, существо' },
                                { word: 'feedback /ˈfiːdbæk/ (n)', trans: 'кері байланыс', context: 'обратная связь' },
                                { word: 'monitor /ˈmɒnɪtə/ (v)', trans: 'бидқадау / тексеру', context: 'контролировать / проверять / отслеживать' },
                            ]
                        }
                    ]
                },
                {
                    id: 'Module 5',
                    title: 'Reading for Pleasure',
                    sections: [
                        {
                            id: '5a',
                            items: [
                                { word: 'a flash of light (phr)', trans: 'сауле жарығы', context: 'вспышка света' },
                                { word: 'chain /tʃeɪn/ (n)', trans: 'тізбек', context: 'цепь' },
                                { word: 'footstep /ˈfʊtstep/ (n)', trans: 'қадам', context: 'шаг' },
                                { word: 'insulted /ɪnˈsʌltɪd/ (adj)', trans: 'ренжілген', context: 'оскорблённый' },
                                { word: 'light /laɪt/ (n)', trans: 'жарык', context: 'свет' },
                                { word: 'revenge /rɪˈvendʒ/ (n)', trans: 'кек алу', context: 'месть' },
                                { word: 'sight /saɪt/ (n)', trans: 'көрінісі', context: 'поле зрения' },
                                { word: 'torn /tɔːn/ (adj)', trans: 'жыртығылған / жарылған', context: 'порванный / разорванный / раздорванный' },
                            ]
                        },
                        {
                            id: '5b',
                            items: [
                                { word: 'compass /ˈkʌmpəs/ (n)', trans: 'компас', context: 'компас' },
                                { word: 'heat /hiːt/ (n)', trans: 'жылу', context: 'тепло' },
                                { word: 'hiss /hɪs/ (v)', trans: 'ысылдау,быжылдау', context: 'шипеть / свистеть / освистывать' },
                                { word: 'mark /mɑːk/ (n)', trans: 'баға / белгі / балл', context: 'оценка / знак / отметка / балл / признак' },
                                { word: 'pickaxe /ˈpɪkæks/ (n)', trans: 'балға шот', context: 'кирка' },
                                { word: 'rope /rəʊp/ (n)', trans: 'арқан', context: 'веревка' },
                            ]
                        },
                        {
                            id: '5c',
                            items: [
                                { word: 'abandoned /əˈbændənd/ (adj)', trans: 'тастанды / тасталған', context: 'заброшенный / покинутый' },
                                { word: 'contemporary /kənˈtempərəri/ (adj)', trans: 'қанаттанда��лар/ қанаттахнган', context: 'удовлетворенный / умиротворенный / довольный' },
                                { word: 'dig /dɪɡ/ (v)', trans: 'қазып алу', context: 'копать' },
                                { word: 'eternal /ɪˈtɜːnl/ (adj)', trans: 'мәңгі', context: 'вечный' },
                                { word: 'feast /fiːst/ (n)', trans: 'мереке', context: 'пир' },
                                { word: 'palace /ˈpæləs/ (n)', trans: 'құдын', context: 'замок' },
                                { word: 'price /praɪs/ (n)', trans: 'баға', context: 'копелек' },
                                { word: 'purse /pɜːs/ (n)', trans: 'сөмке', context: 'сумка' },
                            ]
                        },
                        {
                            id: '5d',
                            items: [
                                { word: 'achieve /əˈtʃiːv/ (v)', trans: 'қол жеткізу', context: 'достигнуть' },
                                { word: 'advice /ədˈvaɪs/ (n)', trans: 'кеңес', context: 'совет' },
                                { word: 'capture /ˈkæptʃə/ (v)', trans: 'алу,алы', context: 'захватывать' },
                                { word: 'conflict /ˈkɒnflɪkt/ (n)', trans: 'соате келу; шатақ шығару', context: 'конфликт' },
                                { word: 'fertile /ˈfɜːtaɪl/ (adj)', trans: 'құнарлы', context: 'плодородный' },
                                { word: 'figure /ˈfɪɡə/ (n)', trans: 'сурет / түрпа', context: 'фигура / личность' },
                                { word: 'goal /ɡəʊl/ (n)', trans: 'мақсат', context: 'цель / гол' },
                                { word: 'justice /ˈdʒʌstɪs/ (n)', trans: 'әділестілік', context: 'правосудие / справедливость' },
                                { word: 'living conditions /ˈlɪvɪŋ kənˈdɪʃənz/ (pl n)', trans: 'өмір сүру жағда��лары', context: 'условия жизни' },
                                { word: 'military theory /ˈmɪlɪtəri ˈθɪəri/ (n)', trans: 'әскери теория', context: 'военная теория' },
                                { word: 'philosopher /fɪˈlɒsəfə/ (n)', trans: 'философ', context: 'философ' },
                                { word: 'respect /rɪˈspekt/ (v)', trans: 'Құрмет', context: 'уважение' },
                                { word: 'society /səˈsaɪəti/ (n)', trans: 'қауымдастық', context: 'общество' },
                                { word: 'soil /sɔɪl/ (n)', trans: 'топырақ', context: 'почва' },
                                { word: 'surround /səˈraʊnd/ (v)', trans: 'қоршау', context: 'окружать' },
                                { word: 'train /treɪn/ (v)', trans: 'пойда', context: 'поезд' },
                                { word: 'wisdom /ˈwɪzdəm/ (n)', trans: 'дана лық', context: 'мудрость' },
                            ]
                        }
                    ]
                },
                {
                    id: 'Module 6',
                    title: 'Traditions & Language',
                    sections: [
                        {
                            id: '6a',
                            items: [
                                { word: 'alien /ˈeɪliən/ (n)', trans: 'шетеедіктеп / бейтаныс', context: 'чужак / иностранец / иноземец / чужеземец' },
                                { word: 'a��uminium foil /ˌæləmɪniəm fɔɪl/ (n)', trans: 'аломниневая фольға', context: 'алюминевая фольга' },
                                { word: 'come alive (phr)', trans: 'гүр', context: 'поцеживайся! Живее! / создание' },
                                { word: 'creature /ˈkriːtʃə/ (n)', trans: 'гужк', context: 'король��вать / одеваться' },
                                { word: 'crowning /ˈkraʊnɪŋ/ (n)', trans: 'кио', context: 'наряжаться / одеваться' },
                                { word: 'dress up /dres ʌp/ (phr v)', trans: 'корме', context: 'выставка' },
                                { word: 'exhibition /ˌekzɪˈbɪʃn/ (n)', trans: 'қалтка / сил', context: 'поплавок / плот' },
                                { word: 'float /fləʊt/ (n)', trans: 'созылути / продолжадысы', context: 'длиться / продолжаться' },
                                { word: 'last /lɑːst/ (v)', trans: 'кәсіпкой', context: 'профессионал' },
                                { word: 'professional /prəˈfeʃənl/ (adj)', trans: 'мүсінді', context: 'скульптор' },
                                { word: 'sculptor /ˈskʌlptə/ (n)', trans: 'тақырып', context: 'тема' },
                                { word: 'theme /θiːm/ (n)', trans: 'тоңна', context: 'тонна' },
                                { word: 'ton /tʌn/ (n)', trans: 'тоңна', context: 'тонна' },
                            ]
                        },
                        {
                            id: '6c',
                            items: [
                                { word: 'ancestor /ˈænsestə/ (n)', trans: 'бабалар', context: 'предок' },
                                { word: 'blessing /ˈblesɪŋ/ (n)', trans: 'бата', context: 'благословение' },
                                { word: 'calendar /ˈkæləndə/ (n)', trans: 'күнтізбе', context: 'календарь' },
                                { word: 'custom /ˈkʌstəm/ (n)', trans: 'әлет-түреш,салт', context: 'традиция' },
                                { word: 'demonstration /ˌdemənˈstreɪʃn/ (n)', trans: 'демонстрация', context: 'демонстрация' },
                                { word: 'equinox /ˈekwɪnɒks/ (n)', trans: 'теңдеу', context: 'равноденствие' },
                                { word: 'forgiveness /fəˈɡɪvnəs/ (n)', trans: 'кепірім', context: 'прощение' },
                                { word: 'fortune /ˈfɔːtʃuː/ (n)', trans: 'сәттілік / байлык / жағдайы', context: 'удача / богатство / состояние' },
                                { word: 'holy /ˈhəʊli/ (adj)', trans: 'қасиеті', context: 'святой' },
                                { word: 'ingredient /ɪnˈɡriːdiənt/ (n)', trans: 'ингредиент', context: 'ингредиент' },
                                { word: 'lifestyle /ˈlaɪfstaɪl/ (n)', trans: 'өмір салты', context: 'образ жизни' },
                                { word: 'prosperity /prɒˈsperəti/ (n)', trans: 'өркендеу', context: 'процветание' },
                                { word: 'virtue /ˈvɜːtʃuː/ (n)', trans: 'бізділь / газалық', context: 'добродетель / чистота' },
                            ]
                        },
                        {
                            id: '6d',
                            items: [
                                { word: 'fussy /ˈfʌsi/ (adj)', trans: 'әңгарлы / сонді', context: 'суетливый / выстурны�� ' },
                                { word: 'hardly /ˈhɑːdli/ (adv)', trans: 'әзер', context: 'едва ли' },
                                { word: 'keen on /kiːn ɒn/ (adj)', trans: 'әуес.берілген', context: 'увлечённый / сосредоточенный' },
                                { word: 'top ten /tɒp ten/ (n)', trans: 'жоғарғы 10', context: 'топ 10' },
                            ]
                        },
                        {
                            id: '6e',
                            items: [
                                { word: 'environmentally-friendly /ɪnˌvaɪrənmentli ˈfrendli/ (adj)', trans: 'экологиялық таза', context: 'экологически чистый' },
                                { word: 'lifetime /ˈlaɪftaɪm/ (n)', trans: 'өмір сүру ұзақтығы', context: 'продолжительность жизни' },
                                { word: 'preserve /prɪˈzɜːv/ (v)', trans: 'преентцию / представление', context: 'презентацию / представление' },
                                { word: 'reduce /rɪˈdjuːs/ (v)', trans: 'ззайту', context: 'уменьшать' },
                                { word: 'waste /weɪst/ (n)', trans: 'қалдктар', context: 'отходы' },
                                { word: 'workshop /ˈwɜːkʃɒp/ (n)', trans: 'шеберхана, семинар', context: 'мастерская/' },
                            ]
                        },
                        {
                            id: '6f',
                            items: [
                                { word: 'battlefield /ˈbætlfiːld/ (n)', trans: 'Жауынге��ойс / шайқас алаңы', context: 'Поле боя / сражения' },
                                { word: 'bugle /ˈbjuːɡl/ (n)', trans: 'стеклярус, керней, сырнай, күйқ', context: 'стеклярус, горн, рожок, труба' },
                                { word: 'fight /faɪt/ (v)', trans: 'күрсу', context: 'сражаться / драться' },
                                { word: 'honour /ˈɒnə/ (n)', trans: 'Құрмет', context: 'часть' },
                                { word: 'memorial /məˈmɔːriəl/ (n)', trans: 'ескерткіш', context: 'мемориал' },
                                { word: 'pin /pɪn/ (v)', trans: 'аринау', context: 'приколоть, колоть' },
                                { word: 'poppy /ˈpɒpi/ (n)', trans: 'мак', context: 'мак' },
                                { word: 'silence /ˈsaɪləns/ (n)', trans: 'тышықтық', context: 'тишина' },
                                { word: 'war /wɔː/ (n)', trans: 'соғыс', context: 'война' },
                            ]
                        }
                    ]
                },
                {
                    id: 'Module 9',
                    title: 'Science & Technology',
                    sections: [
                        {
                            id: '9a',
                            items: [
                                { word: 'allow /əˈlaʊ/ (v)', trans: 'ерік беру; рұқсат ету; ырзалық беру', context: 'позволять' },
                                { word: 'artificial /ˌɑːtɪˈfɪʃl/ (adj)', trans: 'қолдан істелген, жасанды', context: 'искусственный' },
                                { word: 'become a reality (phr)', trans: 'шынайы болу', context: 'стать реальностью' },
                                { word: 'biological /ˌbaɪəˈlɒdʒɪkl/ (adj)', trans: 'биологиялық', context: 'биологический' },
                                { word: 'brain /breɪn/ (n)', trans: 'ми', context: 'мозг' },
                                { word: 'colour blind /ˈkʌlə blaɪnd/ (adj)', trans: 'дальтоник', context: 'дальтоник' },
                                { word: 'develop /dɪˈveləp/ (v)', trans: 'өңдеу', context: 'разработать' },
                                { word: 'gravity /ˈɡrævəti/ (n)', trans: 'ауырлық дәрежесі', context: 'гравитация' },
                                { word: 'illusion /ɪˈluːʒn/ (n)', trans: 'елес', context: 'иллюзия' },
                                { word: 'interactive /ˌɪntərˈæktɪv/ (adj)', trans: 'интерактивті', context: 'интерактивный' },
                                { word: 'introduce /ˌɪntrəˈdjuːs/ (v)', trans: 'енгізу / ұсыну', context: 'ввести / представлять' },
                                { word: 'maze /meɪz/ (n)', trans: 'лабиринт', context: 'лабиринт' },
                                { word: 'on display (phr)', trans: 'дисплейде / дисплейде', context: 'на дисплее / витрине' },
                                { word: 'optical /ˈɒptɪkl/ (adj)', trans: 'оптикалық', context: 'оптический' },
                                { word: 'outermost /ˈaʊtəməʊst/ (adj)', trans: 'сыртқы', context: 'внешний' },
                                { word: 'planetarium /ˌplænəˈteəriəm/ (n)', trans: 'планетарий', context: 'планетарий' },
                                { word: 'rotating /rəʊˈteɪtɪŋ/ (adj)', trans: 'айналдыру', context: 'вращающийся' },
                                { word: 'universe /ˈjuːnɪvɜːs/ (n)', trans: 'бүкіл әлем', context: 'Вселенная' },
                                { word: 'wonder /ˈwʌndə/ (n)', trans: 'ғажайып', context: 'чудо' },
                            ]
                        },
                        {
                            id: '9f',
                            items: [
                                { word: 'circuit board /ˈsɜːkɪt bɔːd/ (n)', trans: 'баспа төлем', context: 'печатная плата' },
                                { word: 'command centre /kəˈmɑːnd ˌsentə/ (n)', trans: 'командалық орталық', context: 'командный центр' },
                                { word: 'generate /ˈdʒenəreɪt/ (v)', trans: 'генерациялау', context: 'генерировать' },
                                { word: 'graphics /ˈɡræfɪks/ (pl n)', trans: 'графика', context: 'графика' },
                                { word: 'interpret /ɪnˈtɜːprɪt/ (v)', trans: 'түсіндіру', context: 'интерпретировать' },
                                { word: 'memory /ˈmeməri/ (n)', trans: 'жады', context: 'память' },
                                { word: 'permanently /ˈpɜːmənəntli/ (adv)', trans: 'тұрақты', context: 'постоянно' },
                                { word: 'port /pɔːt/ (n)', trans: 'айлақ', context: 'порт' },
                                { word: 'software /ˈsɒftweə/ (n)', trans: 'бағдарламалық қамтамасыз ету', context: 'программное обеспечение' },
                            ]
                        }
                    ]
                }
            ],
            rules: [],
            materials: []
        },
        '6': { dictionary: [], rules: [], materials: [] },
        '7': { dictionary: [], rules: [], materials: [] },
        '8': { dictionary: [], rules: [], materials: [] },
    };

    const currentContent = content[selectedGrade as keyof typeof content] || content['5'];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{translations.title[language]}</h1>
                <p className="text-gray-600">{translations.subtitle[language]}</p>
            </motion.div>

            {/* Grade Selection */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                {grades.map((grade) => (
                    <motion.div
                        key={grade}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Card
                            className={`cursor-pointer min-w-[120px] transition-colors ${selectedGrade === grade
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white hover:border-blue-300'
                                }`}
                            onClick={() => setSelectedGrade(grade)}
                        >
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                <GraduationCap className={`size-8 mb-2 ${selectedGrade === grade ? 'text-white' : 'text-blue-600'}`} />
                                <span className="text-2xl font-bold">{grade}</span>
                                <span className="text-xs opacity-80">{translations.grade[language]}</span>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Content Area */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur min-h-[500px]">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl flex items-center gap-3">
                            <Badge variant="outline" className="text-lg py-1 px-3">
                                {selectedGrade}-{translations.grade[language]}
                            </Badge>
                            {language === 'kz' ? 'Оқу материалдары' : 'Учебные материалы'}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="dictionary" className="flex items-center gap-2">
                                <Book className="size-4" />
                                {translations.dictionary[language]}
                            </TabsTrigger>
                            <TabsTrigger value="rules" className="flex items-center gap-2">
                                <FileText className="size-4" />
                                {translations.rules[language]}
                            </TabsTrigger>
                            <TabsTrigger value="materials" className="flex items-center gap-2">
                                <Library className="size-4" />
                                {translations.materials[language]}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="dictionary" className="space-y-4">
                            {currentContent.dictionary.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {currentContent.dictionary.map((module, moduleIdx) => (
                                        <AccordionItem key={moduleIdx} value={`module-${moduleIdx}`} className="border rounded-lg px-4 bg-white shadow-sm">
                                            <AccordionTrigger className="hover:no-underline py-4">
                                                <div className="flex flex-col items-start text-left">
                                                    <span className="font-bold text-lg text-blue-600">{module.id}</span>
                                                    <span className="text-gray-600 font-medium">{module.title}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-4 pb-4">
                                                <div className="space-y-6">
                                                    {module.sections.map((section, sectionIdx) => (
                                                        <div key={sectionIdx} className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary" className="text-sm font-bold bg-blue-100 text-blue-700">
                                                                    {section.id}
                                                                </Badge>
                                                                <div className="h-px bg-gray-200 flex-1"></div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {section.items.map((item, itemIdx) => (
                                                                    <div key={itemIdx} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                                                                        <h4 className="font-bold text-gray-900 mb-1">{item.word}</h4>
                                                                        <p className="text-blue-600 font-medium text-sm">{item.trans}</p>
                                                                        <p className="text-gray-400 text-xs italic">{item.context}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <EmptyState language={language} translations={translations} />
                            )}
                        </TabsContent>

                        <TabsContent value="rules" className="space-y-4">
                            {currentContent.rules.length > 0 ? (
                                <div className="space-y-4">
                                    {currentContent.rules.map((item, idx) => (
                                        <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                                            <CardContent className="p-6 flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                                                    <p className="text-gray-500">{item.desc}</p>
                                                </div>
                                                <ChevronRight className="text-gray-400" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState language={language} translations={translations} />
                            )}
                        </TabsContent>

                        <TabsContent value="materials" className="space-y-4">
                            {currentContent.materials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentContent.materials.map((item, idx) => (
                                        <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer group">
                                            <CardContent className="p-6 flex items-center gap-4">
                                                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                    <Library className="size-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                                    <Badge variant="secondary" className="mt-1">{item.type}</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState language={language} translations={translations} />
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

function EmptyState({ language, translations }: { language: any, translations: any }) {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Lock className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
                {translations.locked[language]}
            </h3>
            <p className="text-gray-500">
                {language === 'kz' ? 'Жақында қосылады...' : 'Скоро будет добавлено...'}
            </p>
        </div>
    );
}
