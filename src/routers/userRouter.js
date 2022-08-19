const express = require('express');
const {
  registerUser,
  loginUser,
  forgotUserPass,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot_password', forgotUserPass);

module.exports = { userRouter: router };
