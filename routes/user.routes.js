const { Router } = require('express');
const isAuth = require('../middleware/is-auth');

const router = Router();

const {
  getAllUsers,
  getOneUser,
  getPayment,
  postPayment,
  getUserMessages,
  deleteMessage,
} = require('../controllers/user.controller');

router.get('/', isAuth, getAllUsers);
router.get('/users/:userId', isAuth, getOneUser);
router.get('/users/:userId/payment', isAuth, getPayment);
router.post('/payment', isAuth, postPayment);
router.get('/messages/:userId', isAuth, getUserMessages);
router.post('/deleteMessage', isAuth, deleteMessage);

module.exports = router;
