const { User } = require('../models/User');

// add photo to profile
const addUserPhoto = async (req, res) => {
  const { userId } = req.user;
  if (req.file) {
    const user = await User.findById(userId);
    user.photo = req.file.filename;
    user.save();
    res.json({ message: 'Image saved' });
  } else {
    res.status(400).json({ message: 'File not found!' });
  }
};

module.exports = { addUserPhoto };
