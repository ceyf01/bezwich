import express from 'express';
import { getUserProfile, followUnfollowUser, updateProfile, getSuggestedUsers } from '../controllers/userc.js';
import protectRoute from '../middleware/protectRoute.js';
const router=express.Router()
router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/follow/:id",protectRoute,followUnfollowUser)
router.post("/update",protectRoute,updateProfile)
export default router

