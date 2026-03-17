'use client';

import React, { useState } from 'react';
import { QuizConfig, JLPTLevel } from '@/types';
import QuizEngine from '@/components/quiz/QuizEngine';
import Button from '@/components/ui/Button';

/**
 * Mock JLPT Exam page — timed mixed quiz simulating real exam conditions.
 */
export default function ExamPage() {
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [jlptLevel, setJlptLevel] = useState<JLPTLevel>('N5');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timed, setTimed] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(true);

  // Load settings from localStorage
  React.useEffect(() => {
    const savedCount = localStorage.getItem('quiz_question_count');
    const savedConfirmation = localStorage.getItem('show_confirmation');
    const savedTimed = localStorage.getItem('quiz_timed');
    
    if (savedCount) setQuestionCount(parseInt(savedCount));
    if (savedConfirmation) setShowConfirmation(savedConfirmation === 'true');
    if (savedTimed) setTimed(savedTimed === 'true');
  }, []);

  // Save settings to localStorage
  const updateQuestionCount = (n: number) => {
    setQuestionCount(n);
    localStorage.setItem('quiz_question_count', n.toString());
  };

  const toggleTimed = () => {
    const newVal = !timed;
    setTimed(newVal);
    localStorage.setItem('quiz_timed', newVal.toString());
  };

  const toggleConfirmation = () => {
    const newVal = !showConfirmation;
    setShowConfirmation(newVal);
    localStorage.setItem('show_confirmation', newVal.toString());
  };

  const levels: JLPTLevel[] = ['N5', 'N4', 'N3'];
  const questionOptions = [10, 15, 30];

  // Time limits: roughly 1 minute per question
  const timeLimit = questionCount * 60;

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
        <h1 className="text-3xl font-bold mb-2">🎓 Mock JLPT Exam</h1>
        <p className="text-muted">Simulate real exam conditions with a timed mixed quiz</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-8 space-y-8">
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
            onClick={toggleTimed}
            className="w-full flex items-center justify-between bg-surface-alt rounded-xl p-4 hover:bg-surface-alt/80 transition-all text-left group"
          >
            <div>
              <h3 className="font-medium">Timed Mode</h3>
              <p className="text-sm text-muted">
                {timed ? `${Math.floor(timeLimit / 60)} minutes for ${questionCount} questions` : 'No time limit'}
              </p>
            </div>
            <div
              className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                timed ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  timed ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </button>

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

        {/* Start Exam */}
        <Button
          onClick={() =>
            setConfig({
              quizType: 'exam',
              jlptLevel,
               questionCount,
               timed,
               timeLimit: timed ? timeLimit : undefined,
               showConfirmation,
             })
           }
           size="lg"
           className="w-full"
         >
           Start Exam →
         </Button>
      </div>
    </div>
  );
}
