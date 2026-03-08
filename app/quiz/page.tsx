'use client';

import React, { useState } from 'react';
import { QuizConfig, QuizType, JLPTLevel } from '@/types';
import QuizEngine from '@/components/quiz/QuizEngine';
import Button from '@/components/ui/Button';

/**
 * Quiz page — user configures quiz type and JLPT level, then takes the quiz.
 */
export default function QuizPage() {
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [quizType, setQuizType] = useState<QuizType>('kana');
  const [jlptLevel, setJlptLevel] = useState<JLPTLevel>('N5');

  const quizTypes: { value: QuizType; label: string; icon: string }[] = [
    { value: 'kana', label: 'Kana', icon: 'あ' },
    { value: 'kanji', label: 'Kanji', icon: '漢' },
    { value: 'grammar', label: 'Grammar', icon: '文' },
    { value: 'mixed', label: 'Mixed', icon: '🎲' },
  ];

  const levels: JLPTLevel[] = ['N5', 'N4', 'N3'];

  if (config) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <QuizEngine config={config} onFinish={() => setConfig(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">📝 Smart Quiz</h1>
        <p className="text-muted">Test your knowledge with randomized questions</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-8 space-y-8">
        {/* Quiz Type */}
        <div>
          <h2 className="font-semibold mb-4">Quiz Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quizTypes.map((qt) => (
              <button
                key={qt.value}
                onClick={() => setQuizType(qt.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  quizType === qt.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="text-2xl mb-1 font-jp">{qt.icon}</div>
                <div className="text-sm font-medium">{qt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* JLPT Level */}
        <div>
          <h2 className="font-semibold mb-4">JLPT Level</h2>
          <div className="flex gap-3">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setJlptLevel(l)}
                className={`flex-1 py-3 rounded-xl border-2 font-bold text-lg transition-all cursor-pointer ${
                  jlptLevel === l
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={() =>
            setConfig({
              quizType,
              jlptLevel,
              questionCount: 10,
              timed: false,
            })
          }
          size="lg"
          className="w-full"
        >
          Start Quiz (10 Questions)
        </Button>
      </div>
    </div>
  );
}
