import mongoose from "mongoose";
const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        max:500
    },
    img:{
        type:String
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            text:{
                type:String,
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
        ],


},{timestamps:true})
const Post=mongoose.model("Post",postSchema)
export default Post  