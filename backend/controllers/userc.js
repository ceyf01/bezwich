import User from "../models/usermodel.js"
import bcrypt from "bcryptjs"
import cloudinary from "../utils/cloudinary.js"
import Notification from "../models/notifmodel.js"
export const getUserProfile=async(req,res)=>{
    const {username}=req.params

    try {
        const user=await User.findOne({username}).select("-password")
        if(user){
            res.status(200).json(user)
        }
        else{
            res.status(404).json({error:"User not found"})
        }  

        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
    }
}
export const followUnfollowUser=async(req,res)=>{
    try {
        const {id}=req.params
        const userToModify=await User.findById(id)
        const currentUser=await User.findById(req.user.id)
         if(id===req.user.id){
            return res.status(400).json({error:"You cannot follow yourself"})
        }   
        if(!userToModify){
            return res.status(404).json({error:"User not found"})
        }
        const isFollowing=currentUser.following.includes(id)
        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(req.user.id,{$pull:{following:id}})
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user.id}})
            res.status(200).json({message:"Unfollowed"})

        }
        else {
            //follow
            await User.findByIdAndUpdate(req.user.id,{$push:{following:id}})
            await User.findByIdAndUpdate(id,{$push:{folloNwers:req.user.id}}) 
            const newNotification=new Notification({
                from:req.user.id,
                to:id,
                type:"follow",
                read:false
            })
            await newNotification.save()
            res.status(200).json({message:"Followed"})


        }





        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
        
    }

}
export const getSuggestedUsers=async(req,res)=>{
    try {
        const userId=req.user._id;
        const usersFollowedByMe=await User.findById(userId).select("following")
        const users=await User.aggregate([  
            {$match:{_id:{$ne:userId}}},
            {$sample:{size:5}}
        ])
        const filteredUsers=users.filter(user=>!usersFollowedByMe.following.includes(user._id))
        const suggestedUsers=filteredUsers.slice(0,4)
        suggestedUsers.forEach(user=>user.password=null)
        res.status(200).json(suggestedUsers)

        

    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})    
        
    }
}
export const updateProfile=async(req,res)=>{
    try {
        const {fullName,username,email,currentPassword,newPassword,bio,profilePic,coverImg,link}=req.body
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        if((!newPassword&&currentPassword)||(!currentPassword&&newPassword)){
            return res.status(400).json({error:"Please enter current and new password"})
        }
        if(currentPassword&&newPassword){
            const isMatch=await bcrypt.compare(currentPassword,user.password)
            if(!isMatch){
                return res.status(400).json({error:"current password is incorrect"})
            }
            if(newPassword.length<6){
                return res.status(400).json({error:"Password must be at least 6 characters"})
            }
            const salt=await bcrypt.genSalt(10)
            user.password=await bcrypt.hash(newPassword,salt)

        }
        if(profilePic){
            const uploadedResponse=await cloudinary.uploader.upload(profilePic)
            profilePic=uploadedResponse.secure_url
        }
        if(coverImg){
            const uploadedResponse=await cloudinary.uploader.upload(coverImg)
            coverImg=uploadedResponse.secure_url
        }
        user.fullName=fullName||user.fullName
        user.username=username||user.username
        user.bio=bio||user.bio
        user.email=email||user.email
        user.profilePic=profilePic||user.profilePic
        user.coverImg=coverImg||user.coverImg

        user.link=link||user.link
        await user.save()
        user.password=null
        res.status(200).json(user)


 

}
catch (error) {
    console.error(error.message)
    res.status(500).json({error:"Server error"})
    
}
}



