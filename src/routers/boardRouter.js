const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addBoard,
  getBoards,
  deleteBoard,
  updateBoard,
  setBoardColumnColor,
  addTask,
  deleteTask,
  editTask,
  changeTaskStatus,
  archiveTask,
  clearArchive,
  addTaskComment,
  deleteTaskComment,
} = require('../controllers/boardController');
const { asyncWrapper } = require('../service/serviseFunctions');

const router = express.Router();

router.post('/', authMiddleware, asyncWrapper(addBoard));
router.get('/', authMiddleware, getBoards);
router.delete('/:id', authMiddleware, deleteBoard);
router.put('/:id', authMiddleware, asyncWrapper(updateBoard));
router.put('/setcolor/:id', authMiddleware, asyncWrapper(setBoardColumnColor));

router.put('/task/:id', authMiddleware, asyncWrapper(addTask));
router.put('/task/edit/:id', authMiddleware, asyncWrapper(editTask));
router.put('/task/status/:id', authMiddleware, asyncWrapper(changeTaskStatus));
router.delete('/task/:id', authMiddleware, deleteTask);
router.delete('/task/archive/:id', authMiddleware, archiveTask);
router.put('/archive/clear', authMiddleware, asyncWrapper(clearArchive));
router.put('/task/comment/:id', authMiddleware, asyncWrapper(addTaskComment));
router.delete('/task/comment/:id', authMiddleware, asyncWrapper(deleteTaskComment));

module.exports = { boardRouter: router };
