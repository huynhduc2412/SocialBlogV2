const postService = require('../services/postService');

const getAllPosts = async (req, res) => {
  const { page = 0, size = 10, sort = 'createdAt,desc' } = req.query;
  const result = await postService.getAllPosts(page, size, sort);
  res.json(result);
};

const getPostById = async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.json(post);
};

const getPostByCommentId = async (req, res) => {
  const postId = await postService.getPostByCommentId(req.params.id);
  res.json(postId);
};

const getMyPosts = async (req, res) => {
  const result = await postService.getMyPosts(req.user.id);
  res.json(result);
};

const getUserPosts = async (req, res) => {
  const result = await postService.getPostsByUser(req.params.id);
  res.json(result);
};

const createPost = async (req, res) => {
    const { title, category, tags, content, imageCloudUrl } = req.body;
    const id = req.user.userId;
    const post = await postService.createPost({ title, category, tags, content, imageCloudUrl }, id);
    res.status(201).json(post);
  };

const updatePost = async (req, res) => {
  const result = await postService.updatePost(req.params.id, req.body);
  res.json(result);
};

const deletePost = async (req, res) => {
  await postService.deletePost(req.params.id);
  res.sendStatus(204);
};

const searchPosts = async (req, res) => {
  const result = await postService.searchPosts(req.query);
  res.json(result);
};

const getPostsByMostLikes = async (req, res) => {
  const { page = 0, size = 4, sort = 'likeCnt,desc' } = req.query;
  const result = await postService.getPostsByMostLikes(page, size, sort);
  res.json(result);
};

const getRelatedPosts = async (req, res) => {
  const { tag, postId } = req.params;
  const { page = 0, size = 4 } = req.query;
  const result = await postService.getRelatedPosts(tag, postId, page, size);
  res.json(result);
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostByCommentId,
  getMyPosts,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  getPostsByMostLikes,
  getRelatedPosts
};
