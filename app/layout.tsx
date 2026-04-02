import type { Metadata } from 'next';
import { Geist, Geist_Mono, Cormorant_Garamond, Noto_Serif_JP } from 'next/font/google';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant',
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-jp',
});

export const metadata: Metadata = {
  title: 'NihongoStudy — JLPT Japanese Study Platform',
  description:
    'Master Japanese for JLPT N5–N3 with interactive kana charts, kanji flashcards, grammar lessons, smart quizzes, and spaced repetition.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${notoSerifJP.variable} antialiased`} suppressHydrationWarning>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-sm text-muted">
          <p>
            © {new Date().getFullYear()} NihongoStudy — Built by Lorenzo Balitian
            {' · '}
            <Link href="/privacy" className="text-muted text-xs hover:text-primary transition-all">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-2">
            <a 
              href="https://ko-fi.com/kuwago" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-all"
            >
              Support this project on Ko-fi ☕
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
