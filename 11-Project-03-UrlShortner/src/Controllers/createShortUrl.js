import Url from '../Models/url.js'

const createShortUrl=async(req,res)=>{
  try{
    if(!req.body)return res.status(400).send({
      message:'Url is required'
    })
    const url=req.body.originalUrl;
    const response=await Url.create({originalUrl:url})
    res.status(201).send({
      message:"Url shortening performed Successfully",
      url:`${response.shortId}`
    })
  }catch(error){
     res.status(500).send({
      message:"Internal server error",
      error:error.message,
     })
  }
}

export default createShortUrl;