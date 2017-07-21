let mongoose = require('mongoose');



let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  vk_id: {
    type: Number
  }
});

let User = mongoose.model('user', UserSchema);



module.exports = User;
