const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addTruck,
  getTrucks,
  assignTruck,
  deleteTruck,
  getTruckById,
  updateTruck,
} = require('../controllers/truckController');

const router = express.Router();

router.post('/', authMiddleware, addTruck);
router.get('/', authMiddleware, getTrucks);
router.post('/:id/assign', authMiddleware, assignTruck);
router.delete('/:id', authMiddleware, deleteTruck);
router.get('/:id', authMiddleware, getTruckById);
router.put('/:id', authMiddleware, updateTruck);

module.exports = { truckRouter: router };
