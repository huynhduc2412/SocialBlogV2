const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        // const unreadOnly = req.query.unreadOnly === "true";
        const notifications = await notificationService.getNotifications(userId, true);
        res.json(notifications);
      } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
      }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đánh dấu đã đọc", error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá thông báo", error: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
};
