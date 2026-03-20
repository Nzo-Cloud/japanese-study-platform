'use client';

import React, { useState } from 'react';
import { workNecessitiesData, WorkNecessityItem } from '@/data/work_necessities';
import { cn } from '@/lib/utils';

export default function WorkNecessities() {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>('general');

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {workNecessitiesData.map((category) => (
        <div 
          key={category.id} 
          className={cn(
            "group rounded-2xl border transition-all duration-300 overflow-hidden",
            openCategoryId === category.id 
              ? "bg-surface border-primary shadow-lg shadow-primary/5" 
              : "bg-surface/50 border-border hover:border-primary/30 hover:bg-surface"
          )}
        >
          {/* Accordion Trigger */}
          <button
            onClick={() => setOpenCategoryId(openCategoryId === category.id ? null : category.id)}
            className="w-full flex items-center justify-between px-6 py-5 cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <h3 className={cn(
                "text-lg font-bold transition-colors duration-300",
                openCategoryId === category.id ? "text-primary" : "text-foreground"
              )}>
                {category.name}
              </h3>
            </div>
            <svg 
              className={cn(
                "w-5 h-5 transition-transform duration-300", 
                openCategoryId === category.id ? "rotate-180 text-primary" : "text-muted"
              )} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Accordion Content */}
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            openCategoryId === category.id ? "max-h-[2000px] border-t border-border/50" : "max-h-0 opacity-0 pointer-events-none"
          )}>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <WorkNecessityCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkNecessityCard({ item }: { item: WorkNecessityItem }) {
  return (
    <div className="relative p-5 rounded-xl bg-surface-alt/40 border border-border group/card hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h4 
          className="font-jp text-xl font-bold text-foreground group-hover/card:text-primary transition-colors ruby-base-align"
          dangerouslySetInnerHTML={{ __html: item.furiganaHTML || item.Japanese_Text }}
        />
        <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
          {item.Romaji}
        </span>
      </div>
      
      <p className="text-sm font-semibold text-foreground/80 mb-4 flex-grow">
        {item.English_Meaning}
      </p>
      
      <div className="mt-auto p-3 rounded-lg bg-surface border border-border/50">
        <p className="text-xs italic text-muted mb-1 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Example Sentence:
        </p>
        <p className="text-sm font-jp leading-relaxed">
          {item.Contextual_Sentence}
        </p>
      </div>
    </div>
  );
}


