
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js' 

dotenv.config({
  path:'./.env'
})

const port =process.env.PORT||3000;

connectDB().then(
   app.listen(port,()=>{
      console.log(`☑️ Server listening on PORT ${port}`);
   })
).catch((e)=>{
   console.log(`❌ Server connection failed`,e);
})