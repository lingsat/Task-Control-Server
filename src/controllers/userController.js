const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendgrid = require('@sendgrid/mail');
require('dotenv').config();
const { User } = require('../models/User');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// registration
const registerUser = async (req, res) => {
  const { login, email, password } = req.body;
  const isUserExists = await User.exists({ email });
  if (!isUserExists) {
    const user = new User({
      login,
      email,
      password: await bcrypt.hash(password, 10),
    });
    user.save();
    const payload = { email: user.email, userId: user.id };
    const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.json({
      jwt_token: jwtToken,
      email: user.email,
      userId: user.id,
      login: user.login,
    });
  }
  return res
    .status(400)
    .json({ message: `User with email ${email} already exists!` });
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    const isPassCorrect = await bcrypt.compare(
      String(password),
      String(user.password),
    );
    if (user && isPassCorrect) {
      const payload = { email: user.email, userId: user.id };
      const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      return res.json({
        jwt_token: jwtToken,
        email: user.email,
        userId: user.id,
        login: user.login,
      });
    }
    return res.status(400).json({ message: 'Wrong Password!' });
  } catch (error) {
    return res.status(400).json({ message: 'No user found' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
