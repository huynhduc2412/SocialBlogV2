const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Like = require('../models/Like');
const User = require('../models/User');
const userService = require('./UserService');

const getCommentsByPost = async (postId, userId = null) => {
  const comments = await Comment.find({ postId })
    .populate('user', 'name')
    .lean();

  console.log(comments);

  try {
    const result = await Promise.all(
      comments.map(async (comment) => {
        const liked = userId
          ? await Like.exists({
              userId,
              contentId: comment._id,
              type: 'COMMENT',
            })
          : false;

        return {
          ...comment,
          liked,
        };
      })
    );
    console.log(result);

    return result;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const createComment = async (content, postId, userId) => {
  const newComment = new Comment({
    content,
    postId,
    user: userId,
    createdAt: new Date(),
    likes: [],
  });

  const savedComment = await newComment.save();

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  post.comments.push(savedComment._id);
  await post.save();
  savedComment.user = await User.findById(userId).select('_id name');

  return savedComment;
};

const updateComment = async (commentId, content) => {
  return await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
};

const deleteComment = async (commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  const post = await Post.findById(comment.postId);
  if (post) {
    post.comments = post.comments.filter((cId) => cId.toString() !== commentId);
    await post.save();
  }

  await Comment.findByIdAndDelete(commentId);
};

const deleteCommentR = async (commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');
  const userId = comment.user.toString();
  const post = await Post.findById(comment.postId);
  if (post) {
    post.comments = post.comments.filter((cId) => cId.toString() !== commentId);
    await post.save();
  }

  await Comment.findByIdAndDelete(commentId);

  return userId;
};

const getPostByCommentId = async (commentId) => {
  const comment = await Comment.findById(commentId);
  return comment.postId;
};

module.exports = {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  deleteCommentR,
  getPostByCommentId,
};
