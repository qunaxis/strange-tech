var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var mongoose = require('mongoose');

var User = require('./db/schemas/User');

var passport = require('passport');
// var VKontakteStrategy = require('passport-vkontakte').Strategy; TODO: Реализовать потом для админов
var LocalStrategy = require('passport-local').Strategy;


var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var orders = require('./routes/orders');

var app = express();


var fs    = require('fs'),
    nconf = require('nconf');


nconf.argv()
   .env()
   .file({ file: './config.json' });

console.log(`NODE_ENV ${nconf.get('NODE_ENV')}`);

var DB_URI = process.env.NODE_ENV == 'production' ? nconf.get('db').MONGODB_URI_HEROKU :  nconf.get('db').MONGODB_URI_LOCAL ;

mongoose.connect(DB_URI, { useMongoClient: true }, function (err) {
  err ? console.log(err) : console.log('MongoDB successfully connected!');;
});

// mongoose.connect('mongodb://localhost:27017/strange-tech', { useMongoClient: true }, function (err) {
//   err ? console.log(err) : console.log('MongoDB successfully connected!');;
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({secret:'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function(username, password,done){
  User.findOne({ username : username},function(err,user){
    return err
      ? done(err)
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err
      ? done(err)
      : done(null,user);
  });
});


app.use('/', index);
app.use('/users', users);

// // Middleware для проверки залогиненности юзера (пока ОНЛИ АДМИНИТРАТОР) TODO: Обновить при создании системы авторега юзеров после заполнении формы и оплаты
// app.all('/*', function (req, res, next) {
//   req.isAuthenticated()
//     ? next()
//     : res.redirect('/');
// });

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

function isAdmin(req, res, next) {
  if (req.user.privilegies == 'admin') {
    next();
  } else {
    res.send('Have not privilegies');
  }
}

app.use('/admin', loggedIn, isAdmin, admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
