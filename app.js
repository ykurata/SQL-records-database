const createError = require('http-errors');
const express = require('express');
const path = require('path');

// Session authentication
const bodyParser = require('body-parser');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Routes
const indexRouter = require('./routes/index');
const recordsRouter = require('./routes/records');
const userRouter = require('./routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Session authentication. initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// Session authentication
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  secret: "somerandomthing",
  resave: true,
  saveUninitialized: false
}));


// Make user ID available in template
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.user;
  next();
});


// Set up routes
app.use('/', indexRouter);
app.use('/records', recordsRouter);
app.use('/user', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('page-not-found');
});

module.exports = app;
