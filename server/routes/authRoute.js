const express = require('express');
const authController = require('../conrollers/authContoller'); // исправил путь controllers
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// Регистрация пользователя
router.post('/signup', authController.signup);

// Вход в систему (логин)
router.post('/login', authController.login);

// Изменение пароля (требует авторизации)
router.patch('/change', protect, authController.changePassword);

// Подтверждение email через токен
router.get('/verify/:token', authController.verify); // Добавлен маршрут для подтверждения email

module.exports = router;