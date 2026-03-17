'use client';

import React, { useState, useEffect } from 'react';
import { Kana } from '@/types';
import { shuffleArray, pickRandom } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface DakutenMiniQuizProps {
  kanaPool: Kana[];
}

export default function DakutenMiniQuiz({ kanaPool }: DakutenMiniQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<{ char: string; correct: string; options: string[] } | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const generateQuestion = () => {
    if (kanaPool.length < 4) return;
    
    const target = kanaPool[Math.floor(Math.random() * kanaPool.length)];
    const wrongOnes = pickRandom(kanaPool.filter(k => k.id !== target.id), 3);
    const options = shuffleArray([target.romanization, ...wrongOnes.map(k => k.romanization)]);
    
    setCurrentQuestion({
      char: target.character,
      correct: target.romanization,
      options
    });
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [kanaPool]);

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const isCorrect = answer === currentQuestion?.correct;
    setFeedback({
      isCorrect,
      message: isCorrect ? 'Correct! ✨' : `Incorrect. It was "${currentQuestion?.correct}"`
    });
    
    setTotal(prev => prev + 1);
    if (isCorrect) setScore(prev => prev + 1);

    // Auto-next after 1.5s
    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Mini Quiz</h3>
        <div className="text-sm font-mono bg-primary/10 text-primary px-3 py-1 rounded-full">
          Score: {score}/{total}
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-6xl font-jp mb-2">{currentQuestion.char}</div>
        <p className="text-muted text-sm">What is the romaji?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
            className={`py-3 rounded-xl border-2 font-bold transition-all ${
              feedback && opt === currentQuestion.correct
                ? 'border-success bg-success/10 text-success'
                : feedback && opt !== currentQuestion.correct && feedback.message.includes(opt)
                ? 'border-danger bg-danger/10 text-danger'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`mt-6 text-center font-bold animate-bounce ${feedback.isCorrect ? 'text-success' : 'text-danger'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}
