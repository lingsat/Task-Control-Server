const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  role: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = { User };
