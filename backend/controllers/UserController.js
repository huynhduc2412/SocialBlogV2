const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');

exports.getAuthenticatedUser = async (req, res) => {
  try {
    // console.log(req.user);
    const id = req.user.userId;
    const user = await UserService.findByIdR(id);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    // console.log(req.params.id);
    const id = req.user.userId;

    const user = await UserService.findByIdR(req.params.id, id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.user.userId;
    const updated = await UserService.updateUser(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};

exports.getTopAuthors = async (req, res) => {
  try {
    const id = req.user.userId;
    // console.log(id);

    const topAuthors = await UserService.getTopAuthors(id);
    // console.log(topAuthors);

    res.json(topAuthors);
  } catch (err) {
    res.status(500).json({ message: 'Get top Author error' });
  }
};
