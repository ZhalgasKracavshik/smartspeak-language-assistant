import { Star, Zap, BookOpen, Mic, MessageSquare, Award, Calendar } from 'lucide-react';

export interface Achievement {
    id: number;
    titleKz: string;
    titleRu: string;
    descriptionKz: string;
    descriptionRu: string;
    icon: any;
    unlocked: boolean;
    color: string;
}

export const achievements: Achievement[] = [
    {
        id: 1,
        titleKz: 'Бірінші қадам',
        titleRu: 'Первый шаг',
        descriptionKz: '10 сөз үйрендіңіз',
        descriptionRu: 'Вы выучили 10 слов',
        icon: Star,
        unlocked: true,
        color: 'from-yellow-400 to-orange-500'
    },
    {
        id: 2,
        titleKz: '7 күндік серия',
        titleRu: 'Серия 7 дней',
        descriptionKz: '7 күн қатарынан оқыдыңыз',
        descriptionRu: 'Вы учились 7 дней подряд',
        icon: Zap,
        unlocked: true,
        color: 'from-purple-400 to-pink-500'
    },
    {
        id: 3,
        titleKz: 'Сөз шебері',
        titleRu: 'Мастер слов',
        descriptionKz: '100 сөз үйрендіңіз',
        descriptionRu: 'Вы выучили 100 слов',
        icon: BookOpen,
        unlocked: true,
        color: 'from-blue-400 to-cyan-500'
    },
    {
        id: 4,
        titleKz: 'Сөйлеу шебері',
        titleRu: 'Мастер речи',
        descriptionKz: '50 айтылым жаттығуын өттіңіз',
        descriptionRu: 'Вы прошли 50 упражнений на говорение',
        icon: Mic,
        unlocked: false,
        color: 'from-green-400 to-emerald-500'
    },
    {
        id: 5,
        titleKz: 'Диалог шебері',
        titleRu: 'Мастер диалога',
        descriptionKz: '20 диалог өттіңіз',
        descriptionRu: 'Вы прошли 20 диалогов',
        icon: MessageSquare,
        unlocked: false,
        color: 'from-red-400 to-rose-500'
    },
    {
        id: 6,
        titleKz: 'Жетістік шыңы',
        titleRu: 'Вершина успеха',
        descriptionKz: '500 сөз үйрендіңіз',
        descriptionRu: 'Вы выучили 500 слов',
        icon: Award,
        unlocked: false,
        color: 'from-indigo-400 to-purple-500'
    },
];

export interface Goal {
    titleKz: string;
    titleRu: string;
    current: number;
    target: number;
    icon: any;
}

export const monthlyGoals: Goal[] = [
    {
        titleKz: '300 жаңа сөз үйрену',
        titleRu: 'Выучить 300 новых слов',
        current: 245,
        target: 300,
        icon: BookOpen
    },
    {
        titleKz: '50 диалог өту',
        titleRu: 'Пройти 50 диалогов',
        current: 32,
        target: 50,
        icon: MessageSquare
    },
    {
        titleKz: '100 айтылым жаттығу',
        titleRu: '100 упражнений на говорение',
        current: 68,
        target: 100,
        icon: Mic
    },
    {
        titleKz: '30 күн оқу',
        titleRu: 'Учиться 30 дней',
        current: 18,
        target: 30,
        icon: Calendar
    },
];
