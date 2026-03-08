import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-sm text-muted">
          <p>© {new Date().getFullYear()} NihongoStudy — Built by Lorenzo Balitian</p>
        </footer>
      </body>
    </html>
  );
}
