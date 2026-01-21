import mongoose from "mongoose";
import shortid from "shortid";

const urlSchema=mongoose.Schema({
   shortId:{
     type:String,
     default:shortid.generate,
     unique:true
   },
   originalUrl:{
     type:String,
     required:true,
   },
   analytics : [{timeStamps: {
    type:Date,
    default:Date.now,
   }}]

},{timestamps:true});

const model=mongoose.model('Url',urlSchema);

export default model;