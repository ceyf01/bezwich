import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { createPost, getFollowingPosts, getAllPosts, likeUnlikePost,getLikedPosts, commentOnPost,deletePost } from '../controllers/postc.js';
import { getUserPosts } from '../controllers/postc.js';
const router=express.Router()
router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getFollowingPosts)
router.get("/likes",protectRoute,getLikedPosts)
router.get("/user/:username",protectRoute,getUserPosts)
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment",protectRoute,commentOnPost)
router.delete("/delete/:id",protectRoute,deletePost)
export default router

