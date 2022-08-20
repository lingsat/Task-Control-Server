const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');

// import routers
const { userRouter } = require('./src/routers/userRouter');
const { userProfileRouter } = require('./src/routers/userProfileRouter');
const { truckRouter } = require('./src/routers/truckRouter');
const { loadRouter } = require('./src/routers/loadRouter');

// create app server and port
const app = express();
const PORT = process.env.PORT || 8080;

// connection to database
mongoose.connect(
  'mongodb+srv://lingsat:mypassword@cluster0.roomuyf.mongodb.net/deliveryservice?retryWrites=true&w=majority',
);

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
app.use('/api/auth', userRouter);
app.use('/api/users', userProfileRouter);
app.use('/api/trucks', truckRouter);
app.use('/api/loads', loadRouter);

app.listen(PORT);

// error Handler
function errorHandler(err, req, res) {
  console.error(err);
  res.status(500).send({ message: 'Server error' });
}
app.use(errorHandler);
