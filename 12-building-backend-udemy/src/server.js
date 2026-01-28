import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config({
  path:"./.env"
})

const port=process.env.PORT||3000;

connectDB().then(()=>{
  app.listen(port,()=>{
   console.log(`Server listening on PORT : ${port}`);
  })
}).catch((err)=>{
  console.log(`DB connection failed`,err);
  process.exit(1);
});
