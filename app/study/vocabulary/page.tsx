'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { VocabWord, JLPTLevel } from '@/types';
import Button from '@/components/ui/Button';

import { vocabWords } from '@/data/vocabulary';
import FlashcardEngine from '@/components/study/FlashcardEngine';
/**
 * Vocabulary flashcard lobby — select mode, level, and start a session.
 * Flashcard engine will be wired in Prompt 3.
 */
export default function VocabularyPage() {
  const [mode, setMode] = useState<'jp-en' | 'en-jp'>('jp-en');
  const [level, setLevel] = useState<JLPTLevel>('N5');
  const [started, setStarted] = useState(false);

  const levels: JLPTLevel[] = ['N5', 'N4', 'N3'];

  // Count words for selected level
  const wordCount = useMemo(
    () => vocabWords.filter((w) => w.jlptLevel === level).length,
    [level]
  );

  const [studiedToday, setStudiedToday] = useState(0);
  const [mastered, setMastered] = useState(0);

  useEffect(() => {
    // 1. STUDIED TODAY
    try {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const storedProgress = localStorage.getItem('vocab_daily_progress');
      if (storedProgress) {
        const progress = JSON.parse(storedProgress);
        const todayEntry = progress.find((p: any) => p.date === today);
        setStudiedToday(todayEntry ? todayEntry.known : 0);
      } else {
        setStudiedToday(0);
      }
    } catch {
      setStudiedToday(0);
    }

    // 2. MASTERED
    try {
      const storedMastered = localStorage.getItem('vocab_mastered_' + level);
      if (storedMastered) {
        const masteredArray = JSON.parse(storedMastered);
        setMastered(Array.isArray(masteredArray) ? masteredArray.length : 0);
      } else {
        setMastered(0);
      }
    } catch {
      setMastered(0);
    }
  }, [level]);

  if (started) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FlashcardEngine
          words={vocabWords.filter((w) => w.jlptLevel === level)}
          mode={mode}
          jlptLevel={level}
          onFinish={() => setStarted(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          <span className="font-jp">単語</span> Vocabulary
        </h1>
        <p className="text-muted">JLPT N5–N3 word lists with spaced repetition</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-8 space-y-8 animate-fade-in">
        {/* Mode Switcher */}
        <div>
          <h2 className="font-semibold mb-4">Card Mode</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('jp-en')}
              className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                mode === 'jp-en'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="text-lg font-bold font-jp mb-1">日→英</div>
              <div className="text-sm font-medium">JP → EN</div>
            </button>
            <button
              onClick={() => setMode('en-jp')}
              className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                mode === 'en-jp'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="text-lg font-bold font-jp mb-1">英→日</div>
              <div className="text-sm font-medium">EN → JP</div>
            </button>
          </div>
        </div>

        {/* JLPT Level */}
        <div>
          <h2 className="font-semibold mb-4">JLPT Level</h2>
          <div className="flex gap-3">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 py-3 rounded-xl border-2 font-bold text-lg transition-all cursor-pointer ${
                  level === l
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-alt rounded-xl p-4 text-center">
            <div className="text-primary text-2xl font-bold">{wordCount}</div>
            <div className="text-xs text-muted mt-1">Total Words</div>
          </div>
          <div className="bg-surface-alt rounded-xl p-4 text-center">
            <div className="text-primary text-2xl font-bold">{studiedToday}</div>
            <div className="text-xs text-muted mt-1">Studied Today</div>
          </div>
          <div className="bg-surface-alt rounded-xl p-4 text-center">
            <div className="text-primary text-2xl font-bold">{mastered}</div>
            <div className="text-xs text-muted mt-1">Mastered</div>
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={() => setStarted(true)}
          size="lg"
          className="w-full"
        >
          Start Flashcards →
        </Button>

        <p className="text-xs text-muted text-center">
          Cards are shown using spaced repetition — words you struggle with appear more often.
        </p>
      </div>
    </div>
  );
}
