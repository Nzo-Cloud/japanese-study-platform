'use client';

import React from 'react';
import { QuizAnswer } from '@/types';
import Button from '@/components/ui/Button';
import { calculateAccuracy } from '@/lib/utils';
import { useState } from 'react';
import grammarData from '@/data/grammar.json';
import kanjiData from '@/data/kanji.json';
import { particleSentences } from '@/data/particles';

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

  const [showReview, setShowReview] = useState(false);
  const wrongAnswers = answers.filter(a => !a.isCorrect);
  const wrongCount = wrongAnswers.length;

  const getExplanation = (answer: QuizAnswer) => {
    switch (answer.category) {
      case 'grammar':
        const grammar = grammarData.find(g => g.id === answer.itemId);
        return grammar?.notes ? `💡 ${grammar.notes}` : null;
      case 'kanji':
        const kanji = kanjiData.find(k => k.id === answer.itemId);
        return kanji ? `💡 Meaning: ${kanji.meaning} | Reading: ${kanji.onyomi.join(', ')} / ${kanji.kunyomi.join(', ')}` : null;
      case 'particles':
        const particle = particleSentences.find(p => p.id === answer.itemId);
        return particle?.hint ? `💡 ${particle.hint}` : null;
      default:
        return null;
    }
  };

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

      {/* Answer Review Section */}
      <div className="mb-8">
        {wrongCount === 0 ? (
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-center text-green-400 text-sm mb-8">
            🎉 Perfect score — no mistakes to review!
          </div>
        ) : !showReview ? (
          <button
            onClick={() => setShowReview(true)}
            className="w-full mb-8 py-4 rounded-xl border-2 border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all font-medium flex items-center justify-center gap-2"
          >
            📋 Review Mistakes ({wrongCount} wrong answers)
          </button>
        ) : (
          <div className="bg-surface rounded-2xl border border-border p-6 mb-8 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-foreground">Mistake Review</h3>
              <button
                onClick={() => setShowReview(false)}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                Hide Review ↑
              </button>
            </div>
            <div className="space-y-4">
              {wrongAnswers.map((answer, index) => {
                const explanation = getExplanation(answer);
                return (
                  <div key={index} className="bg-surface-alt border border-rose-500/20 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                        {answer.category}
                      </span>
                      <span className="text-xs text-muted font-mono">Q{index + 1}</span>
                    </div>
                    
                    <div className="mb-4">
                      <p 
                        className="text-base font-jp text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: answer.questionText || answer.correctAnswer }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-1">
                      <div>
                        <p className="text-[10px] uppercase text-muted font-bold mb-1">Your Answer</p>
                        <p className="text-rose-400 font-jp" dangerouslySetInnerHTML={{ __html: `✗ ${answer.selectedAnswer || '(No answer)'}` }} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted font-bold mb-1">Correct Answer</p>
                        <p className="text-primary font-jp" dangerouslySetInnerHTML={{ __html: `✓ ${answer.correctAnswer}` }} />
                      </div>
                    </div>

                    {explanation && (
                      <div className="text-sm text-muted italic border-t border-border/50 pt-3 mt-3">
                        {explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
