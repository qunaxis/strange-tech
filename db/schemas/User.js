var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  privilegies : {
    type: String,
    required: true
  }
});
var User = mongoose.model('user', UserSchema);

module.exports = User;
