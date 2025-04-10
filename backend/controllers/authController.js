const { loginUser } = require('../services/authService');
const UserService = require('../services/UserService');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await loginUser(username, password);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message || 'Login failed' });
  }
};

exports.register = async (req, res) => {
    try {
      const { name, email, username, password } = req.body;
      const user = await UserService.register({ name, email, username, password });
  
      res.status(201).json({ message: 'Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Đăng ký thất bại' });
    }
  };
