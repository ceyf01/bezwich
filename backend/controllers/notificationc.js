import Notification from "../models/notifmodel.js";
export const getAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profilePic"
        }).sort({ createdAt: -1 });
        await Notification.updateMany({ to: userId, read: false }, { read: true });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
}
export const deleteNotifications=async (req,res) => {
    try {
        const {userId}=req.user._id
        const notification=await Notification.deleteMany({to:userId})
        res.status(200).json({message:"Notifications deleted"})
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
    }   
    
}
export const deleteNotification=async (req,res) => {
    try {
        const {notificationId}=req.params
        const userId=req.user._id
        const notification=await notification.findById(notificationId)

        if(!notification){
            return res.status(404).json({error:"Notification not found"})
        }
        if(notification.to.toString()!==userId){
            return res.status(401).json({error:"Unauthorized"})
        }
        await Notification.findByIdAndDelete(notification)
        res.status(200).json({message:"Notification deleted"})
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Server error"})
    }   
    
}