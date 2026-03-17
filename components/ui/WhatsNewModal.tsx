'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show for new version v1.3
    const hasSeenEvent = sessionStorage.getItem('hasSeenWhatsNewV1_3');
    if (!hasSeenEvent) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenWhatsNewV1_3', 'true');
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
          v1.3 — March 2026
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">JLPT N3 Kanji Expansion 🎓</p>
              <p className="text-sm text-muted">Initial batch of 30 common N3 Kanji with readings and examples.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Custom Quiz Settings ⚙️</p>
              <p className="text-sm text-muted">Select question counts (10-30) and toggle Auto-Advance for a faster study flow.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Dakuten Mini-Quizzes ⚡</p>
              <p className="text-sm text-muted">Interactive romaji quizzes added specifically for the Dakuten study pages.</p>
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
