
// this takes email user name password hashes the password and saves into db and return jwt token to the client
import jwt from'jsonwebtoken'
import User from '../models/user.model.js';

const handleSignup=async (req,res,next)=>{
  const {username,email,password} = req.body;
   try{
     User.create({
      username,
      email,
      password,
     });
     const token=jwt.sign(email,"secret");
     res.cookie("token",token);
     res.send('User created successfully');
   }catch(error){
    next(error);
   }
}
export default handleSignup;