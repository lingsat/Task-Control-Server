const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');

// import routers
const { userRouter } = require('./src/routers/userRouter');
const { boardRouter } = require('./src/routers/boardRouter');
const { loadRouter } = require('./src/routers/loadRouter');

// create app server and port
const app = express();
const PORT = process.env.PORT || 8080;

// connection to database
// mongoose.connect(
//   'mongodb+srv://lingsat:mypassword@cluster0.roomuyf.mongodb.net/deliveryservice?retryWrites=true&w=majority',
// );
mongoose.connect(
  'mongodb+srv://lingsat:2PN9eWjW0gNCVaTX@cluster0.0tzjfke.mongodb.net/taskcontrol?retryWrites=true&w=majority',
);

// 2PN9eWjW0gNCVaTX

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// body parcer to connect with frontend UI
app.use(bodyParser.json());

// cors header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

// routers
app.use('/', express.static(__dirname));

app.use('/api/auth', userRouter);
app.use('/api/board', boardRouter);
app.use('/api/loads', loadRouter);

const start = async () => {
  try {
    if (!fs.existsSync('photos')) {
      fs.mkdirSync('photos');
    }
    app.listen(PORT);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

// error Handler
function errorHandler(err, req, res, next) {
  // console.error(err);
  res.status(500).send({ message: err.message });
  next();
}
app.use(errorHandler);
