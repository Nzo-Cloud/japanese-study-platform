'use client';

import React, { useState, useMemo } from 'react';
import kanjiData from '@/data/kanji.json';
import { Kanji, JLPTLevel } from '@/types';
import KanjiCard from '@/components/study/KanjiCard';

const allKanji: Kanji[] = kanjiData as Kanji[];

/**
 * Kanji study page with JLPT level filtering and search.
 */
export default function KanjiPage() {
  const [level, setLevel] = useState<JLPTLevel | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredKanji = useMemo(() => {
    return allKanji.filter((k) => {
      const matchesLevel = level === 'all' || k.jlptLevel === level;
      const matchesSearch =
        search === '' ||
        k.kanji.includes(search) ||
        k.meaning.toLowerCase().includes(search.toLowerCase()) ||
        k.onyomi.some((r) => r.includes(search)) ||
        k.kunyomi.some((r) => r.includes(search));
      return matchesLevel && matchesSearch;
    });
  }, [level, search]);

  const levels: (JLPTLevel | 'all')[] = ['all', 'N5', 'N4', 'N3'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">漢字 Kanji</h1>
        <p className="text-muted">
          {filteredKanji.length} kanji available — click any card to see details
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Level filter */}
        <div className="flex gap-2">
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

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by meaning or reading..."
            className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Kanji Grid */}
      {filteredKanji.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🔍</p>
          <p>No kanji found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredKanji.map((kanji) => (
            <KanjiCard key={kanji.id} kanji={kanji} />
          ))}
        </div>
      )}
    </div>
  );
}
