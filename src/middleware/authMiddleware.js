const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(400)
      .json({ message: 'Please, provide authorization header' });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Please, include token to request' });
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      userId: tokenPayload.userId,
      username: tokenPayload.username,
    };
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  return undefined;
};

module.exports = { authMiddleware };
