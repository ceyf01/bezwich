import dotenv from 'dotenv'
import express from 'express'
import authr from './routes/authr.js'
import connectdb from './utils/db.js'
import cookieParser from 'cookie-parser'
import userr from './routes/userr.js'
import postr from './routes/postr.js'
dotenv.config()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/auth",authr)
app.use("/user",userr)
app.use("/posts",postr)

const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`LISTENING ON PORT ${PORT}`)
    connectdb()
}

)

