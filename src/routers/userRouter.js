const express = require('express');
// const { authMiddleware } = require('../middleware/authMiddleware');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);

module.exports = { userRouter: router };
