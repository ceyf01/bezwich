import mongoose from "mongoose";
const connectdb=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGOURL)
        console.log(`db connected${conn.connection.host}`)

        
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
    
}
export default connectdb