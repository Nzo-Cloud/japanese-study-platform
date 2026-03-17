'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show for new version v1.4
    const hasSeenEvent = sessionStorage.getItem('hasSeenWhatsNewV1_4');
    if (!hasSeenEvent) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenWhatsNewV1_4', 'true');
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
          v1.4 — Kyoto Nighttime Update
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Kyoto Night Aesthetics 🌙</p>
              <p className="text-sm text-muted">Deep "Sumi-Iro" ink theme with metallic gold accents and paper texture.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Atmospheric Lighting ✨</p>
              <p className="text-sm text-muted">Gently swaying lanterns and a pulsing "Zen" glow system in the Hero section.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary text-lg leading-none mr-3 mt-0.5">•</span>
            <div>
              <p className="font-semibold text-foreground">Zen Motion Design 🌸</p>
              <p className="text-sm text-muted">Added Shadow-Fade entrance animations and interactive moonlit sakura falling.</p>
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
