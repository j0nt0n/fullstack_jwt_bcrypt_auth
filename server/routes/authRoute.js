const express = require('express');
const authController = require('../conrollers/authContoller');
const infoController = require('../conrollers/infoController');
const protect = require('../middlewares/authMiddleware'); 

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/change', protect,authController.changePassword);
router.get('/getinfo', protect,infoController.getUserInfo);
router.post('/reginfo', protect,infoController.regUserInfo);
router.patch('/updinfo', protect,infoController.updUserInfo);

module.exports = router;