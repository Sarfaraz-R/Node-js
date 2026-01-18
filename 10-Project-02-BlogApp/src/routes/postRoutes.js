// POST	/api/posts	Create post
// GET	/api/posts	Get all posts
// GET	/api/posts/:id	Get post by ID
// PUT	/api/posts/:id	Update post
// DELETE	/api/posts/:id	Delete post

import express from "express";
import createPost from "../controllers/createPost.js";
import getAllPosts from "../controllers/getAllPosts.js";
import deletePost from "../controllers/deletePost.js";
import updatePost from "../controllers/updatePost.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

export default router;
