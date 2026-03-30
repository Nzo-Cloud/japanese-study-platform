import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — NihongoStudy',
  description: 'Privacy policy for NihongoStudy, a free JLPT Japanese study platform.',
};

const sections = [
  {
    title: '1. Who We Are',
    body: `NihongoStudy is a free Japanese language study platform built and operated by Lorenzo Balitian, based in the Philippines.`,
    contact: true,
  },
  {
    title: '2. What Data We Collect',
    list: [
      'Email address (when you sign up)',
      'Quiz scores and accuracy (to track your progress)',
      'Study session data and SRS review history',
      'Vocabulary flashcard progress (stored locally in your browser)',
      'No payment information — the platform is free',
    ],
  },
  {
    title: '3. How We Use Your Data',
    list: [
      'To save and display your quiz and exam results',
      'To power the Spaced Repetition System (SRS) for reviews',
      'To show your progress on the dashboard',
      'We do not sell your data to anyone',
      'We do not use your data for advertising',
    ],
  },
  {
    title: '4. Data Storage',
    body: `Your data is stored securely using Supabase (supabase.com), hosted on AWS infrastructure. Vocabulary flashcard progress is stored locally in your browser (localStorage) and never sent to our servers.`,
  },
  {
    title: '5. Your Rights',
    body: `Under the Philippines Data Privacy Act (RA 10173) and GDPR principles, you have the right to:`,
    list: [
      'Access your personal data',
      'Request correction of inaccurate data',
      'Request deletion of your account and all data',
    ],
    footer: `To request account deletion, contact us via Ko-fi and we will process it within 7 business days.`,
  },
  {
    title: '6. Cookies & Local Storage',
    body: `We use browser localStorage to save your quiz settings and flashcard progress. We do not use advertising cookies or tracking cookies.`,
  },
  {
    title: '7. Third-Party Services',
    list: [
      'Supabase (database and authentication) — privacy policy at supabase.com/privacy',
      'Vercel (hosting) — privacy policy at vercel.com/legal/privacy-policy',
      'Jisho.org links — external links only, no data shared',
    ],
  },
  {
    title: '8. Data Breach Policy',
    body: `In the event of a data breach affecting your personal information, we will notify affected users within 72 hours as required by RA 10173.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this policy as the platform grows. Changes will be posted on this page with an updated date.`,
  },
  {
    title: '10. Contact',
    body: `For any privacy concerns or data deletion requests:`,
    footer: `Lorenzo Balitian`,
    contact: true,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="font-jp">プライバシー</span> Privacy Policy
        </h1>
        <p className="text-muted text-sm">Last updated: March 20, 2026</p>
      </div>

      {/* Content card */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-primary mb-3">{section.title}</h2>

            {section.body && (
              <p className="text-muted text-sm leading-relaxed">{section.body}</p>
            )}

            {section.list && (
              <ul className="list-disc list-inside text-muted text-sm leading-relaxed space-y-1 mt-2">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {section.footer && (
              <p className="text-muted text-sm leading-relaxed mt-2">{section.footer}</p>
            )}

            {section.contact && (
              <p className="text-sm mt-2">
                <a
                  href="https://ko-fi.com/kuwago"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline transition-all"
                >
                  Ko-fi: ko-fi.com/kuwago
                </a>
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
