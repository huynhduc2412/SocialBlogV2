const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');

router.get('/users', async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
