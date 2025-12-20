export interface MedicalTerm {
    id: string;
    term: string;
    definition: string;
    category: 'Anatomy' | 'Physiology' | 'Pharmacology' | 'Clinical' | 'Biology' | 'Cardiology' | 'Neurology' | 'Diseases';
    latin?: string;
    example: string;
}

export const MEDICAL_TERMS: MedicalTerm[] = [
    // Anatomy
    {
        id: '1',
        term: 'Femur',
        definition: 'The bone of the thigh or upper hind limb, articulating at the hip and the knee.',
        category: 'Anatomy',
        latin: 'Os femoris',
        example: 'The femur is the longest and strongest bone in the human body.'
    },
    {
        id: '2',
        term: 'Cerebellum',
        definition: 'The part of the brain at the back of the skull that coordinates and regulates muscular activity.',
        category: 'Anatomy',
        latin: 'Cerebellum',
        example: 'Damage to the cerebellum can affect balance and coordination.'
    },
    {
        id: '3',
        term: 'Vertebrae',
        definition: 'Each of the bones forming the spinal column.',
        category: 'Anatomy',
        latin: 'Vertebrae',
        example: 'The human spine consists of 33 vertebrae.'
    },

    // Physiology
    {
        id: '4',
        term: 'Homeostasis',
        definition: 'The tendency toward a relatively stable equilibrium between interdependent elements.',
        category: 'Physiology',
        example: 'The body maintains homeostasis through various feedback loops.'
    },
    {
        id: '5',
        term: 'Metabolism',
        definition: 'The chemical processes that occur within a living organism to maintain life.',
        category: 'Physiology',
        example: 'Exercise increases your metabolic rate.'
    },
    {
        id: '6',
        term: 'Respiration',
        definition: 'The process of taking in oxygen and releasing carbon dioxide.',
        category: 'Physiology',
        latin: 'Respiratio',
        example: 'Cellular respiration produces energy for the body.'
    },

    // Clinical
    {
        id: '7',
        term: 'Myocardial Infarction',
        definition: 'A blockage of blood flow to the heart muscle (heart attack).',
        category: 'Clinical',
        latin: 'Infarctus myocardii',
        example: 'The patient was admitted with signs of acute myocardial infarction.'
    },
    {
        id: '8',
        term: 'Hypertension',
        definition: 'Abnormally high blood pressure.',
        category: 'Clinical',
        latin: 'Hypertensio arterialis',
        example: 'Chronic hypertension is a major risk factor for stroke.'
    },
    {
        id: '9',
        term: 'Fracture',
        definition: 'A break in a bone or cartilage.',
        category: 'Clinical',
        latin: 'Fractura',
        example: 'The X-ray revealed a compound fracture of the tibia.'
    },

    // Biology
    {
        id: '10',
        term: 'Mitochondria',
        definition: 'Membrane-bound cell organelles that generate most of the chemical energy.',
        category: 'Biology',
        example: 'Mitochondria are often referred to as the powerhouse of the cell.'
    },
    {
        id: '11',
        term: 'Chromosome',
        definition: 'A threadlike structure of nucleic acids and protein found in the nucleus of cells.',
        category: 'Biology',
        example: 'Humans have 46 chromosomes in each cell.'
    },
    {
        id: '12',
        term: 'Enzyme',
        definition: 'A substance produced by a living organism which acts as a catalyst.',
        category: 'Biology',
        example: 'Digestive enzymes break down food molecules.'
    },

    // Pharmacology
    {
        id: '13',
        term: 'Antibiotic',
        definition: 'A medicine that inhibits the growth of or destroys microorganisms.',
        category: 'Pharmacology',
        example: 'The doctor prescribed a broad-spectrum antibiotic for the infection.'
    },
    {
        id: '14',
        term: 'Analgesic',
        definition: 'A drug that relieves pain.',
        category: 'Pharmacology',
        example: 'Ibuprofen is a common over-the-counter analgesic.'
    },
    {
        id: '15',
        term: 'Vaccine',
        definition: 'A biological preparation that provides immunity to a particular disease.',
        category: 'Pharmacology',
        example: 'The COVID-19 vaccine has saved millions of lives.'
    },

    // Cardiology
    {
        id: '16',
        term: 'Arrhythmia',
        definition: 'An irregular heartbeat.',
        category: 'Cardiology',
        example: 'Atrial fibrillation is a common type of arrhythmia.'
    },
    {
        id: '17',
        term: 'Atherosclerosis',
        definition: 'The buildup of fats and cholesterol in artery walls.',
        category: 'Cardiology',
        example: 'Atherosclerosis can lead to heart attacks and strokes.'
    },
    {
        id: '18',
        term: 'Cardiac Arrest',
        definition: 'Sudden loss of heart function.',
        category: 'Cardiology',
        example: 'Immediate CPR is crucial during cardiac arrest.'
    },

    // Neurology
    {
        id: '19',
        term: 'Stroke',
        definition: 'Interruption of blood supply to the brain.',
        category: 'Neurology',
        latin: 'Apoplexia cerebri',
        example: 'Quick treatment is essential when someone has a stroke.'
    },
    {
        id: '20',
        term: 'Epilepsy',
        definition: 'A neurological disorder marked by sudden recurrent seizures.',
        category: 'Neurology',
        example: 'Epilepsy can often be controlled with medication.'
    },
    {
        id: '21',
        term: 'Neuron',
        definition: 'A specialized cell transmitting nerve impulses.',
        category: 'Neurology',
        example: 'The human brain contains approximately 86 billion neurons.'
    },

    // Additional terms
    {
        id: '22',
        term: 'Diabetes',
        definition: 'A metabolic disease causing high blood sugar.',
        category: 'Clinical',
        example: 'Type 2 diabetes can often be managed through diet and exercise.'
    },
    {
        id: '23',
        term: 'Immunity',
        definition: 'The ability of an organism to resist infection.',
        category: 'Biology',
        example: 'Vaccines help build immunity against diseases.'
    },
    {
        id: '24',
        term: 'Inflammation',
        definition: 'A localized physical condition with heat, swelling, and pain.',
        category: 'Physiology',
        latin: 'Inflammatio',
        example: 'Inflammation is the body\'s response to injury or infection.'
    },
    {
        id: '25',
        term: 'Pneumonia',
        definition: 'Inflammation of the lungs caused by bacterial or viral infection.',
        category: 'Clinical',
        example: 'Pneumonia can be life-threatening in elderly patients.'
    }
];
