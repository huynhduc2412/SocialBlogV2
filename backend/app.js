var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var verifyRouter = require('./routes/verify');
var userRouter = require('./routes/user');
var uploadRouter = require('./routes/upload');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');
var notificationRouter = require('./routes/notification');
var likeRouter = require('./routes/like');
var followRouter = require('./routes/follow');
var bookmarkRouter = require('./routes/bookmark');
var audioRouter = require('./routes/audio');
var perspectiveRouter = require('./routes/perspective');
var adminRouter = require('./controllers/adminController');

var app = express();
app.use(cors());

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
app.use('/register', registerRouter);
app.use('/verify', verifyRouter);
app.use('/api/users', userRouter);
app.use('/cloudinary', uploadRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/likes', likeRouter);
app.use('/api/follows', followRouter);
app.use('/bookmarks', bookmarkRouter);
app.use('/api/audio', audioRouter);
app.use('/api/perspective', perspectiveRouter);
app.use('/api/admin', adminRouter);

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
