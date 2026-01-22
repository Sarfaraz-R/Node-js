import mongoose from "mongoose";
import dotenv from 'dotenv'



const connectDB=async()=>{
  try{
  await mongoose.connect(process.env.MONGO_URI);
   console.log('DataBase connection Successful');
  }catch(error){
   console.log('Unable to connect to database');
   
  }
}

export default connectDB;