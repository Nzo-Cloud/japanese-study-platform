import Link from 'next/link';
import WhatsNewModal from '@/components/ui/WhatsNewModal';
import SakuraPetals from '@/components/ui/SakuraPetals';
import SakuraGrove from '@/components/ui/SakuraTree';
import JapaneseCastle from '@/components/ui/JapaneseCastle';
import HangingLantern from '@/components/ui/HangingLantern';

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
      title: 'Kanji Mastery',
      description: 'N5–N3 kanji with readings, radicals, and example sentences.',
    },
    {
      icon: '🔍',
      title: 'Jisho Integration',
      description: 'Deep-dive into any Kanji with direct links to Jisho.org for stroke orders and more.',
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
      icon: '💼',
      title: 'Work Necessities',
      description: 'Specialized vocabulary for the workplace: office supplies, electronics, and professional tools.',
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
    { level: 'N3', label: 'Intermediate', desc: 'Robust natural speech support — Now Fully Live!' },
  ];

  return (
    <div className="relative overflow-hidden bg-background">
      <WhatsNewModal />
      <SakuraPetals />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Lantern Glow Pulse */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,rgba(26,26,27,0)_70%)] animate-glow-pulse pointer-events-none z-0" />

        <HangingLantern className="left-8 top-0" />
        <HangingLantern className="right-8 top-0" style={{ animationDelay: '1s' }} />

        <JapaneseCastle />
        <SakuraGrove />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="text-left max-w-2xl animate-shadow-fade">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                v1.5 Live — Study Arsenal Update
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 font-serif leading-tight text-foreground drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                Master <span className="text-primary font-jp">日本語</span>
                <br />
                <span className="text-foreground/80 italic font-medium">With Elegance</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted font-normal tracking-wide max-w-xl mb-12 leading-relaxed">
                Step into a high-end self-study platform.
                Experience Japanese mastery through the lens of Kyoto&apos;s timeless nighttime beauty.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  href="/signup"
                  className="px-10 py-4 bg-accent text-white font-semibold rounded-xl hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all shadow-lg shadow-accent/20 hover:scale-105 text-center"
                >
                  Join the Journey
                </Link>
                <Link
                  href="/study/hiragana"
                  className="px-10 py-4 bg-secondary text-foreground font-semibold rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all text-center"
                >
                  Explore Lessons
                </Link>
              </div>
            </div>

            {/* Vertical Accent Text - Shifted right and layered */}
            <div className="hidden lg:block animate-shadow-fade relative z-[15] translate-x-12" style={{ animationDelay: '0.4s' }}>
              <div className="writing-vertical text-6xl font-serif text-primary/30 select-none animate-pulse drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                努力は裏切らない
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20 animate-shadow-fade">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif mb-6 text-foreground">Moonlit Mastery</h2>
          <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Beautifully designed tools for the serious learner, refined under the Kyoto moon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group bg-surface/40 backdrop-blur-sm rounded-2xl border border-border p-8 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-shadow-fade"
              style={{ animationDelay: `${0.1 * i + 0.5}s` }}
            >
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-primary/10 transition-colors font-jp border border-primary/20 text-primary">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 font-serif text-foreground">{feature.title}</h3>
              <p className="text-base text-muted leading-relaxed font-sans">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JLPT Levels */}
      <section className="relative z-10 bg-primary/[0.02] py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-shadow-fade">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4 text-foreground">Select Your Path</h2>
            <p className="text-muted text-lg">Curated progression for the modern samurai of language.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {levels.map((l, i) => (
              <div
                key={l.level}
                className="bg-surface rounded-2xl border border-border p-10 text-center hover:border-primary/40 hover:shadow-xl hover:scale-105 transition-all duration-500 animate-shadow-fade"
                style={{ animationDelay: `${0.2 * i + 0.8}s` }}
              >
                <div className="text-5xl font-bold text-primary mb-4 font-serif text-shadow-sm">{l.level}</div>
                <div className="text-xl font-bold mb-3 text-foreground/90">{l.label}</div>
                <p className="text-muted leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden bg-secondary border border-primary/20 rounded-[2.5rem] p-12 sm:p-20 text-center text-foreground shadow-2xl animate-shadow-fade">
          {/* Night texture overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '48px 48px' }} />

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold font-serif mb-6 leading-tight text-foreground drop-shadow-md">Step Into the Moonlight</h2>
            <p className="text-muted max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Begin your descent into the depth of Japanese fluency today. Join our elite community.
            </p>
            <Link
              href="/signup"
              className="inline-block px-12 py-5 bg-primary text-background font-bold rounded-2xl hover:brightness-110 hover:scale-105 transition-all shadow-2xl shadow-primary/20 text-lg"
            >
              Start Learning Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
