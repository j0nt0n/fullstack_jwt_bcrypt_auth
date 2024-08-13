const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const createError = require('../utils/appError');


// регистрация пользователя
exports.signup = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email });

        if(user){
            return next(new createError('Пользователь уже существует!', 400));
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        // Assign JWT (json web token) to user
        const token = jwt.sign({ id: newUser._id }, 'secretkey123',{
            expiresIn: '90d',
        });
        
        res.status(201).json({
            status: 'success',
            message: 'Регистрация прошла успешно',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }catch(error){
        next(error);
    }
};

// вход пользователя
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Найти пользователя по email
        const user = await User.findOne({ email });

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

        // Создание JWT для пользователя
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
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        // Передача ошибки в middleware для обработки
        next(error);
    }
};