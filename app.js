var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

var mongoose = require('mongoose');
var config = require('./config/database');

var login_controller = require('./controllers/login');
var login = require('./routes/login');
var dashboard = require('./routes/dashboard');
// var users = require('./routes/users');
var network = require('./routes/network');
var colleges = require('./routes/colleges');

var app = express();

// Connect To Database
// mongoose.connect(config.database);
mongoose.connect(config.database, {
  useMongoClient: true,
  /* other options */
});

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "7u8i9o0p", resave: true, saveUninitialized: true}));
app.use(lessMiddleware(path.join(__dirname, 'public')));

app.use("/static",express.static(__dirname + "public"));
app.use("/assets",express.static(__dirname + "/views"));

// app.use(express.static(path.join(__dirname, 'public'), {
// 	maxAge: 86400000,
// 	redirect: false,
// 	hidden: true
// }));



//authentication middleware
app.all('*', login_controller.userAuth);


// Index Route
app.use('/login', login);
app.use('/dashboard', dashboard);
// app.use('/users', users);
app.use('/network', network);
app.use('/colleges', colleges);

// Default redirected to Dashboard
//app.get('/*', (req, res) => {  return res.redirect(301, '/dashboard');	});


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
