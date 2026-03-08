'use client';

import React, { useState, useMemo } from 'react';
import grammarData from '@/data/grammar.json';
import { GrammarPattern, JLPTLevel } from '@/types';
import GrammarCard from '@/components/study/GrammarCard';

const allGrammar: GrammarPattern[] = grammarData as GrammarPattern[];

/**
 * Grammar study page with JLPT level filtering.
 */
export default function GrammarPage() {
  const [level, setLevel] = useState<JLPTLevel | 'all'>('all');

  const filteredGrammar = useMemo(() => {
    if (level === 'all') return allGrammar;
    return allGrammar.filter((g) => g.jlptLevel === level);
  }, [level]);

  const levels: (JLPTLevel | 'all')[] = ['all', 'N5', 'N4', 'N3'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">文法 Grammar</h1>
        <p className="text-muted">
          {filteredGrammar.length} grammar patterns — master the building blocks of Japanese
        </p>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 mb-8">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              level === l
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-foreground/70 hover:border-primary/30'
            }`}
          >
            {l === 'all' ? 'All' : l}
          </button>
        ))}
      </div>

      {/* Grammar Cards */}
      <div className="space-y-4">
        {filteredGrammar.map((grammar) => (
          <GrammarCard key={grammar.id} grammar={grammar} />
        ))}
      </div>
    </div>
  );
}
