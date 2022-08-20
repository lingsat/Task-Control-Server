const mongoose = require('mongoose');

const loadSchema = mongoose.Schema({
  created_by: {
    type: String,
    require: true,
  },
  assigned_to: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'NEW',
  },
  state: {
    type: String,
    default: 'En route to Pick Up',
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

module.exports = { Load };
