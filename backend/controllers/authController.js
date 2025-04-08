const { loginUser } = require('../services/authService');

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
