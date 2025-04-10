const UserService = require('../services/UserService');

exports.verify = async (req, res) => {
  try {
    const { code } = req.params;
    await UserService.verifyEmail(code);
    res.send('✅ Xác minh thành công. Bạn có thể đăng nhập!');
  } catch (err) {
    console.error(err);
    res.status(400).send('❌ Mã xác minh không hợp lệ hoặc đã hết hạn.');
  }
};
