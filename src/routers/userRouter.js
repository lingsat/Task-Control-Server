const express = require('express');
const {
  registerUser,
  loginUser,
  forgotUserPass,
} = require('../controllers/userController');
const { asyncWrapper } = require('../servise/serviseFunctions');

const router = express.Router();

router.post('/register', asyncWrapper(registerUser));
router.post('/login', asyncWrapper(loginUser));
router.post('/forgot_password', asyncWrapper(forgotUserPass));

module.exports = { userRouter: router };
