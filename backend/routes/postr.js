import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { createPost, likeUnlikePost,commentOnPost,deletePost } from '../controllers/postc.js';
const router=express.Router()
router.post("/create",protectRoute,createPost)
router.post("/like:id",protectRoute,likeUnlikePost)
router.post("/comment",protectRoute,commentOnPost)
router.delete("/delete/:id",protectRoute,deletePost)
export default router

