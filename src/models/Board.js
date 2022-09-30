const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  tasks: {
    type: Array,
    default: [],
  },
  todoCount: {
    type: Number,
    default: 0,
  },
  progressCount: {
    type: Number,
    default: 0,
  },
  doneCount: {
    type: Number,
    default: 0,
  },
});

const Board = mongoose.model('board', boardSchema);

module.exports = { Board };
