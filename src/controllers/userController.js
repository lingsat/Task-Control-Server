const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendgrid = require('@sendgrid/mail');
require('dotenv').config();
const { User } = require('../models/User');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// registration
const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserExists = await User.exists({ email });
  if (!isUserExists) {
    const user = new User({
      email,
      password: await bcrypt.hash(password, 10),
    });
    user
      .save()
      .then(() => {
        res.status(200).json({ message: 'Profile created successfully' });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res
      .status(400)
      .json({ message: `User with email ${email} already exists!` });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
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
    });
  }
  return res.status(400).json({ message: 'Not authorized!' });
};

module.exports = {
  registerUser,
  loginUser,
};
