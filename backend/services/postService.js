const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');

const getAllPosts = async (page, size, sort) => {
  const [sortField, sortDir] = sort.split(',');
  const posts = await Post.find()
    .skip(page * size)
    .limit(size)
    .sort({ [sortField]: sortDir === 'desc' ? -1 : 1 });
  return posts;
};

const getPostById = async (id) => {
  return await Post.findById(id).populate('author');
};

const getPostsByUser = async (userId) => {
  return await Post.find({ author: userId });
};

const createPost = async (postData, id) => {
    const post = new Post({
      ...postData,
      author: id,
      createdAt: new Date(),
    });
    return await post.save();
  };

const updatePost = async (id, data) => {
  return await Post.findByIdAndUpdate(id, {
    ...data,
    createdAt: new Date()
  }, { new: true });
};

const deletePost = async (id) => {
  const post = await Post.findById(id);
  await Comment.deleteMany({ _id: { $in: post.comments } });
  await Like.deleteMany({ _id: { $in: post.likes } });
  return await Post.findByIdAndDelete(id);
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost
};
