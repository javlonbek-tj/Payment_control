const jwt = require('jsonwebtoken');
const UserRepo = require('../repos/user-repo');
const { promisify } = require('util');

const createSendToken = (user, req, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
};

const getLogin = async (req, res, next) => {
  try {
    res.render('auth/login', {
      pageTitle: 'Kirish',
    });
  } catch (err) {
    console.log(err);
  }
};

const postLogin = async (req, res, next) => {
  try {
    const { passport, phoneNumber } = req.body;
    const user = await UserRepo.isUserExists(passport, phoneNumber);
    if (!user) {
      return res.redirect('/login');
    }
    createSendToken(user, req, res);
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

const isAuth = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return next();
    }
    // 1) verify token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

    // 2) Check if user still exists
    const currentUser = await UserRepo.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    // THERE IS A LOGGED IN USER
    req.user = currentUser;
    return next();
  } catch (err) {
    console.log(err);
  }
  next();
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (req.user && !roles.includes(req.user.role)) {
      return res.redirect('/login');
    }
    next();
  };
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getLogin,
  postLogin,
  isAuth,
  logout,
  restrictTo,
};
