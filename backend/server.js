import dotenv from 'dotenv'
import express from 'express'
import authr from './routes/authr.js'
import cors from 'cors'
import connectdb from './utils/db.js'
import cookieParser from 'cookie-parser'
import userr from './routes/userr.js'
import notificationr from './routes/notificationr.js'
import postr from './routes/postr.js'
dotenv.config()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/auth",authr)
app.use("/api/users",userr)
app.use("/api/posts",postr)
app.use("/api/notifications",notificationr)

const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`LISTENING ON PORT ${PORT}`)
    connectdb()
}

)

