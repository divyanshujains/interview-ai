import { createContext, useState, useContext, useCallback } from 'react';
import api from '../utils/api';

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);

  const analyzeProfile = async (formData) => {
    setIsAnalyzing(true);
    try {
      const response = await api.post('/interview/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newReport = response.data.interviewReport;
      setInterviewReport(newReport);
      
      // Immediately add the new report to the top of the history list
      setInterviewHistory(prev => [newReport, ...prev]);
      
      return newReport;
    } catch (error) {
      console.error('Error analyzing profile:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchLatestReport = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await api.get('/interview/latest');
      setInterviewReport(response.data.interviewReport);
      return response.data.interviewReport;
    } catch (error) {
      console.error('Error fetching latest report:', error);
      setInterviewReport(null);
      throw error;
    } finally {
      setIsFetching(false);
    }
  }, []);

  const [interviewHistory, setInterviewHistory] = useState([]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get('/interview/history');
      setInterviewHistory(response.data.history);
      return response.data.history;
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }, []);

  return (
    <AIContext.Provider value={{ 
      isAnalyzing, 
      isFetching,
      interviewReport, 
      setInterviewReport,
      interviewHistory,
      analyzeProfile, 
      fetchLatestReport,
      fetchHistory
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
