const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models/User');

const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    role,
  });
  user.save().then(() => {
    res.status(200).json({ message: 'Profile created successfully' });
  }).catch(() => {
    res.status(400).json({ message: 'Something went wrong' });
  });
};

module.exports = { registerUser };
