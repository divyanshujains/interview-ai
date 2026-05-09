import InterviewReport from "../models/interviewreport.model.js";
import { generateInterviewReport } from "../services/ai.service.js";
import { PDFParse } from "pdf-parse";

export const generateReportController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const parser = new PDFParse({ data: req.file.buffer });
    const data = await parser.getText();
    const resumeText = data.text;

    const { selfDescription, jobDescription } = req.body;

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReport.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
};

export const getLatestReportController = async (req, res) => {
  try {
    const latestReport = await InterviewReport.findOne({ user: req.user.id })
      .sort({ _id: -1 }) // Sort by newest first
      .lean()
      .exec();

    if (!latestReport) {
      return res.status(404).json({ message: "No report found" });
    }

    res.status(200).json({
      message: "Latest report retrieved successfully",
      interviewReport: latestReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving report" });
  }
};

export const getHistoryController = async (req, res) => {
  try {
    const history = await InterviewReport.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    res.status(200).json({
      message: "History retrieved successfully",
      history,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving history" });
  }
};
