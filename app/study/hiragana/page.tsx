'use client';

import React, { useState } from 'react';
import KanaChart from '@/components/study/KanaChart';
import DakutenChart from '@/components/study/DakutenChart';
import DakutenMiniQuiz from '@/components/study/DakutenMiniQuiz';
import hiraganaData from '@/data/hiragana.json';
import { hiraganaDakutenData } from '@/data/kana_dakuten';
import { Kana } from '@/types';

export default function HiraganaPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'dakuten'>('basic');

  const basicHiraganaChars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
  const basicPool: Kana[] = (hiraganaData as Kana[]).filter(k => basicHiraganaChars.includes(k.character));

  const dakutenPool: Kana[] = hiraganaDakutenData.flatMap(g => 
    g.pairs.map(p => ({
      id: `hd-${p.voiced.character}`,
      character: p.voiced.character,
      romanization: p.voiced.romanization,
      type: 'hiragana'
    }))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all cursor-pointer ${
            activeTab === 'basic'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/30 text-foreground/80'
          }`}
        >
          ひらがな Basic
        </button>
        <button
          onClick={() => setActiveTab('dakuten')}
          className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all cursor-pointer ${
            activeTab === 'dakuten'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/30 text-foreground/80'
          }`}
        >
          濁音 Dakuten
        </button>
      </div>

      {/* Content */}
      <div key={activeTab}>
        {activeTab === 'basic' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 [&_.flex-col>button]:hidden">
              <KanaChart data={hiraganaData as Kana[]} type="hiragana" />
            </div>
            <div>
              <DakutenMiniQuiz kanaPool={basicPool} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <DakutenChart 
                groups={hiraganaDakutenData} 
                title="ひらがな 濁音・半濁音 (Dakuten & Handakuten)" 
                type="hiragana"
              />
            </div>
            <div>
              <DakutenMiniQuiz kanaPool={dakutenPool} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
