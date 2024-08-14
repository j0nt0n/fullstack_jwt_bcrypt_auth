const express = require('express');
const authController = require('../conrollers/authContoller');
const protect = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/change', protect,authController.changePassword);

module.exports = router;