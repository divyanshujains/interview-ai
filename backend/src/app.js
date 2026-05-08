import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import interviewRoutes from './routes/interview.routes.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 👈 ADD THIS

// Routes
app.use('/api/auth', authRoutes);

app.use("/api/interview", interviewRoutes);


export default app;