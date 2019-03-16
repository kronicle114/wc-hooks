'use strict';

const express = require('express');
const morgan = require('morgan');

const { error404, error500 } = require('./error-middleware');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

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
  runServer();
}

module.exports = { app };