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
    // res.status(200).json({ message: 'Board created successfully' });
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
      res
        .status(400)
        .json({ message: 'No Boards created for this user!' });
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

module.exports = {
  addBoard,
  getBoards,
  deleteBoard,
  updateBoard,
};
