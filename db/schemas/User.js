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

User.findOrCreate = (profile, callback) => {
  User.findOne({ vk_id: profile.ud }, (err, user) => {
    if(err) { callback(err, user) };
    if(user) {
      callback(null, user)
      console.log('user' + user);
    } else {
      user = new User({
        username: profile.displayName,
        vk_id: profile.id,
        type: 'user'
      });
      user.save(err => {
        if(err) { console.log(err); };
        console.log('new user' + user);
        callback(null, user)
      })
    }
  })
}

module.exports = User;
