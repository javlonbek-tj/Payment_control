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
} = require('../controllers/admin.controller');

router.get('/signup', getAdminSignUp);
router.post('/signup', postAdminSignUp);
router.get('/addUser', isAuth, restrictTo('admin'), getAddUser);
router.post('/addUser', isAuth, restrictTo('admin'), postAddUser);
router.get('/:userId/changeUserInfo', isAuth, restrictTo('admin'), getUpdateUser);
router.post('/changeUserInfo', isAuth, restrictTo('admin'), postUpdateUser);
router.delete('/deleteUser/:userId', isAuth, restrictTo('admin'), deleteUser);
router.get('/messages', isAuth, restrictTo('admin'), getMessages);
router.post('/confirmPayment', isAuth, restrictTo('admin'), confirmPayment);

module.exports = router;
