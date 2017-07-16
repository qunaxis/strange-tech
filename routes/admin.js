let express   = require('express'),
    router    = express.Router(),
    User      = require('../db/schemas/User');



router.get('/', (req, res, next) => {
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



module.exports = router;
