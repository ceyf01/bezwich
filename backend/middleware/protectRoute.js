import User from "../models/usermodel.js"
import jwt from "jsonwebtoken"
 const protectRoute=async (req,res,next) => {

    try {
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({error:"Unauthorized"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({error:"Unauthorized"})
        }
        const user=await User.findById(decoded.id).select("-password")
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        req.user=user
        next()


        
    } catch (error) {
        console.error("Auth Error:", error.message);
        
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized - Invalid or expired token" });
        }

        res.status(500).json({ error: "Server error" });
    
        
    }
    
    
}
export default protectRoute