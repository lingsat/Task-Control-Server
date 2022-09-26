const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addBoard,
  getTrucks,
  assignTruck,
  deleteTruck,
  getTruckById,
  updateTruck,
} = require('../controllers/boardController');
const { asyncWrapper } = require('../service/serviseFunctions');

const router = express.Router();

router.post('/', authMiddleware, asyncWrapper(addBoard));

router.get('/', authMiddleware, getTrucks);
router.post('/:id/assign', authMiddleware, assignTruck);
router.delete('/:id', authMiddleware, deleteTruck);
router.get('/:id', authMiddleware, getTruckById);
router.put('/:id', authMiddleware, asyncWrapper(updateTruck));

module.exports = { boardRouter: router };
