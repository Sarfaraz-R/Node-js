
import userModel from "../models/user.model.js";


const handleLogin=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
      const user=await userModel.findOne({email:email});
      if(!user)return res.send('invalid username or password');
      const isValidPassword=await user.isValidPassword(password);
      if(!isValidPassword)return res.send('invalid username or password');
      res.send(`lo bhai hogaya login`);
    } catch (error) {
      next(error);
    }
}

export default handleLogin;