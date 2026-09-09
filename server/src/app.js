import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import preparationSessionRoutes from './routes/preparationSessionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import codingProblemRoutes from './routes/coding.problems.route.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser()); 

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'prepwise-ai-server' });
});

app.use('/api/coding-problems', codingProblemRoutes)
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/preparation-sessions', preparationSessionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;