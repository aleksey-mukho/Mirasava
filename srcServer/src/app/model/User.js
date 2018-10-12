// @flow
const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema({
  nickname: {
    type: String,
    unique: true,
    index: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
