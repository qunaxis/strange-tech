let express      = require('express'),
    path         = require('path'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    sessions     = require('express-session'),
    mongoose     = require('mongoose'),
    fs           = require('fs'),
    nconf        = require('nconf');

let User         = require('./db/schemas/User');

let passport     = require('passport');
// var VKontakteStrategy = require('passport-vkontakte').Strategy; TODO: Реализовать потом для админов
let LocalStrategy = require('passport-local').Strategy;
let VKontakteStrategy = require('passport-vkontakte').Strategy;


let index   = require('./routes/index'),
    users   = require('./routes/users'),
    admin   = require('./routes/admin'),
    orders  = require('./routes/orders');

let app = express();



nconf.argv()
   .env()
   .file({ file: './config.json' });

const DB_URI = nconf.get('NODE_ENV') == 'production' ? nconf.get('MONGODB_URI') : nconf.get('MONGODB_URI_LOCAL');

mongoose.connect(DB_URI, { useMongoClient: true }, (err) => {
  err ? console.log(err) : console.log('MongoDB successfully connected!');
});

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
}, (username, password,done) => {
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

passport.use(new VKontakteStrategy({
    clientID:     nconf.get("VKONTAKTE_APP_ID"), // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: nconf.get("VKONTAKTE_APP_SECRET"),
    callbackURL:  "//strange-tech.herokuapp.com/users/auth-vk/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {
    // console.log(params.email); // getting the email
    console.log(`accessToken ${accessToken}`);
    console.log(`refreshToken ${refreshToken}`);
    console.log(`params ${params}`);
    console.log(`profile ${profile}`);
    // User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err,user) => {
    err
      ? done(err)
      : done(null,user);
  });
});


app.use('/', index);
app.use('/users', users);

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
app.use((req, res, next) => {
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
