/* eslint-disable camelcase */
const { Load } = require('../models/Load');

const loadStateArr = ['En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery'];

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

// get driver's active load
const getActiveLoad = async (req, res) => {
  const { userId, role } = req.user;
  const activeLoad = await Load.findOne({ assigned_to: userId });
  if (activeLoad && role === 'DRIVER') {
    res.status(200).json({ load: activeLoad });
  } else {
    res
      .status(400)
      .json({ message: "SHIPPER don't have access to get an active load or active load not found!" });
  }
};

// iterate to next Load state
const iterateLoadState = async (req, res) => {
  const { userId, role } = req.user;
  const activeLoad = await Load.findOne({ assigned_to: userId });
  if (activeLoad && role === 'DRIVER') {
    const curStateIndex = loadStateArr.indexOf(activeLoad.state);
    if (curStateIndex >= 0 && curStateIndex < 3) {
      const newState = loadStateArr[curStateIndex + 1];
      activeLoad.state = newState;
      activeLoad.save();
      res.status(200).json({ message: `Load state changed to '${newState}'` });
    } else {
      res.status(200).json({ message: 'Load on the last state!' });
    }
  } else {
    res
      .status(400)
      .json({ message: "SHIPPER don't have access to change load state or active load not found!" });
  }
};

// get user's Load by Id
const getLoadById = async (req, res) => {
  const loadId = req.params.id;
  const { userId, role } = req.user;
  const load = await Load.findOne({ created_by: userId, _id: loadId });
  if (load && role === 'SHIPPER') {
    res.status(200).json({ load });
  } else {
    res
      .status(400)
      .json({ message: "DRIVER don't have access to get load info or load not found!" });
  }
};

// update user's Load by Id
const updateLoadById = (req, res) => {
  const loadId = req.params.id;
  const { userId, role } = req.user;
  const {
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
  } = req.body;

  if (role === 'SHIPPER') {
    Load.findOneAndUpdate(
      { created_by: userId, _id: loadId },
      {
        $set: {
          name,
          payload,
          pickup_address,
          delivery_address,
          dimensions,
          logs: [{
            message: 'Load updated',
            time: new Date().toISOString(),
          }],
        },
      },
    )
      .then((load) => {
        if (load) {
          res.status(200).json({ message: 'Load details changed successfully' });
        } else {
          res.status(400).json({ message: 'Load not found or you dont have access to load!' });
        }
      })
      .catch(() => res.status(400).json({
        message:
              'Not Found! Or you do not have access to update loads!',
      }));
  } else {
    res
      .status(400)
      .json({ message: "DRIVER don't have access to update load!" });
  }
};

module.exports = {
  addLoad,
  getLoads,
  getActiveLoad,
  iterateLoadState,
  getLoadById,
  updateLoadById,
};
