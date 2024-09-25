const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const createError = require('../utils/appError');

const protect = async (req, res, next) => {
    try {
      // Проверка наличия токена в заголовке авторизации
      const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;
  
      // Если токен отсутствует
      if (!token) {
        return next(new createError('Нет токена авторизации!', 401));
      }
  
      // Верификация токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Используйте ваш секретный ключ
  
      // Поиск пользователя по ID, полученному из токена
      const userResult = await pool.query('SELECT * FROM userauth WHERE _id = $1', [decoded.id]);
      const user = userResult.rows[0];
  
      // Если пользователь не найден
      if (!user) {
        return next(new createError('Пользователь не найден!', 402));
      }
  
      // Добавление найденного пользователя в объект запроса (req)
      req.user = user;
  
      // Передача управления следующему middleware или маршруту
      next();
    } catch (error) {
      // Если произошла ошибка, передаем ее следующему обработчику ошибок
      next(error);
    }
  };
  
  module.exports = protect;