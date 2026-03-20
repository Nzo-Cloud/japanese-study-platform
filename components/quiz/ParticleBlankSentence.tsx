'use client';

import React from 'react';
import { ParticleSentence } from '@/types';
import { cn } from '@/lib/utils';

interface ParticleBlankSentenceProps {
  sentence: ParticleSentence;
  activeBlankIndex: number;
  filledAnswers: string[];
  isRevealed: boolean;
}

/**
 * Renders a Japanese sentence with interactive particle blank slots.
 * Blanks are styled as gold active, answered (correct/wrong), or future (dim).
 */
export default function ParticleBlankSentence({
  sentence,
  activeBlankIndex,
  filledAnswers,
  isRevealed,
}: ParticleBlankSentenceProps) {
  let blankCounter = -1;

  return (
    <div className="animate-fade-in">
      {/* Sentence row */}
      <div className="flex flex-wrap items-end justify-center gap-1 font-jp text-xl leading-relaxed">
        {sentence.segments.map((seg, i) => {
          if (seg.type === 'text') {
            return (
              <span key={i} className="text-foreground" dangerouslySetInnerHTML={{ __html: seg.content }} />
            );
          }

          // It's a blank segment
          blankCounter++;
          const bi = blankCounter;
          const chosen = filledAnswers[bi];
          const correct = seg.content;

          // ── Answered blank ──
          if (bi < activeBlankIndex || (bi === activeBlankIndex && isRevealed && chosen)) {
            const isCorrect = chosen === correct;
            return (
              <span key={i} className="relative inline-flex flex-col items-center mx-1">
                <span
                  className={cn(
                    'px-2 py-0 border-b-2 font-bold leading-none',
                    isCorrect
                      ? 'text-primary border-primary/60'
                      : 'text-rose-400 border-rose-400/60'
                  )}
                >
                  {chosen}
                </span>
                <span className={cn(
                    'text-[10px] mt-1 whitespace-nowrap font-bold h-3',
                    isCorrect ? 'text-primary' : 'text-rose-400'
                  )}
                >
                  {isCorrect ? '✓' : `✗ ${correct}`}
                </span>
              </span>
            );
          }

          // ── Currently active blank ──
          if (bi === activeBlankIndex) {
            return (
              <span
                key={i}
                className="inline-flex items-center justify-center px-3 mx-0.5 border-b-2 border-primary animate-pulse text-primary/40 shadow-sm shadow-primary/20 rounded-sm"
              >
                ＿
              </span>
            );
          }

          // ── Future blank (not reached yet) ──
          return (
            <span
              key={i}
              className="inline-flex items-center justify-center px-3 mx-0.5 border-b-2 border-border/40 text-muted/30 opacity-50 rounded-sm"
            >
              ＿
            </span>
          );
        })}
      </div>

      {/* English translation */}
      <p className="text-center text-sm text-muted italic mt-4">{sentence.english}</p>

      {/* Hint box — shown after revealing */}
      {isRevealed && sentence.hint && (
        <div className="mt-4 mx-auto max-w-md px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-sm text-primary/80 animate-fade-in">
          <span className="mr-1.5">💡</span>
          {sentence.hint}
        </div>
      )}
    </div>
  );
}
