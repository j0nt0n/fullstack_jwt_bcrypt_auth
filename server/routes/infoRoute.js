const express = require('express');
const infoController = require('../conrollers/infoController');
const protect = require('../middlewares/authMiddleware'); 

const router = express.Router();
router.get('/getinfo', protect,infoController.getUserInfo);
router.post('/reginfo', protect,infoController.regUserInfo);
router.patch('/updinfo', protect,infoController.updUserInfo);
router.get('/getallrest',infoController.getAllRestaurants);

module.exports = router;