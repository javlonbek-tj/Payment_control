const { Router } = require('express');
const isAuth = require('../middleware/is-auth');

const router = Router();

const {
  getAllUsers,
  getOneUser,
  getPayment,
  postPayment,
} = require('../controllers/user.controller');

router.get('/', isAuth, getAllUsers);
router.get('/:userId', isAuth, getOneUser);
router.get('/:userId/payment', isAuth, getPayment);
router.post('/payment', isAuth, postPayment);

module.exports = router;
