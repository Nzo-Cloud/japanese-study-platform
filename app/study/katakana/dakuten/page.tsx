import DakutenChart from '@/components/study/DakutenChart';
import DakutenMiniQuiz from '@/components/study/DakutenMiniQuiz';
import { katakanaDakutenData } from '@/data/kana_dakuten';
import { Kana } from '@/types';

export const metadata = {
  title: 'Katakana Dakuten & Handakuten — NihongoStudy',
  description: 'Master voiced (゛) and semi-voiced (゜) katakana characters.',
};

export default function KatakanaDakutenPage() {
  const dakutenPool: Kana[] = katakanaDakutenData.flatMap(g => 
    g.pairs.map(p => ({
      id: `kd-${p.voiced.character}`,
      character: p.voiced.character,
      romanization: p.voiced.romanization,
      type: 'katakana'
    }))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <DakutenChart 
            groups={katakanaDakutenData} 
            title="カタカナ 濁音・半濁音 (Dakuten & Handakuten)" 
            type="katakana"
          />
        </div>
        <div>
          <DakutenMiniQuiz kanaPool={dakutenPool} />
        </div>
      </div>
    </div>
  );
}
