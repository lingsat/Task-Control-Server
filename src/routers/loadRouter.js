const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addLoad, getLoads } = require('../controllers/loadController');

const router = express.Router();

router.post('/', authMiddleware, addLoad);
router.get('/', authMiddleware, getLoads);

module.exports = { loadRouter: router };
