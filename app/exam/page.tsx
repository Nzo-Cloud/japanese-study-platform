'use client';

import React, { useState } from 'react';

import { JLPTLevel, ExamStatus, ExamResult } from '@/types';
import { examConfigs } from '@/lib/exam-config';
import Button from '@/components/ui/Button';
import ExamEngine from '@/components/exam/ExamEngine';

export default function ExamPage() {
  const [jlptLevel, setJlptLevel] = useState<JLPTLevel>('N5');
  const [status, setStatus] = useState<ExamStatus>('lobby');
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [sectionResults, setSectionResults] = useState<ExamResult[]>([]);

  const levels: JLPTLevel[] = ['N5', 'N4', 'N3'];
  const config = examConfigs[jlptLevel];

  if (status === 'lobby') {
    const totalTime = config.sections
      .filter(s => s.section !== 'listening')
      .reduce((acc, s) => acc + s.timeLimitMinutes, 0);

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">🎓 Mock JLPT Exam</h1>
          <p className="text-muted">Experience a real JLPT exam simulation</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 space-y-8 shadow-xl">
          {/* JLPT Level Picker */}
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
                      : 'border-border hover:border-primary/30 text-foreground'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Overview Card */}
          <div className="bg-surface-alt rounded-xl p-6 border border-border/50">
            <h2 className="text-xl font-bold text-primary mb-4 font-jp">Exam Structure</h2>
            <div className="space-y-2 mb-6">
              {config.sections.map((sec, idx) => {
                const isListening = sec.section === 'listening';
                return (
                  <div key={sec.section} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-muted text-lg">
                        {idx === 0 ? '①' : idx === 1 ? '②' : '③'}
                      </span>
                      <div>
                        <p className="font-bold font-jp text-foreground">{sec.label}</p>
                        <p className="text-xs text-muted mt-0.5">{sec.labelEn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-right shrink-0">
                      <span className="text-muted whitespace-nowrap hidden sm:inline-block">
                        {isListening ? '–' : `${sec.questionCount} Qs`}
                      </span>
                      <span className="text-muted whitespace-nowrap">
                        {sec.timeLimitMinutes} min
                      </span>
                      {isListening ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 whitespace-nowrap hidden xs:inline-block">
                          🎧 In Development
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 whitespace-nowrap hidden xs:inline-block">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm font-medium text-muted-foreground border-t border-border/50 pt-4">
              Total exam time: <span className="text-foreground">{totalTime} minutes</span> (Listening excluded)
            </p>
          </div>

          {/* Important Notice Box */}
          <div className="border border-rose-500/30 bg-rose-500/5 rounded-xl p-4 flex gap-3 text-sm">
            <span className="text-xl shrink-0">⚠️</span>
            <p className="text-muted-foreground leading-relaxed">
              This is a simulation. Real JLPT passing requires a minimum score in EACH section. This mock exam follows the same structure and time limits as the official exam.
            </p>
          </div>

          {/* Listening Notice Box */}
          <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 flex gap-3 text-sm">
            <span className="text-xl shrink-0">🎧</span>
            <p className="text-muted-foreground leading-relaxed">
              聴解 Listening section is currently in development. The exam will cover Language Knowledge and Reading only. Listening will be added in a future update.
            </p>
          </div>

          {/* Start Exam Button */}
          <div className="pt-4">
            <Button
              onClick={() => {
                setStatus('in-progress');
                setCurrentSectionIndex(0);
              }}
              size="lg"
              variant="primary"
              className="w-full py-4 text-lg font-bold shadow-lg shadow-primary/20"
            >
              Begin Exam — {jlptLevel} →
            </Button>
          </div>
        </div>
      </div>
    );
  }



  // ── IN-PROGRESS / BREAK / COMPLETE ──────────────────
  return (
    <ExamEngine
      examConfig={config}
      onFinish={() => setStatus('lobby')}
    />
  );
}
