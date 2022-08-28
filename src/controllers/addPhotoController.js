// const jwt = require('jsonwebtoken');
// const { User, userJoiSchema } = require('../models/User');

// add photo to profile
const addUserPhoto = async (req, res) => {
  console.log(req.user.userId);
  res.json({ message: 'Image saved' });
};

module.exports = { addUserPhoto };
