// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Truck } = require('../models/Truck');

// add truck for driver
const addTruck = (req, res) => {
  const { userId, role } = req.user;
  const { type } = req.body;
  if (role === 'DRIVER') {
    const truck = new Truck({
      created_by: userId,
      type,
    });
    truck.save().then(() => {
      res.status(200).json({ message: 'Truck created successfully' });
    });
  } else {
    res.status(400).json({ message: "SHIPPER can't add trucks!" });
  }
};

// get driver's trucks
const getTrucks = (req, res) => {
  const { userId, role } = req.user;
  if (role === 'DRIVER') {
    Truck.find({ created_by: userId }).then((list) => {
      if (list.length > 0) {
        res.status(200).json({ trucks: list });
      } else {
        res.status(200).json({ message: 'No trucks created by current DRIVER' });
      }
    });
  } else {
    res.status(400).json({ message: "SHIPPER don't have access to get a list of trucks!" });
  }
};

module.exports = {
  addTruck,
  getTrucks,
};
