const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addLoad,
  getLoads,
  getActiveLoad,
  iterateLoadState,
  getLoadById,
  updateLoadById,
} = require('../controllers/loadController');

const router = express.Router();

router.post('/', authMiddleware, addLoad);
router.get('/', authMiddleware, getLoads);
router.get('/active', authMiddleware, getActiveLoad);
router.patch('/active/state', authMiddleware, iterateLoadState);
router.get('/:id', authMiddleware, getLoadById);
router.put('/:id', authMiddleware, updateLoadById);

module.exports = { loadRouter: router };
