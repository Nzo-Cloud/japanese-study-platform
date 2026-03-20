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

export type QuizType = 'kanji' | 'grammar' | 'particles' | 'all' | 'exam';
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
  /** Type of content this question tests */
  category: any;
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
  item_type: 'kana' | 'kanji' | 'grammar' | 'particles';
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
  // Settings
  quiz_question_count?: number;
  show_confirmation?: boolean;
}

// ─── Component Prop Types ────────────────────────────────────

export interface QuizConfig {
  quizType: QuizType;
  jlptLevel: JLPTLevel;
  questionCount: number;
  timed: boolean;
  /** Time limit in seconds (only used when timed is true) */
  timeLimit?: number;
  /** Whether to show confirmation after answering (default: true) */
  showConfirmation?: boolean;
}

export interface QuizAnswer {
  questionId: string;
  questionText?: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  itemId: string;
  category: any;
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

// ─── Particle Quiz Types ─────────────────────────────────────

/** A sentence with 1–3 particle blanks for the fill-in-the-blank quiz */
export interface ParticleSentence {
  id: string;
  jlptLevel: 'N5' | 'N4' | 'N3';
  segments: Array<{
    type: 'text' | 'blank';
    /** For 'text': the Japanese text. For 'blank': the correct particle answer. */
    content: string;
  }>;
  /** English translation of the full sentence */
  english: string;
  /** Optional grammar hint shown after answering */
  hint?: string;
}

/** A single answered blank within a particle sentence */
export interface ParticleAnswer {
  sentenceId: string;
  blankIndex: number;
  selectedParticle: string;
  correctParticle: string;
  isCorrect: boolean;
}

// ─── Vocabulary Types ────────────────────────────────────────

/** A single vocabulary word for the flashcard system */
export interface VocabWord {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  exampleJa: string;
  exampleEn: string;
  jlptLevel: 'N5' | 'N4' | 'N3';
  category: string;
}

/** A single flashcard review session entry */
export interface VocabSession {
  wordId: string;
  known: boolean;
  reviewedAt: string;
}

// ─── Exam Types ──────────────────────────────────────────────

export type ExamSection = 'language' | 'reading' | 'listening';
export type ExamStatus = 'lobby' | 'in-progress' | 'break' | 'complete';

export interface ExamSectionConfig {
  section: ExamSection;
  label: string;           // e.g. '言語知識 Language Knowledge'
  labelEn: string;         // e.g. 'Language Knowledge'
  questionCount: number;
  timeLimitMinutes: number;
  quizTypes: QuizType[];   // which quiz types to draw from
}

export interface ExamConfig {
  jlptLevel: JLPTLevel;
  sections: ExamSectionConfig[];
}

export interface ExamResult {
  section: ExamSection;
  score: number;
  total: number;
  accuracy: number;
  passed: boolean;         // >= 50% to pass each section
  timeTakenSeconds: number;
}
