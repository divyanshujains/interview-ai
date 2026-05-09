import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../context/AIContext';
import { Loader } from '@gravity-ui/uikit';

export const History = () => {
  const { fetchHistory, interviewHistory, setInterviewReport } = useAI();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      await fetchHistory();
      setLoading(false);
    };
    loadData();
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size="l" />
      </div>
    );
  }

  return (
    <main className="w-full h-full p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Interview History</h1>
          <p className="text-slate-500 mt-2">View your past AI-generated interview profiles and scores.</p>
        </header>

        {interviewHistory.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
            No history found. Try analyzing a new profile!
          </div>
        ) : (
          <div className="grid gap-4">
            {interviewHistory.map((report) => (
              <div key={report._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{report.jobDescription}</p>
                  <button 
                    onClick={() => {
                      setInterviewReport(report);
                      navigate('/');
                    }}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                  >
                    View Report &rarr;
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-blue-600">{report.matchScore || 0}%</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Match Score</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
