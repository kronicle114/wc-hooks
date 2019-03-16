'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const { error404, error500 } = require('./error-middleware');
const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');
const { dbConnect } = require('./db-mongoose');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

// Create an Express application
const app = express();

// logs all requests
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

// Create a static webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// cors
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// backup access headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


const cheeses = [
  'Bath Blue',
  'Barkham Blue',
  'Buxton Blue',
  'Cheshire Blue',
  'Devon Blue',
  'Dorset Blue Vinney',
  'Dovedale',
  'Exmoor Blue',
  'Harbourne Blue',
  'Lanark Blue',
  'Lymeswold',
  'Oxford Blue',
  'Shropshire Blue',
  'Stichelton',
  'Stilton',
  'Blue Wensleydale',
  'Yorkshire Blue'
];

// Mount routers
app.get('/api/cheeses', (req, res, next) => {

  return res.json(cheeses);
});

//requires authToken
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

// Error handlers
app.use(error404);
app.use(error500);

const runServer = (port = PORT) => {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
};

if (require.main === module) {
  dbConnect();
  runServer(DATABASE_URL);
}

module.exports = { app, runServer };