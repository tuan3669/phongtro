// Imports
const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const createError = require('http-errors');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const homePageRouter = require('./src/routes/homePage');
const signupRouter = require('./src/routes/signupRouter');
const signinRouter = require('./src/routes/signinRouter');
const session = require('express-session');
// const flash = require('connect-flash');
const moment = require('moment');
const postRouter = require('./src/routes/post');
const categoryRouter = require('./src/routes/category');
const packageRouter = require('./src/routes/package');
const paymentRouter = require('./src/routes/payment');
const depositHistoryRouter = require('./src/routes/depositHistory');
const category = require('./src/models/category');
const postDetails = require('./src/routes/postDetails');
const getPostNew = require('./src/middlewares/getPostNew');
// const cryptoRandomString = require('crypto-random-string');
const cron = require('node-cron');
// cron.schedule('* * * * *', async () => {
//   console.log('running cron 1 minute');
//   await updateExpiredPosts();
// });
// 24 tiếng
cron.schedule('0 0 */1 * * *', async () => {
  await updateExpiredPosts();
  console.log('chay cron');
});
// 5 p
// cron.schedule('*/5 * * * *', async () => {
//   await updateExpiredPosts();
//   console.log('chay cron');
// });

// conect DB
// Connection URL. This is where your mongodb server is running.
mongoose.set('strictQuery', true);
const conectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'doan2',
    });
  } catch (error) {
    console.log('mongoconet faild : ', error);
  }
};
conectDB();

mongoose.connection.once('open', () => {
  console.log('connection open');
});

// demo

const Post = require('./src/models/posts');

const updateExpiredPosts = async () => {
  const expiredPosts = await Post.find({ isvip: { $ne: 'vip0' }, expired_at: { $lt: new Date() } });
  expiredPosts.forEach(async (post) => {
    post.isvip = 'vip0';
    post.expired_at = null;
    await post.save();
  });
};

// demo

// Middleware
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
  })
);

// app.use(flash());
// middleawre for flash message
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

app.use(getPostNew);

const getCategories = async (req, res, next) => {
  const categories = await category.find();
  res.locals.categories = categories;
  next();
};
app.use(getCategories);

// Static Files
app.use(express.static('public'));

// api

app.use('/api/v1/users', require('./src/routes/api/user'));
app.use('/api/v1/packages', require('./src/routes/api/package'));
app.use('/api/v1/posts', require('./src/routes/api/post'));
app.use('/api/v1/categories', require('./src/routes/api/category'));
app.use('/api/v1/payment', require('./src/routes/api/payment'));

app.use('/', require('./src/routes/profileRoute'));
app.use('/api/v1/profile', require('./src/routes/api/profile'));
app.use('/', require('./src/routes/statisticsRouter'));
app.use('/api/v1/statistics', require('./src/routes/api/statistics'));

app.use('/api/v1/depositHistory', require('./src/routes/api/depositHistory'));

// Set View's
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use('/posts', postRouter);
app.use('/managePost', require('./src/routes/postAdmin'));
app.use('/categories', categoryRouter);
app.use('/packages', packageRouter);
app.use('/payment', paymentRouter);
app.use('/depositHistory', depositHistoryRouter);
app.use(expressLayouts);
app.set('layout', './layouts/layout');
app.use('/', homePageRouter);
app.use('/', postDetails);
app.use('/', signupRouter);
app.use('/', signinRouter);
app.use('/forgot-password', require('./src/routes/forgot-password'));
app.use('/reset-password', require('./src/routes/reset-password'));

// Middleware handle errors
app.use((req, res, next) => {
  next(createError.NotFound('đường dẫn truy cập máy chủ không hợp lệ'));
});

app.use((err, req, res, next) => {
  res.json({
    code: err.status || 500,
    msg: err.message,
  });
});

app.listen(port, () => console.info(`App listening on port ${port}`));
