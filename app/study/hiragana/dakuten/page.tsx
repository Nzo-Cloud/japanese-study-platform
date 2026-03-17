import DakutenChart from '@/components/study/DakutenChart';
import DakutenMiniQuiz from '@/components/study/DakutenMiniQuiz';
import { hiraganaDakutenData } from '@/data/kana_dakuten';
import { Kana } from '@/types';

export const metadata = {
  title: 'Hiragana Dakuten & Handakuten — NihongoStudy',
  description: 'Master voiced (゛) and semi-voiced (゜) hiragana characters.',
};

export default function HiraganaDakutenPage() {
  const dakutenPool: Kana[] = hiraganaDakutenData.flatMap(g => 
    g.pairs.map(p => ({
      id: `hd-${p.voiced.character}`,
      character: p.voiced.character,
      romanization: p.voiced.romanization,
      type: 'hiragana'
    }))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <DakutenChart 
            groups={hiraganaDakutenData} 
            title="ひらがな 濁音・半濁音 (Dakuten & Handakuten)" 
            type="hiragana"
          />
        </div>
        <div>
          <DakutenMiniQuiz kanaPool={dakutenPool} />
        </div>
      </div>
    </div>
  );
}
