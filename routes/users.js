let express   = require('express'),
    router    = express.Router(),
    passport  = require('passport');

let User      = require('../db/schemas/User');



router.post('/login', (req, res, next) => {
  passport.authenticate('local',
     function(err, user, info) {
       return err
         ? next(err)
         : user
           ? req.logIn(user, function (err) {
               return err
                 ? next(err)
                 : res.redirect('/admin'); // TODO: Replace it some later!
                //  : res.send('Auth successfully');
             })
           : res.redirect('/');
     }
   )(req, res, next);
});

router.get('/auth-vk', passport.authenticate('vkontakte'));

router.get('/auth-vk/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.post('/register', (req, res, next) => {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    privilegies: 'user'
  });
  user.save((err) => {
    return err
      ? next(err)
      : req.logIn(user, (err) => {
          return err ? next(err) : res.send('Registration successfully');
        });
  });
});

router.post('/update', (req, res, next) => {
  var data =  req.body ? req.body : req.user;
  console.log(data);
  User.findOne({ username: data.username }, (err, user) => {
    if (!err) {
      Object.assign(user, data); // BUG: Если нет user в БД, то серв падает
      user.save((err) => {
        if (!err) {
          text = `User ${user.username} updated`;
          console.log(text);
          res.json({ message: text });
        } else {
          console.error(err);
          res.json({ message: err });
        }
      });
    } else {
      console.error(err);
      res.json({ message: 'Failed update' });
    }
  })
});

router.post('/delete', (req, res, next) => {
  console.log(req.body);
  User.findOneAndRemove(req.body, (err, user) => {
    if (!err) {
      var text = `User ${ user.username } has been deleted`;
      console.log(text);
      res.status(200).json({ message: text });
    } else {
      console.error(err);
      res.status(500).json({ message: err });
    }
  });
});



module.exports = router;
