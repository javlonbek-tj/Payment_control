const jwt = require('jsonwebtoken');
const UserRepo = require('../repos/user-repo');

const createSendToken = (user, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
    const isUserExists = await UserRepo.isUserExists(passport, phoneNumber);
    if (!isUserExists) {
      return res.redirect('/');
    }
    res.redirect('/users');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getLogin,
  postLogin,
};
