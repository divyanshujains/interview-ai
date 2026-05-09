import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext';
import { useEffect } from 'react';

export const Profile = () => {
  const { user } = useAuth();
  const { interviewHistory, fetchHistory } = useAI();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <main className="w-full h-full p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-2">Manage your account and view your progress.</p>
        </header>

        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1">Name</label>
                <p className="text-slate-800 font-medium">{user?.name || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1">Email</label>
                <p className="text-slate-800 font-medium">{user?.email || 'Loading...'}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Statistics</h2>
            <div className="bg-[#F4F6F8] rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200">
              <span className="text-4xl font-bold text-blue-500">{interviewHistory?.length || 0}</span>
              <span className="text-slate-500 text-sm mt-2">Interviews Analyzed</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
