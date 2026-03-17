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
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [showConfirmation, setShowConfirmation] = useState(true);

  // Load settings from localStorage
  React.useEffect(() => {
    const savedCount = localStorage.getItem('quiz_question_count');
    const savedConfirmation = localStorage.getItem('show_confirmation');
    if (savedCount) setQuestionCount(parseInt(savedCount));
    if (savedConfirmation) setShowConfirmation(savedConfirmation === 'true');
  }, []);

  // Save settings to localStorage
  const updateQuestionCount = (n: number) => {
    setQuestionCount(n);
    localStorage.setItem('quiz_question_count', n.toString());
  };

  const toggleConfirmation = () => {
    const newVal = !showConfirmation;
    setShowConfirmation(newVal);
    localStorage.setItem('show_confirmation', newVal.toString());
  };

  const quizTypes: { value: QuizType; label: string; icon: string }[] = [
    { value: 'kana', label: 'Kana', icon: 'あ' },
    { value: 'kanji', label: 'Kanji', icon: '漢' },
    { value: 'grammar', label: 'Grammar', icon: '文' },
    { value: 'mixed', label: 'Mixed', icon: '🎲' },
  ];

  const levels: JLPTLevel[] = ['N5', 'N4', 'N3'];
  const questionOptions = [10, 15, 30];

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

        {/* Number of Questions */}
        <div>
          <h2 className="font-semibold mb-4">Number of Questions</h2>
          <div className="flex gap-3">
            {questionOptions.map((n) => (
              <button
                key={n}
                onClick={() => updateQuestionCount(n)}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all cursor-pointer ${
                  questionCount === n
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Behavior */}
        <div className="space-y-4">
          <h2 className="font-semibold">Quiz Settings</h2>
          
          <button
            onClick={toggleConfirmation}
            className="w-full flex items-center justify-between bg-surface-alt rounded-xl p-4 hover:bg-surface-alt/80 transition-all text-left group"
          >
            <div>
              <h3 className="font-medium">Show Confirmation Dialog</h3>
              <p className="text-sm text-muted">
                {showConfirmation ? 'Show "Are you sure?" modal before answering' : 'Instant answer selection (Skip modal)'}
              </p>
            </div>
            <div
              className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                showConfirmation ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  showConfirmation ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Start Button */}
        <Button
          onClick={() =>
            setConfig({
              quizType,
              jlptLevel,
              questionCount,
              timed: false,
              showConfirmation,
            })
          }
          size="lg"
          className="w-full"
        >
          Start Quiz ({questionCount} Questions)
        </Button>
      </div>
    </div>
  );
}
