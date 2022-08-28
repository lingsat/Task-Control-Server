const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendgrid = require('@sendgrid/mail');
require('dotenv').config();
const { User, userJoiSchema } = require('../models/User');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// registration
const registerUser = async (req, res, next) => {
  const { email, password, role } = req.body;
  // joi data validation
  await userJoiSchema.validateAsync({ email, password, role });

  const isUserExists = await User.exists({ email });
  if (!isUserExists) {
    const user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role,
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
    res.status(400).json({ message: `User with email ${email} already exists!` });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // joi data validation
  await userJoiSchema.validateAsync({ email, password });

  const user = await User.findOne({ email });
  const isPassCorrect = await bcrypt.compare(
    String(password),
    String(user.password),
  );
  if (user && isPassCorrect) {
    const payload = { email: user.email, userId: user.id, role: user.role };
    const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.json({ jwt_token: jwtToken });
  }
  return res.status(400).json({ message: 'Not authorized!' });
};

// forgot password - sending new password to email
const forgotUserPass = async (req, res) => {
  const { email } = req.body;
  // joi data validation
  await userJoiSchema.validateAsync({ email });

  const user = await User.findOne({ email });
  if (user) {
  // send email with new password
    const msg = {
      to: email,
      from: 'spetrenkomail@meta.ua',
      subject: 'New Password for Freight Delivery',
      text: 'New password for Freight Delivery account is: "pswd".\n\nBest regards, Freight Delivery Team',
    };
    sendgrid.send(msg);
    user.password = await bcrypt.hash('pswd', 10);
    user.save();
    return res
      .status(200)
      .json({ message: 'New password sent to your email address! * for testing - new password - "pswd" *' });
  }
  return res.status(400).json({ message: 'User not found!' });
};

// getting current user profile information
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user) {
    return res.status(200).json({
      user: {
        _id: req.user.userId,
        role: user.role,
        email: user.email,
        created_date: user.created_date,
      },
    });
  }
  return res
    .status(400)
    .json({ message: "Can't get user profile information!" });
};

// change user's password
const changePass = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // joi data validation
  await userJoiSchema.validateAsync({ oldPassword, newPassword });

  const user = await User.findById(req.user.userId);
  const isOldPassCorrect = await bcrypt.compare(
    String(oldPassword),
    String(user.password),
  );
  if (user && isOldPassCorrect) {
    const newPass = await bcrypt.hash(newPassword, 10);
    user.password = newPass;
    user.save();
    return res.status(200).json({ message: 'Password changed successfully' });
  }
  return res.status(400).json({ message: 'Old password not correct' });

  // // alternative way, without validation old password
  // const newPass = await bcrypt.hash(req.body.newPassword, 10);
  // await User.findByIdAndUpdate(req.user.userId, {
  //   $set: { password: newPass },
  // }).then(() => res.json({ message: 'Password changed' }));
};

// delete user's profile
const deleteUser = (req, res) => {
  User.findByIdAndDelete(req.user.userId).then(() => (
    res.status(200).json({ message: 'Profile deleted successfully' })
  ));
};

module.exports = {
  registerUser,
  loginUser,
  forgotUserPass,
  getUserProfile,
  changePass,
  deleteUser,
};
