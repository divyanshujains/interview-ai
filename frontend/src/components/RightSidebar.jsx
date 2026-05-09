import { ATSCard } from './ATSCard';
import { useAI } from '../context/AIContext';

export const RightSidebar = () => {
  const { interviewReport } = useAI();

  return (
    <aside className="w-full lg:w-80 border-l border-slate-200 bg-white/60 backdrop-blur-md p-6 overflow-y-auto">
      <div className="sticky top-0">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          AI Analysis
        </h2>
        {interviewReport ? (
          <ATSCard />
        ) : (
          <div className="text-slate-500 text-sm text-center mt-10">
            No profile analyzed yet. Create one to see your ATS Score and Skill Gaps.
          </div>
        )}
      </div>
    </aside>
  );
};
