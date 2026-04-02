'use client';

import dynamic from 'next/dynamic';

const JourneyScene = dynamic(() => import('@/components/three/JourneyScene'), { ssr: false });

const cardBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,168,76,0.15)',
  borderRadius: '20px',
  padding: '36px 28px',
  textAlign: 'center',
  transition: 'border-color 0.2s',
};

export default function Home() {
  return (
    <main style={{ background: '#0a0815', color: '#f5efe6' }}>

      {/* 3D Hero Journey */}
      <JourneyScene />

      {/* ── SECTIONS ── */}
      <div style={{ position: 'relative', zIndex: 10, background: '#0a0815' }}>

        {/* ── WHY LEARN JAPANESE ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 32px 80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Noto Serif JP', serif", color: '#c9a84c', marginBottom: '12px', letterSpacing: '0.05em' }}>
            Why Learn Japanese?
          </h2>
          <p style={{ color: '#a89880', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 56px', lineHeight: 1.7 }}>
            One language opens a door. Japanese opens an entire world.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { icon: '✈️', title: 'Travel Local', desc: 'Navigate trains, menus, and shrines the way locals do — no translation app needed.' },
              { icon: '💼', title: 'Work in Japan', desc: 'JLPT N4 is required for most work visas. N2 opens corporate doors.' },
              { icon: '🎌', title: 'Culture', desc: 'Manga, anime, film, literature — all without subtitles or barriers.' },
              { icon: '🧠', title: 'Brain Training', desc: 'Learning kanji and grammar builds memory, focus, and cognitive flexibility.' },
            ].map((card) => (
              <div key={card.title} style={cardBase}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{card.icon}</div>
                <h3 style={{ fontFamily: "'Noto Serif JP', serif", color: '#e8d5a3', fontSize: '1.15rem', marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ color: '#7a6a5a', fontSize: '0.92rem', lineHeight: 1.65 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── JLPT LEVEL PATH ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontFamily: "'Noto Serif JP', serif", color: '#c9a84c', marginBottom: '12px' }}>
            Your JLPT Path
          </h2>
          <p style={{ color: '#a89880', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.7 }}>
            Start from zero. Go as far as you want. Every level is fully covered.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { level: 'N5', label: 'Beginner', desc: 'Hiragana, katakana, 100 kanji, basic phrases.', color: '#4caf8c' },
              { level: 'N4', label: 'Elementary', desc: '300 kanji, everyday conversation, visa-ready.', color: '#c9a84c' },
              { level: 'N3', label: 'Intermediate', desc: '650 kanji, news headlines, complex grammar.', color: '#e07b4a' },
              { level: 'N2', label: 'Advanced', desc: '1000 kanji, professional Japanese, near-fluent.', color: '#c05a8a' },
              { level: 'N1', label: 'Mastery', desc: '2000+ kanji, native media, full fluency.', color: '#7a5ac9' },
            ].map((n) => (
              <div key={n.level} style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${n.color}44`,
                borderRadius: '16px',
                padding: '28px 24px',
                minWidth: '160px',
                flex: '1 1 160px',
                maxWidth: '200px',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: n.color, fontFamily: "'Noto Serif JP', serif", marginBottom: '6px' }}>{n.level}</div>
                <div style={{ fontSize: '0.8rem', color: n.color, opacity: 0.8, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{n.label}</div>
                <p style={{ fontSize: '0.85rem', color: '#7a6a5a', lineHeight: 1.55 }}>{n.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES BENTO ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 32px 80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontFamily: "'Noto Serif JP', serif", color: '#c9a84c', marginBottom: '12px' }}>
            Everything You Need to Pass <span style={{ color: '#e8d5a3' }}>JLPT</span>
          </h2>
          <p style={{ color: '#a89880', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.7 }}>
            One platform. All levels. Completely free.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              { icon: '📝', title: 'Smart Quizzes', desc: 'Adaptive questions that get harder as you improve. Targets your exact weak points every session.', tag: 'All levels' },
              { icon: '🧠', title: 'Vocabulary SRS', desc: 'Spaced repetition flashcards that show you words right before you forget them. Science-backed.', tag: '6000+ words' },
              { icon: '漢', title: 'Kanji Mastery', desc: 'Stroke order animations, ON/KUN readings, radicals, and compound words — N5 through N1.', tag: '2136 kanji' },
              { icon: '🎯', title: 'Mock Exams', desc: 'Full timed JLPT simulations with section breakdowns and instant score reports.', tag: 'Realistic format' },
              { icon: '📖', title: 'Grammar Library', desc: 'Every grammar pattern explained in plain English with real example sentences and audio.', tag: 'N5–N1' },
              { icon: '📖', title: 'Grammar Library', desc: 'Every grammar pattern explained in plain English with real example sentences and audio.', tag: 'N5–N1' },
              { icon: '🔊', title: 'Listening Practice', desc: 'Native speaker audio for every quiz, flashcard, and grammar example. Train your ear daily.', tag: 'Native audio' },
            ].map((f, i) => (
              <div key={`${f.title}-${i}`} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '18px',
                padding: '36px 32px',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.72rem', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '3px 10px' }}>{f.tag}</div>
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Noto Serif JP', serif", color: '#e8d5a3', fontSize: '1.1rem', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#7a6a5a', fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ background: 'rgba(201,168,76,0.06)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)', padding: '48px 32px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '32px', textAlign: 'center' }}>
            {[
              { value: '100%', label: 'Free Forever' },
              { value: '6,000+', label: 'Vocabulary Words' },
              { value: '2,136', label: 'Kanji Covered' },
              { value: 'N5–N1', label: 'All JLPT Levels' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#c9a84c', fontFamily: "'Noto Serif JP', serif" }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#7a6a5a', marginTop: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ textAlign: 'center', padding: '120px 32px 100px' }}>
          <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#c9a84c', marginBottom: '12px', letterSpacing: '0.08em' }}>
            「努力は裏切らない」
          </div>
          <p style={{ color: '#7a6a5a', fontSize: '1rem', fontStyle: 'italic', marginBottom: '48px' }}>
            Hard work never betrays you.
          </p>
          <a href="/study" style={{
            display: 'inline-block',
            background: '#c9a84c',
            color: '#0a0815',
            fontFamily: "'Noto Serif JP', serif",
            fontSize: '1.1rem',
            fontWeight: 700,
            padding: '18px 52px',
            borderRadius: '999px',
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}>
            Begin Your Journey
          </a>
        </section>

      </div>
    </main>
  );
}
