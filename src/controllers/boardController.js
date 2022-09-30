const uuid = require('uuid');
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
    res.status(200).json(board);
  });
};

// get user's boards
const getBoards = (req, res) => {
  const { userId } = req.user;
  Board.find({ userId }).then((list) => {
    if (list.length > 0) {
      res.status(200).json({ boards: list });
    } else {
      res.status(200).json({ boards: [] });
    }
  });
};

// delete board by id
const deleteBoard = async (req, res) => {
  const boardId = req.params.id;
  await Board.findByIdAndDelete(boardId);
  res.status(200).json({ message: 'Board deleted successfully' });
};

// update board name
const updateBoard = async (req, res) => {
  const boardId = req.params.id;
  const board = await Board.findById(boardId);
  board.name = req.body.name;
  board.save();
  res.status(200).json({ message: 'Board name changed successfully' });
};

// add task to board
const addTask = async (req, res) => {
  const boardId = req.params.id;
  const { name, status } = req.body;
  const board = await Board.findById(boardId);
  const newTask = {
    id: uuid.v4(),
    boardId,
    name,
    status,
    createdDate: new Date(),
    comments: [],
  };
  board.tasks = [...board.tasks, newTask];
  board.todoCount = board.tasks.filter((task) => task.status === 'todo').length;
  board.progressCount = board.tasks.filter((task) => task.status === 'progress').length;
  board.doneCount = board.tasks.filter((task) => task.status === 'done').length;
  board.save();
  res.status(200).json(board);
};

// delete task from board
const deleteTask = async (req, res) => {
  const boardId = req.params.id;
  const { taskId } = req.body;
  const board = await Board.findById(boardId);
  const filteredTasks = board.tasks.filter((task) => task.id !== taskId);
  board.tasks = filteredTasks;
  board.todoCount = board.tasks.filter((task) => task.status === 'todo').length;
  board.progressCount = board.tasks.filter((task) => task.status === 'progress').length;
  board.doneCount = board.tasks.filter((task) => task.status === 'done').length;
  board.save();
  res.status(200).json(board);
};

// edit task
const editTask = async (req, res) => {
  const boardId = req.params.id;
  const { name, taskId } = req.body;
  const board = await Board.findById(boardId);
  const modTasks = board.tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, name };
    }
    return task;
  });
  board.tasks = modTasks;
  board.todoCount = board.tasks.filter((task) => task.status === 'todo').length;
  board.progressCount = board.tasks.filter((task) => task.status === 'progress').length;
  board.doneCount = board.tasks.filter((task) => task.status === 'done').length;
  board.save();
  res.status(200).json(board);
};

// changee task status
const changeTaskStatus = async (req, res) => {
  const boardId = req.params.id;
  const { status, taskId } = req.body;
  const board = await Board.findById(boardId);
  let tempTask;
  const tempTasksArr = [];
  board.tasks.forEach((task) => {
    if (task.id === taskId) {
      tempTask = { ...task, status };
    } else {
      tempTasksArr.push(task);
    }
  });
  board.tasks = [...tempTasksArr, tempTask];
  board.todoCount = board.tasks.filter((task) => task.status === 'todo').length;
  board.progressCount = board.tasks.filter((task) => task.status === 'progress').length;
  board.doneCount = board.tasks.filter((task) => task.status === 'done').length;
  board.save();
  res.status(200).json({ message: 'Status changed successfully!' });
};

module.exports = {
  addBoard,
  getBoards,
  deleteBoard,
  updateBoard,
  addTask,
  deleteTask,
  editTask,
  changeTaskStatus,
};
