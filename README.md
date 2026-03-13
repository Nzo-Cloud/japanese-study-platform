<<<<<<< HEAD
# 日本語 Study — Japanese Study Platform v2
=======
# NihongoStudy 🎌
>>>>>>> eed5f22 (docs: update README v1.1)

> Learn Japanese at your own pace. Free, forever.

A full-stack Japanese self-study platform for learners preparing for JLPT N5–N3. Built with real learners in mind — not just flashcards, but a complete study system with spaced repetition, mock exams, and now category-based vocabulary study.

[![Live Site](https://img.shields.io/badge/Live%20Site-nihongostudy.vercel.app-red?style=flat-square)](https://japanese-study-platform.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Nzo--Cloud-black?style=flat-square&logo=github)](https://github.com/Nzo-Cloud/japanese-study-platform)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

---

🌐 **Live Demo:** [japanese-study-platform.vercel.app](https://japanese-study-platform.vercel.app)

---

## From v1 to v2

This project is the second iteration of a Japanese learning platform, rebuilt from the ground up with a full-stack architecture.

| | v1 | v2 |
|---|---|---|
| **Stack** | Vanilla HTML + CSS + JavaScript | Next.js 14 + TypeScript + Supabase |
| **Hosting** | Netlify (static) | Vercel + Supabase (full-stack) |
| **Auth** | None | Email/password via Supabase Auth |
| **Database** | None (JSON files only) | PostgreSQL (Supabase) |
| **Scope** | Hiragana quiz only (N5) | Hiragana, Katakana, Kanji, Grammar (N5–N3) |
| **Progress Tracking** | None | Per-user dashboard with score history |
| **Spaced Repetition** | None | SM-2 algorithm (SRS) |
| **Quiz Types** | Hiragana recognition only | Kana, Kanji, Grammar, Mixed, Mock Exam |

v1 is still live at [japanese-learning-website.netlify.app](https://japanese-learning-website.netlify.app)

---

## Features

- **Kana Learning** — Interactive hiragana & katakana charts with mini quiz mode
- **Kanji Study** — 105 kanji (N5/N4) with readings, meanings, radicals, and furigana on all example sentences
- **Grammar Lessons** — 35 grammar patterns (N5–N3) with furigana-annotated example sentences
- **Categories Study** — Vocabulary grouped by topic: Numbers, Days, Months, Body Parts, Colors, Family, Food, Animals, Places, and Time
- **Smart Quizzes** — Multiple choice quizzes with confirmation dialog to prevent accidental misclicks
- **Mock JLPT Exams** — Timed mixed quizzes simulating real exam conditions
- **Spaced Repetition (SRS)** — SM-2 algorithm tracks and schedules reviews automatically
- **Progress Dashboard** — Score history, study streaks, and category breakdowns
- **Authentication** — Email/password signup and login via Supabase Auth

---

<<<<<<< HEAD
## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript, TailwindCSS |
| Backend | Next.js API Routes |
| Database + Auth | Supabase (PostgreSQL + Supabase Auth) |
| Deployment | Vercel (frontend) + Supabase (database) |
=======
## What's New — v1.1 (March 2026)

- **Furigana on all kanji** — Every kanji in every example sentence now shows its reading above it, making sentences accessible for all levels
- **Quiz confirmation dialog** — A confirmation step before submitting answers in Quiz and Mock Exam modes prevents accidental submissions
- **Categories study mode** — 10 thematic vocabulary categories added under the Study menu, each with 10+ words with furigana, romaji, and English meanings
- **What's New modal** — Users see a summary of recent updates on each visit to the homepage

---

## Why I Built This

I wanted a free, focused Japanese study tool that didn't hide core features behind a paywall. Most JLPT apps either charge monthly fees or show ads. This one doesn't.

It also became a proof of concept for AI-assisted development — I built it in Next.js, a framework I don't specialize in, intentionally. Every file the AI generated, I read and verified. The platform is live with real users not because AI wrote it, but because I understood what to ask for and what to check.

---

## Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Next.js 14 App Router | SEO-friendly, fast, free on Vercel |
| Database + Auth | Supabase | Free tier, built-in auth, Row Level Security |
| SRS Algorithm | SM-2 | Industry standard for spaced repetition |
| Furigana | Static ruby tags in JSON | Zero runtime cost, no library bloat |
| Deployment | Vercel | Free, auto-deploys on push to main |

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database + Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Deployment:** Vercel
>>>>>>> eed5f22 (docs: update README v1.1)

---

## Local Setup

<<<<<<< HEAD
1. **Clone the repo**
   ```bash
   git clone https://github.com/Nzo-Cloud/japanese-study-platform.git
   cd japanese-study-platform
   ```
=======
**Prerequisites:** Node.js 18+, Supabase account
>>>>>>> eed5f22 (docs: update README v1.1)

```bash
# Clone the repo
git clone https://github.com/Nzo-Cloud/japanese-study-platform.git
cd japanese-study-platform

<<<<<<< HEAD
3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)
=======
# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the dev server
npm run dev
# Open http://localhost:3000
```
>>>>>>> eed5f22 (docs: update README v1.1)

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
<<<<<<< HEAD

## Deployment (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy — live URL generated automatically
=======

## Deployment

```
1. Push to GitHub
2. vercel.com → Import GitHub repo
3. Add environment variables:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy — live URL generated automatically
```
>>>>>>> eed5f22 (docs: update README v1.1)

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
└── types/                  # TypeScript interfaces
```

---
<<<<<<< HEAD

## Author

**Lorenzo Balitian**
- GitHub: [@Nzo-Cloud](https://github.com/Nzo-Cloud)
=======

## Support

This platform is completely free. If it helped your Japanese studies, consider buying me a coffee — it goes toward keeping the app running.

[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-orange?style=flat-square&logo=ko-fi)](https://ko-fi.com/kuwago)

---

## Built By

**Lorenzo Balitian** — Junior Software Developer, Davao, Philippines

[![Portfolio](https://img.shields.io/badge/Portfolio-View-blue?style=flat-square)](https://portfolio-xi-liart-nvfg0cuod0.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Nzo--Cloud-black?style=flat-square&logo=github)](https://github.com/Nzo-Cloud)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/lorenzo-balitian)
>>>>>>> eed5f22 (docs: update README v1.1)
