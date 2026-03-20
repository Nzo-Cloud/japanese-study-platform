'use client';

import React, { useState, useEffect } from 'react';
import { ExamConfig, ExamResult, QuizQuestion, QuizAnswer } from '@/types';
import { generateQuiz } from '@/lib/quiz-generator';
import { supabase } from '@/lib/supabase';
import { particleSentences } from '@/data/particles';
import { calculateAccuracy, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import grammarData from '@/data/grammar.json';
import kanjiData from '@/data/kanji.json';

interface ExamEngineProps {
  examConfig: ExamConfig;
  onFinish: () => void;
}

export default function ExamEngine({ examConfig, onFinish }: ExamEngineProps) {
  const [phase, setPhase] = useState<'section' | 'break' | 'listening' | 'results'>('section');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [sectionResults, setSectionResults] = useState<ExamResult[]>([]);
  const [sectionStartTime, setSectionStartTime] = useState<number>(Date.now());
  const [allSectionAnswers, setAllSectionAnswers] = useState<QuizAnswer[]>([]);
  const [showReview, setShowReview] = useState(false);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const currentSection = examConfig.sections[currentSectionIndex];

  // ── INIT SECTION ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'section' || !currentSection) return;
    
    // Generate questions correctly per type
    let allQs: QuizQuestion[] = [];
    const typesCount = currentSection.quizTypes.length || 1;
    
    currentSection.quizTypes.forEach((qType, index) => {
      const baseCount = Math.floor(currentSection.questionCount / typesCount);
      const isExtra = index < (currentSection.questionCount % typesCount);
      const targetCount = baseCount + (isExtra ? 1 : 0);
      
      let generated = generateQuiz(qType, examConfig.jlptLevel, targetCount);
      
      // Fallback for particles if generateQuiz comes back empty or unsupported
      if (qType === 'particles' && (!generated || generated.length === 0)) {
        const eligible = particleSentences.filter(s => s.jlptLevel === examConfig.jlptLevel || s.jlptLevel === 'N5');
        const shuffledPool = [...eligible].sort(() => Math.random() - 0.5);
        const particleSet = ['は', 'を', 'に', 'が', 'も', 'で', 'へ', 'と', 'から', 'まで', 'より', 'けど', 'ので', 'のに'];
        
        generated = shuffledPool.slice(0, targetCount).map(sentence => {
          const blankSegment = sentence.segments.find(s => s.type === 'blank');
          const correct = blankSegment ? blankSegment.content : 'は';
          const blankIndex = sentence.segments.findIndex(s => s.type === 'blank');
          
          let distractors = particleSet.filter(p => p !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
          const choices = [correct, ...distractors].sort(() => Math.random() - 0.5);
          
          const questionHtml = sentence.segments.map((s, i) => i === blankIndex ? '___' : s.content).join('');

          return {
            id: `${sentence.id}_${blankIndex}`,
            questionText: 'Select the missing particle:',
            displayText: questionHtml,
            options: choices,
            correctAnswer: correct,
            category: 'particles',
            itemId: sentence.id
          };
        });
      }
      
      allQs.push(...generated);
    });

    // Fisher-Yates shuffle the combined array
    for (let i = allQs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQs[i], allQs[j]] = [allQs[j], allQs[i]];
    }

    setQuestions(allQs);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(currentSection.timeLimitMinutes * 60);
    setSectionStartTime(Date.now());
    setSelectedAnswer(null);
    setIsRevealed(false);
    setIsAdvancing(false);
  }, [phase, currentSectionIndex, examConfig, currentSection]);

  // ── TIMER ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'section' || questions.length === 0 || isRevealed) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft, questions.length, isRevealed]);

  const handleTimeUp = () => {
    // Force complete section
    completeSection(answers);
  };

  const handleAnswerSelect = (optionLabel: string) => {
    if (isRevealed || isAdvancing) return;

    const question = questions[currentQuestionIndex];
    if (!question) return;

    const isCorrect = optionLabel === question.correctAnswer;
    const answer: QuizAnswer = {
      questionId: question.id,
      questionText: question.questionText,
      selectedAnswer: optionLabel,
      correctAnswer: question.correctAnswer,
      isCorrect,
      itemId: question.itemId || question.id,
      category: question.category,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setSelectedAnswer(optionLabel);
    setIsRevealed(true);
    setIsAdvancing(true);

    // Briefly show feedback then auto-advance
    setTimeout(() => {
      if (currentQuestionIndex >= questions.length - 1) {
        completeSection(newAnswers);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsRevealed(false);
        setIsAdvancing(false);
      }
    }, 1500);
  };

  const completeSection = (finalAnswers: QuizAnswer[]) => {
    setAllSectionAnswers(prev => [...prev, ...finalAnswers]);
    const timeTaken = Math.floor((Date.now() - sectionStartTime) / 1000);
    
    const answeredCount = finalAnswers.length;
    const totalCount = questions.length;
    let correctCount = finalAnswers.filter((a) => a.isCorrect).length;
    
    const accuracy = totalCount > 0 ? calculateAccuracy(correctCount, totalCount) : 0;
    const passed = accuracy >= 50;

    const result: ExamResult = {
      section: currentSection.section,
      score: correctCount,
      total: totalCount,
      accuracy,
      passed,
      timeTakenSeconds: timeTaken,
    };

    const newResults = [...sectionResults, result];
    setSectionResults(newResults);

    // Save to supabase (fire and forget)
    saveResultToSupabase(result, examConfig.jlptLevel);

    // Determine next phase
    const nextIdx = currentSectionIndex + 1;
    if (nextIdx < examConfig.sections.length) {
      const nextSec = examConfig.sections[nextIdx];
      setCurrentSectionIndex(nextIdx);
      if (nextSec.section === 'listening') {
        setPhase('listening');
      } else {
        setPhase('break');
      }
    } else {
      setPhase('results');
    }
  };

  const saveResultToSupabase = async (res: ExamResult, lvl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('quiz_results').insert({
        user_id: user.id,
        quiz_type: `exam_${res.section}`,
        jlpt_level: lvl,
        score: res.score,
        total_questions: res.total,
        accuracy: res.accuracy,
      });
    } catch {
      // ignore
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ── RENDER PHASE: SECTION ──────────────────────────────────
  if (phase === 'section') {
    if (questions.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-muted font-jp tracking-widest uppercase">Building Exam Section...</div>
        </div>
      );
    }
    
    const question = questions[currentQuestionIndex];
    const isUrgent = timeLeft <= 60;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-10 animate-fade-in w-full">
        {/* Top bar pill */}
        <div className="flex items-center justify-between w-full px-4 py-3 bg-surface border border-border rounded-xl mb-4 shadow-sm">
          {/* Left — section label */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-sm text-muted font-jp truncate">
              {currentSectionIndex === 0 ? '①' : '②'} {currentSection.label}
            </span>
          </div>

          {/* Center — question progress */}
          <div className="flex-shrink-0 text-sm text-muted mx-4">
            Q {currentQuestionIndex + 1} / {questions.length}
          </div>

          {/* Right — timer */}
          <div className={`flex-shrink-0 font-mono font-bold text-sm flex-1 text-right ${
            timeLeft <= 60 ? 'text-rose-400 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-primary'
          }`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar pill */}
        <div className="w-full bg-border h-1.5 rounded-full mb-6 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Content */}
        <div className="mt-0">
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-xl">
            <p className="text-xs text-muted font-jp tracking-widest uppercase mb-4">
              {question.category}
            </p>
            
            <div className="min-h-[120px] flex flex-col items-center justify-center mb-8">
              <h3 className="text-lg text-muted mb-4 font-medium px-2">{question.questionText}</h3>
              <h2
                className="text-3xl sm:text-4xl text-foreground font-jp leading-relaxed text-center"
                dangerouslySetInnerHTML={{ __html: question.displayText }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {question.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = isRevealed && opt === question.correctAnswer;
                const isWrongSelected = isRevealed && isSelected && !isCorrect;

                return (
                  <button
                    key={i}
                    disabled={isRevealed || isAdvancing}
                    onClick={() => handleAnswerSelect(opt)}
                    className={cn(
                      'p-5 rounded-xl border-2 text-center transition-all font-jp font-medium text-lg leading-relaxed shadow-sm',
                      !isRevealed && !isSelected ? 'border-border hover:border-primary/50 hover:bg-surface-alt hover:shadow-md cursor-pointer text-foreground' : '',
                      isCorrect ? 'border-green-500 bg-green-500/10 text-green-400 font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.2)]' : '',
                      isWrongSelected ? 'border-rose-500 bg-rose-500/10 text-rose-400 opacity-90' : '',
                      isRevealed && !isCorrect && !isWrongSelected ? 'opacity-40 border-border' : ''
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER PHASE: BREAK ──────────────────────────────────
  if (phase === 'break') {
    const prevResult = sectionResults[sectionResults.length - 1];
    const nextSec = examConfig.sections[currentSectionIndex];

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-10 min-h-[80vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center mb-10 text-primary drop-shadow-[0_0_15px_rgba(201,168,76,0.3)]">
          <div className="text-6xl font-jp font-bold mb-4">休憩</div>
          <p className="text-xl text-foreground tracking-widest uppercase text-muted-foreground">Section Complete</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />

          {prevResult && (
            <div className="text-center mb-8">
              <p className="text-sm font-jp text-muted mb-2">{examConfig.sections[currentSectionIndex - 1].label}</p>
              <div className="flex items-end justify-center gap-2 mb-3">
                <span className="text-4xl font-bold text-foreground">{prevResult.score}</span>
                <span className="text-muted text-xl pb-1">/ {prevResult.total}</span>
              </div>
              <div className="flex justify-center gap-3 items-center">
                <span className="text-muted text-sm">{prevResult.accuracy}% Accuracy</span>
                {prevResult.passed ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider">Pass</span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">Fail</span>
                )}
              </div>
            </div>
          )}

          <hr className="border-border mb-8" />

          <div className="text-center mb-8">
            <p className="text-muted text-sm mb-2">Next up:</p>
            <p className="text-xl font-bold font-jp text-primary mb-2">
              ② {nextSec.label} {nextSec.labelEn}
            </p>
            <p className="text-muted text-sm">
              {nextSec.questionCount} questions — {nextSec.timeLimitMinutes} minutes
            </p>
          </div>

          <Button 
            onClick={() => setPhase('section')} 
            variant="primary" 
            size="lg" 
            className="w-full shadow-lg shadow-primary/20"
          >
            Begin Next Section →
          </Button>

          <p className="text-center text-xs text-muted/60 mt-6 max-w-[250px] mx-auto italic">
            In the real JLPT, there is no break between sections.
          </p>
        </div>
      </div>
    );
  }

  // ── RENDER PHASE: LISTENING ────────────────────────────────
  if (phase === 'listening') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-10 min-h-[80vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center mb-10">
          <div className="text-6xl mb-6 drop-shadow-lg">🎧</div>
          <h2 className="text-4xl font-jp font-bold text-primary mb-3">聴解 Listening</h2>
          <p className="text-xl text-muted-foreground uppercase tracking-widest">Coming Soon</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 w-full max-w-lg shadow-xl text-center">
          <p className="text-foreground leading-relaxed mb-8">
            The Listening section is currently in development. It will be added in a future update to complete the full JLPT experience.
          </p>
          
          <div className="bg-surface-alt/50 border border-border/50 rounded-xl py-3 px-4 mb-8">
            <p className="text-sm font-medium text-primary">You have completed 2 of 3 sections.</p>
          </div>

          <Button 
            onClick={() => setPhase('results')} 
            variant="primary" 
            size="lg" 
            className="w-full shadow-lg shadow-primary/20"
          >
            See Your Results →
          </Button>
        </div>
      </div>
    );
  }

  // ── RENDER PHASE: RESULTS ──────────────────────────────────
  if (phase === 'results') {
    const totalScore = sectionResults.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = sectionResults.reduce((sum, r) => sum + r.total, 0);
    const allPassed = sectionResults.every(r => r.passed);
    
    // Safety check if user skipped entire exam or it broke
    if (sectionResults.length === 0) {
      return (
        <div className="text-center p-20">
          <h1 className="text-2xl text-rose-500 mb-4">Exam was aborted early.</h1>
          <Button onClick={onFinish} variant="outline">Back to Lobby</Button>
        </div>
      );
    }
    
    const wrongAnswers = allSectionAnswers.filter(a => !a.isCorrect);
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

    const chartData = examConfig.sections.map((sec) => {
      const res = sectionResults.find(r => r.section === sec.section);
      if (!res) return { name: sec.labelEn.split(' ')[0], score: 0, fill: '#334155' };
      return {
        name: sec.labelEn.split(' ')[0],
        score: res.accuracy,
        fill: res.passed ? '#c9a84c' : '#e85d75',
      };
    });

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-10 animate-fade-in">
        {/* Header content ... unchanged ... */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold tracking-widest mb-6">
            JLPT {examConfig.jlptLevel}
          </div>
          <h1 className="text-5xl font-jp font-bold text-primary mb-4 drop-shadow-[0_0_15px_rgba(201,168,76,0.3)]">試験結果</h1>
          <p className="text-xl text-muted-foreground tracking-widest uppercase">Exam Results</p>
        </div>

        {/* Verdict Card ... unchanged ... */}
        <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 mb-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20" />
          
          <h2 className={cn(
            "text-4xl sm:text-5xl font-jp font-bold mb-4",
            allPassed ? "text-primary drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]" : "text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]"
          )}>
            {allPassed ? '合格圏内' : '要復習'}
          </h2>
          <p className="text-xl text-foreground font-medium mb-8">
            {allPassed ? 'Within Passing Range' : 'Needs Review'}
          </p>

          <div className="flex flex-col items-center justify-center gap-2 mb-8">
            <span className="text-muted text-sm uppercase tracking-widest">Overall Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-foreground">{totalScore}</span>
              <span className="text-2xl text-muted">/ {totalQuestions}</span>
            </div>
          </div>

          {allPassed && (
            <p className="text-sm text-primary/80 bg-primary/5 border border-primary/20 py-2 px-4 rounded-lg inline-block shadow-sm">
              Listening section pending — full final result pending
            </p>
          )}
        </div>

        {/* Breakdown stack */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          {examConfig.sections.map((sec, i) => {
            const res = sectionResults.find(r => r.section === sec.section);
            if (!res) {
              return (
                <div key={i} className="bg-surface-alt/30 rounded-2xl border border-border/30 p-6 opacity-60 flex flex-col items-center justify-center text-center min-h-[140px]">
                  <span className="text-2xl mb-2 opacity-50">🎧</span>
                  <p className="font-jp font-bold mb-1 opacity-50">{sec.label}</p>
                  <p className="text-xs text-muted">Not attempted — In Development</p>
                </div>
              );
            }

            return (
              <div key={i} className="bg-surface rounded-2xl border border-border p-6 shadow-lg flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 gap-2">
                  <div className="flex-1">
                    <p className="font-jp font-bold text-lg mb-1">{sec.label}</p>
                    <p className="text-[11px] leading-tight text-muted line-clamp-2">{sec.labelEn}</p>
                  </div>
                  {res.passed ? (
                    <span className="shrink-0 px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-bold rounded">Pass</span>
                  ) : (
                    <span className="shrink-0 px-2 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] uppercase font-bold rounded">Fail</span>
                  )}
                </div>

                <div className="flex items-baseline gap-4 mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{res.score}</span>
                    <span className="text-sm text-muted mb-1">/ {res.total}</span>
                  </div>
                  <div className="text-[10px] uppercase text-muted font-bold">
                    {formatTime(res.timeTakenSeconds)} taken
                  </div>
                </div>
                
                <div className="w-full bg-border h-2 rounded-full mt-4 overflow-hidden shadow-inner">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", res.passed ? "bg-primary" : "bg-rose-500")}
                    style={{ width: `${res.accuracy}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] uppercase text-muted font-bold">
                  <span>{res.accuracy}% Accuracy</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wrong Answers Review */}
        <div className="mb-12">
          {wrongCount === 0 ? (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-center text-green-400 text-sm">
              🎉 Perfect score — no mistakes to review!
            </div>
          ) : !showReview ? (
            <button
              onClick={() => setShowReview(true)}
              className="w-full py-4 rounded-xl border-2 border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all font-medium flex items-center justify-center gap-2"
            >
              📋 Review Mistakes ({wrongCount} wrong answers)
            </button>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-foreground">Mistake Review</h3>
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

        {/* Chart */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 mb-12 shadow-xl">
          <h3 className="font-bold text-lg mb-8 font-jp text-center">Section Performance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f111a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: any) => [`${value}%`, 'Accuracy']}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8 text-lg font-medium">
            {allPassed ? "Excellent work! You're on track for JLPT success." : sectionResults.some(r => r.passed) ? "Keep studying — review your weak sections above." : "Don't give up — consistent practice is the key."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={onFinish} variant="outline" size="lg" className="min-w-[200px]">
              Retake Exam
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'} variant="primary" size="lg" className="min-w-[200px] shadow-lg">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
