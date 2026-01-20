 // jason middleware
import express from 'express';
import urlRoutes from'./Routes/urlRoutes.js'
import analytics from './Routes/analytics.js';

const app =express();

app.use(express.json());

app.use('/api/urls',urlRoutes);
app.use('/api/analytics',analytics);
export default app;
