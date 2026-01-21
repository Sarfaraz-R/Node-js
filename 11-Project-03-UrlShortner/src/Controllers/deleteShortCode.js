import Url from '../Models/url.js';


const deleteShortCode=async(req,res)=>{
  try{
    const shortId=req.params.id;
    const response=await Url.deleteOne({shortId:shortId});
    if(response.deletedCount===0)return res.status(404).send({
      message:'Invalid shortId',
    })
    res.status(200).send({
      message:`ShortId (${shortId}) deleted`
    })
  }catch(error){
    res.status(500).send({
      message:'Internal Server Error',
      error:error.message,
    })
  }
}
export default deleteShortCode;