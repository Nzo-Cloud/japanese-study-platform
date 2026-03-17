import Link from 'next/link';

export const metadata = {
  title: 'Update History — NihongoStudy',
  description: 'Chronicling the journey of NihongoStudy. See what\'s new in latest versions.',
};

const updates = [
  {
    version: 'v1.2',
    date: 'March 17, 2026',
    title: 'Workplace & Character Mastery',
    changes: [
      {
        title: 'Dakuten & Handakuten Support',
        description: 'New interactive charts for voiced (゛) and semi-voiced (゜) characters in both Hiragana and Katakana. Master the toggle-based relationship between base and voiced characters.',
        link: '/study/hiragana/dakuten'
      },
      {
        title: 'Work Necessities Vocabulary',
        description: 'Curated vocabulary for 8 key industries: General Business, Food Service, Construction, Hospitality, Caregiving, Manufacturing, Retail, and Agriculture.',
        link: '/study/work-necessities'
      },
      {
        title: 'Dedicated Update History',
        description: 'Check past updates and follow our development journey on this new dedicated page.'
      }
    ]
  },
  {
    version: 'v1.1',
    date: 'March 13, 2026',
    title: 'Furigana & Categories',
    changes: [
      {
        title: 'Furigana Everywhere',
        description: 'Readings now appear above all kanji in example sentences for easier learning.'
      },
      {
        title: 'Categories Study Mode',
        description: 'New curated word lists! Master Numbers, Days, Body Parts, Colors, Family, Food, Animals, Places & more.',
        link: '/study/categories'
      },
      {
        title: 'Quiz Confirmation Dialog',
        description: 'A safety dialog prevents accidental misclicks in Quizzes and Mock Exams.'
      }
    ]
  },
  {
    version: 'v1.0',
    date: 'March 8, 2026',
    title: 'The Grand Opening',
    changes: [
      {
        title: 'Initial Release',
        description: 'Launched NihongoStudy with core features: Hiragana, Katakana, Kanji, Grammar, and a Smart Quiz Engine.'
      }
    ]
  }
];

export default function UpdateHistoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Update <span className="text-primary">History</span></h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          We're constantly improving to make your Japanese learning journey smoother and more enjoyable.
        </p>
      </div>

      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {updates.map((update, index) => (
          <div key={update.version} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                  {update.version}
                </span>
                <time className="text-xs text-muted font-medium">{update.date}</time>
              </div>
              
              <h2 className="text-xl font-bold mb-4">{update.title}</h2>
              
              <div className="space-y-4">
                {update.changes.map((change, cIdx) => (
                  <div key={cIdx} className="relative pl-4 border-l-2 border-primary/20">
                    <h3 className="text-sm font-bold text-foreground/90">{change.title}</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{change.description}</p>
                    {change.link && (
                      <Link 
                        href={change.link} 
                        className="inline-flex items-center mt-2 text-[10px] font-bold text-primary hover:underline group/link"
                      >
                        Try it out
                        <svg className="w-2.5 h-2.5 ml-1 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all hover:shadow-lg hover:-translate-y-0.5">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
