'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType, QuizConfig, QuizAnswer } from '@/types';
import { generateQuiz } from '@/lib/quiz-generator';
import { supabase } from '@/lib/supabase';
import { calculateAccuracy } from '@/lib/utils';
import QuizQuestionComponent from './QuizQuestion';
import QuizResults from './QuizResults';
import Button from '@/components/ui/Button';

interface QuizEngineProps {
  config: QuizConfig;
  onFinish?: () => void;
}

/**
 * Complete quiz engine that manages:
 * - Question generation
 * - Answer tracking
 * - Timer (if enabled)
 * - Result saving to Supabase
 * - SRS item updates
 */
export default function QuizEngine({ config, onFinish }: QuizEngineProps) {
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Generate quiz on mount
  useEffect(() => {
    const quiz = generateQuiz(config.quizType, config.jlptLevel, config.questionCount);
    setQuestions(quiz);
    if (config.timed && config.timeLimit) {
      setTimeLeft(config.timeLimit);
    }
  }, [config]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isComplete) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Auto-finish when time runs out
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isComplete]);

  const handleTimeUp = () => {
    // Answer remaining questions incorrectly
    const remaining = questions.slice(currentIndex);
    const autoAnswers: QuizAnswer[] = remaining.map((q) => ({
      questionId: q.id,
      selectedAnswer: '',
      correctAnswer: q.correctAnswer,
      isCorrect: false,
      itemId: q.itemId,
      category: q.category,
    }));
    const allAnswers = [...answers, ...autoAnswers];
    setAnswers(allAnswers);
    finishQuiz(allAnswers);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const question = questions[currentIndex];
    const isCorrect = answer === question.correctAnswer;

    const quizAnswer: QuizAnswer = {
      questionId: question.id,
      selectedAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      itemId: question.itemId,
      category: question.category,
    };

    setAnswers((prev) => [...prev, quizAnswer]);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex + 1 >= questions.length) {
      finishQuiz([...answers]);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const finishQuiz = useCallback(async (finalAnswers: QuizAnswer[]) => {
    setIsComplete(true);
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const score = finalAnswers.filter((a) => a.isCorrect).length;
      const total = finalAnswers.length;
      const accuracy = calculateAccuracy(score, total);

      // Save quiz result
      await supabase.from('quiz_results').insert({
        user_id: user.id,
        quiz_type: config.quizType,
        jlpt_level: config.jlptLevel,
        score,
        total_questions: total,
        accuracy,
      });

      // Update user quiz count
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('total_quizzes_taken')
          .eq('id', user.id)
          .single();
        if (profile) {
          await supabase
            .from('users')
            .update({ total_quizzes_taken: (profile.total_quizzes_taken || 0) + 1 })
            .eq('id', user.id);
        }
      } catch {
        // Best effort — quiz results already saved
      }

      // Update SRS items
      for (const answer of finalAnswers) {
        const { data: existing } = await supabase
          .from('srs_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', answer.itemId)
          .single();

        if (existing) {
          // Update existing SRS item
          const { calculateSRSUpdate } = await import('@/lib/srs-engine');
          const update = calculateSRSUpdate(existing, answer.isCorrect);
          await supabase
            .from('srs_items')
            .update(update)
            .eq('id', existing.id);
        } else {
          // Create new SRS item
          const { createDefaultSRSItem, calculateSRSUpdate } = await import('@/lib/srs-engine');
          const newItem = createDefaultSRSItem(user.id, answer.category, answer.itemId);
          const update = calculateSRSUpdate(
            { interval_days: 1, ease_factor: 2.5, correct_streak: 0 },
            answer.isCorrect
          );
          await supabase.from('srs_items').insert({
            ...newItem,
            ...update,
          });
        }
      }
    } catch (error) {
      console.error('Failed to save quiz results:', error);
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  // Format timer
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="animate-pulse text-4xl mb-4">📝</div>
        <p className="text-muted">Generating quiz...</p>
      </div>
    );
  }

  // Results screen
  if (isComplete) {
    return (
      <div>
        {isSaving && (
          <div className="text-center text-sm text-muted mb-4 animate-pulse">
            Saving results...
          </div>
        )}
        <QuizResults
          answers={answers}
          quizType={config.quizType}
          onRetry={() => {
            setQuestions(generateQuiz(config.quizType, config.jlptLevel, config.questionCount));
            setCurrentIndex(0);
            setAnswers([]);
            setSelectedAnswer(null);
            setIsComplete(false);
            if (config.timed && config.timeLimit) setTimeLeft(config.timeLimit);
          }}
          onHome={() => { if (onFinish) onFinish(); else window.location.href = '/'; }}
        />
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="max-w-2xl mx-auto">
      {/* Timer */}
      {timeLeft !== null && (
        <div className={`text-center mb-4 text-lg font-mono font-bold ${
          timeLeft <= 30 ? 'text-danger animate-pulse' : 'text-muted'
        }`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      )}

      <QuizQuestionComponent
        question={questions[currentIndex]}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Next button appears after answering */}
      {selectedAnswer && (
        <div className="text-center mt-8 animate-fade-in">
          <Button onClick={handleNext} variant="primary" size="lg">
            {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question →'}
          </Button>
        </div>
      )}
    </div>
  );
}
