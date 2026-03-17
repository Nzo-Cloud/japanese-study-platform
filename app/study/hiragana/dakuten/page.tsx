import DakutenChart from '@/components/study/DakutenChart';
import { hiraganaDakutenData } from '@/data/kana_dakuten';

export const metadata = {
  title: 'Hiragana Dakuten & Handakuten — NihongoStudy',
  description: 'Master voiced (゛) and semi-voiced (゜) hiragana characters.',
};

export default function HiraganaDakutenPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DakutenChart 
        groups={hiraganaDakutenData} 
        title="ひらがな 濁音・半濁音 (Dakuten & Handakuten)" 
        type="hiragana"
      />
    </div>
  );
}
