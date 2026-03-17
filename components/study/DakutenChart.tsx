'use client';

import React, { useState } from 'react';
import { DakutenGroup, DakutenPair } from '@/data/kana_dakuten';
import { cn } from '@/lib/utils';

interface DakutenChartProps {
  groups: DakutenGroup[];
  title: string;
  type: 'hiragana' | 'katakana';
}

export default function DakutenChart({ groups, title, type }: DakutenChartProps) {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted mt-2">
          Click on any character to toggle between the base and its voiced version.
        </p>
      </div>

      <div className="space-y-12">
        {groups.map((group) => (
          <div key={group.name}>
            <h2 className="text-xl font-semibold mb-4 text-primary/80 border-l-4 border-primary pl-3">
              {group.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {group.pairs.map((pair) => (
                <DakutenTile key={`${pair.base.character}-${pair.voiced.character}`} pair={pair} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DakutenTile({ pair }: { pair: DakutenPair }) {
  const [isVoiced, setIsVoiced] = useState(false);

  return (
    <button
      onClick={() => setIsVoiced(!isVoiced)}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group overflow-hidden h-32 w-full",
        isVoiced 
          ? "bg-primary/5 border-primary shadow-lg shadow-primary/10 -translate-y-1" 
          : "bg-surface border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      {/* Background Accent */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-500",
        isVoiced ? "bg-gradient-to-br from-primary/10 to-transparent opacity-100" : "group-hover:opacity-10"
      )} />

      <div className="relative z-10 font-jp text-4xl sm:text-5xl transition-all duration-300 ease-out transform">
        <span className={cn(
          "inline-block transition-all duration-300",
          isVoiced ? "scale-110 text-primary" : ""
        )}>
          {isVoiced ? pair.voiced.character : pair.base.character}
        </span>
      </div>
      
      <div className={cn(
        "relative z-10 mt-2 text-sm font-medium transition-colors duration-300",
        isVoiced ? "text-primary/80" : "text-muted"
      )}>
        {isVoiced ? pair.voiced.romanization : pair.base.romanization}
      </div>

      {/* Indicator Icons */}
      <div className="absolute top-2 right-2">
        {isVoiced ? (
            <span className="text-primary text-xs font-bold bg-primary/10 px-1.5 py-0.5 rounded">゛</span>
        ) : (
            <span className="text-muted/30 text-[10px] font-bold">Base</span>
        )}
      </div>

      {/* Subtle Micro-animation Decoration */}
      <div className={cn(
          "absolute -bottom-1 left-0 w-full h-1 bg-primary transform origin-left transition-transform duration-500 rounded-full",
          isVoiced ? "scale-x-100" : "scale-x-0"
      )} />
    </button>
  );
}
