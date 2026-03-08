import KanaChart from '@/components/study/KanaChart';
import katakanaData from '@/data/katakana.json';
import { Kana } from '@/types';

export const metadata = {
  title: 'Katakana — NihongoStudy',
  description: 'Learn all 46 katakana characters with interactive chart and mini quiz.',
};

export default function KatakanaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <KanaChart data={katakanaData as Kana[]} type="katakana" />
    </div>
  );
}
