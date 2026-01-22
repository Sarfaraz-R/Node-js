import Url from '../Models/url.js';

const getAllShortenedUrls=async (req,res)=>{
  try {
    const response = await Url.find();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({
      message:'Internal Server Error',
      error:error.message,
    })
  }
}
 
export  default getAllShortenedUrls;