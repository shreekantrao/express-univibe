const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
// const lessMiddleware = require('less-middleware');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const keys = require('./config/keys');


const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth');
const dashboard = require('./routes/dashboard');
const network = require('./routes/network');
const colleges = require('./routes/colleges');
const companies = require('./routes/companies');
const industries = require('./routes/industries');
const cities = require('./routes/cities');
const courses = require('./routes/courses');
const status = require('./routes/status');
const blogs = require('./routes/blogs');
const opportunity = require('./routes/opportunity');

const app = express();

// set up session cookies
app.use(cookieSession({
  maxAge: 3 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

/*********** Connect To Database *********/
// mongoose.connect(keys.database);
mongoose.connect(keys.mongodb.database, {
  useMongoClient: true,
  /* other options */
});
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + keys.mongodb.database);
});
// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(cookieParser());

// except file upload
app.use(fileUpload());

// less parser
// app.use(lessMiddleware(path.join(__dirname, 'public')));

// app.use("/static", express.static(path.join(__dirname + "/public")));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use("/assets", express.static(__dirname + "/views"));

// app.use(express.static(path.join(__dirname, 'public'), {
// 	maxAge: 86400000,
// 	redirect: false,
// 	hidden: true
// }));


//authentication middleware
// const login_controller = require('./controllers/login');
// app.all('*', login_controller.userAuth);

function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    // next(new Error(401));
    console.log('Isauthenticated function')    
    res.redirect('/auth/login');
  }
}

// Index Route
app.use('/auth', authRoutes);
app.use('/dashboard', IsAuthenticated, dashboard);
// app.use('/users', users);
app.use('/network', IsAuthenticated, network);
app.use('/colleges', IsAuthenticated, colleges);

// Master tables
app.use('/companies', IsAuthenticated, companies);
app.use('/industries', IsAuthenticated, industries);
app.use('/cities', IsAuthenticated, cities);
app.use('/courses', IsAuthenticated, courses);

// Post Router
app.use('/status', IsAuthenticated, status);
app.use('/blogs', IsAuthenticated, blogs);
app.use('/opportunity', opportunity);
// app.use('/events', IsAuthenticated, events);
// app.use('/photos', IsAuthenticated, photos);
// app.use('/videos', IsAuthenticated, videos);

// Default redirected to Dashboard
// app.get('/', (req, res) => {  return res.redirect(301, '/auth/login');	});
app.get('/', (req, res) => {
  if (req.isAuthenticated()) res.redirect('/dashboard');
  else res.redirect('/auth/login');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;