const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Замените на путь к вашей модели User
const createError = require('../utils/appError');

const protect = async (req, res, next) => {
    try {
        // Проверка наличия токена в заголовке авторизации
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
            ? req.headers.authorization.split(' ')[1] 
            : null;

        if (!token) {
            return next(new createError('Нет токена авторизации!', 401));
        }

        // Верификация токена
        const decoded = jwt.verify(token, 'secretkey123'); // Замените на ваш секретный ключ

        // Найти пользователя по ID из токена
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return next(new createError('Пользователь не найден!', 402));         
        }

        // Добавить пользователя в запрос
        req.user = user;
        next(); // Передача управления следующему middleware или маршруту
    } catch (error) {
        next(error);
    }
};

module.exports = protect;
