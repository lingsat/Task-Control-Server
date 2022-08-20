/* eslint-disable camelcase */
const { Load } = require('../models/Load');

// add load for shipper
const addLoad = (req, res) => {
  const { userId, role } = req.user;
  const {
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
  } = req.body;
  if (role === 'SHIPPER') {
    const newLoad = new Load({
      created_by: userId,
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions,
    });
    newLoad.save().then(() => {
      res.status(200).json({ message: 'Load created successfully' });
    });
  } else {
    res.status(400).json({ message: "DRIVER can't add loads!" });
  }
};

// get loads
const getLoads = (req, res) => {
  const { userId, role } = req.user;
  if (role === 'SHIPPER') {
    Load.find({ created_by: userId }).then((list) => {
      if (list.length > 0) {
        res.status(200).json({ loads: list });
      } else {
        res
          .status(200)
          .json({ message: 'No loads created by current SHIPPER' });
      }
    });
  }
  if (role === 'DRIVER') {
    Load.find({ assigned_to: userId }).then((list) => {
      if (list.length > 0) {
        res.status(200).json({ loads: list });
      } else {
        res
          .status(200)
          .json({ message: 'No loads created by current DRIVER' });
      }
    });
  }
};

module.exports = { addLoad, getLoads };
