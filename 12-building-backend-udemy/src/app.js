import express from 'express';
import cors from 'cors';
import healthCheckRoute from './routes/healthCheck.routes.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json({ limit: '16kb' }));

app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static('public'));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'https://localhost:5137',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  }),
);

app.use(cookieParser());

app.use('/api/healthcheck', healthCheckRoute);
app.use('/api/auth', authRouter);

export default app;
