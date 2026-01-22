import Url from'../Models/url.js'

const analytics=async(req,res)=>{
  try{
     const shortId=req.params.id;
     const data=await Url.findOne({shortId:shortId});
     if(!data)return res.status(404).send({
       message:'Invalid shortId'
     })
     res.status(200).send({
       clicks:data.analytics.length,
       analytics:data.analytics,
     })
  }catch(error){
     res.status(500).send({
      message:'Internal Server error',
      error:error.message,
     })
  }
}
export default analytics;