const { Router } = require('express');

const router = Router();

const {
  getAllUsers,
  getOneUser,
  getPayment,
  postPayment,
  get,
} = require('../controllers/user.controller');

router.get('/', getAllUsers);
router.get('/:userId', getOneUser);
router.get('/:userId/payment', getPayment);
router.post('/payment', postPayment);

module.exports = router;
