'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show for new version v1.5
    const hasSeenEvent = sessionStorage.getItem('hasSeenWhatsNewV1_5');
    if (!hasSeenEvent) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenWhatsNewV1_5', 'true');
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="What's New 🎉"
    >
      <div className="px-2 pb-2">
        <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded mb-4">
          v1.5 — Study Arsenal Update
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Particle Quiz 助</p>
              <p className="text-sm text-muted">Fill in the blank with the correct Japanese particle. Sequential blanks, furigana support, and per-blank scoring across N5–N3 levels.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Vocabulary Flashcards 単語</p>
              <p className="text-sm text-muted">300 JLPT-accurate words across N5, N4, N3 with flip cards, Know it / Don't know it SRS system, and Recharts progress tracking.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Real Mock JLPT Exam 🎓</p>
              <p className="text-sm text-muted">Full 3-section exam structure matching real JLPT — Language Knowledge, Grammar & Reading, and a Listening placeholder. Section timers, break screens, and per-section pass/fail results.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Wrong Answers Review 📋</p>
              <p className="text-sm text-muted">After every quiz and exam, review your mistakes with the correct answer and a 💡 explanation pulled from the study data.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Hiragana & Katakana Unified</p>
              <p className="text-sm text-muted">Basic and Dakuten characters now live on one page with tabs and a shared Mini Quiz — no more switching between separate pages.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Work Section 💼</p>
              <p className="text-sm text-muted">Work Necessities promoted to its own nav item for faster access. Built for learners working or preparing to work in Japan.</p>
            </div>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <Link 
            href="/updates" 
            onClick={handleClose}
            className="text-xs font-bold text-primary hover:underline"
          >
            View past updates →
          </Link>
          <Button onClick={handleClose} variant="primary" className="w-full sm:w-auto">
            Awesome!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
