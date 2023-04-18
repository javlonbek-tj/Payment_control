const { Router } = require('express');
const isAuth = require('../middleware/is-auth');
const { restrictTo } = require('../controllers/auth.controller');
const { check } = require('express-validator');

const router = Router();

const {
  getAddUser,
  postAddUser,
  getUpdateUser,
  postUpdateUser,
  deleteUser,
  getMessages,
  confirmPayment,
  rejectPayment,
  getUsersExcel,
  getRejectedCashes,
} = require('../controllers/admin.controller');

router.get('/downloadExcel', isAuth, restrictTo('admin'), getUsersExcel);
router.get('/addUser', isAuth, restrictTo('admin'), getAddUser);
router.post(
  '/addUser',
  [
    check('firstname', 'Ism Familiya kiritilmadi').trim().not().isEmpty(),
    check('lastname', 'Sharif kiritilmadi').trim().not().isEmpty(),
    check('course', 'Kurs tanlanmadi').trim().not().isEmpty(),
    check('mentor', 'Mentor tanlanmadi').trim().not().isEmpty(),
    check('login')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Login kiritilmadi')
      .isLength({ max: 20 })
      .withMessage('Login 20 ta belgidan ko`p bo`lmasligi kerak'),
    check('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Parol kiritilmadi')
      .isLength(9)
      .withMessage("Parol 9 ta belgidan iborat bo'lishi kerak"),
  ],
  isAuth,
  restrictTo('admin'),
  postAddUser,
);
router.get('/:userId/changeUserInfo', isAuth, restrictTo('admin'), getUpdateUser);
router.post(
  '/changeUserInfo',
  isAuth,
  restrictTo('admin'),
  [
    check('firstname', 'Ism Familiya kiritilmadi').trim().not().isEmpty(),
    check('lastname', 'Sharif kiritilmadi').trim().not().isEmpty(),
    check('course', 'Kurs tanlanmadi').trim().not().isEmpty(),
    check('mentor', 'Mentor tanlanmadi').trim().not().isEmpty(),
  ],
  postUpdateUser,
);
router.post('/deleteUser', isAuth, restrictTo('admin'), deleteUser);
router.get('/messages', isAuth, restrictTo('admin'), getMessages);
router.post('/confirmPayment', isAuth, restrictTo('admin'), confirmPayment);
router.post('/rejectPayment', isAuth, restrictTo('admin'), rejectPayment);
router.get('/downloadExcel', isAuth, restrictTo('admin'), getUsersExcel);
router.get('/rejectedCashes', isAuth, getRejectedCashes);

module.exports = router;
