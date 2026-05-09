import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextArea, Text } from '@gravity-ui/uikit';
import { useAI } from '../context/AIContext';

export const Setup = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { analyzeProfile, isAnalyzing, setInterviewReport } = useAI();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError('File size must be less than 3MB');
        setResumeFile(null);
        e.target.value = null; // reset input
      } else if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setResumeFile(null);
        e.target.value = null; // reset input
      } else {
        setError('');
        setResumeFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!jobDescription.trim() || !selfDescription.trim() || !resumeFile) {
      setError('Please fill in all fields and upload a resume');
      return;
    }

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);
    formData.append('resume', resumeFile);

    try {
      await analyzeProfile(formData);
      navigate('/'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing profile. Please try again.');
    }
  };

  return (
    <main className="w-full h-full overflow-y-auto py-10 px-6 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Profile Setup</h2>
        <p className="text-slate-500 text-center mb-8">Tell us about the role and yourself to generate your tailored interview profile.</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
            <TextArea 
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)} 
              size="l" 
              placeholder="Paste the job description here..." 
              minRows={5}
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Self Description</label>
            <TextArea 
              value={selfDescription} 
              onChange={(e) => setSelfDescription(e.target.value)} 
              size="l" 
              placeholder="Tell us about your background and experience..." 
              minRows={4}
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Resume (PDF, Max 3MB)</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              disabled={isAnalyzing}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {resumeFile && <Text color="positive" className="mt-2 block">Selected: {resumeFile.name}</Text>}
          </div>

          <Button type="submit" view="action" size="l" loading={isAnalyzing} className="mt-4 w-full">
            {isAnalyzing ? 'Analyzing Profile...' : 'Generate Profile'}
          </Button>
        </form>
      </div>
    </main>
  );
};
