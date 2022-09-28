const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { asyncWrapper } = require('../service/serviseFunctions');

const router = express.Router();

router.post('/register', asyncWrapper(registerUser));
router.post('/login', asyncWrapper(loginUser));

module.exports = { userRouter: router };
