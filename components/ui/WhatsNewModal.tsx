'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show once per session (re-appears on full page reload)
    const hasSeenEvent = sessionStorage.getItem('hasSeenWhatsNewV1_1');
    if (!hasSeenEvent) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenWhatsNewV1_1', 'true');
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
          v1.1 — March 2026
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Furigana added everywhere</p>
              <p className="text-sm text-muted">Readings now appear above all kanji in example sentences.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Quiz Confirmation Dialog</p>
              <p className="text-sm text-muted">A safety dialog prevents accidental misclicks in Quizzes and Mock Exams.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Categories Study Mode</p>
              <p className="text-sm text-muted">New curated word lists! Master Numbers, Days, Body Parts, Colors, Family, Food, Animals, Places & more.</p>
            </div>
          </li>
        </ul>

        <div className="flex justify-end">
          <Button onClick={handleClose} variant="primary" className="w-full sm:w-auto">
            Got it!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
