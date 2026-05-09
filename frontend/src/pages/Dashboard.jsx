import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextArea, Loader } from '@gravity-ui/uikit';
import { useAI } from '../context/AIContext';

export const Dashboard = () => {
  const [answer, setAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { isAnalyzing, isFetching, interviewReport, fetchLatestReport } = useAI();
  const navigate = useNavigate();

  useEffect(() => {
    const loadReport = async () => {
      if (!interviewReport) {
        try {
          const report = await fetchLatestReport();
          if (!report) {
            navigate('/setup');
          }
        } catch (e) {
          navigate('/setup');
        }
      }
    };
    loadReport();
  }, [interviewReport, fetchLatestReport, navigate]);

  if (isFetching || !interviewReport) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F4F6F8]">
        <Loader size="l" />
        <span className="ml-4 text-slate-600 font-semibold">Loading Dashboard...</span>
      </div>
    );
  }

  const allQuestions = [
    ...(interviewReport.technicalQuestions || []),
    ...(interviewReport.behavioralQuestions || [])
  ];

  return (
    <main className="w-full h-full p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
            
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Interview Questions</h1>
              <p className="text-slate-500 mt-2">
                Review these tailored questions to prepare for your interview.
              </p>
            </header>

            {allQuestions.length > 0 ? (
              <div className="grid gap-6">
                {allQuestions.map((q, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-slate-800 flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm shrink-0">Q{idx + 1}</span>
                      {q.question}
                    </h3>
                    
                    <div className="mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm font-semibold text-slate-600 mb-1 uppercase tracking-wider text-xs">Interviewer's Intention</p>
                      <p className="text-slate-700 text-sm">{q.intention}</p>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm font-semibold text-blue-700 mb-1 uppercase tracking-wider text-xs">Suggested Approach</p>
                      <p className="text-slate-700 text-sm">{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-200">
                No questions available in this report.
              </div>
            )}

            {/* Preparation Plan Section */}
            {interviewReport.preparationPlan && interviewReport.preparationPlan.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Preparation Plan</h2>
                <div className="grid gap-4">
                  {interviewReport.preparationPlan.map((plan, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          Day {plan.day}
                        </span>
                        <h3 className="font-semibold text-slate-800">{plan.focus}</h3>
                      </div>
                      <div className="text-slate-600 text-sm mt-2">
                        <ul className="list-disc pl-5">
                          {plan.tasks && plan.tasks.map((task, i) => (
                            <li key={i}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
      </div>
    </main>
  );
};

