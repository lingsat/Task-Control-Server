/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const { Load, loadJoiSchema } = require('../models/Load');
const { Truck } = require('../models/Truck');

const loadStateArr = ['En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery'];

// add load for shipper
const addLoad = async (req, res) => {
  const { userId, role } = req.user;
  const {
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
  } = req.body;
  // joi data validation
  await loadJoiSchema.validateAsync({
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
  });

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
const getLoads = async (req, res) => {
  const { userId, role } = req.user;
  if (role === 'SHIPPER') {
    const shipperLoads = await Load.aggregate([{ $match: { created_by: userId } }]);
    if (shipperLoads.length > 0) {
      res.status(200).json({ loads: shipperLoads });
    } else {
      res.status(400).json({ message: 'Loads not found!' });
    }
  } else if (role === 'DRIVER') {
    const assignedTruck = await Truck.findOne({ assigned_to: userId });
    const driverLoads = await Load.aggregate([{
      $match: { assigned_to: assignedTruck._id.toString() },
    }]);
    if (driverLoads.length > 0) {
      res.status(200).json({ loads: driverLoads });
    } else {
      res.status(400).json({ message: 'Load not found!' });
    }
  } else {
    res.status(400).json({ message: 'Error' });
  }
};

// get driver's active load
const getActiveLoad = async (req, res) => {
  const { userId, role } = req.user;
  const assignedTruck = await Truck.findOne({ assigned_to: userId });
  const activeLoad = await Load.findOne({ assigned_to: assignedTruck._id });
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
  const assignedTruck = await Truck.findOne({ assigned_to: userId });
  const activeLoad = await Load.findOne({ assigned_to: assignedTruck._id, status: 'ASSIGNED' });
  if (activeLoad && role === 'DRIVER') {
    const curStateIndex = loadStateArr.indexOf(activeLoad.state);
    if (curStateIndex >= 0 && curStateIndex < 3) {
      const newState = loadStateArr[curStateIndex + 1];
      activeLoad.state = newState;
      activeLoad.logs = [...activeLoad.logs, {
        message: `Load state changed to '${newState}'`,
        time: new Date().toISOString(),
      }];
      if (newState === 'Arrived to delivery') {
        activeLoad.status = 'SHIPPED';
        assignedTruck.status = 'IS';
      }
      activeLoad.save();
      assignedTruck.save();
      res.status(200).json({ message: `Load state changed to '${newState}'` });
    } else {
      res.status(200).json({ message: 'Load SHIPPED!' });
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
const updateLoadById = async (req, res) => {
  const loadId = req.params.id;
  const { userId, role } = req.user;
  const {
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
  } = req.body;
  const load = await Load.findOne({ created_by: userId, _id: loadId });
  if (load && role === 'SHIPPER') {
    load.name = name;
    load.payload = payload;
    load.pickup_address = pickup_address;
    load.delivery_address = delivery_address;
    load.dimensions = dimensions;
    load.logs = [...load.logs, {
      message: 'Load updated',
      time: new Date().toISOString(),
    }];
    load.save();
    res.status(200).json({ message: 'Load details changed successfully' });
  } else {
    res
      .status(400)
      .json({ message: "DRIVER don't have access to update load or load not found!" });
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

// post load
const postLoad = async (req, res) => {
  const loadId = req.params.id;
  const { userId, role } = req.user;
  if (role === 'SHIPPER') {
    const load = await Load.findOne({ created_by: userId, _id: loadId });
    const awailableTrucks = await Truck.aggregate([
      {
        $match: {
          status: 'IS',
          assigned_to: {
            $nin: [null],
          },
          // payload: {
          //   $gte: load.payload,
          // },
          'dimensions.width': {
            $gte: load.dimensions.width,
          },
          'dimensions.height': {
            $gte: load.dimensions.height,
          },
          'dimensions.length': {
            $gte: load.dimensions.length,
          },
        },
      },
      {
        $sort: {
          payload: 1,
        },
      },
      { $limit: 1 },
    ]);
    const suitableTruck = awailableTrucks[0];
    if (suitableTruck) {
      await Truck.findByIdAndUpdate(suitableTruck._id, { $set: { status: 'OL' } });
      load.assigned_to = suitableTruck._id;
      load.status = 'ASSIGNED';
      load.state = 'En route to Pick Up';
      load.logs = [...load.logs, {
        message: 'Load assigned',
        time: new Date().toISOString(),
      }];
      load.save();
      res.status(200).json({ message: 'Load posted successfully', driver_found: true });
    } else {
      load.logs = [...load.logs, {
        message: 'Suitable truck not found',
        time: new Date().toISOString(),
      }];
      load.save();
      res.status(400).json({ message: 'Suitable Truck not found. Try again later!' });
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
