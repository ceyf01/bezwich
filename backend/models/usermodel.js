import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6

    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }

    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }

    ],
    profilePic :{
        type:String,
        default:"",

    },
    coverImg:{
        type:String,
        default:"",

    },
    link:{
        type:String,
        default:"",

    },
    bio:{
        type:String,
        default:"",

    },
    likedPosts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[]
        }

    ],



},{timestamps:true})
const User= mongoose.model("User",userSchema)
export default User