/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const { Load } = require('../models/Load');
const { Truck } = require('../models/Truck');

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

// delete user's load
const deleteLoad = (req, res) => {
  const loadId = req.params.id;
  const { userId, role } = req.user;
  if (role === 'SHIPPER') {
    Load.findOneAndDelete({ created_by: userId, _id: loadId })
      .then((load) => {
        if (load) {
          res.status(200).json({ message: 'Load deleted successfully' });
        } else {
          res.status(400).json({ message: 'Load not found!' });
        }
      });
  } else {
    res
      .status(400)
      .json({ message: "DRIVER don't have access to delete load!" });
  }
};

// post load by id
const postLoad = async (req, res) => {
  const loadId = req.params.id;
  const { userId, role } = req.user;
  if (role === 'SHIPPER') {
    const load = await Load.findOne({ created_by: userId, _id: loadId });
    // hardcoded filter
    const awailableTrucks = await Truck.find({ type: 'SPRINTER' });

    if (awailableTrucks.length > 0) {
      const neededTruck = awailableTrucks.find((truck) => truck.assigned_to !== '');
      if (neededTruck) {
        neededTruck.status = 'OL';
        neededTruck.save();
        load.assigned_to = neededTruck._id;
        load.status = 'ASSIGNED';
        load.logs = [...load.logs, {
          message: 'Load assigned',
          time: new Date().toISOString(),
        }];
        load.save();
        res.status(200).json({ message: 'Load posted successfully', driver_found: true });
      }
    } else {
      res.status(400).json({ message: 'Trucks not found' });
    }
  } else {
    res
      .status(400)
      .json({ message: "DRIVER don't have access to post load!" });
  }
};

// get user's Load shipping by id
const getLoadShippingById = async (req, res) => {
  const loadId = req.params.id;
  const { userId, role } = req.user;
  const load = await Load.findOne({ created_by: userId, _id: loadId });
  if (load && role === 'SHIPPER') {
    if (load.assigned_to === '') {
      res.status(400).json({ message: 'Load not assigned' });
    } else {
      const truck = await Truck.findById(load.assigned_to);
      res.status(200).json({ load, truck });
    }
  } else {
    res
      .status(400)
      .json({ message: "DRIVER don't have access to get load info or load not found!" });
  }
};

module.exports = {
  addLoad,
  getLoads,
  getActiveLoad,
  iterateLoadState,
  getLoadById,
  updateLoadById,
  deleteLoad,
  postLoad,
  getLoadShippingById,
};
