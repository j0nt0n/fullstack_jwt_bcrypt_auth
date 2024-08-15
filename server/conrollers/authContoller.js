const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const createError = require('../utils/appError');


// регистрация пользователя
exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Проверка, существует ли пользователь с данным email
    const userCheck = await pool.query('SELECT * FROM userauth WHERE email = $1', [email]);

    if (userCheck.rows.length > 0) {
      return next(new createError('Пользователь уже существует!', 400));
    }

    // Хэшируем пароль перед сохранением в базу данных
    const hashedPassword = await bcrypt.hash(password, 12);

    // Вставляем нового пользователя в таблицу userauth
    const result = await pool.query(
      'INSERT INTO userauth (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Генерация JWT токена для пользователя
    const token = jwt.sign({ id: newUser._id }, 'secretkey123', {
      expiresIn: '90d',  // Срок действия токена
    });

    // Отправляем успешный ответ с токеном и данными пользователя
    res.status(201).json({
      status: 'success',
      message: 'Регистрация прошла успешно',
      token,
      user: {
        id: newUser._id,
        email: newUser.email
      },
    });
  } catch (error) {
    next(error);  // Обработка ошибок
  }
};

// вход пользователя
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Поиск пользователя по email в базе данных
    const userResult = await pool.query('SELECT * FROM userauth WHERE email = $1', [email]);
    const user = userResult.rows[0];

    // Если пользователь не найден
    if (!user) {
      return next(new createError('Пользователь не найден!', 404));
    }

    // Проверка правильности пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Если пароль неверный
    if (!isPasswordValid) {
      return next(new createError('Неверный адрес электронной почты или пароль', 401));
    }

    // Генерация JWT токена для пользователя
    const token = jwt.sign({ id: user._id }, 'secretkey123', {
      expiresIn: '90d',
    });

    // Ответ с успешной авторизацией
    res.status(200).json({
      status: 'success',
      token,
      message: 'Успешно вошли в систему',
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    // Передача ошибки в middleware для обработки
    next(error);
  }
};

// смена пароля
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Проверка, существует ли пользователь в запросе (добавленный в middleware protect)
    if (!req.user || !req.user._id) {
      return next(new createError('Нет данных пользователя!', 400));
    }

    // Поиск пользователя в базе данных по идентификатору, полученному из middleware protect
    const userResult = await pool.query('SELECT * FROM userauth WHERE _id = $1', [req.user._id]);
    const user = userResult.rows[0];

    // Проверка, найден ли пользователь
    if (!user) {
      return next(new createError('Пользователь не найден!', 404));
    }

    // Сравнение текущего пароля с хэшированным паролем в базе данных
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    // Если текущий пароль неверен
    if (!isPasswordValid) {
      return next(new createError('Текущий пароль неверен!', 401));
    }

    // Хэширование нового пароля
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Обновление пароля пользователя в базе данных
    await pool.query('UPDATE userauth SET password = $1 WHERE _id = $2', [hashedNewPassword, user._id]);

    // Генерация нового JWT токена для пользователя
    const token = jwt.sign({ id: user._id }, 'secretkey123', {
      expiresIn: '90d',
    });

    // Ответ с успешным изменением пароля
    res.status(200).json({
      status: 'success',
      message: 'Пароль успешно изменен',
      token,
    });
  } catch (error) {
    next(error);
  }
};