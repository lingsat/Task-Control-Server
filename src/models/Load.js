const mongoose = require('mongoose');
const Joi = require('joi');

const loadJoiSchema = Joi.object({
  name: Joi.string().min(3).required(),
  payload: Joi.number().integer().min(10).required(),
  pickup_address: Joi.string().min(10),
  delivery_address: Joi.string().min(10),
  dimensions: {
    width: Joi.number().integer().required(),
    length: Joi.number().integer().required(),
    height: Joi.number().integer().required(),
  },
});

const loadSchema = mongoose.Schema({
  created_by: {
    type: String,
    require: true,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: 'NEW',
  },
  state: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    require: true,
  },
  payload: {
    type: Number,
    require: true,
  },
  pickup_address: {
    type: String,
    require: true,
  },
  delivery_address: {
    type: String,
    require: true,
  },
  dimensions: {
    width: {
      type: Number,
      require: true,
    },
    length: {
      type: Number,
      require: true,
    },
    height: {
      type: Number,
      require: true,
    },
  },
  logs: {
    type: Array,
    default: {
      message: 'Load created',
      time: new Date().toISOString(),
    },
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const Load = mongoose.model('load', loadSchema);

module.exports = { Load, loadJoiSchema };
