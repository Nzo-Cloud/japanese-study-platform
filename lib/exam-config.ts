import { ExamConfig } from '@/types';

export const examConfigs: Record<string, ExamConfig> = {
  N5: {
    jlptLevel: 'N5',
    sections: [
      {
        section: 'language',
        label: '言語知識',
        labelEn: 'Language Knowledge (Vocabulary & Kanji)',
        questionCount: 20,
        timeLimitMinutes: 25,
        quizTypes: ['kanji'],
      },
      {
        section: 'reading',
        label: '読解',
        labelEn: 'Grammar & Reading',
        questionCount: 10,
        timeLimitMinutes: 50,
        quizTypes: ['grammar', 'particles'],
      },
      {
        section: 'listening',
        label: '聴解',
        labelEn: 'Listening (Coming Soon)',
        questionCount: 0,
        timeLimitMinutes: 30,
        quizTypes: [],
      },
    ],
  },
  N4: {
    jlptLevel: 'N4',
    sections: [
      {
        section: 'language',
        label: '言語知識',
        labelEn: 'Language Knowledge (Vocabulary & Kanji)',
        questionCount: 25,
        timeLimitMinutes: 30,
        quizTypes: ['kanji'],
      },
      {
        section: 'reading',
        label: '読解',
        labelEn: 'Grammar & Reading',
        questionCount: 15,
        timeLimitMinutes: 60,
        quizTypes: ['grammar', 'particles'],
      },
      {
        section: 'listening',
        label: '聴解',
        labelEn: 'Listening (Coming Soon)',
        questionCount: 0,
        timeLimitMinutes: 35,
        quizTypes: [],
      },
    ],
  },
  N3: {
    jlptLevel: 'N3',
    sections: [
      {
        section: 'language',
        label: '言語知識',
        labelEn: 'Language Knowledge (Vocabulary & Kanji)',
        questionCount: 30,
        timeLimitMinutes: 30,
        quizTypes: ['kanji'],
      },
      {
        section: 'reading',
        label: '読解',
        labelEn: 'Grammar & Reading',
        questionCount: 20,
        timeLimitMinutes: 40,
        quizTypes: ['grammar', 'particles'],
      },
      {
        section: 'listening',
        label: '聴解',
        labelEn: 'Listening (Coming Soon)',
        questionCount: 0,
        timeLimitMinutes: 40,
        quizTypes: [],
      },
    ],
  },
};
