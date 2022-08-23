const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addLoad,
  getLoads,
  getActiveLoad,
  iterateLoadState,
  getLoadById,
  updateLoadById,
  deleteLoad,
  postLoad,
  getLoadShippingById,
} = require('../controllers/loadController');
const { asyncWrapper } = require('../service/serviseFunctions');

const router = express.Router();

router.post('/', authMiddleware, asyncWrapper(addLoad));
router.get('/', authMiddleware, getLoads);
router.get('/active', authMiddleware, getActiveLoad);
router.patch('/active/state', authMiddleware, iterateLoadState);
router.get('/:id', authMiddleware, getLoadById);
router.put('/:id', authMiddleware, updateLoadById);
router.delete('/:id', authMiddleware, deleteLoad);
router.post('/:id/post', authMiddleware, postLoad);
router.get('/:id/shipping_info', authMiddleware, getLoadShippingById);

module.exports = { loadRouter: router };
