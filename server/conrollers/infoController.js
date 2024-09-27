const pool = require('../config/db');
const createError = require('../utils/appError');

// Регистрация инофрмациии о юзере и о его аллергиях
exports.regUserInfo = async (req, res, next) => {
    const { full_name, phone_number, age, gender, allergies } = req.body;
  
    try {
        // Проверка, существует ли пользователь в запросе (добавленный в middleware protect)
        if (!req.user || !req.user._id) {
            return next(new createError('Нет данных пользователя!', 400));
        }
      
        // Поиск пользователя в базе данных по идентификатору, полученному из middleware protect
        const userResult = await pool.query('SELECT _id FROM userauth WHERE _id = $1', [req.user._id]);
        const user = userResult.rows[0];
        const userId = user._id;
      
        // Проверка, найден ли пользователь
        if (!userId) {
            return next(new createError('Пользователь не найден!', 404));
        }
      
        // Попытка вставить информацию о пользователе в таблицу UserInfo
        try {
            await pool.query(
                'INSERT INTO userinfo (_id, full_name, role, phone_number, age, gender) VALUES ($1, $2, $3, $4, $5, $6)',
                [userId, full_name, 'user', phone_number, age, gender]
            );
        } catch (err) {
            if (err.code === '23505') { // Код ошибки для уникального ограничения
                return next(new createError('Пользователь с такими данными уже существует!', 409));
            }
        }
      
        // Обработка новых аллергий
        // Если allergies пустое, удаляем все связанные записи
        if (!allergies || allergies.length === 0) {
            await pool.query('DELETE FROM userallergy WHERE user_id = $1', [userId]);
            let insertResult = await pool.query(
                'INSERT INTO allergy (name) VALUES ($1) RETURNING _id',
                [allergies]
            );
            allergyId = insertResult.rows[0]._id;
        } else {
            // Если allergies не пустое, обновляем записи аллергий
            // Сначала удаляем старые записи аллергий
            await pool.query('DELETE FROM userallergy WHERE user_id = $1', [userId]);

            // Обработка аллергий
            for (let allergy of allergies) {
                // Преобразуем аллерген в нижний регистр
                let lowercaseAllergy = allergy.toLowerCase();
                // Проверяем, существует ли уже аллераген в базе данных
                let allergyResult = await pool.query(
                    'SELECT _id FROM allergy WHERE name = $1',
                    [lowercaseAllergy]
                );
              
                let allergyId;
                if (allergyResult.rows.length > 0) {
                    // Если существует, используем существующий ID
                    allergyId = allergyResult.rows[0]._id;
                } else {
                    // Если не существует, добавляем новый аллерген
                    let insertResult = await pool.query(
                        'INSERT INTO allergy (name) VALUES ($1) RETURNING _id',
                        [lowercaseAllergy]
                    );
                    allergyId = insertResult.rows[0]._id;
                }
            }
            // Создаем связь между пользователем и аллергеном
            await pool.query(
                'INSERT INTO userallergy (user_id, allergy_id) VALUES ($1, $2)',
                [userId, allergyId]
            );
            
        }
      
        // Ответ с успешной регистрацией
        res.status(201).json({
          status: 'success',
          message: 'Информация о пользователе успешно внесена',
        });
    } catch (error) {
      next(error);
    }
};

// Получение информации о юзере и о его аллергиях
exports.getUserInfo = async (req, res, next) => {
    try {
        // Проверка, существует ли пользователь в запросе (добавленный в middleware protect)
        if (!req.user || !req.user._id) {
            return next(new createError('Нет данных пользователя!', 400));
        }

        // Получение основной информации о пользователе из таблицы userinfo
        const userInfoResult = await pool.query(
            'SELECT full_name, phone_number, age, gender FROM userinfo WHERE _id = $1',
            [req.user._id]
        );

        const userInfo = userInfoResult.rows[0];

        if (!userInfo) {
            return next(new createError('Информация о пользователе не найдена!', 404));
        }

        // Получение информации о аллергиях пользователя
        const allergiesResult = await pool.query(
            'SELECT a.name FROM allergy a INNER JOIN userallergy ua ON a._id = ua.allergy_id WHERE ua.user_id = $1',
            [req.user._id]
        );

        const allergies = allergiesResult.rows.map(row => row.name);

        // Ответ с информацией о пользователе
        res.status(200).json({
            status: 'success',
            user: {
                full_name: userInfo.full_name,
                phone_number: userInfo.phone_number,
                age: userInfo.age,
                gender: userInfo.gender,
                allergies: allergies
            }
        });
    } catch (error) {
        next(error);
    }
};

// Изменение информации о юзере и о его аллергиях
exports.updUserInfo = async (req, res, next) => {
    const { full_name, phone_number, age, gender, allergies } = req.body;

    try {
        // Проверка, существует ли пользователь в запросе (добавленный в middleware protect)
        if (!req.user || !req.user._id) {
            return next(new createError('Нет данных пользователя!', 400));
        }

        // Проверка, существует ли пользователь в базе данных
        const userResult = await pool.query('SELECT _id FROM userauth WHERE _id = $1', [req.user._id]);
        const user = userResult.rows[0];
        const userId = user._id;

        if (!userId) {
            return next(new createError('Пользователь не найден!', 404));
        }

        // Обновление информации о пользователе в таблице userinfo
        await pool.query(
            'UPDATE userinfo SET full_name = $1, phone_number = $2, age = $3, gender = $4 WHERE _id = $5',
            [full_name, phone_number, age, gender, userId]
        );

        // Удаление существующих записей об аллергиях пользователя в таблице userallergy
        await pool.query('DELETE FROM userallergy WHERE user_id = $1', [userId]);

        // Обработка новых аллергий
        // Если allergies пустое, удаляем все связанные записи
        if (!allergies || allergies.length === 0) {
            await pool.query('DELETE FROM userallergy WHERE user_id = $1', [userId]);
        } else {
            // Если allergies не пустое, обновляем записи аллергий
            // Сначала удаляем старые записи аллергий
            await pool.query('DELETE FROM userallergy WHERE user_id = $1', [userId]);

            // Обработка аллергий
            for (let allergy of allergies) {
                // Преобразуем аллерген в нижний регистр
                let lowercaseAllergy = allergy.toLowerCase();
                // Проверяем, существует ли уже аллераген в базе данных
                let allergyResult = await pool.query(
                    'SELECT _id FROM allergy WHERE name = $1',
                    [lowercaseAllergy]
                );
              
                let allergyId;
                if (allergyResult.rows.length > 0) {
                    // Если существует, используем существующий ID
                    allergyId = allergyResult.rows[0]._id;
                } else {
                    // Если не существует, добавляем новый аллерген
                    let insertResult = await pool.query(
                        'INSERT INTO allergy (name) VALUES ($1) RETURNING _id',
                        [lowercaseAllergy]
                    );
                    allergyId = insertResult.rows[0]._id;
                }

                // Создаем связь между пользователем и аллергеном
                await pool.query(
                    'INSERT INTO userallergy (user_id, allergy_id) VALUES ($1, $2)',
                    [userId, allergyId]
                );
            }
        }
        // Ответ с успешным обновлением
        res.status(200).json({
            status: 'success',
            message: 'Информация о пользователе успешно обновлена'
        });
    } catch (error) {
        next(error);
    }
};

// Получение информации о ресторане и о его продуктах
exports.getAllRestaurants = async (req, res, next) => {
    try {
        // Получение информации обо всех ресторанах
        const restaurantsResult = await pool.query(
            'SELECT rest_id, latitude, longitude, name, description, imageurl FROM Restaurant'
        );

        const restaurants = restaurantsResult.rows;

        if (restaurants.length === 0) {
            return next(new createError('Рестораны не найдены!', 404));
        }

        // Получение информации о продуктах (аллергенах) для каждого ресторана
        const restaurantInfoPromises = restaurants.map(async restaurant => {
            const productsResult = await pool.query(
                'SELECT a.name FROM Allergy a INNER JOIN RestaurantAllergy ra ON a._id = ra.allergy_id WHERE ra.rest_id = $1',
                [restaurant.rest_id]
            );

            const products = productsResult.rows.map(row => row.name);

            return {
                _id: restaurant.rest_id,
                coordinates: [restaurant.latitude, restaurant.longitude],
                name: restaurant.name,
                description: restaurant.description,
                imageurl: restaurant.imageurl,
                products: products
            };
        });

        // Ждём выполнения всех запросов и формируем итоговый массив ресторанов
        const allRestaurants = await Promise.all(restaurantInfoPromises);

        // Ответ с информацией о всех ресторанах
        res.status(200).json({
            status: 'success',
            restaurants: allRestaurants
        });
    } catch (error) {
        next(error);
    }
};