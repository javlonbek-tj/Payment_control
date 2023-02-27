const { Router } = require('express');

const router = Router();

const { getLogin, postLogin } = require('../controllers/auth.controller');

router.get('/', getLogin);
router.post('/login', postLogin);

module.exports = router;
