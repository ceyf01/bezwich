import User from "../models/usermodel.js"
import Post from "../models/postmodel.js"
import Notification from "../models/notifmodel.js"
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
    try {
        const userId=req.user._id;
        const{id:postId}=req.params
        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const userLiked=post.likes.includes(userId)
        if(userLiked){
            //unlike
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}})
            res.status(200).json({message:"Post unliked"})
        }
        else {
            //like
            post.likes.push(userId)
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}})
            await post.save()
            const notification= new Notification({
                from:userId,
                to:post.user,
                type:"like",
                read:false
            })
            await notification.save()
            res.status(200).json({message:"Post liked "})
        }   
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})    
        
    }           
}


export const commentOnPost=async(req,res)=>{
    try {
        const userId=req.user._id
        const {postId}=req.params
        const {text}=req.body
        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const newComment={
            text,
            user:userId
        }
        post.comments.push(newComment)
        await post.save()
        const notification=new Notification({
            from:userId,
            to:post.user,
            type:"comment",
            read:false
        })
        await notification.save()
        res.status(200).json(post)
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
        
    }
}
export const deletePost=async(req,res)=>{
    try {
        const userId=req.user._id
        const {postId}=req.params
        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        if(post.user.toString()!==userId){
            return res.status(401).json({error:"Unauthorized"})
        }
        await Post.findByIdAndDelete(postId)
        res.status(200).json({message:"Post deleted"})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
        

    }
}
export const getLikedPosts=async(req,res)=>{   
    const userId=req.user._id
    try {
        const user=await   User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        const likedPosts=await Post.find({_id:{$in:user.likedPosts}}).populate({
                path:"user",
                select:"-password"
        }).populate({   
            path:"comments.user",
            select:"-password"  
        })

        res.status(200).json(likedPosts)
 
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
        
    } 
}
export const getAllPosts=async(req,res)=>{
    try {
        const posts=await Post.find().sort({createdAt:-1}).populate(
            {path:"user",select:"-password"}
        ).populate({
            path:"comments.user",
            select:"-password"
        })
        if (posts.length===0){
            return res.status(404).json([])

        }
        res.status(200).json(posts)


        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
        
    }
}
export const getFollowingPosts=async(req,res)=>{    
    try {
        const userId=req.user.id

        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        const following=user.following
        const feedPosts=await Post.find({user:{$in:following}}).sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password"

        }).populate({
            path:"comments.user",
            select:"-password"
        })
        return res.status(200).json(feedPosts)
        
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
    }
}
export const getUserPosts=async(req,res)=>{
    try {
        const username=req.params.username
        const user=await User.findOne({
            username
        })
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        const posts=await Post.find({user:user._id}).sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })
        res.status(200).json(posts)


        
    } catch (error) {
        
    }

}
