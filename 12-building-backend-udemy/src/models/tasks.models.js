import mongoose, { Schema } from 'mongoose';

import { TaskStatusEnum, AvailableTaskStatus } from '../constants/constants.js';

const taskSchema = new Schema(
  {
    title:{
      type:String,
      required:true,
      trim:true
    },
    description:{
      type:String,
    },
    project:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Project',
      required:true,
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
      type:String,
      enum:AvailableTaskStatus,
      default:TaskStatusEnum.TODO
    },
    attachment:{
       type:[{
        url:String,
        MimeType:String,
        size:number
       }],
       default:[],
    }
  },
  {
    timestamps: true,
  },
);


export const taskModel=mongoose.model("Task",taskSchema);