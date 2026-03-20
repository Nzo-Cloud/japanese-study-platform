'use client';

import React, { useState } from 'react';
import KanaChart from '@/components/study/KanaChart';
import DakutenChart from '@/components/study/DakutenChart';
import DakutenMiniQuiz from '@/components/study/DakutenMiniQuiz';
import katakanaData from '@/data/katakana.json';
import { katakanaDakutenData } from '@/data/kana_dakuten';
import { Kana } from '@/types';

export default function KatakanaPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'dakuten'>('basic');

  const basicKatakanaChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const basicPool: Kana[] = (katakanaData as Kana[]).filter(k => basicKatakanaChars.includes(k.character));

  const dakutenPool: Kana[] = katakanaDakutenData.flatMap(g => 
    g.pairs.map(p => ({
      id: `kd-${p.voiced.character}`,
      character: p.voiced.character,
      romanization: p.voiced.romanization,
      type: 'katakana'
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
          カタカナ Basic
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
              <KanaChart data={katakanaData as Kana[]} type="katakana" />
            </div>
            <div>
              <DakutenMiniQuiz kanaPool={basicPool} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <DakutenChart 
                groups={katakanaDakutenData} 
                title="カタカナ 濁音・半濁音 (Dakuten & Handakuten)" 
                type="katakana"
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
