import express from "express";
import DBConnection from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
const app=express();
DBConnection();
app.use(express.json());
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
export default app;