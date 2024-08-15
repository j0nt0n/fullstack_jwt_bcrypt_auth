const pool = require('../config/db');
const createError = require('../utils/appError');

exports.reginfo = async (req, res, next) => {
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
            const allergyIds = [];
        }
      
        // Обработка аллергий
        for (let allergy of allergies) {
            // Проверяем, существует ли уже аллераген в базе данных
            let allergyResult = await pool.query(
                'SELECT _id FROM allergy WHERE name = $1',
                [allergy]
            );
          
            let allergyId;
            if (allergyResult.rows.length > 0) {
                // Если существует, используем существующий ID
                allergyId = allergyResult.rows[0]._id;
            } else {
                // Если не существует, добавляем новый аллерген
                let insertResult = await pool.query(
                    'INSERT INTO allergy (name) VALUES ($1) RETURNING _id',
                    [allergy]
                );
                allergyId = insertResult.rows[0]._id;
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
          user: {
              id: userId,
              email: user.email,
              full_name,
              phone_number,
              age,
              gender
          }
      });
    } catch (error) {
      next(error);
    }
};
