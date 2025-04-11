const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');
const Follow = require('../models/Follow');
const NotificationService = require('./notificationService');
const { LIKE_TYPE } = require('../constants');
const mongoose = require('mongoose');
const { DBRef } = require('bson');
module.exports = {
  async customMap(post, currUserId) {
    console.log(post._id.toString());

    try {
      const allLikes = await Like.find({ type: LIKE_TYPE.POST });
      // console.log(allLikes);

      const likeCnt = allLikes.reduce((count, like) => {
        if (like.contentId.toString() === post._id.toString()) {
          return count + 1;
        }
        return count;
      }, 0);
      const liked = allLikes.some(
        (like) =>
          like.contentId.toString() === post._id.toString() &&
          like.userId.toString() === currUserId.toString()
      );

      const allBookmarks = await Bookmark.find();

      const saved = allBookmarks.some(
        (bookmark) =>
          bookmark.postId.toString() === post._id.toString() &&
          bookmark.userId.toString() === currUserId.toString()
      );

      const authorField = post.author;

      let authorId;
      if (post.author instanceof DBRef) {
        authorId = post.author._id || post.author.$id;
      } else if (post.author && typeof post.author === 'object') {
        authorId = post.author._id || post.author.$id;
      } else {
        authorId = post.author;
      }

      const author = await User.findById(authorId);
      if (!author) {
        console.log('Không tìm thấy tác giả:', authorId);
        return null;
      }

      return {
        id: post._id.toString(),
        title: post.title,
        category: post.category,
        imageCloudUrl: post.imageCloudUrl,
        createdAt: post.createdAt,
        author: {
          id: author._id.toString(),
          name: author.name,
          username: author.username,
          email: author.email,
          profilePicture: author.profilePicture,
          enabled: author.enabled,
          followers: author.followers || [],
          following: author.following || [],
          userRole: author.userRole,
        },
        likeCnt,
        saved: !!saved,
        liked: !!liked,
      };
    } catch (error) {
      console.error('Lỗi trong customMap:', error);
      return null;
    }
  },

  async sendNewPostNotificationToUsers(followers, postId, currUsername) {
    if (followers.length === 0) {
      return; // Nếu followers rỗng thì không làm gì cả
    }

    for (const follower of followers) {
      console.log(follower._id);
      await NotificationService.createNewPostNotification(
        (userId = Follow.findById(follower._id).user),
        postId,
        '🆕 Bài viết mới',
        `📢 ${currUsername} vừa đăng một bài viết mới!`
      );
    }
  },

  async getAllPosts(page = 0, size = 10, sort = 'createdAt,desc') {
    const [sortField, sortDir] = sort.split(',');
    const sortOption = { [sortField]: sortDir === 'desc' ? -1 : 1 };

    const posts = await Post.find()
      .skip(page * size)
      .limit(size)
      .sort(sortOption)
      .populate('author', 'name profilePicture') // Optional: include author info
      .lean();

    return posts;
  },

  async getPostById(id) {
    const post = await Post.findById(id);
    // console.log(post);
    const userId = post.author?._doc?._id || post?.author || post.author?._id;
    // console.log(userId);

    const user = await User.findById(userId);
    post.author = user;
    if (!post) throw new Error('Post not found');
    return post;
  },

  async createPost(postRequest, req) {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const { title, category, content, imageCloudUrl, tags = [] } = postRequest;

    const newPost = new Post({
      title,
      category,
      tags,
      content,
      imageCloudUrl:
        imageCloudUrl ||
        'https://img.freepik.com/free-vector/hand-drawn-flat-design-digital-detox-illustration_23-2149332264.jpg',
      author: user._id,
      createdAt: new Date(),
      likes: [],
      comments: [],
    });

    await newPost.save();
    await this.sendNewPostNotificationToUsers(
      user.followers,
      newPost._id,
      user.username
    );
    return newPost;
  },

  async updatePost(id, postRequest) {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...postRequest,
        createdAt: new Date(),
      },
      { new: true }
    );
    if (!updatedPost) throw new Error('Post not found');
    return updatedPost;
  },

  async deletePost(id) {
    const post = await Post.findById(id);
    if (!post) throw new Error('Post not found');

    await Comment.deleteMany({ _id: { $in: post.comments } });
    await Like.deleteMany({ _id: { $in: post.likes } });
    await Post.findByIdAndDelete(id);
  },

  async deletePostR(id) {
    const post = await Post.findById(id);
    if (!post) throw new Error('Post not found');
    const userId = post.author.toString();

    await Comment.deleteMany({ _id: { $in: post.comments } });
    await Like.deleteMany({ _id: { $in: post.likes } });
    await Post.findByIdAndDelete(id);

    return userId;
  },

  async deleteNullComment(postId) {
    const post = await Post.findById(postId).populate('comments');
    const validComments = post.comments.filter((c) => c.content !== null);
    post.comments = validComments.map((c) => c._id);
    await post.save();
  },

  async getMyPosts(userId) {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Truy vấn theo DBRef
    const posts = await Post.find({ 'author.$id': objectId }).lean();
    // console.log(posts);

    // Map và custom dữ liệu
    const results = await Promise.all(
      posts.map((post) => this.customMap(post, userId))
    );
    return results;
  },

  async getPostsByUser(userId) {
    // Truy vấn các bài post có author là objectId
    const posts = await Post.find({ author: userId }).lean();

    // Map từng bài post với hàm customMap
    const results = await Promise.all(
      posts.map((post) => this.customMap(post, userId))
    );

    return results;
  },

  async searchPosts(keyword, tags) {
    let posts = [];

    if (keyword && !tags?.length) {
      posts = await Post.find({ title: { $regex: keyword, $options: 'i' } });
    } else if (tags?.length && !keyword) {
      posts = await Post.find({ tags: { $in: tags } });
    } else if (keyword && tags?.length) {
      const postsByTitle = await Post.find({
        title: { $regex: keyword, $options: 'i' },
      });
      const postsByTags = await Post.find({ tags: { $in: tags } });
      posts = [...postsByTitle, ...postsByTags];
    } else {
      posts = await Post.find();
    }

    // Lọc các bài viết có author hợp lệ
    posts = posts.filter((post) => post.author && post.author.id);

    // Nếu author hợp lệ, tiếp tục xử lý các bài viết
    return Promise.all(
      posts.map((post) => this.customMap(post, post.author.toString()))
    );
  },

  async getPostsByMostLikes(userId) {
    // Fetch all post likes
    const allLikes = await Like.find({ type: LIKE_TYPE.POST }).lean();

    // Count likes per post
    const likeCountByPostId = {};
    for (const like of allLikes) {
      const postId = like.contentId.toString();
      likeCountByPostId[postId] = (likeCountByPostId[postId] || 0) + 1;
    }

    // Fetch all posts with author info
    const allPosts = await Post.find({})
      .populate('author', 'name profilePicture') // Customize fields as needed
      .lean();

    // Attach like count to each post
    const postsWithLikeCnt = allPosts.map((post) => ({
      ...post,
      likeCnt: likeCountByPostId[post._id.toString()] || 0,
    }));

    // Sort posts by like count descending
    return postsWithLikeCnt.sort((a, b) => b.likeCnt - a.likeCnt);
  },

  async getRelatedPosts(tag, postId) {
    const posts = await Post.find({ tags: tag });
    const filtered = posts.filter((p) => p._id.toString() !== postId);
    return Promise.all(
      filtered.map((p) => this.customMap(p, p.author.toString()))
    );
  },

  async getPostByCommentId(commentId) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    const post = await Post.findById(comment.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    return post._id; // Return the post ID
  },
};
