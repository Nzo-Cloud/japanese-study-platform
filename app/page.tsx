import Link from 'next/link';
import WhatsNewModal from '@/components/ui/WhatsNewModal';

/**
 * Landing page — hero section, feature highlights, and call to action.
 */
export default function HomePage() {
  const features = [
    {
      icon: 'あ',
      title: 'Kana Mastery',
      description: 'Learn all 46 hiragana and katakana with interactive charts and mini quizzes.',
    },
    {
      icon: '漢',
      title: 'Kanji Study',
      description: '100+ kanji with readings, meanings, radicals, and example sentences.',
    },
    {
      icon: '文',
      title: 'Grammar Lessons',
      description: '35+ grammar patterns from N5 to N3 with clear explanations.',
    },
    {
      icon: '📝',
      title: 'Smart Quizzes',
      description: 'Randomized multiple-choice quizzes that adapt to your JLPT level.',
    },
    {
      icon: '🧠',
      title: 'SRS Review',
      description: 'Spaced repetition system ensures you review items at the optimal time.',
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Dashboard with score history, study streaks, and category breakdowns.',
    },
  ];

  const levels = [
    { level: 'N5', label: 'Beginner', desc: 'Basic vocabulary and simple sentences' },
    { level: 'N4', label: 'Elementary', desc: 'Everyday conversations and basic reading' },
    { level: 'N3', label: 'Intermediate', desc: 'Natural speech and general topics' },
  ];

  return (
    <div>
      <WhatsNewModal />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Free JLPT Study Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Master{' '}
              <span className="text-primary font-jp">日本語</span>
              <br />
              <span className="text-foreground/80">Your Way</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10">
              The complete self-study platform for JLPT N5–N3. Learn kana, kanji, and grammar
              with smart quizzes and spaced repetition — all for free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 text-center"
              >
                Start Learning Free →
              </Link>
              <Link
                href="/study/hiragana"
                className="px-8 py-3.5 bg-surface text-foreground font-semibold rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-center"
              >
                Explore Content
              </Link>
            </div>
          </div>

          {/* Floating characters decoration */}
          <div className="absolute top-10 left-10 text-6xl opacity-5 font-jp select-none">あ</div>
          <div className="absolute top-20 right-20 text-8xl opacity-5 font-jp select-none">漢</div>
          <div className="absolute bottom-10 left-1/4 text-7xl opacity-5 font-jp select-none">カ</div>
          <div className="absolute bottom-20 right-1/3 text-5xl opacity-5 font-jp select-none">字</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted max-w-2xl mx-auto">
            A complete toolkit to prepare for the JLPT, from basic kana to advanced grammar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group bg-surface rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-primary/20 transition-colors font-jp">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JLPT Levels */}
      <section className="bg-surface-alt py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Level</h2>
            <p className="text-muted">Content organized by JLPT level for focused study.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {levels.map((l) => (
              <div
                key={l.level}
                className="bg-surface rounded-2xl border border-border p-8 text-center hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="text-4xl font-bold text-primary mb-2">{l.level}</div>
                <div className="font-semibold mb-2">{l.label}</div>
                <p className="text-sm text-muted">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            Join thousands of learners preparing for the JLPT. Create your free account and start studying today.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
