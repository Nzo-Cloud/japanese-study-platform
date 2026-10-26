import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — NihongoStudy',
  description: 'Privacy policy for NihongoStudy, a free JLPT Japanese study platform.',
};

const sections = [
  {
    title: '1. Who We Are',
    body: `NihongoStudy is a free Japanese language study platform built and operated by Lorenzo Balitian, based in the Philippines. You can reach us at nihongostudy.support@gmail.com.`,
    contact: true,
  },
  {
    title: '2. What Data We Collect',
    list: [
      'Account details when you sign up: your email address, a username you choose, and a password (stored in hashed form by our authentication provider, Supabase)',
      'Profile and progress data: your JLPT level, study streak, number of quizzes taken, and the date your account was created',
      'Quiz and exam results: quiz type, JLPT level, score, number of questions, accuracy, and date taken',
      'Spaced repetition (SRS) review data: which items you reviewed, when, and your review schedule and streak',
      'Flashcard mastery and daily progress counts (stored locally in your browser)',
      'Technical data: your IP address, browser and device details, pages visited, and error and performance reports (collected through our error monitoring service, Sentry)',
      'No payment information — the platform is free',
    ],
  },
  {
    title: '3. How We Use Your Data',
    list: [
      'To save and display your quiz and exam results',
      'To power the Spaced Repetition System (SRS) for reviews',
      'To show your progress on the dashboard',
      'To find and fix errors and monitor how the site performs',
      'We do not sell your data to anyone',
      'We do not use your data for advertising',
    ],
  },
  {
    title: '4. Data Storage',
    body: `Your account and study data are stored using Supabase (supabase.com) in an AWS data center in Tokyo, Japan. Row-level access rules mean each account can only read and change its own data. Flashcard mastery and daily progress counts are stored locally in your browser (localStorage). Error and performance reports, which include IP addresses, are sent to Sentry (sentry.io), whose servers are in the United States. Our hosting provider, Vercel, also processes visitor IP addresses in standard server logs. By using NihongoStudy you understand that your data is transferred to and processed in these countries. We keep your account and study data until you ask us to delete your account. Sentry keeps error and performance reports for up to 90 days.`,
  },
  {
    title: '5. Your Rights',
    body: `Under the Philippines Data Privacy Act (RA 10173) and GDPR principles, you have the right to:`,
    list: [
      'Access your personal data',
      'Request correction of inaccurate data',
      'Request deletion of your account and all data',
      'Raise a question or complaint about how your data is handled (in the Philippines you may also contact the National Privacy Commission)',
    ],
    footer: `To request access, correction, or deletion, email nihongostudy.support@gmail.com from the address you signed up with and include your username. We will process deletion requests within 7 business days. Deleting your account removes your profile, quiz results, and review data.`,
  },
  {
    title: '6. Cookies & Local Storage',
    body: `We use your browser localStorage to keep you logged in, and to save your quiz settings, flashcard progress, and whether you have seen our update notice. We do not use advertising cookies or tracking cookies. When an error is reported, our error monitoring service may also receive request headers and cookies that your browser sends.`,
  },
  {
    title: '7. Third-Party Services',
    list: [
      'Supabase (database and authentication) — privacy policy at supabase.com/privacy',
      'Vercel (hosting) — privacy policy at vercel.com/legal/privacy-policy',
      'Sentry (error and performance monitoring), privacy policy at sentry.io/privacy',
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
    body: `For any privacy concerns or data deletion requests, email nihongostudy.support@gmail.com. Ko-fi is a secondary way to reach us.`,
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
        <p className="text-muted text-sm">Last updated: October 25, 2026</p>
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
