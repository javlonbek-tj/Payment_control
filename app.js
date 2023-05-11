const express = require('express');
const path = require('path');
const upload = require('./services/fileUpload');
const { isAuth } = require('./controllers/auth.controller');
const { get404, globalErrorHandler } = require('./controllers/error.controller');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/cashes', express.static(path.join(__dirname, '/cashes')));
app.use(upload.single('cash'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(isAuth);

// Set global user
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use(authRoutes);
app.use(userRoutes);
app.use('/admin', adminRoutes);

app.use(get404);
app.use(globalErrorHandler);

module.exports = app;
