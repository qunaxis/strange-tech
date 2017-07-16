let mongoose = require('mongoose');



let UserSchema = new mongoose.Schema({
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

let User = mongoose.model('user', UserSchema);



module.exports = User;
