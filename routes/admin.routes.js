const { Router } = require('express');
const isAuth = require('../middleware/is-auth');
const { restrictTo } = require('../controllers/auth.controller');

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
router.post('/addUser', isAuth, restrictTo('admin'), postAddUser);
router.get('/:userId/changeUserInfo', isAuth, restrictTo('admin'), getUpdateUser);
router.post('/changeUserInfo', isAuth, restrictTo('admin'), postUpdateUser);
router.delete('/deleteUser/:userId', isAuth, restrictTo('admin'), deleteUser);
router.get('/messages', isAuth, restrictTo('admin'), getMessages);
router.post('/confirmPayment', isAuth, restrictTo('admin'), confirmPayment);
router.post('/rejectPayment', isAuth, restrictTo('admin'), rejectPayment);
router.get('/downloadExcel', isAuth, restrictTo('admin'), getUsersExcel);
router.get('/rejectedCashes', isAuth, getRejectedCashes);

module.exports = router;
