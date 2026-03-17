import DakutenChart from '@/components/study/DakutenChart';
import { katakanaDakutenData } from '@/data/kana_dakuten';

export const metadata = {
  title: 'Katakana Dakuten & Handakuten — NihongoStudy',
  description: 'Master voiced (゛) and semi-voiced (゜) katakana characters.',
};

export default function KatakanaDakutenPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DakutenChart 
        groups={katakanaDakutenData} 
        title="カタカナ 濁音・半濁音 (Dakuten & Handakuten)" 
        type="katakana"
      />
    </div>
  );
}
