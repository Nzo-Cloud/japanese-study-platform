# 日本語 Study — Japanese Study Platform v2

A full-stack Japanese self-study web application for learners preparing for JLPT exams (N5–N3). Features interactive kana charts, kanji flashcards, grammar lessons, smart quizzes with spaced repetition, and a comprehensive progress dashboard.

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
- **Kanji Study** — 105 kanji (N5/N4) with readings, meanings, radicals, and examples
- **Grammar Lessons** — 35 grammar patterns (N5–N3) with example sentences
- **Smart Quizzes** — Multiple choice quizzes filtered by type and JLPT level
- **Mock JLPT Exams** — Timed mixed quizzes simulating real exam conditions
- **Spaced Repetition (SRS)** — SM-2 algorithm tracks and schedules reviews
- **Progress Dashboard** — Score history, study streaks, and category breakdowns
- **Authentication** — Email/password signup and login via Supabase Auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript, TailwindCSS |
| Backend | Next.js API Routes |
| Database + Auth | Supabase (PostgreSQL + Supabase Auth) |
| Deployment | Vercel (frontend) + Supabase (database) |

---

## Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Nzo-Cloud/japanese-study-platform.git
   cd japanese-study-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

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

---

## Database Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and run the SQL from `/supabase/migrations/001_initial_schema.sql`
4. Copy your **Project URL** and **Anon Key** from Settings → API
5. Paste them into your `.env.local` file

---

## Deployment (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy — live URL generated automatically

---

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login & signup pages
│   ├── api/                # API routes (profile, quiz-results, srs)
│   ├── dashboard/          # Progress dashboard
│   ├── exam/               # Mock JLPT exam
│   ├── quiz/               # Smart quiz
│   └── study/              # Hiragana, Katakana, Kanji, Grammar
├── components/             # React components
│   ├── dashboard/          # StatsCard, ProgressChart
│   ├── quiz/               # QuizEngine, QuizQuestion, QuizResults
│   ├── study/              # KanaChart, KanjiCard, GrammarCard
│   └── ui/                 # Navbar, Button, Card, Modal
├── data/                   # Static JSON datasets
├── lib/                    # Core libraries (Supabase, quiz generator, SRS engine)
├── supabase/migrations/    # Database migration SQL
└── types/                  # TypeScript interfaces
```

---

## Author

**Lorenzo Balitian**
- GitHub: [@Nzo-Cloud](https://github.com/Nzo-Cloud)
