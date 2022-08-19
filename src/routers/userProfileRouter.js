const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getUserProfile, changePass, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/me', authMiddleware, getUserProfile);
router.patch('/me/password', authMiddleware, changePass);
router.delete('/me', authMiddleware, deleteUser);

module.exports = { userProfileRouter: router };
