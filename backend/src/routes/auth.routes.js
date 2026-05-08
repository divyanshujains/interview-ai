import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/authcontroller.js";

import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// 🔐 Auth Routes
router.post("/register", registerUser); // Register
router.post("/login", loginUser); // Login
router.post("/logout", logoutUser); // Logout

// 👤 User Routes
router.get("/profile", protect,  getUserProfile); // Get logged-in user

export default router;
