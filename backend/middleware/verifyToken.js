const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '⚠️ Token không được cung cấp hoặc không hợp lệ' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    // ⛔ Token hết hạn
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '⏰ Token đã hết hạn, vui lòng đăng nhập lại' });
    }

    // ⛔ Token sai định dạng hoặc không đúng
    return res.status(403).json({ message: '⛔ Token không hợp lệ' });
  }
};

module.exports = verifyToken;
