'use strict';

module.exports = {
  PORT: process.env.PORT || 8080, 
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost.3000',
  DATABASE_URL: process.env.DATABASE_URL ||  'mongodb://localhost/backend', //switch this with your mongodb atlas url
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-backend',
  JWT_SECRET: process.env.JWT_SECRET || 'really-secret-string', 
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};