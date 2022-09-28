const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addBoard,
  getBoards,
  deleteBoard,
  updateBoard,
  addTask,
  deleteTask,
  editTask,
} = require('../controllers/boardController');
const { asyncWrapper } = require('../service/serviseFunctions');

const router = express.Router();

router.post('/', authMiddleware, asyncWrapper(addBoard));
router.get('/', authMiddleware, getBoards);
router.delete('/:id', authMiddleware, deleteBoard);
router.put('/:id', authMiddleware, asyncWrapper(updateBoard));

router.put('/task/:id', authMiddleware, asyncWrapper(addTask));
router.put('/task/edit/:id', authMiddleware, asyncWrapper(editTask));
router.delete('/task/:id', authMiddleware, deleteTask);

module.exports = { boardRouter: router };
