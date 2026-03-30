'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

/**
 * Responsive navigation bar with:
 * - Logo / brand
 * - Study dropdown (Hiragana, Katakana, Kanji, Grammar)
 * - Quiz, Exam, Progress links
 * - Auth state (Login/Logout + username display)
 * - Mobile hamburger menu
 */
export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen to auth state
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        // Fetch username from profile
        const { data: profile } = await supabase
          .from('users')
          .select('username')
          .eq('id', data.user.id)
          .single();
        if (profile) setUsername(profile.username);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setUsername('');
    });

    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsStudyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsStudyOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUsername('');
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  const studyLinks = [
    { href: '/study/hiragana', label: 'ひらがな Hiragana' },
    { href: '/study/katakana', label: 'カタカナ Katakana' },
    { href: '/study/kanji', label: '漢字 Kanji' },
    { href: '/study/grammar', label: '文法 Grammar' },
    { href: '/study/categories', label: 'カテゴリー Categories' },
    { href: '/study/vocabulary', label: '単語 Vocabulary' },
  ];

  const navLinkClass = (path: string) =>
    cn(
      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
      isActive(path)
        ? 'text-primary bg-primary/10'
        : 'text-foreground/70 hover:text-foreground hover:bg-surface-alt'
    );

  return (
    <nav className="sticky top-0 z-40 bg-[#1A1A1B]/80 backdrop-blur-md border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold text-primary font-serif group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all">
              日本語
            </span>
            <span className="hidden sm:inline font-bold tracking-tight text-foreground/90 font-serif">
              NihongoStudy
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Study Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsStudyOpen(!isStudyOpen)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1 cursor-pointer',
                  pathname.startsWith('/study') && !pathname.startsWith('/study/work-necessities')
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-surface-alt'
                )}
              >
                Study
                <svg
                  className={cn('w-4 h-4 transition-transform', isStudyOpen && 'rotate-180')}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isStudyOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-surface rounded-xl border border-border shadow-xl py-2 animate-fade-in">
                  {studyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'block px-4 py-2.5 text-sm transition-colors',
                        isActive(link.href)
                          ? 'text-primary bg-primary/5'
                          : 'text-foreground/70 hover:text-foreground hover:bg-surface-alt'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/quiz" className={navLinkClass('/quiz')}>Quiz</Link>
            <Link href="/exam" className={navLinkClass('/exam')}>Mock Exam</Link>
            <Link href="/study/work-necessities" className={navLinkClass('/study/work-necessities')}>Work</Link>
            {user && <Link href="/dashboard" className={navLinkClass('/dashboard')}>Progress</Link>}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted">
                  {username || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-lg hover:bg-surface-alt transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-lg hover:bg-surface-alt transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">Study</p>
              {studyLinks.map((link) => (
                <Link key={link.href} href={link.href} className={cn('block', navLinkClass(link.href))}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <Link href="/quiz" className={cn('block', navLinkClass('/quiz'))}>Quiz</Link>
              <Link href="/exam" className={cn('block', navLinkClass('/exam'))}>Mock Exam</Link>
              <Link href="/study/work-necessities" className={cn('block', navLinkClass('/study/work-necessities'))}>Work</Link>
              
              {user && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link href="/dashboard" className={cn('block', navLinkClass('/dashboard'))}>Progress</Link>
                </>
              )}
              <div className="border-t border-border my-2" />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-foreground/70 hover:text-foreground rounded-lg hover:bg-surface-alt transition-colors cursor-pointer"
                >
                  Logout ({username || user.email?.split('@')[0]})
                </button>
              ) : (
                <>
                  <Link href="/login" className={cn('block', navLinkClass('/login'))}>Log in</Link>
                  <Link href="/signup" className={cn('block', navLinkClass('/signup'))}>Sign up</Link>
                </>
              )}
              <div className="border-t border-border my-2" />
              <Link href="/privacy" className="block px-3 py-2 text-xs text-muted hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
