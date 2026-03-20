'use client';

import React, { useState, useEffect } from 'react';
import { VocabWord } from '@/types';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList, LineChart, Line } from 'recharts';

interface FlashcardEngineProps {
  words: VocabWord[];
  mode: 'jp-en' | 'en-jp';
  jlptLevel: 'N5' | 'N4' | 'N3';
  onFinish: () => void;
}

// Fisher-Yates shuffle
function shuffleQueue(array: VocabWord[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashcardEngine({ words, mode, jlptLevel, onFinish }: FlashcardEngineProps) {
  const [queue, setQueue] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [unknownIds, setUnknownIds] = useState<string[]>([]);
  const [seeCount, setSeeCount] = useState<Record<string, number>>({});
  const [sessionEnded, setSessionEnded] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<{ date: string; known: number }[]>([]);

  useEffect(() => {
    setQueue(shuffleQueue(words));
  }, [words]);

  const currentWord = queue[currentIndex];

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const handleRating = async (rating: 'known' | 'unknown') => {
    if (!currentWord) return;

    const wordId = currentWord.id;
    let newKnown = [...knownIds];
    let newUnknown = [...unknownIds];
    const newSeeCount = { ...seeCount };
    newSeeCount[wordId] = (newSeeCount[wordId] || 0) + 1;

    let newQueue = [...queue];

    if (rating === 'known') {
      if (!newKnown.includes(wordId)) {
        newKnown.push(wordId);
        
        try {
          const key = 'vocab_mastered_' + jlptLevel;
          const stored = localStorage.getItem(key);
          const masteredArray = stored ? JSON.parse(stored) : [];
          if (Array.isArray(masteredArray) && !masteredArray.includes(wordId)) {
            masteredArray.push(wordId);
            localStorage.setItem(key, JSON.stringify(masteredArray));
          }
        } catch {
          // safely ignore parsing errors
        }
      }
    } else {
      if (!newUnknown.includes(wordId)) newUnknown.push(wordId);
      // Re-queue the word at the end if unknown and not seen twice yet
      if (newSeeCount[wordId] < 2) {
        newQueue.push(currentWord);
      }
    }

    setKnownIds(newKnown);
    setUnknownIds(newUnknown);
    setSeeCount(newSeeCount);
    setQueue(newQueue);
    setIsFlipped(false);

    // Session ends when all unique words have been answered "Know it" once, 
    // OR user has seen every unique word at least twice.
    const isWordFinished = (id: string) => {
      return newKnown.includes(id) || (newSeeCount[id] || 0) >= 2;
    };

    let nextIndex = currentIndex + 1;
    // Skip any words in the queue that are already finished
    while (nextIndex < newQueue.length && isWordFinished(newQueue[nextIndex].id)) {
      nextIndex++;
    }

    if (nextIndex >= newQueue.length) {
      endSession(newKnown.length, words.length);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const endSession = async (knownCount: number, totalCount: number) => {
    setSessionEnded(true);

    // Save to localStorage
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const stored = localStorage.getItem('vocab_daily_progress');
    let progress = stored ? JSON.parse(stored) : [];
    
    // Update today's record or append
    const todayIndex = progress.findIndex((p: any) => p.date === today);
    if (todayIndex >= 0) {
      progress[todayIndex].known += knownCount;
    } else {
      progress.push({ date: today, known: knownCount });
    }
    
    // Keep last 7 days
    if (progress.length > 7) progress = progress.slice(progress.length - 7);
    
    localStorage.setItem('vocab_daily_progress', JSON.stringify(progress));
    setDailyProgress(progress);

    // Save to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('quiz_results').insert({
          user_id: user.id,
          quiz_type: 'vocabulary',
          jlpt_level: jlptLevel,
          score: knownCount,
          total_questions: totalCount,
          accuracy: totalCount > 0 ? Math.round((knownCount / totalCount) * 100) : 0,
        });
      }
    } catch (e) {
      // safely ignore errors to prevent crashing the results screen
    }
  };

  const resetSession = () => {
    setQueue(shuffleQueue(words));
    setCurrentIndex(0);
    setKnownIds([]);
    setUnknownIds([]);
    setSeeCount({});
    setSessionEnded(false);
    setIsFlipped(false);
  };

  if (sessionEnded) {
    const barData = [
      { name: 'Known', value: knownIds.length, fill: '#c9a84c' },
      { name: 'Unknown', value: unknownIds.length, fill: '#e85d75' }
    ];

    return (
      <div className="max-w-4xl mx-auto py-10 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-primary">{knownIds.length}</span> / {words.length} Known
          </h2>
          <p className="text-muted">Session Complete</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4 text-center">Session Results</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} style={{ background: 'transparent' }}>
                  <XAxis dataKey="name" tick={{ fill: 'currentColor' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'white' }} 
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} minPointSize={8}>
                    <LabelList dataKey="value" position="top" fill="#c9a84c" fontSize={14} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4 text-center">7-Day Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyProgress} style={{ background: 'transparent' }}>
                  <XAxis dataKey="date" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'white' }}
                    itemStyle={{ color: '#c9a84c' }}
                  />
                  <Line type="monotone" dataKey="known" stroke="#c9a84c" strokeWidth={3} dot={{ fill: '#c9a84c', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={resetSession} variant="outline">
            Study Again
          </Button>
          <Button onClick={onFinish}>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  if (!currentWord || queue.length === 0) return null;

  // Render variables
  const trueCurrentIndex = currentIndex + 1;
  const trueTotalCards = queue.length;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">Card {trueCurrentIndex} of {trueTotalCards}</span>
        <div className="w-1/2 bg-surface-alt h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((trueCurrentIndex / trueTotalCards) * 100))}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card */}
      <div style={{ perspective: '1000px' }}>
        <div 
          onClick={handleFlip}
          className={`bg-surface border-2 rounded-2xl p-8 cursor-pointer relative transition-all duration-500 hover:border-primary/40 min-h-[280px] flex flex-col justify-center items-center text-center ${isFlipped ? 'border-primary/40' : 'border-border'}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Face */}
          <div 
            className="absolute inset-0 flex flex-col justify-center items-center p-8 w-full h-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {mode === 'jp-en' ? (
              <>
                <div className="text-4xl font-bold font-jp mb-4">{currentWord.japanese}</div>
                <div className="text-lg text-muted">{currentWord.reading}</div>
              </>
            ) : (
              <div className="text-2xl font-bold">{currentWord.english}</div>
            )}
            
            {!isFlipped && (
              <div className="absolute bottom-6 text-sm text-muted animate-pulse">
                Tap to reveal
              </div>
            )}
          </div>

          {/* Back Face */}
          <div 
            className="absolute inset-0 flex flex-col justify-center items-center p-8 w-full h-full"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {mode === 'jp-en' ? (
              <>
                <div className="text-2xl font-bold mb-6 text-primary">{currentWord.english}</div>
                <div className="text-lg font-jp mb-2" dangerouslySetInnerHTML={{ __html: currentWord.exampleJa }} />
                <div className="text-sm text-muted">{currentWord.exampleEn}</div>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold font-jp mb-2 text-primary">{currentWord.japanese}</div>
                <div className="text-lg text-muted mb-6">{currentWord.reading}</div>
                <div className="text-lg font-jp mb-2" dangerouslySetInnerHTML={{ __html: currentWord.exampleJa }} />
                <div className="text-sm text-muted">{currentWord.exampleEn}</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating Buttons */}
      {isFlipped && (
        <div className="mt-8 grid grid-cols-2 gap-4 animate-fade-in">
          <button
            onClick={() => handleRating('unknown')}
            className="min-h-[56px] rounded-xl border-2 border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold transition-all cursor-pointer"
          >
            ✗ Don't know
          </button>
          <button
            onClick={() => handleRating('known')}
            className="min-h-[56px] rounded-xl border-2 border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 font-bold transition-all cursor-pointer"
          >
            ✓ Know it
          </button>
        </div>
      )}
    </div>
  );
}
