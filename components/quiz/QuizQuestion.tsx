'use client';

import React, { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

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
 * Requires user confirmation before submitting an answer to prevent misclicks.
 */
export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);
  const isAnswered = selectedAnswer !== null;

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setPendingAnswer(option);
  };

  const handleConfirm = () => {
    if (pendingAnswer) {
      onAnswer(pendingAnswer);
      setPendingAnswer(null);
    }
  };

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
              onClick={() => handleOptionClick(option)}
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={pendingAnswer !== null}
        onClose={() => setPendingAnswer(null)}
        title="Confirm Answer"
        hideBackdrop
      >
        <div className="text-center px-1 py-1">
          <p className="text-base text-foreground mb-4">
            Are you sure you want to submit this answer?
          </p>
          <div className="font-jp text-base text-foreground/80 mb-6 py-2 px-4 mx-auto w-max max-w-full bg-surface-alt/50 rounded flex items-center justify-center border border-border/50">
            {pendingAnswer}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={() => setPendingAnswer(null)} 
              variant="outline" 
              className="w-full sm:w-auto order-last sm:order-first"
            >
              Go Back
            </Button>
            <Button 
              onClick={handleConfirm} 
              variant="primary" 
              className="w-full sm:w-auto shadow-md"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
