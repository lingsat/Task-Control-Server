const mongoose = require('mongoose');
const Joi = require('joi');

const userJoiSchema = Joi.object({
  role: Joi.string().valid('DRIVER', 'SHIPPER'),
  email: Joi.string().email(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  oldPassword: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  newPassword: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
});

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  role: {
    type: String,
    require: true,
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

module.exports = { User, userJoiSchema };
