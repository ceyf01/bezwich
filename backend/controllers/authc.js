import User from "../models/usermodel.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generatetoken.js"
export const signup=async (req,res) => {
    try {
        const {username,fullName,email,password}=req.body
        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!username || !fullName || !email || !password){
            return res.status(400).json({ error:"Please fill in all fields"})    
        }
        if(!emailRegex.test(email)){
            return res.status(400).json({ error:"invalid email format"})    
        }
        const existingEmail= await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({ error:"Email is already taken"})    
        }
        const existingUser= await User.findOne({username})
        if(existingUser){
            return res.status(400).json({ error:"Username is already taken"})    
        }
        if(password.length<6){
            return res.status(400).json({ error:"Password must be at least 6 characters"})    

        }
        const salt=await bcrypt.genSalt(10)
        const hashPass=await bcrypt.hash(password,salt)
        const newUser=new User({
            username,
            fullName,
            email,
            password:hashPass
        })
        if (newUser){
            await newUser.save()
            generateTokenAndSetCookie(newUser._id,res)
            
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profilePic:newUser.profilePic,
                coverImg:newUser.coverImg,
   
            })

        }
        else{
            res.status(400).json({error:"Invalid user data"})
        }
        
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
    }
    
}
export const login=async (req,res) => {
try {
        const{username,password}=req.body
        if(!username || !password){
            return res.status(400).json({error:"Please fill in all fields"})
        }
        const user=await User.findOne({username})
        if(!user){
            return res.status(400).json({error:"Invalid credentials"})
        }
        const isMatch=await bcrypt.compare(password,user?.password||"")  
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"})
        }
        generateTokenAndSetCookie(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profilePic:user.profilePic,
            coverImg:user.coverImg,
        })


    
} catch (error) {
    console.error(error.message)
    res.status(500).json({error:"Server error"})
    
}    

}
export const logout=async (req,res) => {
    try {
        res.cookie("jwt",{maxAge:0})
        res.status(200).json({message:"Logged out"})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})   

        
        
    }
    
}
export const getMe=async (req,res) => {
    try {
        const user=await User.findById(req.user.id).select("-password")
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