var express = require('express');
var router = express.Router();
var User = require('../db/schemas/User');



router.get('/', function (req, res, next) {
  User.find({}, (err, users) => {
    if (!err)  {
      res.render('admin', {
        title: 'ST Admin Panel',
        user: req.user,
        userslist: users
      })
    } else {
      console.error(err);
    }
  });
});

router.get('/userinfo', function (req, res, next) {
  res.send(req.user);
})

module.exports = router;
