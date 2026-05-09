import { useAI } from '../context/AIContext';
import { SkillBadge } from './SkillBadge';

export const ATSCard = () => {
  const { interviewReport } = useAI();
  
  if (!interviewReport) return null;

  const score = interviewReport.matchScore || 0;
  
  // A simple circular progress SVG
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">ATS Match Score</h3>
        <div className="relative flex items-center justify-center">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              className="text-slate-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
            <circle
              className="text-blue-500 transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
          </svg>
          <span className="absolute text-3xl font-bold text-slate-800">{score}%</span>
        </div>
      </div>

      {interviewReport.skillGaps && interviewReport.skillGaps.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Skill Gaps</h4>
          <div className="flex flex-wrap gap-2">
            {interviewReport.skillGaps.map((gap, index) => {
              // Map severity to theme
              let theme = "normal";
              if (gap.severity === "high") theme = "danger";
              if (gap.severity === "medium") theme = "warning";
              if (gap.severity === "low") theme = "info";

              return (
                <SkillBadge key={index} skill={gap.skill} theme={theme} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
