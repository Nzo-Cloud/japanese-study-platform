import KanaChart from '@/components/study/KanaChart';
import hiraganaData from '@/data/hiragana.json';
import { Kana } from '@/types';

export const metadata = {
  title: 'Hiragana — NihongoStudy',
  description: 'Learn all 46 hiragana characters with interactive chart and mini quiz.',
};

export default function HiraganaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <KanaChart data={hiraganaData as Kana[]} type="hiragana" />
    </div>
  );
}
