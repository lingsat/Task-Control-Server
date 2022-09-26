/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const { Board } = require('../models/Board');

// add board
const addBoard = async (req, res) => {
  const { userId } = req.user;
  const { name, description } = req.body;

  const board = new Board({
    userId,
    name,
    description,
  });

  board.save().then(() => {
    res.status(200).json({ message: 'Board created successfully' });
  });
};

// get driver's trucks
const getTrucks = (req, res) => {
  const { userId, role } = req.user;
  if (role === 'DRIVER') {
    Board.find({ created_by: userId }).then((list) => {
      if (list.length > 0) {
        res.status(200).json({ trucks: list });
      } else {
        res
          .status(200)
          .json({ message: 'No trucks created by current DRIVER' });
      }
    });
  } else {
    res
      .status(400)
      .json({ message: "SHIPPER don't have access to get a list of trucks!" });
  }
};

// assign truck to driver by id
const assignTruck = async (req, res) => {
  const truckId = req.params.id;
  const { userId, role } = req.user;
  const assignedTruck = await Board.findOne({ assigned_to: userId });
  const truck = await Board.findOne({ created_by: userId, _id: truckId });
  if (!assignedTruck) {
    if (truck && role === 'DRIVER') {
      truck.assigned_to = userId;
      truck.save();
      res.status(200).json({ message: 'Truck assigned successfully' });
    } else {
      res
        .status(400)
        .json({
          message:
            "SHIPPER don't have access to assign trucks or truck not found!",
        });
    }
  } else {
    if (truck.assigned_to === userId && truck.status !== 'OL') {
      truck.assigned_to = null;
      truck.save();
      return res.status(200).json({ message: 'Truck disassigned successfully' });
    }
    return res
      .status(400)
      .json({
        message:
          `DRIVER is assigned to truck with id: "${assignedTruck._id}"`,
      });
  }
};

// delete user's truck(own) - not assigned to him(assign he can not delete?)
const deleteTruck = async (req, res) => {
  const truckId = req.params.id;
  const { userId, role } = req.user;
  const truck = await Board.findOne({ created_by: userId, _id: truckId });
  if (truck && userId !== truck.assigned_to && role === 'DRIVER') {
    await Board.findByIdAndDelete(truckId);
    res.status(200).json({ message: 'Truck deleted successfully' });
  } else {
    res
      .status(400)
      .json({
        message:
          'Truck not found / Wrong user role / Truck assigned to current driver!',
      });
  }
};

// get truck by id
const getTruckById = (req, res) => {
  const truckId = req.params.id;
  const { userId, role } = req.user;
  if (role === 'DRIVER') {
    Board.findOne({ created_by: userId, _id: truckId }).then((truck) => {
      if (truck) {
        res.status(200).json({ truck });
      } else {
        res
          .status(200)
          .json({ message: 'Truck not found!' });
      }
    });
  } else {
    res
      .status(400)
      .json({ message: "SHIPPER don't have access to get truck info!" });
  }
};

// update user's truck(own) - not assigned to him(assign he can not update?)
const updateTruck = async (req, res) => {
  const truckId = req.params.id;
  const { userId, role } = req.user;
  const { type } = req.body;

  const truck = await Board.findOne({ created_by: userId, _id: truckId });
  if (truck && role === 'DRIVER') {
    if (userId !== truck.assigned_to) {
      truck.type = type;
      truck.save();
      res.status(200).json({ message: 'Truck details changed successfully' });
    } else {
      res.status(200).json({ message: 'Truck details not changed. Truck is assigned to current driver!' });
    }
  } else {
    res
      .status(400)
      .json({
        message:
          "SHIPPER don't have access to update truck info or truck not found!",
      });
  }
};

module.exports = {
  addBoard,
  getTrucks,
  assignTruck,
  deleteTruck,
  getTruckById,
  updateTruck,
};
