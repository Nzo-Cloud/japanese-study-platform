import React from 'react';
import Link from 'next/link';
import { categoriesData } from '@/data/categories';

export const metadata = {
  title: 'Categories | NihongoStudy',
  description: 'Study vocabulary organized by topic categories.',
};

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">📚 Vocabulary Categories</h1>
        <p className="text-muted max-w-2xl mx-auto text-lg">
          Master essential Japanese vocabulary organized by themes. Select a category to start studying.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData.map((category) => (
          <Link
            key={category.id}
            href={`/study/categories/${category.id}`}
            className="group block p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                {category.titleEn}
              </h2>
              <span className="text-3xl font-jp text-muted group-hover:text-primary/70 transition-colors">
                {category.titleJp}
              </span>
            </div>
            
            <div className="flex items-center text-sm font-medium text-muted bg-surface-alt py-1.5 px-3 rounded-full w-max">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                />
              </svg>
              {category.words.length} words
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
