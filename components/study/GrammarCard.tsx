'use client';

import React from 'react';
import { GrammarPattern } from '@/types';

interface GrammarCardProps {
  grammar: GrammarPattern;
}

/**
 * Grammar pattern card showing pattern, meaning, example, and notes.
 */
export default function GrammarCard({ grammar }: GrammarCardProps) {
  const levelColor: Record<string, string> = {
    N5: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    N4: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    N3: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-jp text-2xl font-bold text-primary">{grammar.pattern}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${levelColor[grammar.jlptLevel] || ''}`}>
          {grammar.jlptLevel}
        </span>
      </div>

      {/* Meaning */}
      <p className="text-base font-medium mb-4">{grammar.meaning}</p>

      {/* Example */}
      <div className="bg-surface-alt rounded-lg p-4 mb-4">
        <p className="font-jp text-lg mb-1">{grammar.example}</p>
        <p className="text-sm text-muted">{grammar.translation}</p>
      </div>

      {/* Notes */}
      {grammar.notes && (
        <div className="flex items-start gap-2 text-sm">
          <span className="text-accent">💡</span>
          <p className="text-foreground/70">{grammar.notes}</p>
        </div>
      )}
    </div>
  );
}
