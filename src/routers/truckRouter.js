const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addTruck, getTrucks } = require('../controllers/truckController');

const router = express.Router();

router.post('/', authMiddleware, addTruck);
router.get('/', authMiddleware, getTrucks);

module.exports = { truckRouter: router };
