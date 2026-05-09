import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import interviewRoutes from './routes/interview.routes.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 👈 ADD THIS

// Routes
app.use('/api/auth', authRoutes);

app.use("/api/interview", interviewRoutes);


export default app;