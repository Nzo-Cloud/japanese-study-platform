/**
 * SRS Engine — Spaced Repetition System
 *
 * Implements an SM-2-inspired algorithm:
 *   Correct → interval = interval * ease_factor, ease_factor += 0.1
 *   Wrong   → interval = 1, ease_factor = max(1.3, ease_factor - 0.2)
 *   next_review = today + interval days
 */

import { SRSItem } from '@/types';
import { addDays } from './utils';

// ─── SRS Constants ───────────────────────────────────────────

const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 5.0;
const EASE_CORRECT_BONUS = 0.1;
const EASE_WRONG_PENALTY = 0.2;
const DEFAULT_INTERVAL = 1;
const DEFAULT_EASE_FACTOR = 2.5;

// ─── Core Algorithm ──────────────────────────────────────────

export interface SRSUpdate {
  interval_days: number;
  ease_factor: number;
  correct_streak: number;
  next_review: string;
  last_reviewed: string;
}

/**
 * Calculate the next SRS state after answering an item.
 * @param item - The current SRS item state
 * @param isCorrect - Whether the user answered correctly
 * @returns Updated SRS fields
 */
export function calculateSRSUpdate(
  item: Pick<SRSItem, 'interval_days' | 'ease_factor' | 'correct_streak'>,
  isCorrect: boolean
): SRSUpdate {
  const now = new Date();
  let { interval_days, ease_factor, correct_streak } = item;

  if (isCorrect) {
    // Correct: increase interval and ease factor
    interval_days = Math.round(interval_days * ease_factor);
    ease_factor = Math.min(MAX_EASE_FACTOR, ease_factor + EASE_CORRECT_BONUS);
    correct_streak += 1;
  } else {
    // Wrong: reset interval, decrease ease factor
    interval_days = DEFAULT_INTERVAL;
    ease_factor = Math.max(MIN_EASE_FACTOR, ease_factor - EASE_WRONG_PENALTY);
    correct_streak = 0;
  }

  return {
    interval_days,
    ease_factor: Math.round(ease_factor * 100) / 100, // 2 decimal places
    correct_streak,
    next_review: addDays(now, interval_days),
    last_reviewed: now.toISOString(),
  };
}

/**
 * Create a new SRS item with default values.
 */
export function createDefaultSRSItem(
  userId: string,
  itemType: 'kana' | 'kanji' | 'grammar',
  itemId: string
): Omit<SRSItem, 'id'> {
  const now = new Date();
  return {
    user_id: userId,
    item_type: itemType,
    item_id: itemId,
    last_reviewed: now.toISOString(),
    next_review: now.toISOString(), // Due immediately
    interval_days: DEFAULT_INTERVAL,
    ease_factor: DEFAULT_EASE_FACTOR,
    correct_streak: 0,
  };
}

/**
 * Check if an SRS item is due for review.
 */
export function isDueForReview(item: Pick<SRSItem, 'next_review'>): boolean {
  const now = new Date();
  const nextReview = new Date(item.next_review);
  return nextReview <= now;
}

/**
 * Sort SRS items by urgency (most overdue first).
 */
export function sortByUrgency<T extends Pick<SRSItem, 'next_review'>>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(a.next_review).getTime() - new Date(b.next_review).getTime()
  );
}
