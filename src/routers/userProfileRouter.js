const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getUserProfile, changePass, deleteUser } = require('../controllers/userController');
const { addUserPhoto } = require('../controllers/addPhotoController');
const { asyncWrapper } = require('../service/serviseFunctions');

const router = express.Router();

// multer - to save photos on server side
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './photos/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Uncorrect file type!'), false);
  }
};

const upload = multer({
  storage,
  limits: 1024 * 1024 * 5,
  fileFilter,
});

router.get('/me', authMiddleware, getUserProfile);
router.patch('/me/password', authMiddleware, asyncWrapper(changePass));
router.delete('/me', authMiddleware, deleteUser);
// add photo router
router.post('/me/uploadphoto', authMiddleware, upload.single('photoImage'), addUserPhoto);

module.exports = { userProfileRouter: router };
