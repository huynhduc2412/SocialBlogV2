var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config();

var indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const { appendFile } = require('fs');

var app = express();

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', require('./routes/register'));
app.use('/verify', require('./routes/verify'));
app.use('/api/users', require('./routes/user'));
app.use('/cloudinary', require('./routes/upload'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/comments', require('./routes/comment'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/likes', require('./routes/like'));
app.use('/api/follows', require('./routes/follow'));
app.use('/api/bookmarks', require('./routes/bookmark'));
app.use('/api/audio', require('./routes/audio'));
app.use('/api/perspective', require('./routes/perspective'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

module.exports = app;
