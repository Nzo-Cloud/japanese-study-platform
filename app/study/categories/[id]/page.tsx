import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoriesData } from '@/data/categories';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: CategoryPageProps) {
  const params = await props.params;
  const category = categoriesData.find((c) => c.id === params.id);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.titleEn} (${category.titleJp}) | NihongoStudy`,
    description: `Study Japanese words related to ${category.titleEn}`,
  };
}

export async function generateStaticParams() {
  return categoriesData.map((category) => ({
    id: category.id,
  }));
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const category = categoriesData.find((c) => c.id === params.id);
  if (!category) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/study/categories"
        className="inline-flex items-center text-sm font-medium text-muted hover:text-primary mb-8 group transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Categories
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{category.titleEn}</h1>
        <p className="text-2xl font-jp text-primary mb-2 tracking-widest">{category.titleJp}</p>
        <span className="inline-block mt-4 text-sm font-medium text-muted bg-surface-alt py-1 px-3 rounded-full">
          {category.words.length} words
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {category.words.map((word) => (
          <div
            key={word.id}
            className="group relative p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-xl transition-all flex flex-col items-center justify-center text-center overflow-hidden"
          >
             {/* Word / Reading (with Ruby Tags rendering support) */}
            <div className="mb-6 flex-1 flex flex-col justify-center items-center">
              {word.furiganaHTML ? (
                <div
                  className="font-jp text-5xl sm:text-6xl text-primary font-bold tracking-widest leading-normal"
                  dangerouslySetInnerHTML={{ __html: word.furiganaHTML }}
                />
              ) : (
                <div className="font-jp text-5xl sm:text-6xl text-primary font-bold tracking-widest leading-normal">
                  {word.character}
                </div>
              )}
            </div>

            {/* Translation & Romaji Context */}
            <div className="w-full pt-4 border-t border-border">
              <p className="font-medium text-xl text-foreground mb-1">
                {word.meaning}
              </p>
              <p className="text-sm text-muted font-mono tracking-wide uppercase">
                {word.romaji}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
