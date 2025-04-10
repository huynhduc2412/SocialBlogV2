const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken");
// api/posts/
router.get("/",postController.getAllPosts); //solved
router.get("/me", verifyToken, postController.getMyPosts);//solved
router.get("/search", postController.searchPosts); //solved
router.get("/most-liked",verifyToken ,postController.getPostsByMostLikes); //solved
router.get("/:id-posts", postController.getUserPosts);//solved
router.get("/:id", postController.getPostById);//solved
router.get("/post-by-com-id/:id", postController.getPostByCommentId);
router.post("/", verifyToken, postController.createPost); //solved
router.put("/:id", verifyToken, postController.updatePost); // solved
router.delete("/:id", verifyToken, postController.deletePost); //solved
router.get("/related/:tag/:postId", postController.getRelatedPosts);

module.exports = router;


