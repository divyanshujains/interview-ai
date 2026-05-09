import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { generateReportController, getLatestReportController, getHistoryController } from "../controllers/interviewcontroller.js";

import upload from "../middleware/multermiddleware.js";

const interviewRoutes = express.Router();

// Generate Interview Report
interviewRoutes.post("/generate", protect, upload.single("resume"),  generateReportController);

// Get Latest Interview Report
interviewRoutes.get("/latest", protect, getLatestReportController);

// Get Interview History
interviewRoutes.get("/history", protect, getHistoryController);

export default interviewRoutes;
