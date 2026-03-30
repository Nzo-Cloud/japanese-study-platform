# NihongoStudy 🎌 — Japanese Study Platform v1.5.1

> Learn Japanese at your own pace. Free, forever.

A full-stack Japanese self-study platform for learners preparing for JLPT N5–N3. Built with real learners in mind — not just flashcards, but a complete study system with spaced repetition, mock exams, and robust vocabulary study.

[![Live Site](https://img.shields.io/badge/Live%20Site-nihongostudy.vercel.app-red?style=flat-square)](https://japanese-study-platform.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Nzo--Cloud-black?style=flat-square&logo=github)](https://github.com/Nzo-Cloud/japanese-study-platform)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

---

🌐 **Live Demo:** [japanese-study-platform.vercel.app](https://japanese-study-platform.vercel.app)

---

## What's New — v1.5.1 (March 2026)

*   **Security Hardening** — Full production security audit completed. Added HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options), rate limiting on all API routes, and a Privacy Policy page (/privacy).

*   **Dependency Updates** — Upgraded Next.js 16.1.6 → 16.2.1 fixing 5 security vulnerabilities including HTTP request smuggling and CSRF bypass. Zero npm audit vulnerabilities.

*   **Error Monitoring** — Sentry Next.js SDK integrated for real-time error tracking and performance monitoring in production.

*   **Privacy Policy** — Published at /privacy covering data collection, storage, user rights under Philippines RA 10173 and GDPR principles, and third-party services.

## What's New — v1.5 (March 2026)

*   **Particle Fill-in-the-Blank Quiz** — New quiz type where users fill blank slots in Japanese sentences with the correct particle (は/を/で/に/が/も and more). Sequential blanks, furigana on all kanji, per-blank scoring, N5–N3 levels.

*   **SRS Vocabulary Flashcards** — 300 JLPT-accurate words across N5, N4, N3. Flip card interface with JP→EN and EN→JP modes, Know it / Don't know it binary rating, spaced repetition re-queue, and Recharts bar + line charts for session and 7-day progress tracking.

*   **Real Mock JLPT Exam** — Rebuilt from scratch to match official JLPT structure. Sequential sections with individual timers: 言語知識 Language Knowledge (Kanji) and 読解 Grammar & Reading. Force-advance on timer zero. Break screens between sections. 聴解 Listening placeholder (in development). Per-section pass/fail results with Recharts performance chart.

*   **Wrong Answers Review** — Available after every quiz and exam. Collapsible review panel showing question, your answer, correct answer, and a 💡 explanation sourced from study data (kanji meaning/reading, grammar notes, particle hints).

*   **Hiragana & Katakana Unified Pages** — Basic and Dakuten characters merged into one page each with tab switching. Shared Mini Quiz resets per tab. Dakuten sub-links removed from navbar.

*   **Quiz Refocused** — Removed Kana quiz type (covered by Mini Quiz on study pages). Renamed Mixed to All — now pulls from Kanji + Grammar + Particles only. Exam sections now use correct question type pools.

*   **Work Nav Item** — Work Necessities promoted from Study dropdown to its own top-level direct nav link for faster access by work-focused learners.

## What's New — v1.4 (March 2026)
+ **Premium Kyoto Nighttime Overhaul** — Complete aesthetic pivot to a "Sumi-Iro" dark theme with metallic gold ink and atmospheric pulse lighting.
+ **Zen Motion Design** — Added "Shadow Fade" entrance animations for a high-end feel and swaying SVG lantern elements.
+ **Interactive Nighttime Visuals** — Sakura-fubuki (petal blizzard) updated for moonlight visibility with interactive mouse repulsion.
+ **Kyoto Lantern Lighting** — Atmospheric radial glow pulsing behind hero text to mimic traditional candlelight.

## What's New — v1.3.1 (March 2026)

- **JLPT N3 Expansion** — Robust set of N3 Kanji with readings, examples, and meanings.
- **Jisho.org Integration** — Direct "View on Jisho" links from all Kanji cards for stroke order and deep analysis.
- **Dakuten Mini-Quizzes** — Dedicated practice for voiced (゛) and semi-voiced (゜) characters in both Hiragana and Katakana.
- **High-Speed Quiz Workflow** — Toggleable "Are you sure?" confirmation dialog and 100% manual progression for zero-friction study.
- **Improved UX** — Entire settings rows are now clickable, and settings persist across sessions via localStorage.

---

## Features

- **Kana Mastery** — Interactive hiragana & katakana charts with unified Basic/Dakuten views and per-tab mini quizzes.
- **Kanji Study** — Comprehensive list (N5–N3) with readings, meanings, radicals, and "View on Jisho" integration.
- **Grammar Lessons** — 35+ patterns (N5–N3) with furigana-annotated example sentences.
- **Vocabulary Flashcards** — SRS-backed study system with flip cards and visual progress tracking.
- **Categories Study** — Vocabulary grouped by topic: Numbers, Days, Months, Body Parts, Colors, Family, Food, Animals, Places, and Time.
- **Work Essentials** — Dedicated industry-specific vocabulary for professional environments in Japan.
- **Smart Quizzes** — Multiple quiz modes including Multiple Choice and the new **Particle Fill-in-the-Blank**.
- **Mock JLPT Exams** — Realistic sequential exam simulation with timers, section rules, and per-section pass/fail metrics.
- **Wrong Answers Review** — Deep mistake analysis with data-driven explanations following every session.
- **Spaced Repetition (SRS)** — SM-2 algorithm tracks and schedules reviews automatically.
- **Progress Dashboard** — Score history, study streaks, and detailed performance visualization via Recharts.

---

## Why I Built This

I wanted a free, focused Japanese study tool that didn't hide core features behind a paywall. Most JLPT apps either charge monthly fees or show ads. This one doesn't.

It also became a proof of concept for AI-assisted development — I built it in Next.js, a framework I don't specialize in, intentionally. Every file the AI generated, I read and verified. The platform is live with real users not because AI wrote it, but because I understood what to ask for and what to check.

---

## Security

NihongoStudy takes user data seriously. Key measures in place:

- **Row Level Security (RLS)** enabled on all Supabase tables
- **HTTP Security Headers** — CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy on all routes
- **Rate Limiting** on all API endpoints
- **Sentry** error tracking and performance monitoring
- **Branch Protection** on main — all changes via Pull Request
- **Privacy Policy** published at /privacy
- **Philippines Data Privacy Act (RA 10173)** compliant

---

## Tech Stack

- **Frontend:** Next.js 16.2.1 (App Router, Turbopack), React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database + Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Error Monitoring:** Sentry
- **Charts:** Recharts
- **Deployment:** Vercel

---

## Local Setup

**Prerequisites:** Node.js 18+, Supabase account

```bash
# Clone the repo
git clone https://github.com/Nzo-Cloud/japanese-study-platform.git
cd japanese-study-platform

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the dev server
npm run dev
# Open http://localhost:3000
```

---

## Database Setup

```
1. Create a free project at supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL from /supabase/migrations/001_initial_schema.sql
4. Copy Project URL and Anon Key from Settings → API
5. Paste into your .env.local file
```

---

## Deployment

```
1. Push to GitHub
2. vercel.com → Import GitHub repo
3. Add environment variables:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SENTRY_AUTH_TOKEN
4. Deploy — live URL generated automatically
```

---

## Project Structure

```
├── app/
│   ├── (auth)/             # Login & signup
│   ├── api/                # API routes
│   ├── dashboard/          # Progress dashboard
│   ├── exam/               # Mock JLPT exam
│   ├── quiz/               # Smart quiz
│   └── study/              # Hiragana, Katakana, Kanji, Grammar, Categories
├── components/
│   ├── dashboard/          # StatsCard, ProgressChart
│   ├── quiz/               # QuizEngine, QuizQuestion, QuizResults
│   ├── study/              # KanaChart, KanjiCard, GrammarCard
│   └── ui/                 # Navbar, Button, Card, Modal, WhatsNewModal
├── data/                   # Static datasets (kanji, grammar, categories)
├── lib/                    # Supabase client, quiz generator, SRS engine
├── supabase/migrations/    # Database SQL
├── types/                  # TypeScript interfaces
```

---

## Support

This platform is completely free. If it helped your Japanese studies, consider buying me a coffee — it goes toward keeping the app running.

[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-orange?style=flat-square&logo=ko-fi)](https://ko-fi.com/kuwago)

---

## Built By

**Lorenzo Balitian** — Junior Software Developer, Davao, Philippines

[![Portfolio](https://img.shields.io/badge/Portfolio-View-blue?style=flat-square)](https://portfolio-xi-liart-nvfg0cuod0.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Nzo--Cloud-black?style=flat-square&logo=github)](https://github.com/Nzo-Cloud)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/lorenzo-balitian)
