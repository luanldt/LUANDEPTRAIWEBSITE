var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');


var app = express();

var config = require('./config/database');


// mongoose connect
mongoose.connect(config.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets',express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

// passport
app.use(session({
    secret: 'luandeptraiwebsite'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Require routers
var login = require('./routes/login')(passport);
var index = require('./routes/index');
var projects = require('./routes/projects');
var account = require('./routes/account');
// End require routers

require('./config/passport')(passport);





app.use('/Admin', login);
app.use('/Admin', index);
app.use('/Admin/Projects', projects);
app.use('/Admin/Account', account);


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
  res.render('404');
});

module.exports = app;
