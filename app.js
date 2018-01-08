const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
// const lessMiddleware = require('less-middleware');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const keys = require('./config/keys');

const app = express();

app.use(cookieParser())

// set up session cookies
app.use(cookieSession({
  maxAge: 3 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

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

let college = require('./controllers/colleges');
app.all('*', (req, res, next) => {
  // console.log('Cookie ', req.query.clearcookie);
  // console.log(req.headers);

  if (typeof req.cookies['siteHeader'] == 'undefined') {
    // console.log('req headers not set');
    college.getSiteHeader(req, res, keys.domain.base, next);
    // siteHeader = res.cookies['siteHeader'];
    // next();
  } else if (typeof req.query.clearcookie !== 'undefined'){
    res.clearCookie("siteHeader");
    next();
  }else{
    // ############################################################
    //            this variable is global variable 
                siteHeader = req.cookies['siteHeader'];
    // ############################################################
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// logs all file request to terminal
// app.use(logger('dev'));
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

// const passportSetup = require('./config/passport-setup');
const login = require('./routes/login');
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
const event = require('./routes/event');

const user = require('./controllers/login');

// Index Route
app.use('/login', login);
app.use('/dashboard', user.verifyToken,  dashboard);
// app.use('/users', users);
app.use('/network', user.verifyToken, network);
app.use('/colleges', user.verifyToken, colleges);

// Master tables
app.use('/companies', user.verifyToken, companies);
app.use('/industries', user.verifyToken, industries);
app.use('/cities', user.verifyToken, cities);
app.use('/courses', user.verifyToken, courses);

// Post Router
app.use('/status', user.verifyToken, status);
app.use('/blogs', user.verifyToken, blogs);
app.use('/opportunity', user.verifyToken, opportunity);
app.use('/event', event);
// app.use('/photos', user.verifyToken, photos);
// app.use('/videos', user.verifyToken, videos);

app.get('/logout', (req, res) => {  
  res.clearCookie("authorization");  
  return res.redirect('/login');	
});

// Default redirected to Dashboard
app.get('/', user.verifyToken, (req, res) => {
  res.redirect('/dashboard');
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