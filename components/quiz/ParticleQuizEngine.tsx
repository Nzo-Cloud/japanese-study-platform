'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { QuizConfig, ParticleSentence, ParticleAnswer } from '@/types';
import { particleSentences } from '@/data/particles';
import { shuffleArray, calculateAccuracy, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import ParticleBlankSentence from '@/components/quiz/ParticleBlankSentence';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

// ─── Particle sets by JLPT level ─────────────────────────────
const PARTICLE_SETS: Record<string, string[]> = {
  N5: ['は', 'を', 'に', 'が', 'も', 'で'],
  N4: ['は', 'を', 'に', 'が', 'も', 'で', 'へ', 'と', 'から', 'まで'],
  N3: ['は', 'を', 'に', 'が', 'も', 'で', 'へ', 'と', 'から', 'まで', 'より', 'けど', 'ので', 'のに'],
};

/** A single blank "question unit" — one blank to fill in one sentence */
interface BlankUnit {
  sentenceId: string;
  sentence: ParticleSentence;
  blankIndex: number;
  correctParticle: string;
}

interface ParticleQuizEngineProps {
  config: QuizConfig;
  onFinish: () => void;
}

/**
 * Full quiz engine for the Particle fill-in-the-blank quiz.
 * Self-contained: handles question building, answering, scoring, and results.
 */
export default function ParticleQuizEngine({ config, onFinish }: ParticleQuizEngineProps) {
  // ─── State ──────────────────────────────────────────────────
  const [blanks, setBlanks] = useState<BlankUnit[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ParticleAnswer[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [resultsSaved, setResultsSaved] = useState(false);

  // Track filled answers per sentence (map sentenceId -> string[])
  const [filledMap, setFilledMap] = useState<Record<string, string[]>>({});

  // Active blank's sentence-local blank index tracker
  const [sentenceBlankCounts, setSentenceBlankCounts] = useState<Record<string, number>>({});

  const particleSet = PARTICLE_SETS[config.jlptLevel] || PARTICLE_SETS.N5;

  // ─── Build question blanks on mount ─────────────────────────
  useEffect(() => {
    // Filter sentences by level (include all levels up to and including selected)
    const levelOrder = ['N5', 'N4', 'N3'];
    const maxLevelIdx = levelOrder.indexOf(config.jlptLevel);
    const eligible = particleSentences.filter(
      (s) => levelOrder.indexOf(s.jlptLevel) <= maxLevelIdx
    );

    const shuffledSentences = shuffleArray(eligible);
    const allBlanks: BlankUnit[] = [];
    let blanksAdded = 0;

    for (const sentence of shuffledSentences) {
      if (blanksAdded >= config.questionCount) break;

      let blankIdx = 0;
      sentence.segments.forEach((seg) => {
        if (seg.type === 'blank') {
          allBlanks.push({
            sentenceId: sentence.id,
            sentence,
            blankIndex: blankIdx,
            correctParticle: seg.content,
          });
          blankIdx++;
          blanksAdded++;
        }
      });
    }

    setBlanks(allBlanks);
  }, [config.jlptLevel, config.questionCount]);

  // ─── Generate choices when currentIndex or blanks change ────
  useEffect(() => {
    if (blanks.length === 0 || currentIndex >= blanks.length) return;
    const current = blanks[currentIndex];
    const correct = current.correctParticle;

    // Pick 3 distractors (different from correct)
    const pool = particleSet.filter((p) => p !== correct);
    const distractors = shuffleArray(pool).slice(0, 3);
    setChoices(shuffleArray([correct, ...distractors]));
    setIsRevealed(false);
    setSelectedParticle(null);
    setPendingAnswer(null);
  }, [currentIndex, blanks, particleSet]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleChoiceClick = (particle: string) => {
    if (isRevealed) return;

    if (config.showConfirmation) {
      setPendingAnswer(particle);
    } else {
      commitAnswer(particle);
    }
  };

  const handleConfirm = () => {
    if (pendingAnswer) {
      commitAnswer(pendingAnswer);
      setPendingAnswer(null);
    }
  };

  const commitAnswer = (particle: string) => {
    const current = blanks[currentIndex];
    const isCorrect = particle === current.correctParticle;

    // Record answer
    const answer: ParticleAnswer = {
      sentenceId: current.sentenceId,
      blankIndex: current.blankIndex,
      selectedParticle: particle,
      correctParticle: current.correctParticle,
      isCorrect,
    };
    setAnswers((prev) => [...prev, answer]);

    // Track filled answers for the sentence display
    setFilledMap((prev) => {
      const existing = prev[current.sentenceId] || [];
      const updated = [...existing];
      updated[current.blankIndex] = particle;
      return { ...prev, [current.sentenceId]: updated };
    });

    // Track how many blanks we've answered for this sentence
    setSentenceBlankCounts((prev) => ({
      ...prev,
      [current.sentenceId]: (prev[current.sentenceId] || 0) + 1,
    }));

    const isLastBlankInSentence =
      currentIndex === blanks.length - 1 ||
      blanks[currentIndex + 1].sentenceId !== current.sentenceId;

    if (isLastBlankInSentence) {
      setSelectedParticle(particle);
      setIsRevealed(true);
    } else {
      // Auto-advance to the next blank in the same sentence immediately
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex >= blanks.length - 1) {
      // Quiz complete
      setIsFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRetry = () => {
    // Reshuffle and reset
    const shuffled = shuffleArray(blanks);
    setBlanks(shuffled);
    setCurrentIndex(0);
    setAnswers([]);
    setFilledMap({});
    setSentenceBlankCounts({});
    setIsRevealed(false);
    setSelectedParticle(null);
    setPendingAnswer(null);
    setIsFinished(false);
    setResultsSaved(false);
  };

  // ─── Save results to Supabase ───────────────────────────────
  useEffect(() => {
    if (!isFinished || resultsSaved) return;

    const saveResults = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const correctCount = answers.filter((a) => a.isCorrect).length;
        const totalBlanks = answers.length;
        const accuracy = calculateAccuracy(correctCount, totalBlanks);

        await supabase.from('quiz_results').insert({
          user_id: user.id,
          quiz_type: 'particles',
          jlpt_level: config.jlptLevel,
          score: correctCount,
          total_questions: totalBlanks,
          accuracy,
        });
        setResultsSaved(true);
      } catch {
        // Silently fail — don't crash the results screen
      }
    };
    saveResults();
  }, [isFinished, resultsSaved, answers, config.jlptLevel]);

  // ─── Derived values ─────────────────────────────────────────
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalBlanks = blanks.length;
  const accuracy = totalBlanks > 0 ? calculateAccuracy(correctCount, totalBlanks) : 0;

  // Score message
  const getMessage = () => {
    if (accuracy >= 90) return { text: '素晴らしい! Excellent!', emoji: '🎉' };
    if (accuracy >= 70) return { text: 'よくできました! Well done!', emoji: '👏' };
    if (accuracy >= 50) return { text: 'まあまあです! Not bad!', emoji: '💪' };
    return { text: 'もっと頑張りましょう! Keep studying!', emoji: '📚' };
  };

  // Score ring
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (accuracy / 100) * circumference;
  const ringColor =
    accuracy >= 70 ? 'text-success' : accuracy >= 50 ? 'text-accent' : 'text-danger';

  // Group answers by sentence for the review breakdown
  const reviewSentences = useMemo(() => {
    const map = new Map<string, { sentence: ParticleSentence; answers: ParticleAnswer[] }>();
    answers.forEach((a) => {
      if (!map.has(a.sentenceId)) {
        const blank = blanks.find((b) => b.sentenceId === a.sentenceId);
        if (blank) map.set(a.sentenceId, { sentence: blank.sentence, answers: [] });
      }
      map.get(a.sentenceId)!.answers.push(a);
    });
    return Array.from(map.values());
  }, [answers, blanks]);

  // ─── Loading state ──────────────────────────────────────────
  if (blanks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">助</div>
          <p className="text-muted">Preparing particle quiz...</p>
        </div>
      </div>
    );
  }

  // ─── Results Screen ─────────────────────────────────────────
  if (isFinished) {
    const message = getMessage();

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Score Card */}
        <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-8">
          <p className="text-4xl mb-4">{message.emoji}</p>
          <h2 className="text-2xl font-bold mb-2">{message.text}</h2>
          <p className="text-muted mb-8 capitalize">Particles Quiz Complete</p>

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
              <span className="text-sm text-muted">{correctCount}/{totalBlanks} blanks</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-sm text-muted">
            <div className="text-center">
              <p className="font-medium text-success">{correctCount}</p>
              <p>Correct</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-danger">{totalBlanks - correctCount}</p>
              <p>Wrong</p>
            </div>
          </div>
        </div>

        {/* Answer Review — grouped by sentence */}
        <div className="bg-surface rounded-2xl border border-border p-6 mb-8">
          <h3 className="font-semibold mb-4">Answer Review</h3>
          <div className="space-y-4">
            {reviewSentences.map(({ sentence, answers: sentenceAnswers }) => (
              <div
                key={sentence.id}
                className="p-4 rounded-xl border border-border/50 bg-surface-alt/30"
              >
                {/* Reconstructed sentence */}
                <div className="flex flex-wrap items-end gap-1 font-jp text-base mb-2">
                  {(() => {
                    let bi = -1;
                    return sentence.segments.map((seg, j) => {
                      if (seg.type === 'text') {
                        return <span key={j} dangerouslySetInnerHTML={{ __html: seg.content }} />;
                      }
                      bi++;
                      const a = sentenceAnswers.find((ans) => ans.blankIndex === bi);
                      if (!a) {
                        return (
                          <span key={j} className="text-muted/50">＿</span>
                        );
                      }
                      return (
                        <span
                          key={j}
                          className={cn(
                            'px-1 font-bold border-b-2',
                            a.isCorrect
                              ? 'text-primary border-primary/60'
                              : 'text-rose-400 border-rose-400/60'
                          )}
                        >
                          {a.selectedParticle}
                          {!a.isCorrect && (
                            <span className="text-xs text-primary/60 ml-1">({a.correctParticle})</span>
                          )}
                        </span>
                      );
                    });
                  })()}
                </div>
                <p className="text-xs text-muted italic">{sentence.english}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button onClick={handleRetry} variant="primary" size="lg">
            Try Again
          </Button>
          <Button onClick={onFinish} variant="outline" size="lg">
            Back to Quiz Menu
          </Button>
        </div>
      </div>
    );
  }

  // ─── Active Quiz Screen ─────────────────────────────────────
  const current = blanks[currentIndex];

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted">
          Blank {currentIndex + 1} of {totalBlanks}
        </span>
        <span className="text-xs text-muted uppercase tracking-wider font-jp">
          助詞 Particles
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-primary/20 rounded-full h-1.5 mb-8">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + (isRevealed ? 1 : 0)) / totalBlanks) * 100}%` }}
        />
      </div>

      {/* Sentence Card */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 mb-8">
        <ParticleBlankSentence
          sentence={current.sentence}
          activeBlankIndex={current.blankIndex}
          filledAnswers={filledMap[current.sentenceId] || []}
          isRevealed={isRevealed}
        />
      </div>

      {/* Particle Choice Buttons */}
      {!isRevealed && (
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8 animate-fade-in">
          {choices.map((particle, i) => (
            <button
              key={i}
              onClick={() => handleChoiceClick(particle)}
              className={cn(
                'p-4 rounded-xl border-2 text-center transition-all cursor-pointer font-jp text-xl font-bold min-h-12',
                pendingAnswer === particle
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 hover:shadow-sm'
              )}
            >
              {particle}
            </button>
          ))}
        </div>
      )}

      {/* Feedback + Next Button */}
      {isRevealed && (
        <div className="text-center animate-fade-in mt-4">
          <Button onClick={handleNext} variant="primary" size="lg" className="min-w-40 shadow-md">
            {currentIndex >= blanks.length - 1 ? 'View Results' : 'Next →'}
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={pendingAnswer !== null && !isRevealed}
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
