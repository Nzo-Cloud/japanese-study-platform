import WorkNecessities from '@/components/study/WorkNecessities';

export const metadata = {
  title: 'Work Necessities — NihongoStudy',
  description: 'Master Japanese vocabulary and phrases for different industries and workplaces.',
};

export default function WorkNecessitiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2"><span className="text-primary font-jp">仕事の基本</span> Work Necessities</h1>
        <p className="text-lg text-muted">
          Essential vocabulary and real-world contextual sentences for various professional fields in Japan. 
          Perfect for those starting or looking to transition into a new industry.
        </p>
      </div>

      <WorkNecessities />
      
      {/* Quick Guide / Footer */}
      <div className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/10 max-w-4xl mx-auto text-center">
        <h3 className="text-xl font-bold mb-3 text-primary">Need more specific terms?</h3>
        <p className="text-foreground/70 mb-6">
          This is a curated list of high-impact vocabulary. For more advanced or niche technical terms, 
          check out our Kanji study mode organized by frequency.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            General Office
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary/50"></span>
            Technical Fields
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Service Industry
          </div>
        </div>
      </div>
    </div>
  );
}
