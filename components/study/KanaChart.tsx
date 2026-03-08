'use client';

import React, { useState } from 'react';
import { Kana } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { shuffleArray, pickRandom } from '@/lib/utils';

interface KanaChartProps {
  data: Kana[];
  type: 'hiragana' | 'katakana';
}

// Kana grid layout: consonant rows × vowel columns
const VOWELS = ['a', 'i', 'u', 'e', 'o'];
const CONSONANT_PREFIXES = ['', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'];

// Map romanizations to their row/column position
function getGridPosition(romanization: string): { row: number; col: number } | null {
  // Special cases
  if (romanization === 'n') return { row: 10, col: 0 };
  if (romanization === 'shi') return { row: 2, col: 1 };
  if (romanization === 'chi') return { row: 3, col: 1 };
  if (romanization === 'tsu') return { row: 3, col: 2 };
  if (romanization === 'fu') return { row: 5, col: 2 };
  if (romanization === 'wo') return { row: 9, col: 4 };

  const vowelIndex = VOWELS.indexOf(romanization);
  if (vowelIndex !== -1) return { row: 0, col: vowelIndex };

  for (let i = 1; i < CONSONANT_PREFIXES.length; i++) {
    const prefix = CONSONANT_PREFIXES[i];
    const vowel = romanization.replace(prefix, '');
    if (romanization.startsWith(prefix) && VOWELS.includes(vowel)) {
      return { row: i, col: VOWELS.indexOf(vowel) };
    }
  }
  return null;
}

/**
 * Interactive Kana chart with grid layout and mini quiz mode.
 */
export default function KanaChart({ data, type }: KanaChartProps) {
  const [selectedKana, setSelectedKana] = useState<Kana | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState<Kana | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  // Build grid data structure
  const ROW_LABELS = ['', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W', 'N'];
  const grid: (Kana | null)[][] = Array.from({ length: 11 }, () =>
    Array.from({ length: 5 }, () => null)
  );

  data.forEach((kana) => {
    const pos = getGridPosition(kana.romanization);
    if (pos) grid[pos.row][pos.col] = kana;
  });

  // Start a new quiz question
  const nextQuizQuestion = () => {
    const target = data[Math.floor(Math.random() * data.length)];
    const wrong = pickRandom(
      data.filter((k) => k.id !== target.id),
      3
    );
    setQuizQuestion(target);
    setQuizOptions(shuffleArray([target.character, ...wrong.map((k) => k.character)]));
    setQuizAnswer(null);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setQuizScore({ correct: 0, total: 0 });
    nextQuizQuestion();
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizAnswer) return; // Already answered
    setQuizAnswer(answer);
    const isCorrect = answer === quizQuestion?.character;
    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const title = type === 'hiragana' ? 'ひらがな Hiragana' : 'カタカナ Katakana';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted mt-1">Click any character to learn more</p>
        </div>
        <Button
          onClick={quizMode ? () => setQuizMode(false) : startQuiz}
          variant={quizMode ? 'outline' : 'primary'}
        >
          {quizMode ? '← Back to Chart' : '🎯 Mini Quiz'}
        </Button>
      </div>

      {/* Quiz Mode */}
      {quizMode && quizQuestion ? (
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="bg-surface rounded-2xl border border-border p-8 mb-6">
            <p className="text-sm text-muted mb-2">What is the {type} for:</p>
            <p className="text-3xl font-bold text-primary mb-1">{quizQuestion.romanization}</p>
            <p className="text-xs text-muted">
              Score: {quizScore.correct}/{quizScore.total}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {quizOptions.map((option, i) => {
              let style = 'bg-surface border-border hover:border-primary/50';
              if (quizAnswer) {
                if (option === quizQuestion.character) {
                  style = 'bg-success/10 border-success text-success';
                } else if (option === quizAnswer && option !== quizQuestion.character) {
                  style = 'bg-danger/10 border-danger text-danger';
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(option)}
                  disabled={quizAnswer !== null}
                  className={`font-jp text-3xl py-6 rounded-xl border-2 transition-all cursor-pointer disabled:cursor-default ${style}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {quizAnswer && (
            <Button onClick={nextQuizQuestion} variant="primary" size="lg">
              Next Question →
            </Button>
          )}
        </div>
      ) : (
        /* Chart Grid */
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs text-muted w-10"></th>
                {VOWELS.map((v) => (
                  <th key={v} className="p-2 text-sm font-semibold text-primary uppercase">
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, ri) => (
                <tr key={ri}>
                  <td className="p-2 text-xs font-semibold text-muted text-center">
                    {ROW_LABELS[ri]}
                  </td>
                  {row.map((kana, ci) => (
                    <td key={ci} className="p-1">
                      {kana ? (
                        <button
                          onClick={() => setSelectedKana(kana)}
                          className="w-full aspect-square flex flex-col items-center justify-center rounded-xl bg-surface border border-border hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                        >
                          <span className="font-jp text-2xl sm:text-3xl group-hover:text-primary transition-colors">
                            {kana.character}
                          </span>
                          <span className="text-[10px] text-muted mt-0.5">
                            {kana.romanization}
                          </span>
                        </button>
                      ) : (
                        <div className="w-full aspect-square rounded-xl bg-surface-alt/50" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Character Detail Modal */}
      <Modal
        isOpen={!!selectedKana}
        onClose={() => setSelectedKana(null)}
        title={`${type === 'hiragana' ? 'Hiragana' : 'Katakana'} Character`}
      >
        {selectedKana && (
          <div className="text-center">
            <div className="font-jp text-8xl mb-4 text-primary">{selectedKana.character}</div>
            <div className="text-2xl font-bold mb-2">{selectedKana.romanization}</div>
            <div className="text-sm text-muted">
              🔊 Pronunciation: <span className="font-semibold">{selectedKana.romanization}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
