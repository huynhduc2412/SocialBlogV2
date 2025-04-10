const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const User = require("../models/User");

const createNotification = async (userId, title, message) => {
  const notification = new Notification({
    userId,
    title,
    message,
    read: false,
  });
  return await notification.save();
};

const createNewPostNotification = async (userId, postId, title, message) => {
  const notification = new Notification({
    userId,
    postId,
    title,
    message,
    read: false,
  });
  return await notification.save();
};

const getNotifications = async (userId, unreadOnly) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
  
    // Lấy tất cả thông báo, sort theo thời gian mới nhất
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).lean();
  
    // Lọc theo userId (so sánh bằng toString) và unreadOnly nếu có
    const filtered = notifications
      .filter(noti => noti.userId?.toString() === userId.toString())
      .filter(noti => !unreadOnly || noti.read === false) // chỉ lọc nếu unreadOnly = true
      .map(noti => ({
        ...noti,
        _id: noti._id.toString(),
        userId: noti.userId?.toString(),
        postId: noti.postId?.toString() || null
      }));
  
    return filtered;
  };

const markAsRead = async (notificationId) => {``
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.read = true;
  return await notification.save();
};

const deleteNotification = async (notificationId) => {
  await Notification.findByIdAndDelete(notificationId);
};

module.exports = {
  createNotification,
  createNewPostNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
};
