const { Router } = require('express');
const isAuth = require('../middleware/is-auth');
const { restrictTo } = require('../controllers/auth.controller');

const router = Router();

const {
  getAdminSignUp,
  postAdminSignUp,
  getAddUser,
  postAddUser,
  getUpdateUser,
  postUpdateUser,
  deleteUser,
  getMessages,
  confirmPayment,
  getUsersExcel,
} = require('../controllers/admin.controller');

router.get('/downloadExcel', isAuth, restrictTo('admin'), getUsersExcel);
router.get('/addAdmin', isAuth, restrictTo('admin'), getAdminSignUp);
router.post('/signup', isAuth, restrictTo('admin'), postAdminSignUp);
router.get('/addUser', isAuth, restrictTo('admin'), getAddUser);
router.post('/addUser', isAuth, restrictTo('admin'), postAddUser);
router.get('/:userId/changeUserInfo', isAuth, restrictTo('admin'), getUpdateUser);
router.post('/changeUserInfo', isAuth, restrictTo('admin'), postUpdateUser);
router.delete('/deleteUser/:userId', isAuth, restrictTo('admin'), deleteUser);
router.get('/messages', isAuth, restrictTo('admin'), getMessages);
router.post('/confirmPayment', isAuth, restrictTo('admin'), confirmPayment);
router.get('/downloadExcel', isAuth, restrictTo('admin'), getUsersExcel);

module.exports = router;
