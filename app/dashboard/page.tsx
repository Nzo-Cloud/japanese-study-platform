'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QuizResult, SRSItem } from '@/types';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import Button from '@/components/ui/Button';
import Link from 'next/link';

/**
 * Dashboard page — displays user's study progress, stats, and SRS review items.
 * Protected route: redirects to login if not authenticated.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [srsItems, setSrsItems] = useState<SRSItem[]>([]);
  const [studyStreak, setStudyStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username);
        setStudyStreak(profile.study_streak || 0);
      }

      // Fetch quiz results
      const { data: results } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false })
        .limit(50);

      if (results) setQuizResults(results);

      // Fetch SRS items
      const { data: srs } = await supabase
        .from('srs_items')
        .select('*')
        .eq('user_id', user.id);

      if (srs) setSrsItems(srs);

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">📊</div>
          <p className="text-muted">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalQuizzes = quizResults.length;
  const avgAccuracy =
    totalQuizzes > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + r.accuracy, 0) / totalQuizzes)
      : 0;

  const dueItems = srsItems.filter(
    (item) => new Date(item.next_review) <= new Date()
  );

  // Category breakdown
  const categories = ['kana', 'kanji', 'grammar'] as const;
  const categoryStats = categories.map((cat) => {
    const catResults = quizResults.filter((r) => r.quiz_type === cat);
    return {
      category: cat,
      count: catResults.length,
      avgAccuracy:
        catResults.length > 0
          ? Math.round(catResults.reduce((s, r) => s + r.accuracy, 0) / catResults.length)
          : 0,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {username || 'learner'}!</h1>
          <p className="text-muted mt-1">Here&apos;s your study progress</p>
        </div>
        {dueItems.length > 0 && (
          <Link href="/quiz">
            <Button variant="primary" className="animate-pulse-glow">
              🧠 Review {dueItems.length} items
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Quizzes Taken"
          value={totalQuizzes}
          icon="📝"
          subtitle="Total quizzes completed"
        />
        <StatsCard
          title="Average Accuracy"
          value={`${avgAccuracy}%`}
          icon="🎯"
          trend={avgAccuracy >= 70 ? 'up' : avgAccuracy >= 50 ? 'neutral' : 'down'}
        />
        <StatsCard
          title="Study Streak"
          value={`${studyStreak} days`}
          icon="🔥"
          subtitle="Days in a row"
        />
        <StatsCard
          title="Due for Review"
          value={dueItems.length}
          icon="🧠"
          subtitle="SRS items to review"
        />
      </div>

      {/* Chart & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProgressChart results={quizResults} />
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium capitalize">{cat.category}</span>
                  <span className="text-sm text-muted">{cat.count} quizzes</span>
                </div>
                <div className="w-full bg-surface-alt rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${cat.avgAccuracy}%` }}
                  />
                </div>
                <p className="text-xs text-muted mt-1">{cat.avgAccuracy}% avg accuracy</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Recent Quizzes</h3>
        {quizResults.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <p className="text-3xl mb-2">📝</p>
            <p>No quizzes taken yet.</p>
            <Link href="/quiz" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
              Take your first quiz →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted">Type</th>
                  <th className="pb-3 font-medium text-muted">Level</th>
                  <th className="pb-3 font-medium text-muted">Score</th>
                  <th className="pb-3 font-medium text-muted">Accuracy</th>
                  <th className="pb-3 font-medium text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.slice(0, 10).map((result) => (
                  <tr key={result.id} className="border-b border-border/50">
                    <td className="py-3 capitalize">{result.quiz_type}</td>
                    <td className="py-3">{result.jlpt_level}</td>
                    <td className="py-3">{result.score}/{result.total_questions}</td>
                    <td className="py-3">
                      <span
                        className={`font-medium ${
                          result.accuracy >= 70
                            ? 'text-success'
                            : result.accuracy >= 50
                            ? 'text-accent'
                            : 'text-danger'
                        }`}
                      >
                        {result.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(result.taken_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
