const mongoose = require('mongoose');
const Joi = require('joi');

const truckJoiSchema = Joi.object({
  type: Joi.string().valid('SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'),
});

const truckSchema = mongoose.Schema({
  created_by: {
    type: String,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: 'IS',
  },
  payload: {
    type: Number,
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
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const Truck = mongoose.model('truck', truckSchema);

module.exports = { Truck, truckJoiSchema };
