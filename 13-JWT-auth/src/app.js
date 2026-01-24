import express from 'express';
import signupRoute from './routes/signup.routes.js'
import loginRoutes from './routes/login.routes.js'
import cookieParser from 'cookie-parser';
import userProfileRoutes from './routes/userProfile.routes.js'
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/signup',signupRoute);
app.use('/login',loginRoutes);
app.use('/profile',userProfileRoutes)
export default app;