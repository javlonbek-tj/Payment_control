const { Router } = require('express');

const router = Router();

const {
  getAddUser,
  postAddUser,
  getUpdateUser,
  postUpdateUser,
  deleteUser,
  getMessages,
  confirmPayment,
} = require('../controllers/admin.controller');

router.get('/addUser', getAddUser);
router.post('/addUser', postAddUser);
router.get('/:userId/changeUserInfo', getUpdateUser);
router.post('/changeUserInfo', postUpdateUser);
router.delete('/deleteUser/:userId', deleteUser);
router.get('/messages', getMessages);
router.post('/confirmPayment', confirmPayment);

module.exports = router;
