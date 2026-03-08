'use client';

import React, { useState } from 'react';
import { Kanji } from '@/types';
import Modal from '@/components/ui/Modal';

interface KanjiCardProps {
  kanji: Kanji;
}

/**
 * Kanji card with expandable detail view showing all readings,
 * meanings, example words and sentences.
 */
export default function KanjiCard({ kanji }: KanjiCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const levelColor: Record<string, string> = {
    N5: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    N4: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    N3: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left bg-surface rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="font-jp text-4xl group-hover:text-primary transition-colors">
            {kanji.kanji}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border ${levelColor[kanji.jlptLevel] || ''}`}>
            {kanji.jlptLevel}
          </span>
        </div>
        <p className="font-medium text-sm mb-1">{kanji.meaning}</p>
        <p className="text-xs text-muted truncate">{kanji.exampleWord}</p>
      </button>

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Kanji Details">
        <div className="space-y-6">
          {/* Main character */}
          <div className="text-center">
            <div className="font-jp text-8xl text-primary mb-2">{kanji.kanji}</div>
            <span className={`inline-block text-xs px-3 py-1.5 rounded-full border ${levelColor[kanji.jlptLevel] || ''}`}>
              {kanji.jlptLevel}
            </span>
          </div>

          {/* Meaning */}
          <div className="text-center">
            <h3 className="text-xl font-bold">{kanji.meaning}</h3>
          </div>

          {/* Readings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-alt rounded-lg p-4">
              <p className="text-xs text-muted uppercase tracking-wider mb-2">On&apos;yomi (音読み)</p>
              <p className="font-jp text-lg">{kanji.onyomi.join('、') || '—'}</p>
            </div>
            <div className="bg-surface-alt rounded-lg p-4">
              <p className="text-xs text-muted uppercase tracking-wider mb-2">Kun&apos;yomi (訓読み)</p>
              <p className="font-jp text-lg">{kanji.kunyomi.join('、') || '—'}</p>
            </div>
          </div>

          {/* Radicals */}
          <div className="bg-surface-alt rounded-lg p-4">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Radicals</p>
            <div className="flex gap-2">
              {kanji.radicals.map((r, i) => (
                <span key={i} className="font-jp text-lg bg-surface px-3 py-1 rounded-lg border border-border">
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Example */}
          <div className="border-l-4 border-primary pl-4">
            <p className="text-sm text-muted mb-1">Example</p>
            <p className="font-jp text-lg mb-1">{kanji.exampleWord}</p>
            <p className="font-jp text-base text-foreground/80">{kanji.exampleSentence}</p>
            <p className="text-sm text-muted mt-1">{kanji.translation}</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
