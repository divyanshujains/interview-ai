import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { generateReportController } from "../controllers/interviewcontroller.js";

import upload from "../middleware/multermiddleware.js";

const interviewRoutes = express.Router();

// Generate Interview Report
interviewRoutes.post("/generate", protect, upload.single("resume"),  generateReportController);

export default interviewRoutes;
