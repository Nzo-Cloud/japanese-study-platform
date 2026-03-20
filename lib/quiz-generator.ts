/**
 * Quiz Generator — builds randomized multiple-choice quizzes
 * from kana, kanji, and grammar datasets.
 */

import { Kanji, GrammarPattern, QuizQuestion, QuizType, JLPTLevel, ParticleSentence } from '@/types';
import { shuffleArray, pickRandom, generateId } from './utils';

// ─── Data imports ────────────────────────────────────────────

import kanjiData from '@/data/kanji.json';
import grammarData from '@/data/grammar.json';
import { particleSentences } from '@/data/particles';

const allKanji: Kanji[] = kanjiData as Kanji[];
const allGrammar: GrammarPattern[] = grammarData as GrammarPattern[];

// ─── Question Generators ─────────────────────────────────────

/**
 * Generate a particle fill-in-the-blank question.
 */
function generateParticleQuestion(pool: ParticleSentence[]): QuizQuestion | null {
  if (pool.length === 0) return null;
  const sentence = pool[Math.floor(Math.random() * pool.length)];

  const blanks = sentence.segments.map((s, i) => ({ s, i })).filter(item => item.s.type === 'blank');
  if (blanks.length === 0) return null;

  const targetBlankInfo = blanks[Math.floor(Math.random() * blanks.length)];
  const correctParticle = targetBlankInfo.s.content;

  const questionText = sentence.segments.map((s, i) => {
    if (i === targetBlankInfo.i) return '___';
    return s.content;
  }).join('');

  const distractorsPool = ['は','を','に','が','も','で','へ','と','から','まで','より','けど','ので','のに'].filter(p => p !== correctParticle);
  const wrongOptions = pickRandom(distractorsPool, 3);
  const options = shuffleArray([correctParticle, ...wrongOptions]);

  return {
    id: generateId(),
    questionText: `Which particle fits the blank?`,
    displayText: questionText,
    options,
    correctAnswer: correctParticle,
    category: 'particles',
    itemId: sentence.id,
  };
}

/**
 * Generate a kanji quiz question: "What does [kanji] mean?"
 * User picks from 4 meaning options.
 */
function generateKanjiQuestion(pool: Kanji[]): QuizQuestion | null {
  if (pool.length < 4) return null;

  const target = pool[Math.floor(Math.random() * pool.length)];

  const wrongOptions = pickRandom(
    pool.filter((k) => k.id !== target.id),
    3
  ).map((k) => k.meaning);

  const options = shuffleArray([target.meaning, ...wrongOptions]);

  return {
    id: generateId(),
    questionText: `What does this kanji mean?`,
    displayText: target.kanji,
    options,
    correctAnswer: target.meaning,
    category: 'kanji',
    itemId: target.id,
  };
}

/**
 * Generate a grammar quiz question: "What does [pattern] mean?"
 * User picks from 4 meaning options.
 */
function generateGrammarQuestion(pool: GrammarPattern[]): QuizQuestion | null {
  if (pool.length < 4) return null;

  const target = pool[Math.floor(Math.random() * pool.length)];

  const wrongOptions = pickRandom(
    pool.filter((g) => g.id !== target.id),
    3
  ).map((g) => g.meaning);

  const options = shuffleArray([target.meaning, ...wrongOptions]);

  return {
    id: generateId(),
    questionText: `What does this grammar pattern mean?`,
    displayText: target.pattern,
    options,
    correctAnswer: target.meaning,
    category: 'grammar',
    itemId: target.id,
  };
}

// ─── Quiz Builder ────────────────────────────────────────────

/**
 * Generate a complete quiz with the specified parameters.
 * @param quizType - Type of quiz (kana, kanji, grammar, mixed, exam)
 * @param jlptLevel - JLPT level to filter content
 * @param questionCount - Number of questions to generate
 * @returns Array of quiz questions
 */
export function generateQuiz(
  quizType: QuizType,
  jlptLevel: JLPTLevel,
  questionCount: number = 10
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Filter data by JLPT level
  const filteredKanji = allKanji.filter((k) => k.jlptLevel === jlptLevel);
  const filteredGrammar = allGrammar.filter((g) => g.jlptLevel === jlptLevel);
  const filteredParticles = particleSentences.filter((p) => p.jlptLevel === jlptLevel);

  // Determine which generators to use based on quiz type
  const generators: (() => QuizQuestion | null)[] = [];

  switch (quizType) {
    case 'kanji':
      generators.push(() => generateKanjiQuestion(filteredKanji.length >= 4 ? filteredKanji : allKanji));
      break;
    case 'grammar':
      generators.push(() => generateGrammarQuestion(filteredGrammar.length >= 4 ? filteredGrammar : allGrammar));
      break;
    case 'particles':
      generators.push(() => generateParticleQuestion(filteredParticles.length > 0 ? filteredParticles : particleSentences));
      break;
    case 'all':
    case 'exam':
      // Mix kanji, grammar, and particles
      generators.push(
        () => generateKanjiQuestion(filteredKanji.length >= 4 ? filteredKanji : allKanji),
        () => generateGrammarQuestion(filteredGrammar.length >= 4 ? filteredGrammar : allGrammar),
        () => generateParticleQuestion(filteredParticles.length > 0 ? filteredParticles : particleSentences)
      );
      break;
  }

  // Generate questions
  let attempts = 0;
  const maxAttempts = questionCount * 5; // Prevent infinite loops

  while (questions.length < questionCount && attempts < maxAttempts) {
    const generator = generators[Math.floor(Math.random() * generators.length)];
    const question = generator();

    if (question) {
      // Avoid duplicate questions
      const isDuplicate = questions.some(
        (q) => q.displayText === question.displayText && q.questionText === question.questionText
      );
      if (!isDuplicate) {
        questions.push(question);
      }
    }
    attempts++;
  }

  return shuffleArray(questions);
}

/**
 * Generate a quiz from specific SRS items (for review sessions).
 */
export function generateSRSQuiz(
  itemIds: { type: 'kana' | 'kanji' | 'grammar' | 'particles'; id: string }[]
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const item of itemIds) {
    let question: QuizQuestion | null = null;

    switch (item.type) {
      case 'particles': {
        const pItem = particleSentences.find((p) => p.id === item.id);
        if (pItem) {
          question = generateParticleQuestion([pItem]);
        }
        break;
      }
      case 'kanji': {
        const kanjiItem = allKanji.find((k) => k.id === item.id);
        if (kanjiItem) {
          const wrongOptions = pickRandom(
            allKanji.filter((k) => k.id !== kanjiItem.id),
            3
          ).map((k) => k.meaning);
          question = {
            id: generateId(),
            questionText: 'What does this kanji mean?',
            displayText: kanjiItem.kanji,
            options: shuffleArray([kanjiItem.meaning, ...wrongOptions]),
            correctAnswer: kanjiItem.meaning,
            category: 'kanji',
            itemId: kanjiItem.id,
          };
        }
        break;
      }
      case 'grammar': {
        const grammarItem = allGrammar.find((g) => g.id === item.id);
        if (grammarItem) {
          const wrongOptions = pickRandom(
            allGrammar.filter((g) => g.id !== grammarItem.id),
            3
          ).map((g) => g.meaning);
          question = {
            id: generateId(),
            questionText: 'What does this grammar pattern mean?',
            displayText: grammarItem.pattern,
            options: shuffleArray([grammarItem.meaning, ...wrongOptions]),
            correctAnswer: grammarItem.meaning,
            category: 'grammar',
            itemId: grammarItem.id,
          };
        }
        break;
      }
    }

    if (question) {
      questions.push(question);
    }
  }

  return shuffleArray(questions);
}
