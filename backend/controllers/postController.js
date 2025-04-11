const postService = require('../services/postService');

const getAllPosts = async (req, res) => {
  const { page = 0, size = 10, sort = 'createdAt,desc' } = req.query;
  const result = await postService.getAllPosts(page, size, sort);
  res.json({ content: result });
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    res
      .status(404)
      .json({ message: 'Không tìm thấy bài viết', error: err.message });
  }
};
//fix comment
const getPostByCommentId = async (req, res) => {
  try {
    const postId = await postService.getPostByCommentId(req.params.id);
    res.json(postId);
  } catch (err) {
    res.status(404).json({
      message: 'Không tìm thấy bài viết từ bình luận',
      error: err.message,
    });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await postService.getMyPosts(req.user.userId);
    res.json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Không thể lấy bài viết của tôi', error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    console.log(req.params.id);

    const posts = await postService.getPostsByUser(req.params.id);
    res.json(posts);
  } catch (err) {
    res.status(404).json({
      message: 'Không tìm thấy bài viết của người dùng',
      error: err.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body, req);
    res.status(201).json(post);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Không thể tạo bài viết', error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    res.json(post);
  } catch (err) {
    res
      .status(404)
      .json({ message: 'Không thể cập nhật bài viết', error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    res.status(204).end();
  } catch (err) {
    res
      .status(404)
      .json({ message: 'Không thể xóa bài viết', error: err.message });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { keyword, tags } = req.query;
    const result = await postService.searchPosts(keyword, tags);
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Lỗi khi tìm kiếm bài viết', error: err.message });
  }
};

const getPostsByMostLikes = async (req, res) => {
  try {
    const result = await postService.getPostsByMostLikes(req.user.userId);
    res.json({ content: result });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi khi lấy bài viết nhiều lượt thích',
      error: err.message,
    });
  }
};

const getRelatedPosts = async (req, res) => {
  try {
    const { tag, postId } = req.params;
    const result = await postService.getRelatedPosts(tag, postId);
    res.json({ content: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Lỗi khi lấy bài viết liên quan', error: err.message });
  }
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
  getRelatedPosts,
};
