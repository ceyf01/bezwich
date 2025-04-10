import jwt from 'jsonwebtoken'
export const generateTokenAndSetCookie=(id,res)=>{  
    const token=jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"15d"
    })
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:15*24*60*60*1000,
        sameSite:"strict",
        secure:process.env.NODEENV==="production" ,
        path: '/'



    })
}