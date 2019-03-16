'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String, 
    required: true
  }
});

UserSchema.set('timestamps', true);

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    name: this.name || '',
    id: this._id
  };
};

UserSchema.set('toJSON', {
  virtuals: true, 
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password; //delete plaintext password so it doesn't come back in the response
  } 
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 8);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };