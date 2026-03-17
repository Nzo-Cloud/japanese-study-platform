/**
 * Quiz Generator — builds randomized multiple-choice quizzes
 * from kana, kanji, and grammar datasets.
 */

import { Kana, Kanji, GrammarPattern, QuizQuestion, QuizType, JLPTLevel } from '@/types';
import { shuffleArray, pickRandom, generateId } from './utils';

// ─── Data imports ────────────────────────────────────────────

import hiraganaData from '@/data/hiragana.json';
import katakanaData from '@/data/katakana.json';
import kanjiData from '@/data/kanji.json';
import grammarData from '@/data/grammar.json';
import { hiraganaDakutenData, katakanaDakutenData } from '@/data/kana_dakuten';

const hiragana: Kana[] = hiraganaData as Kana[];
const katakana: Kana[] = katakanaData as Kana[];

// Extract Dakuten characters from grouped data
const hDakutenAll: Kana[] = hiraganaDakutenData.flatMap(g => 
  g.pairs.map(p => ({
    id: `hd-${p.voiced.character}`,
    character: p.voiced.character,
    romanization: p.voiced.romanization,
    type: 'hiragana' as const
  }))
);

const kDakutenAll: Kana[] = katakanaDakutenData.flatMap(g => 
  g.pairs.map(p => ({
    id: `kd-${p.voiced.character}`,
    character: p.voiced.character,
    romanization: p.voiced.romanization,
    type: 'katakana' as const
  }))
);

const allKana: Kana[] = [...hiragana, ...katakana, ...hDakutenAll, ...kDakutenAll];
const allKanji: Kanji[] = kanjiData as Kanji[];
const allGrammar: GrammarPattern[] = grammarData as GrammarPattern[];

// ─── Question Generators ─────────────────────────────────────

/**
 * Generate a kana quiz question: "What is the romanization of [character]?"
 * User picks from 4 romanization options.
 */
function generateKanaQuestion(pool: Kana[]): QuizQuestion | null {
  if (pool.length < 4) return null;

  const target = pool[Math.floor(Math.random() * pool.length)];

  // Pick 3 wrong answers from the pool
  const wrongOptions = pickRandom(
    pool.filter((k) => k.id !== target.id),
    3
  ).map((k) => k.romanization);

  const options = shuffleArray([target.romanization, ...wrongOptions]);

  return {
    id: generateId(),
    questionText: `What is the romanization of this character?`,
    displayText: target.character,
    options,
    correctAnswer: target.romanization,
    category: 'kana',
    itemId: `${target.type}-${target.id}`,
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

  // Determine which generators to use based on quiz type
  const generators: (() => QuizQuestion | null)[] = [];

  switch (quizType) {
    case 'kana':
      generators.push(() => generateKanaQuestion(allKana));
      break;
    case 'kanji':
      generators.push(() => generateKanjiQuestion(filteredKanji.length >= 4 ? filteredKanji : allKanji));
      break;
    case 'grammar':
      generators.push(() => generateGrammarQuestion(filteredGrammar.length >= 4 ? filteredGrammar : allGrammar));
      break;
    case 'mixed':
    case 'exam':
      // Mix all types for mixed/exam quizzes
      generators.push(
        () => generateKanaQuestion(allKana),
        () => generateKanjiQuestion(filteredKanji.length >= 4 ? filteredKanji : allKanji),
        () => generateGrammarQuestion(filteredGrammar.length >= 4 ? filteredGrammar : allGrammar)
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
  itemIds: { type: 'kana' | 'kanji' | 'grammar'; id: string }[]
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const item of itemIds) {
    let question: QuizQuestion | null = null;

    switch (item.type) {
      case 'kana': {
        const kanaItem = allKana.find(
          (k) => `${k.type}-${k.id}` === item.id || k.id === item.id
        );
        if (kanaItem) {
          question = generateKanaQuestion(allKana);
          if (question) {
            // Override to use the specific item
            question.displayText = kanaItem.character;
            question.correctAnswer = kanaItem.romanization;
            question.itemId = `${kanaItem.type}-${kanaItem.id}`;
            // Rebuild options with correct answer
            const wrongOptions = pickRandom(
              allKana.filter((k) => k.id !== kanaItem.id),
              3
            ).map((k) => k.romanization);
            question.options = shuffleArray([kanaItem.romanization, ...wrongOptions]);
          }
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
