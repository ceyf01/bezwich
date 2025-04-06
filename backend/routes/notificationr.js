import express from 'express';
import {getAllNotifications,deleteNotification} from '../controllers/notificationc.js';
import protectRoute from '../middleware/protectRoute.js';
const router=express.Router()
router.get("/",protectRoute,getAllNotifications)
router.delete("/",protectRoute,deleteNotification)
export default router
