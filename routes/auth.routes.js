const { Router } = require('express');

const router = Router();

const { getLogin, postLogin, logout } = require('../controllers/auth.controller');

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

module.exports = router;
