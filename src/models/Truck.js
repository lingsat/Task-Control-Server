const mongoose = require('mongoose');

const truckSchema = mongoose.Schema({
  created_by: {
    type: String,
  },
  assigned_to: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: '',
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const Truck = mongoose.model('truck', truckSchema);

module.exports = { Truck };
