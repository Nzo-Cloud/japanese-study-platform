'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show for new version v1.6 with a short delay
    const hasSeenEvent = localStorage.getItem('hasSeenWhatsNewV1_6');
    if (!hasSeenEvent) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWhatsNewV1_6', 'true');
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="What's New 🎉"
    >
      <div className="px-2 pb-2">
        <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
          {/* v1.6 Cinematic Hero Update */}
          <section>
            <div className="inline-block bg-primary/15 text-primary text-[10px] font-black px-2 py-0.5 rounded-full mb-3 uppercase tracking-tighter border border-primary/20">
              v1.6 — Cinematic Hero Update
            </div>
            <ul className="space-y-3">
              {[
                { title: '3D Scrollytelling Journey', desc: 'Shrine → Forest → Tokyo → CTA transition as you scroll.' },
                { title: 'Real-time R3F Scene', desc: 'Artisanal sakura trees, swaying grass, and dynamic city skyline.' },
                { title: 'Tokyo Nightscape', desc: 'Window-lit buildings, Tokyo Tower, and an elevated metro train.' },
                { title: 'Aizome Silhouettes', desc: 'Indigo blue silhouette people, a nod to traditional Japanese craftsmanship.' },
                { title: 'Cinematic Visuals', desc: 'Bloom post-processing, atmospheric fog, and high-contrast twilight colors.' },
                { title: 'Static/3D Toggle', desc: 'High-performance static mode with automatic device compatibility detection.' },
                { title: 'Performance Optimized', desc: '~50 draw calls via InstancedMesh — console-grade rendering on web.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-primary mr-3 mt-1 text-xs">◆</span>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight">{item.title}</h4>
                    <p className="text-[13px] text-muted leading-snug mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-border/50" />

          {/* v1.5 Study Arsenal Update */}
          <section>
            <div className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase tracking-tighter border border-primary/10">
              v1.5 — Study Arsenal Update
            </div>
            <ul className="space-y-3">
              {[
                { title: 'Particle Quiz 助', desc: 'Interactive Japanese particle practice for N5–N3 levels.' },
                { title: 'Vocabulary Flashcards 単語', desc: 'SRS-powered flip cards with 300+ JLPT-accurate words.' },
                { title: 'Real Mock JLPT Exam 🎓', desc: 'Full timed simulations with Language, Reading, and Grammar sections.' },
                { title: 'Wrong Answers Review 📋', desc: 'Review mistakes with context-rich explanations after every quiz.' },
                { title: 'Hiragana & Katakana Unified', desc: 'Unified dashboard for all kana characters and shared mini-quizzes.' },
                { title: 'Work Section 💼', desc: 'Dedicated hub for business Japanese and work-related vocabulary.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-primary/60 mr-3 mt-1 text-xs">○</span>
                  <div>
                    <h4 className="text-sm font-medium text-foreground/80 leading-tight">{item.title}</h4>
                    <p className="text-[12px] text-muted/80 leading-snug mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

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
