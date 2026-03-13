// ─── Static Data Types ───────────────────────────────────────

/** A single kana character (hiragana or katakana) */
export interface Kana {
  id: string;
  character: string;
  romanization: string;
  type: 'hiragana' | 'katakana';
}

/** A single kanji entry */
export interface Kanji {
  id: string;
  kanji: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  radicals: string[];
  jlptLevel: 'N5' | 'N4' | 'N3';
  exampleWord: string;
  exampleSentence: string;
  translation: string;
}

/** A grammar pattern */
export interface GrammarPattern {
  id: string;
  pattern: string;
  meaning: string;
  example: string;
  translation: string;
  jlptLevel: 'N5' | 'N4' | 'N3';
  notes: string;
}

/** A word within a specific Category */
export interface CategoryWord {
  id: string;
  character: string;
  furiganaHTML: string | null;
  romaji: string;
  meaning: string;
}

/** A Vocabulary Category grouping */
export interface VocabularyCategory {
  id: string;
  titleEn: string;
  titleJp: string;
  words: CategoryWord[];
}

// ─── Quiz Types ──────────────────────────────────────────────

export type QuizType = 'kana' | 'kanji' | 'grammar' | 'mixed' | 'exam';
export type JLPTLevel = 'N5' | 'N4' | 'N3';

/** A single quiz question */
export interface QuizQuestion {
  id: string;
  questionText: string;
  /** The item being quizzed (character, kanji, pattern) */
  displayText: string;
  options: string[];
  correctAnswer: string;
  /** Type of content this question tests */
  category: 'kana' | 'kanji' | 'grammar';
  /** Reference ID to the source data item */
  itemId: string;
}

/** Result from a completed quiz */
export interface QuizResult {
  id: string;
  user_id: string;
  quiz_type: QuizType;
  jlpt_level: JLPTLevel;
  score: number;
  total_questions: number;
  accuracy: number;
  taken_at: string;
}

// ─── SRS Types ───────────────────────────────────────────────

/** Spaced Repetition System item */
export interface SRSItem {
  id: string;
  user_id: string;
  item_type: 'kana' | 'kanji' | 'grammar';
  item_id: string;
  last_reviewed: string;
  next_review: string;
  interval_days: number;
  ease_factor: number;
  correct_streak: number;
}

// ─── User Types ──────────────────────────────────────────────

/** User profile stored in public.users table */
export interface UserProfile {
  id: string;
  username: string;
  jlpt_level: JLPTLevel;
  study_streak: number;
  total_quizzes_taken: number;
  created_at: string;
}

// ─── Component Prop Types ────────────────────────────────────

export interface QuizConfig {
  quizType: QuizType;
  jlptLevel: JLPTLevel;
  questionCount: number;
  timed: boolean;
  /** Time limit in seconds (only used when timed is true) */
  timeLimit?: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  itemId: string;
  category: 'kana' | 'kanji' | 'grammar';
}

/** Dashboard statistics */
export interface DashboardStats {
  totalQuizzes: number;
  averageAccuracy: number;
  studyStreak: number;
  dueReviewCount: number;
  categoryBreakdown: {
    kana: { count: number; avgAccuracy: number };
    kanji: { count: number; avgAccuracy: number };
    grammar: { count: number; avgAccuracy: number };
  };
  recentResults: QuizResult[];
}
