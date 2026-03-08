'use client';

import React from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

/**
 * Single quiz question display with 4 multiple-choice options.
 * Shows correct/incorrect feedback after selection.
 */
export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="text-xs text-muted uppercase tracking-wider">
          {question.category}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-surface-alt rounded-full h-1.5 mb-8">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <p className="text-sm text-muted mb-3">{question.questionText}</p>
        <div className="font-jp text-6xl sm:text-7xl text-primary font-bold">
          {question.displayText}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {question.options.map((option, i) => {
          let optionStyle = 'bg-surface border-border hover:border-primary/50 hover:shadow-sm';

          if (isAnswered) {
            if (option === question.correctAnswer) {
              optionStyle = 'bg-success/10 border-success text-success';
            } else if (option === selectedAnswer && option !== question.correctAnswer) {
              optionStyle = 'bg-danger/10 border-danger text-danger';
            } else {
              optionStyle = 'bg-surface border-border opacity-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && onAnswer(option)}
              disabled={isAnswered}
              className={cn(
                'p-4 rounded-xl border-2 text-left transition-all cursor-pointer disabled:cursor-default',
                optionStyle
              )}
            >
              <span className="text-xs text-muted mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              <span className="text-sm font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div className="text-center mt-6 animate-fade-in">
          {selectedAnswer === question.correctAnswer ? (
            <p className="text-success font-semibold">✓ Correct!</p>
          ) : (
            <p className="text-danger font-semibold">
              ✗ Incorrect — the answer is &quot;{question.correctAnswer}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
