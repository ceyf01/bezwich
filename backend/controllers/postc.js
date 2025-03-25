import User from "../models/usermodel.js"
import Post from "../models/postmodel.js"
import cloudinary from "../utils/cloudinary.js"     

export const createPost = async (req, res) => {
    try {
        const {text,img} = req.body
        const userId=req.user.id.toString()
        const user=await User
        .findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        if(!text&&!img){
            return res.status(400).json({error:"Post must have text or"})
        }
        if(img){
            const uploadedResponse=await cloudinary.uploader.upload(img)
            img=uploadedResponse.secure_url
        }
        const newPost=new Post({
            user:userId,
            text,
            img
        })
        await newPost.save()
        res.status(201).json(newPost)


        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
        
    }
}
export const likeUnlikePost=async(req,res)=>{             
}
export const commentOnPost=async(req,res)=>{
}
export const deletePost=async(req,res)=>{
}