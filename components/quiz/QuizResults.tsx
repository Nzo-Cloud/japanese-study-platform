'use client';

import React from 'react';
import { QuizAnswer } from '@/types';
import Button from '@/components/ui/Button';
import { calculateAccuracy } from '@/lib/utils';

interface QuizResultsProps {
  answers: QuizAnswer[];
  quizType: string;
  onRetry: () => void;
  onHome: () => void;
}

/**
 * Quiz results screen with score summary and per-question breakdown.
 */
export default function QuizResults({ answers, quizType, onRetry, onHome }: QuizResultsProps) {
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const accuracy = calculateAccuracy(correct, total);

  // Score message based on accuracy
  const getMessage = () => {
    if (accuracy >= 90) return { text: '素晴らしい! Excellent!', emoji: '🎉' };
    if (accuracy >= 70) return { text: 'よくできました! Well done!', emoji: '👏' };
    if (accuracy >= 50) return { text: 'まあまあです! Not bad!', emoji: '💪' };
    return { text: 'もっと頑張りましょう! Keep studying!', emoji: '📚' };
  };

  const message = getMessage();

  // Score ring color
  const ringColor =
    accuracy >= 70 ? 'text-success' : accuracy >= 50 ? 'text-accent' : 'text-danger';

  // SVG ring
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Score Card */}
      <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-8">
        <p className="text-4xl mb-4">{message.emoji}</p>
        <h2 className="text-2xl font-bold mb-2">{message.text}</h2>
        <p className="text-muted mb-8 capitalize">{quizType} Quiz Complete</p>

        {/* Score Ring */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="currentColor"
              className="text-surface-alt" strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="currentColor"
              className={ringColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{accuracy}%</span>
            <span className="text-sm text-muted">{correct}/{total}</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="flex justify-center gap-6 text-sm text-muted">
          {['kana', 'kanji', 'grammar'].map((cat) => {
            const catAnswers = answers.filter((a) => a.category === cat);
            if (catAnswers.length === 0) return null;
            const catCorrect = catAnswers.filter((a) => a.isCorrect).length;
            return (
              <div key={cat} className="text-center">
                <p className="capitalize font-medium text-foreground">{cat}</p>
                <p>{catCorrect}/{catAnswers.length}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer Review */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-8">
        <h3 className="font-semibold mb-4">Answer Review</h3>
        <div className="space-y-3">
          {answers.map((answer, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                answer.isCorrect
                  ? 'bg-success/5 border border-success/20'
                  : 'bg-danger/5 border border-danger/20'
              }`}
            >
              <span className={`font-semibold ${answer.isCorrect ? 'text-success' : 'text-danger'}`}>
                {answer.isCorrect ? '✓' : '✗'}
              </span>
              <span className="text-muted w-6">{i + 1}.</span>
              <span className="flex-1">
                Your answer: <span className="font-medium">{answer.selectedAnswer}</span>
              </span>
              {!answer.isCorrect && (
                <span className="text-success">
                  Correct: <span className="font-medium">{answer.correctAnswer}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button onClick={onRetry} variant="primary" size="lg">
          Try Again
        </Button>
        <Button onClick={onHome} variant="outline" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
