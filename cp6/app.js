//This is the server-side JS

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// we added this part ////////
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth', { useNewUrlParser: true });
require('./models/users_model.js');
var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, '> DB connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('> Connected to DB');
});
////////

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(expressSession({
  secret: 'SECRET',
  cookie: {maxAge:2628000000},  //this is the number of seconds that the login session is valid for
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
      mongooseConnection:mongoose.connection
    })
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.render('error');
});

module.exports = app;